'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Diamond, Eye, EyeOff, ArrowRight, Loader2, Gem, ShieldCheck } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';

export default function LoginPage() {
    const router = useRouter();
    const { setToken, setUser, setReseller } = useAuthStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

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
        <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-bg-secondary overflow-hidden relative">
            {/* Minimalist Background Particles */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
                <div className="absolute top-[20%] right-[10%] w-72 h-72 bg-jaipur-sand rounded-full blur-[120px]" />
                <div className="absolute bottom-[20%] left-[10%] w-72 h-72 bg-jaipur-gold/5 rounded-full blur-[120px]" />
            </div>

            <div className="w-full max-w-[440px] relative z-10 animate-fade-in">
                {/* Logo */}
                <Link href="/" className="flex items-center justify-center gap-2 mb-10 group">
                    <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center border border-border-light group-hover:border-jaipur-gold transition-all duration-500 shadow-sm">
                        <Gem className="w-7 h-7 text-jaipur-burgundy" />
                    </div>
                </Link>

                <div className="bg-white/90 backdrop-blur-2xl rounded-[2.5rem] p-10 shadow-xl border border-white/40 relative overflow-hidden">
                    <div className="text-center mb-10">
                        <h1 className="text-[32px] font-display font-medium tracking-tight text-text-primary mb-3">Welcome Back</h1>
                        <p className="text-text-secondary text-base font-light">Manage your boutique with ease</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 rounded-2xl p-4 mb-8 text-sm font-medium border border-red-100 animate-slide-up">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="input-label">EMAIL ADDRESS</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input h-[54px]"
                                placeholder="you@example.com"
                                autoComplete="email"
                                required
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="input-label mb-0">PASSWORD</label>
                                <Link href="/forgot-password" title="Under construction" className="text-jaipur-gold hover:text-jaipur-burgundy text-[11px] font-bold transition-colors uppercase tracking-wider">
                                    Forgot?
                                </Link>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input h-[54px] pr-14"
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-text-muted hover:text-text-primary transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 px-1">
                            <input type="checkbox" id="remember" className="w-4 h-4 rounded border-border-medium text-jaipur-burgundy focus:ring-transparent cursor-pointer" />
                            <label htmlFor="remember" className="text-[13px] text-text-secondary font-medium cursor-pointer select-none">Stay signed in</label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full h-[58px] text-lg flex items-center justify-center gap-3 mt-4"
                        >
                            {loading ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-border-light text-center">
                        <p className="text-text-secondary text-[14px] font-medium">
                            Don't have an account?{' '}
                            <Link href="/register" className="text-text-primary font-bold hover:text-jaipur-gold transition-colors underline decoration-jaipur-gold/30 underline-offset-4">
                                Sign up free
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Demo credentials */}
                <div className="mt-8 p-5 rounded-[2rem] bg-white/50 backdrop-blur-sm border border-border-light text-center animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <p className="text-[12px] text-text-secondary font-medium">
                        <span className="text-jaipur-gold font-bold">Demo Access:</span> demo@mystore.com / demo123
                    </p>
                </div>

                <div className="mt-10 flex items-center justify-center gap-2 text-text-muted text-[10px] font-semibold uppercase tracking-widest opacity-60">
                    <ShieldCheck size={14} />
                    Secure & AES-256 Encrypted
                </div>
            </div>
        </div>
    );
}

