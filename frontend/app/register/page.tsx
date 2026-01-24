'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Diamond, Eye, EyeOff, ArrowRight, Loader2, CheckCircle, Gem } from 'lucide-react';
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
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
        <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-bg-secondary overflow-hidden relative">
            {/* Minimalist Background Particles */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
                <div className="absolute top-[10%] left-[10%] w-64 h-64 bg-jaipur-sand rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] right-[10%] w-64 h-64 bg-jaipur-gold/5 rounded-full blur-[120px]" />
            </div>

            <div className="w-full max-w-[440px] relative z-10 animate-fade-in">
                {/* Logo */}
                <Link href="/" className="flex items-center justify-center gap-2 mb-10 group">
                    <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center border border-border-light group-hover:border-jaipur-gold transition-all duration-500 shadow-sm">
                        <Gem className="w-7 h-7 text-jaipur-burgundy" />
                    </div>
                </Link>

                <div className="bg-white/90 backdrop-blur-2xl rounded-[2.5rem] p-10 shadow-xl border border-white/40 relative overflow-hidden">
                    {/* Progress Indicator */}
                    <div className="flex items-center justify-center gap-2 mb-10">
                        <div className={`h-1 rounded-full transition-all duration-500 ${step === 1 ? 'w-8 bg-jaipur-burgundy' : 'w-4 bg-border-medium'}`} />
                        <div className={`h-1 rounded-full transition-all duration-500 ${step === 2 ? 'w-8 bg-jaipur-burgundy' : 'w-4 bg-border-medium'}`} />
                    </div>

                    <div className="text-center mb-10">
                        <h1 className="text-[28px] font-display font-medium tracking-tight text-text-primary mb-3">
                            {step === 1 ? 'Create your account' : 'Tell us about your store'}
                        </h1>
                        <p className="text-text-secondary text-base font-light">
                            {step === 1 ? 'Join the exclusive reseller network' : 'This will be your identity on our platform'}
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 rounded-2xl p-4 mb-8 text-sm font-medium border border-red-100 animate-slide-up">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {step === 1 ? (
                            <div className="space-y-6 animate-fade-in">
                                <div>
                                    <label className="input-label">EMAIL ADDRESS</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="input"
                                        placeholder="you@example.com"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="input-label">PASSWORD</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="input pr-14"
                                            placeholder="Min. 8 characters"
                                            required
                                            minLength={8}
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

                                <div>
                                    <label className="input-label">CONFIRM PASSWORD</label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="input pr-14"
                                            placeholder="••••••••"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-text-muted hover:text-text-primary transition-colors"
                                        >
                                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6 animate-fade-in">
                                <div>
                                    <label className="input-label">STORE NAME</label>
                                    <input
                                        type="text"
                                        value={businessName}
                                        onChange={(e) => setBusinessName(e.target.value)}
                                        className="input"
                                        placeholder="e.g. Aura Gems"
                                        required
                                        minLength={2}
                                    />
                                    <p className="text-[12px] text-text-muted mt-3 ml-1 font-light italic">
                                        Your customers will see this as your official brand name.
                                    </p>
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full h-[58px] text-lg flex items-center justify-center gap-3 mt-4"
                        >
                            {loading ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <>
                                    {step === 1 ? 'Continue' : 'Create Account'}
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>

                        {step === 2 && (
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="w-full text-text-secondary hover:text-jaipur-burgundy text-xs font-bold uppercase tracking-widest transition-all pt-2"
                            >
                                Back to details
                            </button>
                        )}
                    </form>

                    <div className="mt-10 pt-8 border-t border-border-light text-center">
                        <p className="text-text-secondary text-[14px] font-medium">
                            Already have an account?{' '}
                            <Link href="/login" className="text-text-primary font-bold hover:text-jaipur-gold transition-colors underline decoration-jaipur-gold/30 underline-offset-4">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>

                <p className="text-center text-[11px] text-text-muted mt-10 font-medium leading-relaxed max-w-[320px] mx-auto opacity-60">
                    By joining, you agree to our <span className="underline">Terms</span> and <span className="underline">Privacy Policy</span>.
                </p>
            </div>
        </div>
    );
}

