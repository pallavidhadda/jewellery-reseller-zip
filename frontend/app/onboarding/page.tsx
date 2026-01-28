'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Diamond, Palette, Globe,
    Check, ArrowRight,
    Loader2, Upload, Minus, Gem, Sparkles, Building2, Phone, Info
} from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';

export default function OnboardingPage() {
    const router = useRouter();
    const { reseller, setReseller } = useAuthStore();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Step 1: Profile
    const [businessName, setBusinessName] = useState('');
    const [description, setDescription] = useState('');
    const [phone, setPhone] = useState('');

    // Step 2: Branding
    const [primaryColor, setPrimaryColor] = useState('#C0A062'); // Default luxury gold
    const [logoUrl, setLogoUrl] = useState('');

    // Step 3: Domain
    const [subdomain, setSubdomain] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token || token === 'null' || token === 'undefined') {
            router.push('/login');
            return;
        }
        if (reseller) {
            setBusinessName(reseller.business_name || '');
            setDescription(reseller.description || '');
            setPhone(reseller.phone || '');
            setPrimaryColor(reseller.primary_color || '#C0A062');
            setSubdomain(reseller.subdomain || reseller.slug || '');
        }
    }, [reseller]);

    const nextStep = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setStep(s => s + 1);
    };
    const prevStep = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setStep(s => s - 1);
    };

    const handleSaveProfile = async () => {
        setLoading(true);
        setError('');
        try {
            const updated = await api.updateResellerProfile({
                business_name: businessName,
                description,
                phone
            });
            setReseller(updated as any);
            nextStep();
        } catch (err: any) {
            setError(err.message || 'Failed to save profile');
        } finally {
            setLoading(false);
        }
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        setError('');
        try {
            const result = await api.uploadLogo(file) as any;
            setLogoUrl(result.logo_url);
        } catch (err: any) {
            setError(err.message || 'Failed to upload logo');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveBranding = async () => {
        setLoading(true);
        setError('');
        try {
            const updated = await api.updateBranding({
                primary_color: primaryColor,
                logo_url: logoUrl
            });
            setReseller(updated as any);
            nextStep();
        } catch (err: any) {
            setError(err.message || 'Failed to save branding');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveDomain = async () => {
        setLoading(true);
        setError('');
        try {
            const updated = await api.updateDomain({ subdomain });
            setReseller(updated as any);

            // Publish Store automatically
            await api.publishStore();

            // Redirect to Products Dashboard to start curating
            router.push('/dashboard/products');
        } catch (err: any) {
            setError(err.message || 'Failed to secure URL');
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        { icon: Building2, title: 'Profile' },
        { icon: Palette, title: 'Branding' },
        { icon: Globe, title: 'Domain' },
    ];

    return (
        <div className="min-h-screen bg-bg-secondary text-text-primary py-12 px-4 relative overflow-hidden font-body">
            {/* Background Patterns */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0"
                style={{ backgroundImage: 'url("/lib/patterns/geometric-jali.svg")', backgroundSize: '150px' }} />

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <div className="w-12 h-12 rounded-full bg-jaipur-gold/10 flex items-center justify-center border border-jaipur-gold/20">
                            <Gem className="w-6 h-6 text-jaipur-gold" />
                        </div>
                        <span className="font-display text-3xl font-semibold tracking-tight">JewelryHub</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-display font-medium mb-3">Welcome to the inner circle</h1>
                    <p className="text-text-secondary font-light max-w-md mx-auto">Set up your luxury boutique in a few simple steps</p>
                </div>

                {/* Progress Bar */}
                <div className="flex items-center justify-between mb-12 relative max-w-lg mx-auto">
                    <div className="absolute top-5 left-0 right-0 h-[1px] bg-border-medium/50 -z-10" />
                    {steps.map((s, i) => (
                        <div key={i} className="flex flex-col items-center gap-3 bg-bg-secondary px-4 transition-all duration-500">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-500 ${step > i + 1 ? 'bg-jaipur-burgundy border-jaipur-burgundy text-white' :
                                step === i + 1 ? 'bg-white border-jaipur-gold text-jaipur-gold shadow-lg shadow-jaipur-gold/10' : 'bg-white border-border-medium text-text-muted opacity-50'
                                }`}>
                                {step > i + 1 ? <Check className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
                            </div>
                            <span className={`text-[10px] uppercase tracking-widest font-bold ${step === i + 1 ? 'text-jaipur-gold' : 'text-text-muted opacity-50'}`}>
                                {s.title}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Step Content */}
                <div className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl rounded-[2.5rem] p-8 md:p-12 max-w-2xl mx-auto transition-all duration-500 min-h-[500px] flex flex-col items-center justify-center">
                    {error && (
                        <div className="w-full bg-red-50 border border-red-100 rounded-2xl p-4 mb-8 text-red-600 text-sm font-medium animate-slide-up flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
                            {error}
                        </div>
                    )}

                    {step === 1 && (
                        <div className="w-full space-y-8 animate-fade-in">
                            <div>
                                <h2 className="text-2xl font-display font-medium mb-2">Boutique Profile</h2>
                                <p className="text-text-secondary text-sm font-light">Details that will represent your brand identity</p>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="input-label">Boutique Name</label>
                                    <input
                                        type="text"
                                        value={businessName}
                                        onChange={e => setBusinessName(e.target.value)}
                                        className="input h-[54px]"
                                        placeholder="Enter your store name"
                                    />
                                </div>
                                <div className="relative">
                                    <label className="input-label">Short Description</label>
                                    <textarea
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                        className="input min-h-[120px] pt-4"
                                        placeholder="A brief history or vision of your brand..."
                                    />
                                    <div className="absolute top-2 right-4 text-jaipur-gold/20">
                                        <Info size={16} />
                                    </div>
                                </div>
                                <div>
                                    <label className="input-label">Concierge Phone (Optional)</label>
                                    <div className="relative">
                                        <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={e => setPhone(e.target.value)}
                                            className="input h-[54px] pl-11"
                                            placeholder="+91 98765 43210"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleSaveProfile}
                                disabled={loading || !businessName || !description}
                                className="btn-primary w-full h-[58px] flex items-center justify-center gap-3"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Next <ArrowRight className="w-5 h-5" /></>}
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="w-full space-y-8 animate-fade-in">
                            <div>
                                <h2 className="text-2xl font-display font-medium mb-2">Visual Heritage</h2>
                                <p className="text-text-secondary text-sm font-light">Luxury is in the details. Upload your crest and colors.</p>
                            </div>

                            <div className="space-y-8">
                                <div className="flex flex-col items-center justify-center p-8 bg-bg-secondary rounded-3xl border border-border-light relative group">
                                    {logoUrl ? (
                                        <div className="relative">
                                            <img src={api.getMediaUrl(logoUrl)} alt="Logo" className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg" />
                                            <button
                                                onClick={() => setLogoUrl('')}
                                                className="absolute -top-1 -right-1 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-black transition-colors"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="w-32 h-32 rounded-full border-2 border-dashed border-jaipur-gold/30 flex flex-col items-center justify-center hover:border-jaipur-gold transition-colors cursor-pointer bg-white/50">
                                            <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                                            <Upload className="w-8 h-8 text-jaipur-gold/40 mb-2" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-jaipur-gold/60">Upload Crest</span>
                                        </label>
                                    )}
                                    <p className="text-[10px] text-text-muted uppercase tracking-[0.2em] font-medium mt-6">Recommended: Square PNG/JPG</p>
                                </div>

                                <div>
                                    <label className="input-label">Theme Accent</label>
                                    <div className="flex items-center gap-6 p-4 bg-bg-secondary rounded-2xl border border-border-light">
                                        <input
                                            type="color"
                                            value={primaryColor}
                                            onChange={e => setPrimaryColor(e.target.value)}
                                            className="w-12 h-12 rounded-xl bg-transparent cursor-pointer overflow-hidden border-none"
                                        />
                                        <div>
                                            <p className="font-display text-lg font-medium">{primaryColor.toUpperCase()}</p>
                                            <p className="text-xs text-text-muted font-light">Custom tone for your boutique elements</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button onClick={prevStep} className="btn-ghost flex-1 h-[58px]">Back</button>
                                <button onClick={handleSaveBranding} className="btn-primary flex-[2] h-[58px] flex items-center justify-center gap-3">
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Save Branding <ArrowRight className="w-5 h-5" /></>}
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="w-full space-y-8 animate-fade-in">
                            <div>
                                <h2 className="text-2xl font-display font-medium mb-2">Exclusive Address</h2>
                                <p className="text-text-secondary text-sm font-light">Secure your digital store location</p>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="input-label">Digital Subdomain</label>
                                    <div className="flex items-center gap-2">
                                        <div className="relative flex-1">
                                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-jaipur-gold/30 w-4 h-4" />
                                            <input
                                                type="text"
                                                value={subdomain}
                                                onChange={e => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                                                className="input h-[54px] pl-11"
                                                placeholder="boutique-slug"
                                            />
                                        </div>
                                        <span className="text-text-muted font-display text-lg">.jewelryhub.in</span>
                                    </div>
                                    <div className="mt-4 p-4 bg-bg-accent/50 rounded-xl border border-jaipur-gold/10 flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-jaipur-gold" />
                                        <p className="text-xs text-text-secondary font-light">
                                            This will be the permanent link shared with your clients.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button onClick={prevStep} className="btn-ghost flex-1 h-[58px]">Back</button>
                                <button onClick={handleSaveDomain} className="btn-primary flex-[2] h-[58px] flex items-center justify-center gap-3 shadow-gold">
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Launch Boutique <Sparkles className="w-5 h-5" /></>}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
