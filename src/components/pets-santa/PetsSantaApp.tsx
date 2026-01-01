"use client";

import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import Hero from './Hero';
import Features from './Features';
import FAQ from './FAQ';
import AuthModal from './AuthModal';
import { Page, User, Creation } from '@/types';
import { useSession, signOut } from '@/lib/auth/client';

const SEOSection = () => (
  <section className="py-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
    <div className="max-w-4xl mx-auto px-4 text-center">
      <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">AI Christmas Pet Photo Templates</h2>
      <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
        Upload a photo of your pet and let AI turn it into a festive holiday portrait. Dress your pet in Santa, Elf, or Reindeer outfits, add cozy winter scenes, Christmas trees, lights, and gifts—no editing needed. Just upload, generate, and download your Christmas pet photo online.
      </p>
    </div>
  </section>
);

const AboutSection = () => (
  <section className="py-24 bg-red-600 dark:bg-red-700 text-white transition-colors duration-300">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
      <div>
        <h2 className="text-4xl lg:text-5xl font-bold mb-8 festive-font">Made for Pet Lovers, Built for the Holidays</h2>
        <p className="text-red-100 text-xl leading-relaxed mb-10">
          Pets helps you turn everyday pet photos into festive holiday portraits you&apos;ll actually want to share. No complicated tools—just upload and generate.
        </p>
        <div className="grid gap-6">
          {["Perfect for holiday cards and gifts", "Great for social posts and family sharing", "Works for dogs, cats, and other pets"].map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="w-8 h-8 bg-white/20 flex items-center justify-center rounded-full text-white text-sm">✓</span>
              <span className="text-lg font-medium">{item}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="relative">
        <div className="aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white/10">
          <img src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=1000" alt="Dog Portrait" className="w-full h-full object-cover" />
        </div>
        <div className="absolute -bottom-10 -left-10 bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-2xl text-slate-900 dark:text-white border border-slate-50 dark:border-slate-700">
          <div className="text-3xl mb-3">🎁</div>
          <div className="font-bold text-xl">Instant Magic</div>
          <div className="text-sm text-slate-500 dark:text-slate-400">Perfect gift for owners</div>
        </div>
      </div>
    </div>
  </section>
);

const TestimonialSection = () => (
  <section className="py-24 bg-white dark:bg-slate-900 transition-colors duration-300">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-4xl font-bold text-center mb-16 dark:text-white">What Pet Owners Are Saying</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            text: "My cat looks incredible in the elf outfit—instant holiday vibe.",
            author: "Emma",
            role: "Cat Lover",
            avatar: "https://i.pravatar.cc/150?u=emma"
          },
          {
            text: "We made Christmas portraits for our dog and rabbit. Super fun and easy.",
            author: "Lucas",
            role: "Dog Dad",
            avatar: "https://i.pravatar.cc/150?u=lucas"
          },
          {
            text: "Perfect for our pet shop's holiday promo—customers loved it.",
            author: "Nina",
            role: "Shop Owner",
            avatar: "https://i.pravatar.cc/150?u=nina"
          }
        ].map((t, i) => (
          <div key={i} className="bg-slate-50 dark:bg-slate-800 p-10 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-xl dark:hover:shadow-red-900/10 transition-all group">
            <div className="flex gap-1 mb-6">
              {[...Array(5)].map((_, j) => <span key={j} className="text-yellow-400 text-lg">★</span>)}
            </div>
            <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed mb-8 italic">&quot;{t.text}&quot;</p>
            <div className="flex items-center gap-4">
              <img
                src={t.avatar}
                alt={t.author}
                className="w-12 h-12 rounded-2xl object-cover border border-slate-200 dark:border-slate-600 group-hover:scale-110 transition-transform"
              />
              <div>
                <div className="font-bold text-slate-900 dark:text-white leading-tight">{t.author}</div>
                <div className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase tracking-widest mt-1">{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const CTASection = ({ onScrollToTop, onGoPricing }: { onScrollToTop: () => void, onGoPricing: () => void }) => (
  <section className="py-32 bg-slate-900 dark:bg-black text-white relative overflow-hidden transition-colors duration-300">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(220,38,38,0.2)_0%,_transparent_70%)]"></div>
    <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
      <h2 className="text-5xl font-bold mb-6 festive-font">Ready to Make Your Pet&apos;s Christmas Portrait?</h2>
      <p className="text-xl text-slate-400 mb-12">Upload a photo and generate your first festive look in seconds.</p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
        <button onClick={onScrollToTop} className="w-full sm:w-auto px-12 py-5 bg-red-600 text-white rounded-full font-bold text-xl hover:bg-red-700 transition-all shadow-2xl shadow-red-900/40 transform hover:-translate-y-1">
          Upload & Generate
        </button>
        <button onClick={onGoPricing} className="w-full sm:w-auto px-12 py-5 bg-transparent border-2 border-slate-700 dark:border-slate-600 text-white rounded-full font-bold text-xl hover:bg-white hover:text-slate-900 hover:border-white transition-all">
          See Pricing
        </button>
      </div>
      <p className="mt-10 text-slate-500 font-medium tracking-wide">No credit card required to try.</p>
    </div>
  </section>
);

