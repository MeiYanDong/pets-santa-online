import { type Metadata } from "next";
import SignInForm from "./form";
import Link from "next/link";
import { GoogleSignInButton } from "../components/google-signin-button";

export const metadata: Metadata = {
  title: "Sign In - Pets Santa",
  description: "Sign in to your Pets Santa account to create AI Christmas pet portraits.",
};

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Background gradient */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-red-50 via-white to-green-50 dark:from-red-900/10 dark:via-slate-950 dark:to-green-900/10 opacity-70"></div>

      {/* Header */}
      <header className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-2 group w-fit">
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white text-xl shadow-lg group-hover:scale-110 transition-transform">
              🐾
            </div>
            <span className="festive-font text-2xl font-bold text-red-600 tracking-tight">Pets Santa</span>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-10 transition-colors duration-300">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl shadow-inner">
                🐾
              </div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome Back</h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                Sign in to continue creating festive pet portraits
              </p>
            </div>

            {/* Form */}
            <SignInForm />

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase tracking-widest">or</span>
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
            </div>

            {/* Google Sign In */}
            <GoogleSignInButton />

            {/* Sign up link */}
            <div className="text-center mt-6">
              <span className="text-sm text-slate-500 dark:text-slate-400">Don&apos;t have an account? </span>
              <Link
                href="/signup"
                className="text-sm font-bold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>

          {/* Back to home */}
          <div className="text-center mt-8">
            <Link
              href="/"
              className="text-sm text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors inline-flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-slate-400 dark:text-slate-500">
        © {new Date().getFullYear()} Pets Santa. All rights reserved.
      </footer>
    </div>
  );
}
