'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Diamond, Mail, Lock, Store, ArrowRight, Loader2, CheckCircle, Gem } from 'lucide-react';
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
        <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-bg-primary overflow-hidden relative">
            {/* Background Patterns */}
            <div className="absolute inset-0 z-0 opacity-[0.03]"
                style={{ backgroundImage: 'url("/lib/patterns/geometric-jali.svg")', backgroundSize: '120px' }} />

            <div className="absolute -top-24 -left-24 w-96 h-96 bg-jaipur-peacock/10 rounded-full blur-3xl opacity-40" />
            <div className="absolute top-1/2 right-0 w-96 h-96 bg-jaipur-gold/10 rounded-full blur-3xl opacity-40" />

            <div className="w-full max-w-md relative z-10 animate-fade-in">
                {/* Logo */}
                <Link href="/" className="flex items-center justify-center gap-2 mb-8 group">
                    <div className="w-12 h-12 rounded-full bg-jaipur-pink/30 flex items-center justify-center border border-jaipur-pink group-hover:border-jaipur-gold transition-colors shadow-lg">
                        <Gem className="w-6 h-6 text-jaipur-burgundy" />
                    </div>
                </Link>

                <div className="card bg-white shadow-xl border-border-medium/60 relative overflow-hidden backdrop-blur-xl">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-jaipur"></div>

                    {/* Progress */}
                    <div className="flex items-center justify-center gap-4 mb-8 pt-4">
                        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-jaipur-peacock' : 'text-text-muted'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all shadow-sm ${step >= 1 ? 'bg-jaipur-peacock text-white shadow-peacock' : 'bg-bg-secondary text-text-muted border border-border-medium'}`}>
                                {step > 1 ? <CheckCircle className="w-5 h-5" /> : '1'}
                            </div>
                            <span className="text-sm font-medium">Account</span>
                        </div>
                        <div className={`w-12 h-0.5 transition-colors ${step >= 2 ? 'bg-jaipur-peacock' : 'bg-border-medium'}`} />
                        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-jaipur-peacock' : 'text-text-muted'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all shadow-sm ${step >= 2 ? 'bg-jaipur-peacock text-white shadow-peacock' : 'bg-bg-secondary text-text-muted border border-border-medium'}`}>
                                2
                            </div>
                            <span className="text-sm font-medium">Business</span>
                        </div>
                    </div>

                    <div className="text-center mb-6">
                        <h1 className="font-display text-2xl font-medium text-text-primary mb-2">
                            {step === 1 ? 'Create Your Account' : 'Name Your Store'}
                        </h1>
                        <p className="text-text-secondary text-sm">
                            {step === 1 ? 'Start your jewelry business today' : 'Choose a unique name for your brand'}
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-2 text-red-700 text-sm">
                            <span className="font-medium">Error:</span> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {step === 1 ? (
                            <div className="space-y-5 animate-slide-up">
                                <div>
                                    <label className="input-label">Email Address</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-jaipur-peacock transition-colors" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="input pl-12 bg-bg-secondary focus:bg-white"
                                            placeholder="you@example.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="input-label">Password</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-jaipur-peacock transition-colors" />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="input pl-12 bg-bg-secondary focus:bg-white"
                                            placeholder="••••••••"
                                            required
                                            minLength={8}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="input-label">Confirm Password</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-jaipur-peacock transition-colors" />
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="input pl-12 bg-bg-secondary focus:bg-white"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-5 animate-slide-up">
                                <div>
                                    <label className="input-label">Store Name</label>
                                    <div className="relative group">
                                        <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-jaipur-peacock transition-colors" />
                                        <input
                                            type="text"
                                            value={businessName}
                                            onChange={(e) => setBusinessName(e.target.value)}
                                            className="input pl-12 bg-bg-secondary focus:bg-white"
                                            placeholder="Sparkle Jewels"
                                            required
                                            minLength={2}
                                        />
                                    </div>
                                    <p className="text-xs text-text-muted mt-2 ml-1">
                                        This will be your store's display name seen by customers
                                    </p>
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full flex items-center justify-center gap-2 mt-6 shadow-gold"
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
                                className="w-full text-text-secondary hover:text-text-primary text-sm font-medium transition-colors pt-2"
                            >
                                Go back
                            </button>
                        )}
                    </form>

                    <div className="mt-8 pt-6 border-t border-border-light text-center text-sm text-text-secondary">
                        Already have an account?{' '}
                        <Link href="/login" className="text-jaipur-peacock hover:text-jaipur-terra font-semibold transition-colors">
                            Sign in
                        </Link>
                    </div>
                </div>

                <p className="text-center text-xs text-text-muted mt-6 font-light">
                    By signing up, you agree to our Terms of Service and Privacy Policy
                </p>
            </div>
        </div>
    );
}
