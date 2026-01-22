'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Diamond, Mail, Lock, Store, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';

export default function RegisterPage() {
    const router = useRouter();
    const { setToken, setUser, setReseller } = useAuthStore();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (step === 1) {
            if (password !== confirmPassword) {
                setError('Passwords do not match');
                return;
            }
            if (password.length < 8) {
                setError('Password must be at least 8 characters');
                return;
            }
            setError('');
            setStep(2);
            return;
        }

        setError('');
        setLoading(true);

        try {
            const { access_token } = await api.register(email, password, businessName) as any;
            setToken(access_token);
            localStorage.setItem('token', access_token);

            // Fetch user and reseller data
            const user = await api.getCurrentUser();
            setUser(user as any);

            const reseller = await api.getResellerProfile();
            setReseller(reseller as any);

            router.push('/onboarding');
        } catch (err: any) {
            setError(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
            {/* Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl" />
            </div>

            <div className="w-full max-w-md relative">
                {/* Logo */}
                <Link href="/" className="flex items-center justify-center gap-2 mb-8">
                    <Diamond className="w-10 h-10 text-purple-400" />
                    <span className="font-display text-2xl font-bold gradient-text">JewelryHub</span>
                </Link>

                <div className="card">
                    {/* Progress */}
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-purple-400' : 'text-white/40'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 1 ? 'bg-purple-500' : 'bg-white/10'}`}>
                                {step > 1 ? <CheckCircle className="w-5 h-5" /> : '1'}
                            </div>
                            <span className="text-sm">Account</span>
                        </div>
                        <div className="w-8 h-px bg-white/20" />
                        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-purple-400' : 'text-white/40'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 2 ? 'bg-purple-500' : 'bg-white/10'}`}>
                                2
                            </div>
                            <span className="text-sm">Business</span>
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-center mb-2">
                        {step === 1 ? 'Create Your Account' : 'Name Your Store'}
                    </h1>
                    <p className="text-white/60 text-center mb-8">
                        {step === 1 ? 'Start your jewelry business today' : 'Choose a name for your store'}
                    </p>

                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-6 text-red-300 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {step === 1 ? (
                            <>
                                <div>
                                    <label className="input-label">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="input pl-12"
                                            placeholder="you@example.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="input-label">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="input pl-12"
                                            placeholder="••••••••"
                                            required
                                            minLength={8}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="input-label">Confirm Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="input pl-12"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div>
                                <label className="input-label">Store Name</label>
                                <div className="relative">
                                    <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                    <input
                                        type="text"
                                        value={businessName}
                                        onChange={(e) => setBusinessName(e.target.value)}
                                        className="input pl-12"
                                        placeholder="Sparkle Jewels"
                                        required
                                        minLength={2}
                                    />
                                </div>
                                <p className="text-xs text-white/40 mt-2">
                                    This will be your store's display name
                                </p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    {step === 1 ? 'Continue' : 'Create My Store'}
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>

                        {step === 2 && (
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="w-full text-white/60 hover:text-white text-sm"
                            >
                                Go back
                            </button>
                        )}
                    </form>

                    <div className="mt-8 text-center text-sm text-white/60">
                        Already have an account?{' '}
                        <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium">
                            Sign in
                        </Link>
                    </div>
                </div>

                <p className="text-center text-xs text-white/40 mt-6">
                    By signing up, you agree to our Terms of Service and Privacy Policy
                </p>
            </div>
        </div>
    );
}
