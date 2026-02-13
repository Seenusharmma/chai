'use client';

import { useSignIn, useSignUp } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Coffee } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

export function AuthPage({ type }: { type: 'sign-in' | 'sign-up' }) {
    const { signIn, isLoaded: isSignInLoaded } = useSignIn();
    const { signUp, isLoaded: isSignUpLoaded } = useSignUp();
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get('redirect_url') || '/';

    const handleGoogleSignIn = async () => {
        if (type === 'sign-in') {
            if (!isSignInLoaded) return;
            try {
                await signIn.authenticateWithRedirect({
                    strategy: "oauth_google",
                    redirectUrl: "/sso-callback",
                    redirectUrlComplete: redirectUrl,
                });
            } catch (err) {
                console.error("Error signing in:", err);
            }
        } else {
            if (!isSignUpLoaded) return;
            try {
                await signUp.authenticateWithRedirect({
                    strategy: "oauth_google",
                    redirectUrl: "/sso-callback",
                    redirectUrlComplete: redirectUrl,
                });
            } catch (err) {
                console.error("Error signing up:", err);
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#1A1410] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#D4A574]/5 blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#8B5E3C]/10 blur-[100px]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-[#252019]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl relative z-10"
            >
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D4A574] to-[#8B6F47] flex items-center justify-center shadow-lg shadow-[#D4A574]/20">
                        <Coffee className="w-8 h-8 text-white" />
                    </div>
                </div>

                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="font-heading text-3xl text-white font-bold mb-3">
                        {type === 'sign-in' ? 'Welcome Back' : 'Create Account'}
                    </h1>
                    <p className="text-[#A89B8F]">
                        {type === 'sign-in'
                            ? 'Sign in to access your dashboard and orders'
                            : 'Join us to start ordering delicious coffee'}
                    </p>
                </div>

                {/* Google Button */}
                <button
                    onClick={handleGoogleSignIn}
                    className="w-full h-14 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-xl flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg group relative overflow-hidden"
                >
                    <Image
                        src="https://www.google.com/favicon.ico"
                        alt="Google"
                        width={20}
                        height={20}
                        className="w-5 h-5"
                    />
                    <span>Continue with Google</span>

                    {/* Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                </button>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-[#5A524C]">
                        By continuing, you agree to our{' '}
                        <a href="#" className="text-[#8B5E3C] hover:text-[#D4A574] transition-colors">Terms of Service</a>
                        {' '}and{' '}
                        <a href="#" className="text-[#8B5E3C] hover:text-[#D4A574] transition-colors">Privacy Policy</a>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
