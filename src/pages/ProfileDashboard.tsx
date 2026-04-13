import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useStore } from '../store/useStore';
import { User, Mail, Shield, Lock, Loader2, CheckCircle2, AlertCircle, Calendar, Fingerprint, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

export const ProfileDashboard: React.FC = () => {
  const user = useStore((state) => state.user);
  const [authData, setAuthData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    const fetchAuthData = async () => {
      const { data: { user: supabaseUser } } = await supabase.auth.getUser();
      setAuthData(supabaseUser);
      setLoading(false);
    };
    fetchAuthData();
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmNewPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setPasswordLoading(true);
    try {
      // Verify current password first
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: authData.email,
        password: currentPassword,
      });

      if (signInError) {
        throw new Error('Current password is incorrect');
      }

      // Supabase auth.updateUser handles password updates
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast.success('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update password');
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="animate-spin text-cyan" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="p-2 bg-slate-900 border border-slate-800 rounded-sm text-slate-400 hover:text-white hover:border-slate-700 transition-all"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                <User className="text-cyan" size={32} />
                User <span className="text-cyan">Profile</span>
              </h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Manage your account settings and security</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-slate-900 p-1 rounded-sm border border-slate-800">
            <div className={cn(
              "px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-sm",
              user?.role === 'owner' ? "bg-purple-500/10 text-purple-500" :
              user?.role === 'admin' ? "bg-cyan/10 text-cyan" :
              "bg-slate-800 text-slate-400"
            )}>
              {user?.role} Account
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Account Metadata */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-sm p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Fingerprint size={80} />
              </div>
              
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Shield size={14} /> Account Metadata
              </h3>

              <div className="space-y-6 relative z-10">
                <div className="flex flex-col gap-1">
                  <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Username</span>
                  <span className="text-sm font-bold text-white">{user?.username}</span>
                </div>
                
                <div className="flex flex-col gap-1">
                  <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Email Address</span>
                  <div className="flex items-center gap-2">
                    <Mail size={12} className="text-slate-500" />
                    <span className="text-sm font-bold text-white">{authData?.email}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Account ID</span>
                  <span className="text-[10px] font-mono text-slate-500 break-all">{authData?.id}</span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Member Since</span>
                  <div className="flex items-center gap-2">
                    <Calendar size={12} className="text-slate-500" />
                    <span className="text-sm font-bold text-white">
                      {new Date(authData?.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Last Sign In</span>
                  <span className="text-xs text-slate-400">
                    {new Date(authData?.last_sign_in_at).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-cyan/5 border border-cyan/10 rounded-sm p-6">
              <div className="flex items-center gap-3 text-cyan mb-4">
                <CheckCircle2 size={20} />
                <span className="text-xs font-black uppercase tracking-widest">Email Verified</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                Your email address has been verified. You will receive order updates and security alerts at this address.
              </p>
            </div>
          </div>

          {/* Security / Password Change */}
          <div className="lg:col-span-2">
            <div className="bg-slate-900 border border-slate-800 rounded-sm overflow-hidden">
              <div className="p-6 border-b border-slate-800 bg-slate-900/50">
                <h3 className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                  <Lock size={14} className="text-cyan" /> Security Settings
                </h3>
              </div>

              <form onSubmit={handlePasswordChange} className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Current Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                        <input 
                          type="password" 
                          required
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-sm focus:border-cyan outline-none text-white text-sm transition-colors"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex justify-between">
                        New Password
                        <span className="text-[8px] text-slate-600">Min. 6 characters</span>
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                        <input 
                          type="password" 
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-sm focus:border-cyan outline-none text-white text-sm transition-colors"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Confirm New Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                        <input 
                          type="password" 
                          required
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-sm focus:border-cyan outline-none text-white text-sm transition-colors"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-6 rounded-sm border border-slate-800 flex flex-col justify-center">
                    <div className="flex items-start gap-4 text-amber-500/80 mb-4">
                      <AlertCircle size={24} className="shrink-0" />
                      <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest mb-1">Password Policy</h4>
                        <p className="text-[10px] text-slate-500 leading-relaxed">
                          Changing your password will update your credentials across all devices. You may be required to confirm this change via email.
                        </p>
                      </div>
                    </div>
                    <ul className="space-y-2">
                      {['At least 6 characters', 'Mix of letters & numbers', 'Unique from previous'].map((rule, i) => (
                        <li key={i} className="flex items-center gap-2 text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                          <div className="w-1 h-1 bg-slate-700 rounded-full" />
                          {rule}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-end">
                  <button 
                    disabled={passwordLoading}
                    className="px-8 py-4 bg-cyan text-navy font-black rounded-sm text-[10px] uppercase tracking-widest hover:bg-white transition-all flex items-center gap-3 shadow-[0_0_20px_rgba(0,229,255,0.2)] disabled:opacity-50"
                  >
                    {passwordLoading ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <>Update Security Credentials</>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Role Protection Notice */}
            <div className="mt-8 p-6 bg-slate-900 border border-slate-800 rounded-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-800 rounded-sm flex items-center justify-center border border-slate-700">
                  <Shield className="text-slate-500" size={20} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Role Management</h4>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest">Account roles are managed by system administrators only.</p>
                </div>
              </div>
              <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest border border-slate-800 px-3 py-1 rounded-full">
                Immutable Field
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
