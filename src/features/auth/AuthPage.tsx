import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { ArrowLeft, Mail, Lock, User } from 'lucide-react';

type AuthView = 'LOGIN' | 'SIGNUP' | 'FORGOT_PASSWORD';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);
  const addToast = useNotificationStore((s) => s.addToast);

  const [view, setView] = useState<AuthView>('LOGIN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setLoading(true);
    try {
      await login(email, password);
      addToast({
        type: 'success',
        title: 'Welcome back!',
        message: 'Successfully logged in to PetBloom.'
      });
      navigate('/dashboard');
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Login Failed',
        message: 'Invalid credentials. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) return;

    setLoading(true);
    try {
      await register(name, email);
      addToast({
        type: 'success',
        title: 'Account Created',
        message: 'Welcome to PetBloom! Let\'s set up your profile.'
      });
      navigate('/onboarding');
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Registration Failed',
        message: 'Could not create account. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    setTimeout(() => {
      addToast({
        type: 'info',
        title: 'Reset Link Sent',
        message: `A password reset link has been sent to ${email} (Mock Action).`
      });
      setLoading(false);
      setView('LOGIN');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-warm-cream flex items-center justify-center p-6 dark:bg-midnight-forest transition-colors duration-300 animate-spring-bounce">
      <Card variant="default" className="max-w-md w-full p-8 shadow-2xl relative overflow-hidden">
        
        {/* Glow Gradient BG */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-bloom-rose/10 blur-3xl -z-10 rounded-full" />
        
        {/* Back Link to Landing */}
        {view === 'LOGIN' ? (
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-warm-slate hover:text-bloom-rose mb-6 cursor-pointer select-none">
            <ArrowLeft size={14} /> Back to home
          </Link>
        ) : (
          <button
            onClick={() => setView('LOGIN')}
            className="inline-flex items-center gap-1.5 text-xs text-warm-slate hover:text-bloom-rose mb-6 cursor-pointer select-none"
          >
            <ArrowLeft size={14} /> Back to login
          </button>
        )}

        {/* LOGO HEADER */}
        <div className="flex flex-col items-center gap-3 mb-8 text-center">
          <div className="w-11 h-11 rounded-full bg-bloom-rose flex items-center justify-center text-white font-bold text-xl font-display shadow-sm">
            P
          </div>
          <div>
            <h1 className="text-2xl font-bold text-deep-charcoal font-display dark:text-frosted-pearl">
              {view === 'LOGIN' && 'Welcome Back'}
              {view === 'SIGNUP' && 'Create Account'}
              {view === 'FORGOT_PASSWORD' && 'Reset Password'}
            </h1>
            <p className="text-xs text-warm-slate mt-1 dark:text-frosted-pearl/60">
              {view === 'LOGIN' && 'Log in to care for your blooming pet'}
              {view === 'SIGNUP' && 'Sign up to build your customized care plans'}
              {view === 'FORGOT_PASSWORD' && 'Enter your email to recover your account'}
            </p>
          </div>
        </div>

        {/* LOGIN FORM */}
        {view === 'LOGIN' && (
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="relative">
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="sarah@petbloom.com"
                className="pl-9"
              />
              <Mail size={16} className="absolute left-3 top-[38px] text-warm-slate/60" />
            </div>

            <div className="relative">
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium text-warm-slate dark:text-frosted-pearl/80">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setView('FORGOT_PASSWORD')}
                  className="text-xs text-bloom-rose hover:underline"
                >
                  Forgot?
                </button>
              </div>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="pl-9"
              />
              <Lock size={16} className="absolute left-3 top-[38px] text-warm-slate/60" />
            </div>

            <Button type="submit" variant="primary" fullWidth disabled={loading} className="mt-2 cursor-pointer">
              {loading ? 'Logging in...' : 'Sign In'}
            </Button>

            <p className="text-center text-xs text-warm-slate mt-4 dark:text-frosted-pearl/60">
              Don't have an account?{' '}
              <button type="button" onClick={() => setView('SIGNUP')} className="text-bloom-rose font-bold hover:underline">
                Sign Up
              </button>
            </p>
          </form>
        )}

        {/* SIGN UP FORM */}
        {view === 'SIGNUP' && (
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <div className="relative">
              <Input
                label="Full Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Sarah Jenkins"
                className="pl-9"
              />
              <User size={16} className="absolute left-3 top-[38px] text-warm-slate/60" />
            </div>

            <div className="relative">
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="sarah@petbloom.com"
                className="pl-9"
              />
              <Mail size={16} className="absolute left-3 top-[38px] text-warm-slate/60" />
            </div>

            <div className="relative">
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="pl-9"
              />
              <Lock size={16} className="absolute left-3 top-[38px] text-warm-slate/60" />
            </div>

            <Button type="submit" variant="primary" fullWidth disabled={loading} className="mt-2 cursor-pointer">
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>

            <p className="text-center text-xs text-warm-slate mt-4 dark:text-frosted-pearl/60">
              Already have an account?{' '}
              <button type="button" onClick={() => setView('LOGIN')} className="text-bloom-rose font-bold hover:underline">
                Sign In
              </button>
            </p>
          </form>
        )}

        {/* FORGOT PASSWORD FORM */}
        {view === 'FORGOT_PASSWORD' && (
          <form onSubmit={handleForgotPassword} className="flex flex-col gap-4">
            <div className="relative">
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="sarah@petbloom.com"
                className="pl-9"
              />
              <Mail size={16} className="absolute left-3 top-[38px] text-warm-slate/60" />
            </div>

            <Button type="submit" variant="primary" fullWidth disabled={loading} className="mt-2 cursor-pointer">
              {loading ? 'Sending link...' : 'Send Recovery Email'}
            </Button>
          </form>
        )}

      </Card>
    </div>
  );
};
export default AuthPage;
