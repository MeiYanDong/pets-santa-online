"use client";

import React from 'react';
import Link from 'next/link';
import { signIn } from '@/lib/auth/client';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    try {
      await signIn.social({
        provider: "google",
        callbackURL: window.location.origin
      });
    } catch (error) {
      console.error("Sign in failed:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-transparent dark:border-slate-800 transition-colors animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-10 text-center">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl shadow-inner">
            🐾
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Log in to save and download</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">
            Sign in to keep your creations and unlock premium quality for your pet portraits.
          </p>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full py-4 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold flex items-center justify-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm mb-4"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
          </div>

          {/* Email Sign In */}
          <Link
            href="/signin"
            onClick={onClose}
            className="w-full py-4 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold flex items-center justify-center gap-3 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-lg mb-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Sign in with Email
          </Link>

          {/* Sign Up Link */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-sm text-slate-500 dark:text-slate-400">Don&apos;t have an account?</span>
            <Link
              href="/signup"
              onClick={onClose}
              className="text-sm font-bold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
            >
              Sign up
            </Link>
          </div>

          <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-relaxed">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
