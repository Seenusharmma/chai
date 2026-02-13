'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Mail, Phone, MapPin, Send, Clock, Facebook, Instagram, Twitter, CheckCircle } from 'lucide-react';
import { Header } from '@/components/layout/Header';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        setIsSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const contactInfo = [
        { icon: Phone, label: 'Phone', value: '+91 98765 43210', color: 'bg-green-500/10 text-green-400' },
        { icon: Mail, label: 'Email', value: 'hello@auracafe.com', color: 'bg-blue-500/10 text-blue-400' },
        { icon: MapPin, label: 'Address', value: 'Mumbai, Maharashtra, India', color: 'bg-purple-500/10 text-purple-400' },
        { icon: Clock, label: 'Hours', value: 'Mon-Sun: 8AM - 10PM', color: 'bg-amber-500/10 text-amber-400' },
    ];

    const socialLinks = [
        { icon: Facebook, label: 'Facebook', color: 'hover:bg-blue-500/20 text-blue-400' },
        { icon: Instagram, label: 'Instagram', color: 'hover:bg-gradient-to-br hover:from-purple-500/20 hover:to-pink-500/20 text-pink-400' },
        { icon: Twitter, label: 'Twitter', color: 'hover:bg-sky-500/20 text-sky-400' },
    ];

    return (
        <main className="min-h-screen bg-[#1A1410] pb-24 md:pb-0">
            {/* Desktop Header - Fixed */}
            <div className="hidden md:block fixed top-0 left-0 right-0 z-50">
                <Header />
            </div>

            {/* Mobile Header */}
            <div className="sticky top-0 z-50 bg-[#1A1410]/95 backdrop-blur-xl border-b border-white/5 md:hidden">
                <div className="flex items-center justify-between h-16 px-4">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4A574] to-[#8B6F47] flex items-center justify-center">
                            <span className="text-white font-bold text-sm">A</span>
                        </div>
                        <span className="font-bold text-white">Aura<span className="text-[#D4A574]">Café</span></span>
                    </Link>
                </div>
            </div>

            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#D4A574]/5 via-transparent to-[#8B6F47]/5" />
                <div className="absolute top-20 right-0 w-80 h-80 bg-[#D4A574]/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#8B6F47]/5 rounded-full blur-3xl" />

                <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center max-w-2xl mx-auto"
                    >
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                            Get in <span className="text-[#D4A574]">Touch</span>
                        </h1>
                        <p className="text-[#A89B8F] text-lg mb-8">
                            Have a question or feedback? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Contact Content */}
            <div className="container mx-auto px-4 md:px-6 lg:px-8 pb-12">
                <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-[#2D2520] rounded-3xl p-6 md:p-8 border border-white/5"
                    >
                        {isSubmitted ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-12"
                            >
                                <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle className="w-10 h-10 text-green-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                                <p className="text-[#A89B8F] mb-6">Thank you for reaching out. We'll get back to you soon.</p>
                                <button
                                    onClick={() => setIsSubmitted(false)}
                                    className="px-6 py-3 bg-[#D4A574] text-[#1A1410] font-semibold rounded-xl hover:bg-[#C49564] transition-colors"
                                >
                                    Send Another Message
                                </button>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-[#A89B8F]">Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            placeholder="Your name"
                                            className="w-full bg-[#1A1410] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-[#6B6560] focus:outline-none focus:ring-2 focus:ring-[#D4A574]/50 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-[#A89B8F]">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="your@email.com"
                                            className="w-full bg-[#1A1410] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-[#6B6560] focus:outline-none focus:ring-2 focus:ring-[#D4A574]/50 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-[#A89B8F]">Subject</label>
                                    <select
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-[#1A1410] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#D4A574]/50 transition-all appearance-none"
                                    >
                                        <option value="">Select a subject</option>
                                        <option value="general">General Inquiry</option>
                                        <option value="feedback">Feedback</option>
                                        <option value="support">Customer Support</option>
                                        <option value="partnership">Partnership</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-[#A89B8F]">Message</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={5}
                                        placeholder="Write your message here..."
                                        className="w-full bg-[#1A1410] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-[#6B6560] focus:outline-none focus:ring-2 focus:ring-[#D4A574]/50 transition-all resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#D4A574] text-[#1A1410] font-semibold rounded-xl hover:bg-[#C49564] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <span className="w-5 h-5 border-2 border-[#1A1410]/30 border-t-[#1A1410] rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            Send Message
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </motion.div>

                    {/* Contact Info */}
                    <div className="space-y-6">
                        {/* Info Cards */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="grid sm:grid-cols-2 gap-4"
                        >
                            {contactInfo.map((info, index) => (
                                <motion.div
                                    key={info.label}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 + index * 0.1 }}
                                    className="bg-[#2D2520] rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-colors"
                                >
                                    <div className={`w-12 h-12 rounded-xl ${info.color} flex items-center justify-center mb-3`}>
                                        <info.icon className="w-5 h-5" />
                                    </div>
                                    <p className="text-[#A89B8F] text-sm mb-1">{info.label}</p>
                                    <p className="text-white font-medium">{info.value}</p>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Social Links */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="bg-[#2D2520] rounded-3xl p-6 md:p-8 border border-white/5"
                        >
                            <h3 className="text-xl font-bold text-white mb-4">Follow Us</h3>
                            <p className="text-[#A89B8F] mb-6">
                                Stay connected with us on social media for updates, promotions, and more.
                            </p>
                            <div className="flex gap-3">
                                {socialLinks.map((social) => (
                                    <a
                                        key={social.label}
                                        href="#"
                                        className={`w-12 h-12 rounded-xl bg-[#1A1410] flex items-center justify-center text-[#A89B8F] ${social.color} transition-all hover:scale-110`}
                                    >
                                        <social.icon className="w-5 h-5" />
                                    </a>
                                ))}
                            </div>
                        </motion.div>

                        {/* Map Preview */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className="bg-[#2D2520] rounded-3xl p-2 border border-white/5"
                        >
                            <div className="aspect-video rounded-2xl bg-gradient-to-br from-[#3A3230] to-[#252019] flex items-center justify-center">
                                <div className="text-center">
                                    <MapPin className="w-12 h-12 text-[#D4A574] mx-auto mb-2" />
                                    <p className="text-white font-medium">View on Map</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </main>
    );
}
