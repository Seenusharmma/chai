'use client';

import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Settings, CreditCard, Bell, HelpCircle, LogOut, Instagram, Facebook, ArrowLeft, Award } from 'lucide-react';
import Link from 'next/link';
import { Navigation } from '@/components/layout/Navigation';
import { Header } from '@/components/layout/Header';
import { useUser } from '@clerk/nextjs';
import { SignInButton } from '@clerk/nextjs';

export default function ProfilePage() {
  const { user, isLoaded } = useUser();

  const menuItems = [
    { icon: CreditCard, label: 'Payment Methods', badge: '2 cards' },
    { icon: Bell, label: 'Notifications', badge: '3 new' },
    { icon: HelpCircle, label: 'Help & Support', badge: null },
    { icon: Settings, label: 'Settings', badge: null },
  ];

  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-[#1A1410] flex items-center justify-center">
        <div className="text-[#A89B8F]">Loading...</div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-[#1A1410] pb-24 md:pb-8">
        <div className="hidden md:block fixed top-0 left-0 right-0 z-50">
          <Header />
        </div>

        <div className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-white/5 md:hidden">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex items-center justify-between h-20">
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="w-5 h-5 text-white" />
                <span className="text-lg font-bold text-white">Profile</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-24 md:pt-8 px-4 md:px-8 max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="w-20 h-20 rounded-full bg-[#2D2520] flex items-center justify-center mb-6">
              <User className="w-10 h-10 text-[#A89B8F]" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Sign In Required</h2>
            <p className="text-[#A89B8F] mb-8">Please sign in to view your profile</p>
            <SignInButton mode="modal">
              <button className="bg-[#8B5E3C] text-white font-bold py-3 px-8 rounded-xl hover:bg-[#6F4E37] transition-colors">
                Sign In
              </button>
            </SignInButton>
          </div>
        </div>
        <Navigation />
      </main>
    );
  }

  const userData = {
    name: user.fullName || user.firstName || 'User',
    email: user.primaryEmailAddress?.emailAddress || '',
    phone: user.primaryPhoneNumber?.phoneNumber || '',
    location: 'Mumbai, India',
    avatar: user.imageUrl,
    credits: 250,
  };

  return (
    <main className="min-h-screen bg-[#1A1410] pb-24 md:pb-8">
      {/* Desktop Header - Fixed */}
      <div className="hidden md:block fixed top-0 left-0 right-0 z-50">
        <Header />
      </div>

      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-white/5 md:hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="w-5 h-5 text-white" />
              <span className="text-lg font-bold text-white">Profile</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="pt-24 md:pt-8 px-4 md:px-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#2D2520] to-[#3A3230] rounded-3xl p-6 md:p-8 border border-white/5 mb-6"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-[#D4A574] shadow-lg">
                <img
                  src={userData.avatar}
                  alt={userData.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#D4A574] rounded-full flex items-center justify-center shadow-lg hover:bg-[#C49564] transition-colors">
                <Settings className="w-4 h-4 text-[#1A1410]" />
              </button>
            </div>

            <div className="text-center md:text-left flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{userData.name}</h1>
              <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-[#A89B8F] text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{userData.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{userData.phone}</span>
                </div>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2 text-[#A89B8F] text-sm mt-2">
                <MapPin className="w-4 h-4" />
                <span>{userData.location}</span>
              </div>
            </div>

            <div className="bg-[#1A1410] rounded-2xl p-4 md:p-6 text-center min-w-[140px]">
              <div className="w-12 h-12 rounded-full bg-[#D4A574]/10 flex items-center justify-center mx-auto mb-2">
                <Award className="w-6 h-6 text-[#D4A574]" />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-white">{userData.credits}</p>
              <p className="text-xs text-[#A89B8F]">Credits</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#2D2520] rounded-2xl border border-white/5 overflow-hidden mb-6"
        >
          {menuItems.map((item, index) => (
            <button
              key={item.label}
              className={`w-full flex items-center justify-between p-4 md:p-5 hover:bg-[#352D28] transition-colors ${
                index !== menuItems.length - 1 ? 'border-b border-white/5' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#D4A574]/10 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-[#D4A574]" />
                </div>
                <span className="text-white font-medium">{item.label}</span>
              </div>
              <div className="flex items-center gap-3">
                {item.badge && (
                  <span className="text-xs text-[#A89B8F] bg-[#1A1410] px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
                <svg className="w-5 h-5 text-[#A89B8F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#2D2520] rounded-2xl border border-white/5 overflow-hidden mb-6"
        >
          <div className="p-4 md:p-5 border-b border-white/5">
            <h2 className="text-white font-semibold">Follow Us</h2>
            <p className="text-sm text-[#A89B8F]">Stay connected on social media</p>
          </div>
          <div className="flex">
            <button className="flex-1 flex items-center justify-center gap-3 p-4 md:p-5 hover:bg-[#352D28] transition-colors border-r border-white/5">
              <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center">
                <Facebook className="w-5 h-5 text-blue-500" />
              </div>
              <span className="text-white font-medium">Facebook</span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-3 p-4 md:p-5 hover:bg-[#352D28] transition-colors">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
                <Instagram className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-medium">Instagram</span>
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <button className="w-full flex items-center justify-center gap-3 p-4 md:p-5 bg-[#2D2520] rounded-2xl border border-white/5 text-[#D4A574] font-semibold hover:bg-[#352D28] transition-colors">
            <CreditCard className="w-5 h-5" />
            Add Credits
          </button>

          <button className="w-full flex items-center justify-center gap-3 p-4 md:p-5 bg-red-500/10 rounded-2xl border border-red-500/20 text-red-400 font-semibold hover:bg-red-500/20 transition-colors">
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </motion.div>

        <p className="text-center text-[#6B6560] text-xs mt-8 pb-4">
          Version 1.0.0 • AuraCafé
        </p>
      </div>
      <Navigation />
    </main>
  );
}
