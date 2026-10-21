'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePlatform } from '@/context/PlatformContext';
import {
  X,
  Radio,
  Lock,
  Mail,
  User as UserIcon,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const router = useRouter();
  const {
    isAuthModalOpen,
    authModalTab,
    openAuthModal,
    closeAuthModal,
    login,
    register,
  } = usePlatform();

  // Local form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await login(loginEmail.trim(), loginPassword);
      setIsLoading(false);
      if (result.success) {
        closeAuthModal();
        router.push('/dashboard/buy-number');
      } else {
        setErrorMessage(result.error || 'Invalid email or password.');
      }
    } catch (err: unknown) {
      setIsLoading(false);
      const msg = err instanceof Error ? err.message : 'Login failed.';
      setErrorMessage(msg);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!signupName.trim() || !signupEmail.trim() || !signupPassword.trim()) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (signupPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await register(signupName.trim(), signupEmail.trim(), signupPassword);
      setIsLoading(false);
      if (result.success) {
        closeAuthModal();
        router.push('/dashboard/buy-number');
      } else {
        setErrorMessage(result.error || 'Failed to create account.');
      }
    } catch (err: unknown) {
      setIsLoading(false);
      const msg = err instanceof Error ? err.message : 'Registration failed.';
      setErrorMessage(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={closeAuthModal}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-zinc-800/80 bg-zinc-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
              <Radio className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-sm text-white">
                OTP<span className="text-emerald-400">Wallet</span>
              </span>
              <p className="text-[10px] text-zinc-400 -mt-0.5">Authentication Portal</p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeAuthModal}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher - Strictly Sign In and Sign Up only */}
        <div className="flex border-b border-zinc-800 bg-zinc-950/80 p-1.5 gap-1">
          <button
            type="button"
            onClick={() => {
              openAuthModal('login');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
              authModalTab === 'login'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              openAuthModal('signup');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
              authModalTab === 'signup'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800/80 flex items-start gap-2.5 text-rose-300 text-xs animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <div className="leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {/* LOGIN TAB */}
          {authModalTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-white">Sign In to OTPWallet</h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Access your temporary numbers, active orders & wallet balance
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => {
                      setLoginEmail(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    className="w-full pl-9 pr-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 transition"
                    placeholder="name@example.com"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => {
                      setLoginPassword(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    className="w-full pl-9 pr-9 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 transition"
                    placeholder="Enter password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-300 cursor-pointer"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !loginEmail.trim() || !loginPassword.trim()}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer mt-2"
              >
                {isLoading ? (
                  <span>Signing in...</span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              <div className="pt-2 text-center text-xs text-zinc-400">
                Need an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    openAuthModal('signup');
                    setErrorMessage(null);
                  }}
                  className="text-emerald-400 hover:underline font-semibold cursor-pointer ml-1"
                >
                  Create one now
                </button>
              </div>
            </form>
          )}

          {/* SIGN UP TAB */}
          {authModalTab === 'signup' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-white">Create New Account</h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Get started with instant virtual numbers and SMS verification
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={signupName}
                    onChange={(e) => {
                      setSignupName(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    className="w-full pl-9 pr-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 transition"
                    placeholder="Your Name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={signupEmail}
                    onChange={(e) => {
                      setSignupEmail(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    className="w-full pl-9 pr-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 transition"
                    placeholder="name@example.com"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showSignupPassword ? 'text' : 'password'}
                    required
                    value={signupPassword}
                    onChange={(e) => {
                      setSignupPassword(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    className="w-full pl-9 pr-9 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 transition"
                    placeholder="At least 6 characters"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-300 cursor-pointer"
                  >
                    {showSignupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !signupName.trim() || !signupEmail.trim() || !signupPassword.trim()}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer mt-2"
              >
                {isLoading ? (
                  <span>Creating account...</span>
                ) : (
                  <>
                    <span>Create Account & Continue</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              <div className="pt-2 text-center text-xs text-zinc-400">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => {
                    openAuthModal('login');
                    setErrorMessage(null);
                  }}
                  className="text-emerald-400 hover:underline font-semibold cursor-pointer ml-1"
                >
                  Sign in here
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
