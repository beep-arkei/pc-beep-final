import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useStore } from '../store/useStore';
import { X, Phone, ShieldCheck, Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface PhoneVerificationModalProps {
  onSuccess: () => void;
  onClose: () => void;
}

export const PhoneVerificationModal: React.FC<PhoneVerificationModalProps> = ({ onSuccess, onClose }) => {
  const { user, setUser } = useStore();
  const [phone, setPhone] = useState(user?.phone || '');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!phone || phone.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    try {
      // Simulation mode for development if no SMS provider is configured
      // In a real app, you'd use:
      // const { error } = await supabase.auth.signInWithOtp({ phone });
      
      console.log('Sending OTP to:', phone);
      // Simulating network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Verification code sent! (Mock: 123456)');
      setStep('otp');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter a 6-digit code');
      return;
    }

    setLoading(true);
    try {
      // Simulation: Mock code is 123456
      if (otp !== '123456') {
        throw new Error('Invalid verification code');
      }

      // Update profile in database
      if (user) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            phone: phone,
            phone_verified: true 
          })
          .eq('id', user.id);

        if (updateError) throw updateError;

        // Update local state
        setUser({
          ...user,
          phone: phone,
          phone_verified: true
        });

        toast.success('Phone verified successfully!');
        onSuccess();
      }
    } catch (error: any) {
      toast.error(error.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-navy/80 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div className="w-12 h-12 bg-cyan/10 rounded-2xl flex items-center justify-center">
              <ShieldCheck className="text-cyan" size={24} />
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
              <X size={20} className="text-slate-400" />
            </button>
          </div>

          <h2 className="text-2xl font-black text-navy uppercase tracking-tight mb-2">
            {step === 'phone' ? 'Verify Your Phone' : 'Enter Code'}
          </h2>
          <p className="text-slate-500 text-sm font-medium mb-8">
            {step === 'phone' 
              ? 'To secure your order, we need to verify your phone number via SMS.' 
              : `We've sent a 6-digit verification code to ${phone}.`}
          </p>

          {step === 'phone' ? (
            <div className="space-y-6">
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="tel"
                  placeholder="+63 912 345 6789"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-navy focus:ring-2 focus:ring-cyan outline-none transition-all"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <button
                onClick={handleSendOTP}
                disabled={loading}
                className="w-full py-4 bg-navy text-white font-black rounded-2xl hover:bg-navy/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : (
                  <>
                    SEND CODE
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex gap-2 justify-between">
                {[...Array(6)].map((_, i) => (
                  <input
                    key={i}
                    type="text"
                    maxLength={1}
                    className="w-12 h-14 text-center text-2xl font-black text-navy bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-cyan outline-none transition-all"
                    value={otp[i] || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^\d?$/.test(val)) {
                        const newOtp = otp.split('');
                        newOtp[i] = val;
                        setOtp(newOtp.join(''));
                        // Auto focus next
                        if (val && i < 5) {
                          (e.currentTarget.nextSibling as HTMLInputElement)?.focus();
                        }
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !otp[i] && i > 0) {
                        (e.currentTarget.previousSibling as HTMLInputElement)?.focus();
                      }
                    }}
                  />
                ))}
              </div>
              <button
                onClick={handleVerifyOTP}
                disabled={loading}
                className="w-full py-4 bg-cyan text-navy font-black rounded-2xl hover:bg-white border border-cyan transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan/20 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'VERIFY & CONTINUE'}
              </button>
              <button
                onClick={() => setStep('phone')}
                className="w-full text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-navy transition-colors"
              >
                Change Phone Number
              </button>
            </div>
          )}
        </div>
        
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Secure Verification Powered by PC Beep
          </p>
        </div>
      </div>
    </div>
  );
};
