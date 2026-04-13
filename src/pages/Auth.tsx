import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { Mail, Lock, User, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useStore } from '../store/useStore';

type AuthStep = 'credentials' | 'otp';

export const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState<AuthStep>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const setUser = useStore((state) => state.setUser);

  const seedAccounts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/dev/seed-accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Seeding failed');
      
      const failed = data.results.filter((r: any) => r.status === 'error');
      if (failed.length > 0) {
        console.error('Some accounts failed to seed:', failed);
        alert(`Seeding completed with some errors. Check console for details.`);
      } else {
        alert('Seed accounts created/verified and emails confirmed. You can now login.');
      }
    } catch (err: any) {
      setError('Seeding failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const checkOtpExemption = (userEmail: string) => {
    const lastVerified = localStorage.getItem(`otp_verified_${userEmail}`);
    if (lastVerified) {
      const lastTime = new Date(lastVerified).getTime();
      const now = new Date().getTime();
      const oneHour = 60 * 60 * 1000;
      return (now - lastTime) < oneHour;
    }
    return false;
  };

  const setOtpExemption = (userEmail: string) => {
    localStorage.setItem(`otp_verified_${userEmail}`, new Date().toISOString());
  };

  const bypassOtp = async () => {
    if (!email) {
      setError('Please enter an email first');
      return;
    }
    setOtpExemption(email);
    setStep('credentials');
    await completeAuth();
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (step === 'credentials') {
        // First, check if OTP is needed
        const isExempt = checkOtpExemption(email);
        
        if (isExempt) {
          await completeAuth();
        } else {
          // Send OTP
          const response = await fetch('/api/auth/send-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
          });
          
          const data = await response.json();
          if (!response.ok) throw new Error(data.error || 'Failed to send OTP');
          
          setStep('otp');
        }
      } else {
        // Verify OTP
        const response = await fetch('/api/auth/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, code: otpCode }),
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Invalid OTP');
        
        setOtpExemption(email);
        await completeAuth();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const completeAuth = async () => {
    if (isLogin) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      
      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        let finalProfile = profile;
        
        // If profile is missing, create a temporary one for the session
        if (!profile) {
          finalProfile = {
            id: data.user.id,
            username: data.user.user_metadata?.username || email.split('@')[0] || 'User',
            role: 'buyer',
            created_at: new Date().toISOString()
          };
        }

        // Force roles for test accounts
        if (email === 'ryankaitobeppu@gmail.com') finalProfile.role = 'owner';
        else if (email === 'rkbeppu@gmail.com') finalProfile.role = 'admin';
        else if (email === 'rkpbeppu@universityofbohol.edu.ph') finalProfile.role = 'buyer';
        
        setUser(finalProfile);
        navigate('/dashboard');
      }
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });
      if (error) throw error;
      
      if (data.user) {
        // Assign roles based on email for pre-defined accounts
        let role = 'buyer';
        if (email === 'ryankaitobeppu@gmail.com') role = 'owner';
        else if (email === 'rkbeppu@gmail.com') role = 'admin';

        await supabase.from('profiles').update({ role }).eq('id', data.user.id);

        alert('Registration successful! Please check your email for verification.');
        setIsLogin(true);
        setStep('credentials');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/login_background_vid.mp4" type="video/mp4" />
      </video>
      
      {/* Dark Overlay/Blur */}
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm z-10" />

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-white/20 overflow-hidden relative z-20 animate-in fade-in zoom-in duration-500">
        <div className="bg-navy p-8 text-center relative overflow-hidden">
          {/* Tech Pattern Overlay */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" 
               style={{ 
                 backgroundImage: `linear-gradient(to right, #00BFE6 1px, transparent 1px), linear-gradient(to bottom, #00BFE6 1px, transparent 1px)`, 
                 backgroundSize: '20px 20px' 
               }} 
          />
          <Logo className="justify-center brightness-0 invert relative z-10" variant="icon" />
          <h2 className="mt-4 text-2xl font-black text-white uppercase tracking-tighter relative z-10">
            {step === 'otp' ? 'Verify Identity' : (isLogin ? 'Welcome Back' : 'Join the Community')}
          </h2>
          <p className="text-slate-400 text-sm mt-2 relative z-10">
            {step === 'otp' 
              ? `We've sent a code to ${email}` 
              : (isLogin ? 'Login to manage your builds and orders.' : 'Create an account to start building your dream PC.')}
          </p>
        </div>

        <form onSubmit={handleAuth} className="p-8 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-500 text-xs font-bold uppercase tracking-widest">
              {error}
            </div>
          )}

          {step === 'credentials' ? (
            <>
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-xs font-black text-navy uppercase tracking-widest">Username</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan outline-none"
                      placeholder="beppu"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-black text-navy uppercase tracking-widest">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan outline-none"
                    placeholder="ryankaitobeppu@gmail.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-navy uppercase tracking-widest">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <label className="text-xs font-black text-navy uppercase tracking-widest">Verification Code</label>
              <div className="relative">
                <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  required
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan outline-none text-center text-2xl font-black tracking-[0.5em]"
                  placeholder="000000"
                />
              </div>
              <p className="text-[10px] text-slate-400 text-center uppercase font-bold tracking-widest mt-2">
                Check your inbox for the 6-digit code
              </p>
            </div>
          )}

          <button 
            disabled={loading}
            className="w-full py-4 bg-cyan text-navy font-black rounded-xl flex items-center justify-center gap-3 hover:bg-cyan/90 transition-all shadow-lg shadow-cyan/20 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
              <>
                {step === 'otp' ? 'VERIFY CODE' : (isLogin ? 'LOGIN' : 'CREATE ACCOUNT')} <ArrowRight size={20} />
              </>
            )}
          </button>

          <div className="text-center">
            <button 
              type="button"
              onClick={() => {
                if (step === 'otp') {
                  setStep('credentials');
                } else {
                  setIsLogin(!isLogin);
                }
              }}
              className="text-sm font-bold text-navy hover:text-cyan transition-colors"
            >
              {step === 'otp' ? 'Back to Login' : (isLogin ? "Don't have an account? Register" : "Already have an account? Login")}
            </button>
          </div>
        </form>

        {/* Dev Login Helper */}
        <div className="p-6 bg-slate-50 border-t border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck size={12} /> Dev Login Helper
            </h3>
            <div className="flex gap-4">
              <button 
                onClick={bypassOtp}
                disabled={loading}
                className="text-[10px] font-black text-purple-500 hover:underline uppercase tracking-widest disabled:opacity-50"
              >
                Bypass OTP
              </button>
              <button 
                onClick={seedAccounts}
                disabled={loading}
                className="text-[10px] font-black text-cyan hover:underline uppercase tracking-widest disabled:opacity-50"
              >
                Seed Accounts
              </button>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { role: 'Owner', email: 'ryankaitobeppu@gmail.com', pass: 'beep123' },
              { role: 'Admin', email: 'rkbeppu@gmail.com', pass: 'admin123' },
              { role: 'User', email: 'rkpbeppu@universityofbohol.edu.ph', pass: '123456' }
            ].map((acc) => (
              <button
                key={acc.role}
                type="button"
                onClick={() => {
                  setEmail(acc.email);
                  setPassword(acc.pass);
                }}
                className="w-full p-3 bg-white border border-slate-200 rounded-xl text-left hover:border-cyan transition-all group"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-navy uppercase tracking-tighter">{acc.role}</span>
                  <span className="text-[8px] font-bold text-slate-400 group-hover:text-cyan uppercase">Click to Autofill</span>
                </div>
                <div className="text-xs font-medium text-slate-500 truncate">{acc.email}</div>
                <div className="text-[10px] font-mono text-slate-400">Pass: {acc.pass}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
