'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Diamond, Mail, Lock, ArrowRight, Loader2, Gem } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';

export default function LoginPage() {
    const router = useRouter();
    const { setToken, setUser, setReseller } = useAuthStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { access_token } = await api.login(email, password);
            setToken(access_token);
            localStorage.setItem('token', access_token);

            // Fetch user and reseller data
            const user = await api.getCurrentUser();
            setUser(user as any);

            if ((user as any).role === 'reseller') {
                const reseller = await api.getResellerProfile();
                setReseller(reseller as any);

                if ((reseller as any).is_onboarded) {
                    router.push('/dashboard');
                } else {
                    router.push('/onboarding');
                }
            } else {
                router.push('/dashboard');
            }
        } catch (err: any) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-bg-primary overflow-hidden relative">
            {/* Background Patterns */}
            <div className="absolute inset-0 z-0 opacity-[0.03]"
                style={{ backgroundImage: 'url("/lib/patterns/geometric-jali.svg")', backgroundSize: '120px' }} />

            <div className="absolute -top-24 -right-24 w-96 h-96 bg-jaipur-gold/20 rounded-full blur-3xl opacity-30" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-jaipur-terra/20 rounded-full blur-3xl opacity-30" />

            <div className="w-full max-w-md relative z-10 animate-fade-in">
                {/* Logo */}
                <Link href="/" className="flex items-center justify-center gap-2 mb-8 group">
                    <div className="w-12 h-12 rounded-full bg-jaipur-pink/30 flex items-center justify-center border border-jaipur-pink group-hover:border-jaipur-gold transition-colors shadow-lg">
                        <Gem className="w-6 h-6 text-jaipur-burgundy" />
                    </div>
                </Link>

                <div className="card bg-white shadow-xl border-border-medium/60 relative overflow-hidden backdrop-blur-xl">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-jaipur"></div>

                    <div className="text-center mb-8">
                        <h1 className="font-display text-3xl font-medium text-text-primary mb-2">Welcome Back</h1>
                        <p className="text-text-secondary">Sign in to manage your jewelry store</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-2 text-red-700 text-sm">
                            <span className="font-medium">Error:</span> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
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
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-jaipur-peacock focus:ring-jaipur-peacock" />
                                <span className="text-text-secondary group-hover:text-text-primary transition-colors">Remember me</span>
                            </label>
                            <Link href="/forgot-password" className="text-jaipur-peacock hover:text-jaipur-terra font-medium transition-colors">
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full flex items-center justify-center gap-2 shadow-gold"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-border-light text-center text-sm text-text-secondary">
                        Don't have an account?{' '}
                        <Link href="/register" className="text-jaipur-peacock hover:text-jaipur-terra font-semibold transition-colors">
                            Sign up free
                        </Link>
                    </div>
                </div>

                {/* Demo credentials */}
                <div className="mt-6 p-4 rounded-xl bg-bg-secondary border border-jaipur-gold/20 text-center animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <p className="text-sm text-text-secondary">
                        <span className="font-semibold text-jaipur-peacock">Demo Access:</span> demo@mystore.com / demo123
                    </p>
                </div>

                <div className="mt-8 text-center text-xs text-text-muted font-light">
                    Protected by SSL encryption. Your data is secure.
                </div>
            </div>
        </div>
    );
}
