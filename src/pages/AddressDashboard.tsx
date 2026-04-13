import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { MapPin, Plus, Trash2, CheckCircle2, Home, Briefcase, Loader2, ChevronLeft, Map as MapIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { UserAddress } from '../types';
import { toast } from 'react-hot-toast';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface AddressFormProps {
  address?: UserAddress | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddressForm: React.FC<AddressFormProps> = ({ address, onClose, onSuccess }) => {
  const user = useStore((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: address?.full_name || '',
    phone: address?.phone || '',
    email: address?.email || user?.email || '',
    region: address?.region || 'Visayas',
    province: address?.province || 'Bohol',
    city: address?.city || '',
    barangay: address?.barangay || '',
    postal_code: address?.postal_code || '',
    street_address: address?.street_address || '',
    label: address?.label || 'Home',
    is_default: address?.is_default || false,
    lat: address?.lat || 9.6412, // Default to Tagbilaran
    lng: address?.lng || 123.8553
  });

  const LocationPicker = () => {
    const map = useMap();
    
    useMapEvents({
      click(e) {
        setFormData(prev => ({ ...prev, lat: e.latlng.lat, lng: e.latlng.lng }));
      },
    });

    useEffect(() => {
      if (address?.lat && address?.lng) {
        map.setView([address.lat, address.lng], 15);
      }
    }, [map]);

    return formData.lat && formData.lng ? (
      <Marker position={[Number(formData.lat), Number(formData.lng)]} />
    ) : null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      const payload = {
        ...formData,
        user_id: user.id
      };

      if (address) {
        const { error } = await supabase
          .from('user_addresses')
          .update(payload)
          .eq('id', address.id);
        if (error) throw error;
        toast.success('Address updated successfully');
      } else {
        const { error } = await supabase
          .from('user_addresses')
          .insert(payload);
        if (error) throw error;
        toast.success('Address added successfully');
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error('Failed to save address');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-none border border-slate-200 shadow-2xl flex flex-col lg:flex-row">
        {/* Form Side */}
        <div className="flex-1 p-8 border-r border-slate-100">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-navy uppercase tracking-tighter">
              {address ? 'Edit' : 'Add New'} <span className="text-cyan">Address</span>
            </h3>
            <button onClick={onClose} className="text-slate-400 hover:text-navy transition-colors">
              <Plus className="rotate-45" size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Full Name</label>
                <input
                  required
                  type="text"
                  className="w-full bg-slate-50 border border-slate-200 p-3 text-sm focus:border-cyan outline-none transition-all rounded-none"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Phone Number</label>
                <input
                  required
                  type="tel"
                  className="w-full bg-slate-50 border border-slate-200 p-3 text-sm focus:border-cyan outline-none transition-all rounded-none"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Email Address</label>
              <input
                required
                type="email"
                className="w-full bg-slate-50 border border-slate-200 p-3 text-sm focus:border-cyan outline-none transition-all rounded-none"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Region</label>
                <input
                  required
                  type="text"
                  className="w-full bg-slate-50 border border-slate-200 p-3 text-sm focus:border-cyan outline-none transition-all rounded-none"
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Province</label>
                <input
                  required
                  type="text"
                  className="w-full bg-slate-50 border border-slate-200 p-3 text-sm focus:border-cyan outline-none transition-all rounded-none"
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">City/Municipality</label>
                <input
                  required
                  type="text"
                  className="w-full bg-slate-50 border border-slate-200 p-3 text-sm focus:border-cyan outline-none transition-all rounded-none"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Barangay</label>
                <input
                  required
                  type="text"
                  className="w-full bg-slate-50 border border-slate-200 p-3 text-sm focus:border-cyan outline-none transition-all rounded-none"
                  value={formData.barangay}
                  onChange={(e) => setFormData({ ...formData, barangay: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Postal Code</label>
                <input
                  required
                  type="text"
                  className="w-full bg-slate-50 border border-slate-200 p-3 text-sm focus:border-cyan outline-none transition-all rounded-none"
                  value={formData.postal_code}
                  onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Label</label>
                <select
                  className="w-full bg-slate-50 border border-slate-200 p-3 text-sm focus:border-cyan outline-none transition-all rounded-none"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value as 'Home' | 'Work' })}
                >
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Street Address</label>
              <textarea
                required
                rows={2}
                className="w-full bg-slate-50 border border-slate-200 p-3 text-sm focus:border-cyan outline-none transition-all rounded-none resize-none"
                value={formData.street_address}
                onChange={(e) => setFormData({ ...formData, street_address: e.target.value })}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_default"
                className="w-4 h-4 accent-cyan"
                checked={formData.is_default}
                onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
              />
              <label htmlFor="is_default" className="text-xs font-bold text-slate-600 uppercase tracking-widest">Set as default address</label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-navy text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-cyan hover:text-navy transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : (address ? 'UPDATE ADDRESS' : 'SAVE ADDRESS')}
            </button>
          </form>
        </div>

        {/* Map Side */}
        <div className="w-full lg:w-[400px] h-[300px] lg:h-auto relative bg-slate-100">
          <div className="absolute top-4 left-4 z-[10] bg-white/90 backdrop-blur-md p-3 border border-slate-200 shadow-lg max-w-[200px]">
            <p className="text-[10px] font-black text-navy uppercase tracking-widest mb-1 flex items-center gap-1">
              <MapIcon size={12} /> Pin Location
            </p>
            <p className="text-[8px] text-slate-500 font-bold leading-tight">Click on the map to set the exact delivery coordinates.</p>
          </div>
          <MapContainer 
            center={[formData.lat, formData.lng]} 
            zoom={13} 
            className="w-full h-full"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <LocationPicker />
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export const AddressDashboard: React.FC = () => {
  const { user } = useStore();
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(null);
  const navigate = useNavigate();

  const fetchAddresses = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setAddresses(data || []);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    try {
      const { error } = await supabase
        .from('user_addresses')
        .delete()
        .eq('id', id);
      if (error) throw error;
      toast.success('Address deleted');
      fetchAddresses();
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error('Failed to delete address');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const { error } = await supabase
        .from('user_addresses')
        .update({ is_default: true })
        .eq('id', id);
      if (error) throw error;
      toast.success('Default address updated');
      fetchAddresses();
    } catch (error) {
      console.error('Error setting default address:', error);
      toast.error('Failed to update default address');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Placeholder (Matches Dashboard) */}
        <aside className="w-full lg:w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-80px)] -mt-12 -ml-4 lg:-ml-0">
          <div className="p-8 bg-navy text-white mb-4 rounded-none">
            <div className="w-12 h-12 bg-cyan rounded-full flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(0,229,255,0.3)]">
              <MapPin size={24} />
            </div>
            <div className="font-bold truncate">{user?.username || 'User'}</div>
            <div className="text-[10px] font-bold text-cyan uppercase tracking-widest">Address Book</div>
          </div>

          <div className="space-y-0">
            <button
              onClick={() => navigate('/dashboard')}
              className="sidebar-link rounded-none"
            >
              <div className="flex items-center gap-3">
                <ChevronLeft size={18} />
                Back to Dashboard
              </div>
            </button>
            <button
              className="sidebar-link rounded-none sidebar-link-active"
            >
              <div className="flex items-center gap-3">
                <MapPin size={18} />
                Manage Addresses
              </div>
            </button>
          </div>
        </aside>

        <main className="flex-1">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-black text-navy uppercase tracking-tighter">Address <span className="text-cyan">Book</span></h2>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Manage your shipping locations</p>
            </div>
            <button 
              onClick={() => {
                setEditingAddress(null);
                setIsModalOpen(true);
              }}
              className="px-6 py-3 bg-cyan text-navy font-black rounded-none text-[10px] uppercase tracking-widest hover:bg-navy hover:text-white transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(0,229,255,0.3)]"
            >
              <Plus size={16} /> ADD NEW ADDRESS
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-24">
              <Loader2 className="animate-spin text-cyan" size={48} />
            </div>
          ) : addresses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {addresses.map((addr) => (
                <div 
                  key={addr.id} 
                  className={cn(
                    "bg-white p-6 border transition-all relative group",
                    addr.is_default ? "border-cyan shadow-[0_0_20px_rgba(0,229,255,0.1)]" : "border-slate-200 hover:border-slate-300"
                  )}
                >
                  {addr.is_default && (
                    <div className="absolute top-0 right-0 bg-cyan text-navy text-[8px] font-black px-2 py-1 uppercase tracking-widest">
                      DEFAULT
                    </div>
                  )}
                  
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-slate-100 flex items-center justify-center text-slate-500">
                        {addr.label === 'Home' ? <Home size={16} /> : <Briefcase size={16} />}
                      </div>
                      <div>
                        <div className="text-sm font-black text-navy uppercase tracking-tight">{addr.full_name}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{addr.label}</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-start gap-2 text-xs text-slate-600">
                      <MapPin size={14} className="mt-0.5 flex-shrink-0 text-slate-400" />
                      <span>{addr.street_address}, {addr.barangay}, {addr.city}, {addr.province}, {addr.postal_code}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <div className="w-3.5 h-3.5 flex items-center justify-center text-slate-400">📞</div>
                      <span>{addr.phone}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex gap-4">
                      <button 
                        onClick={() => {
                          setEditingAddress(addr);
                          setIsModalOpen(true);
                        }}
                        className="text-[10px] font-black text-slate-400 hover:text-cyan uppercase tracking-widest transition-colors"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(addr.id)}
                        className="text-[10px] font-black text-slate-400 hover:text-red-500 uppercase tracking-widest transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                    {!addr.is_default && (
                      <button 
                        onClick={() => handleSetDefault(addr.id)}
                        className="text-[10px] font-black text-cyan hover:underline uppercase tracking-widest"
                      >
                        Set as Default
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 border-2 border-dashed border-slate-200">
              <MapPin className="mx-auto text-slate-200 mb-4" size={48} />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No addresses saved yet</p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="mt-4 text-cyan font-black text-[10px] uppercase tracking-widest hover:underline"
              >
                Add your first address
              </button>
            </div>
          )}
        </main>
      </div>

      {isModalOpen && (
        <AddressForm 
          address={editingAddress} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={fetchAddresses} 
        />
      )}
    </div>
  );
};