const PricingPage = ({ onPlanSelect, isLoading }: { onPlanSelect: (plan: string) => void; isLoading?: boolean }) => {
  const plan = {
    name: 'Holiday Pack',
    price: '$10',
    sub: '',
    desc: 'Perfect for sharing with family and friends.',
    features: ['200 Holiday Credits', 'High-quality downloads', 'All Christmas styles', 'Priority generation', 'No expiration'],
    button: 'Buy 200 Credits',
  };

  return (
    <div className="py-24 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h1 className="text-6xl font-bold text-slate-900 dark:text-white mb-6 festive-font">Pricing</h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">One-time purchase credit packs. No subscriptions, just holiday fun.</p>
        </div>
        <div className="flex justify-center">
          <div className="relative bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] shadow-xl border border-red-500 dark:border-red-600 flex flex-col max-w-md w-full transform transition-all hover:shadow-2xl">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest px-6 py-2 rounded-full shadow-xl">Best Value</div>
            <div className="mb-10">
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{plan.name}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{plan.desc}</p>
            </div>
            <div className="mb-10">
              <span className="text-6xl font-bold text-slate-900 dark:text-white">{plan.price}</span>
              <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">One-time payment</div>
            </div>
            <ul className="space-y-5 mb-12 flex-grow">
              {plan.features.map((f, j) => (
                <li key={j} className="flex items-center gap-4 text-slate-600 dark:text-slate-400 font-medium">
                  <span className="w-6 h-6 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center text-xs">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => onPlanSelect(plan.name)}
              disabled={isLoading}
              className="w-full py-5 rounded-2xl font-bold text-lg transition-all bg-red-600 text-white hover:bg-red-700 shadow-xl shadow-red-200 dark:shadow-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Processing...' : plan.button}
            </button>
          </div>
        </div>
        <div className="mt-20 text-center text-slate-400 text-sm italic">
          Need custom volume? <button className="text-red-600 dark:text-red-400 font-bold hover:underline">Contact us</button> for bulk rates.
        </div>
      </div>
    </div>
  );
};

const MyCreationsPage = ({ creations, isLoading }: { creations: Creation[]; isLoading: boolean }) => (
  <div className="py-24 min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-16 festive-font">My Creations</h1>
      {isLoading ? (
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-32 text-center border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="text-8xl mb-8 animate-bounce">🐾</div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Loading...</h2>
        </div>
      ) : creations.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-32 text-center border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="text-8xl mb-8 opacity-20">📸</div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">No creations yet</h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg">Go to the homepage and create your first festive portrait!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {creations.map((c) => (
            <div key={c.id} className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 group hover:shadow-xl transition-all">
              <div className="relative aspect-square overflow-hidden bg-slate-50 dark:bg-slate-800">
                {c.status === 'processing' || c.status === 'pending' ? (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <svg className="animate-spin h-12 w-12 text-red-500 mb-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-sm text-slate-500 dark:text-slate-400">Generating...</span>
                  </div>
                ) : c.status === 'failed' || c.status === 'refunded' ? (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4">
                    <div className="text-4xl mb-4">❌</div>
                    <span className="text-sm text-red-500 dark:text-red-400 text-center">
                      {c.status === 'refunded' ? 'Failed - Credits Refunded' : 'Failed'}
                    </span>
                    {c.errorMessage && (
                      <span className="text-xs text-slate-400 mt-2 text-center">{c.errorMessage}</span>
                    )}
                  </div>
                ) : c.generatedImage ? (
                  <img src={c.generatedImage} alt={c.style} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-slate-400">No image</span>
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-800/90 px-3 py-1 rounded-xl text-[10px] font-bold text-red-600 dark:text-red-400 uppercase shadow-md tracking-widest">{c.style}</div>
                {(c.status === 'processing' || c.status === 'pending') && (
                  <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-xl text-[10px] font-bold uppercase shadow-md tracking-widest">Processing</div>
                )}
              </div>
              <div className="p-6 flex items-center justify-between bg-white dark:bg-slate-900 border-t border-slate-50 dark:border-slate-800">
                <span className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">{c.date}</span>
                {c.generatedImage && c.status === 'completed' && (
                  <button
                    onClick={() => { const link = document.createElement('a'); link.href = c.generatedImage!; link.download = `pet-${c.id}.png`; link.click(); }}
                    className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

const PetsSantaApp: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [creations, setCreations] = useState<Creation[]>([]);
  const [isCreationsLoading, setIsCreationsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  // Use Better Auth session
  const { data: session, isPending } = useSession();

  // Map Better Auth User to our local User type
  const mappedUser: User | null = session?.user ? {
    id: session.user.id,
    name: session.user.name || 'Pet Lover',
    email: session.user.email,
    plan: 'free'
  } : null;

  // Fetch creations from API
  const fetchCreations = async () => {
    if (!session?.user) return;

    setIsCreationsLoading(true);
    try {
      const response = await fetch('/api/creations');
      if (response.ok) {
        const data = await response.json();
        setCreations(data.creations);
      }
    } catch (error) {
      console.error('Failed to fetch creations:', error);
    } finally {
      setIsCreationsLoading(false);
    }
  };

  useEffect(() => {
    // Initialize dark mode from localStorage or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(savedTheme === 'dark' || (!savedTheme && prefersDark));
  }, []);

  // Fetch creations when user logs in or navigates to my-creations page
  useEffect(() => {
    if (session?.user && currentPage === 'my-creations') {
      fetchCreations();
    }
  }, [session?.user, currentPage]);

  // Poll for in-progress tasks
  useEffect(() => {
    if (currentPage !== 'my-creations') return;

    const hasProcessing = creations.some(c => c.status === 'processing' || c.status === 'pending');
    if (!hasProcessing) return;

    const interval = setInterval(() => {
      fetchCreations();
    }, 3000);

    return () => clearInterval(interval);
  }, [currentPage, creations]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  const handleLogout = async () => {
    await signOut();
    setCurrentPage('home');
  };

  const handleNewCreation = () => {
    // Refresh creations from the database
    // The creation is already saved by the API
    fetchCreations();
  };

  const handleCheckout = async () => {
    if (!mappedUser) {
      setIsAuthModalOpen(true);
      return;
    }

    setIsCheckoutLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        const errorMsg = data.details ? `${data.error}: ${data.details}` : data.error;
        alert(errorMsg || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to initiate checkout');
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="animate-bounce text-4xl">🐾</div>
      </div>
    );
  }

  return (
    <Layout
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      user={mappedUser}
      onLogin={() => setIsAuthModalOpen(true)}
      onLogout={handleLogout}
      isDarkMode={isDarkMode}
      toggleDarkMode={toggleDarkMode}
    >
      {currentPage === 'home' && (
        <>
          <Hero
            onGenerated={handleNewCreation}
            user={mappedUser}
            onLogin={() => setIsAuthModalOpen(true)}
            onNavigateToPricing={() => setCurrentPage('pricing')}
          />
          <SEOSection />
          <Features />
          <AboutSection />
          <TestimonialSection />
          <FAQ />
          <CTASection onScrollToTop={scrollToTop} onGoPricing={() => setCurrentPage('pricing')} />
        </>
      )}
      {currentPage === 'pricing' && <PricingPage onPlanSelect={handleCheckout} isLoading={isCheckoutLoading} />}
      {currentPage === 'my-creations' && <MyCreationsPage creations={creations} isLoading={isCreationsLoading} />}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </Layout>
  );
};

export default PetsSantaApp;
