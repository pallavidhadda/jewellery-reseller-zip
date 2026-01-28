'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    LayoutDashboard, ShoppingBag, Package, CreditCard,
    Settings, LogOut, Menu, X, Save, Upload,
    Instagram, Facebook, Twitter, Mail, Phone, MapPin,
    Eye, Loader2, Minus, Gem, Palette, CheckCircle2
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import api from '@/lib/api';

export default function SettingsPage() {
    const router = useRouter();
    const { user, reseller, setReseller, logout } = useAuthStore();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isDirty, setIsDirty] = useState(false);

    // Initial State ref for comparison
    const initialState = useRef<any>(null);

    // Form States
    const [businessName, setBusinessName] = useState('');
    const [description, setDescription] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');

    // Branding & Template
    const [logoUrl, setLogoUrl] = useState('');
    const [bannerUrl, setBannerUrl] = useState('');
    const [accentColor, setAccentColor] = useState('#D4AF37');
    const [selectedTheme, setSelectedTheme] = useState('heritage');

    // Config
    const [socialLinks, setSocialLinks] = useState({
        instagram: '',
        facebook: '',
        twitter: '',
        whatsapp: ''
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token || token === 'null' || token === 'undefined') {
            router.push('/login');
            return;
        }
        loadData();
    }, []);

    // Check for changes effect
    useEffect(() => {
        if (!initialState.current) return;

        const currentSettings = {
            businessName,
            description,
            phone,
            address,
            accentColor,
            logoUrl,
            bannerUrl,
            selectedTheme,
            socialLinks
        };

        const initial = initialState.current;
        const hasChanges =
            currentSettings.businessName !== initial.businessName ||
            currentSettings.description !== initial.description ||
            currentSettings.phone !== initial.phone ||
            currentSettings.address !== initial.address ||
            currentSettings.accentColor !== initial.accentColor ||
            currentSettings.logoUrl !== initial.logoUrl ||
            currentSettings.bannerUrl !== initial.bannerUrl ||
            currentSettings.selectedTheme !== initial.selectedTheme ||
            JSON.stringify(currentSettings.socialLinks) !== JSON.stringify(initial.socialLinks);

        setIsDirty(hasChanges);
    }, [businessName, description, phone, address, accentColor, logoUrl, bannerUrl, selectedTheme, socialLinks]);

    const loadData = async () => {
        setLoading(true);
        try {
            const profile = await api.getResellerProfile() as any;
            const config = await api.getStorefrontConfig() as any;

            const initialData = {
                businessName: profile.business_name || '',
                description: profile.description || '',
                phone: profile.phone || '',
                address: profile.address || '',
                accentColor: profile.accent_color || '#D4AF37',
                logoUrl: profile.logo_url || '',
                bannerUrl: config.hero_image || '',
                selectedTheme: config.theme || 'heritage',
                socialLinks: {
                    instagram: config.social_links?.instagram || '',
                    facebook: config.social_links?.facebook || '',
                    twitter: config.social_links?.twitter || '',
                    whatsapp: config.social_links?.whatsapp || ''
                }
            };

            setBusinessName(initialData.businessName);
            setDescription(initialData.description);
            setPhone(initialData.phone);
            setAddress(initialData.address);
            setAccentColor(initialData.accentColor);
            setLogoUrl(initialData.logoUrl);
            setBannerUrl(initialData.bannerUrl);
            setSelectedTheme(initialData.selectedTheme);
            setSocialLinks(initialData.socialLinks);

            initialState.current = initialData;
        } catch (err: any) {
            setError('Failed to load settings');
        } finally {
            setLoading(false);
        }
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setSaving(true);
        try {
            const result = await api.uploadLogo(file) as any;
            setLogoUrl(result.logo_url);
        } catch (err: any) {
            setError(err.message || 'Logo upload failed');
        } finally {
            setSaving(false);
        }
    };

    const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setSaving(true);
        try {
            const result = await api.uploadBanner(file) as any;
            setBannerUrl(result.banner_url);
        } catch (err: any) {
            setError(err.message || 'Banner upload failed');
        } finally {
            setSaving(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isDirty && !saving) return;

        setSaving(true);
        setError('');
        setSuccess('');

        try {
            // Update Profile
            const updatedProfile = await api.updateResellerProfile({
                business_name: businessName,
                description,
                phone,
                address,
                accent_color: accentColor,
                logo_url: logoUrl
            });

            // Update Config
            await api.updateStorefrontConfig({
                social_links: socialLinks,
                hero_image: bannerUrl,
                theme: selectedTheme
            });

            setReseller(updatedProfile as any);

            // Update initial state to new state
            initialState.current = {
                businessName,
                description,
                phone,
                address,
                accentColor,
                logoUrl,
                bannerUrl,
                selectedTheme,
                socialLinks
            };
            setIsDirty(false);

            setSuccess('Store adjustments saved successfully!');
            setTimeout(() => setSuccess(''), 5000);
        } catch (err: any) {
            setError(err.message || 'Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        logout();
        router.push('/');
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Overview', href: '/dashboard', active: false },
        { icon: ShoppingBag, label: 'Products', href: '/dashboard/products' },
        { icon: Package, label: 'Orders', href: '/dashboard/orders' },
        { icon: CreditCard, label: 'Payouts', href: '/dashboard/payouts' },
        { icon: Settings, label: 'Settings', href: '/dashboard/settings', active: true },
    ];

    const themes = [
        { id: 'heritage', name: 'Royal Heritage', desc: 'Classic Jaipur luxury. Deep burgundy, gold, and heritage mandala patterns.', color: '#722F37' },
        { id: 'chic', name: 'Minimalist Chic', desc: 'Sleek, high-fashion aesthetic. Clean lines, monochrome palette, and premium white space.', color: '#1A1A1A' },
        { id: 'bloom', name: 'Artisan Bloom', desc: 'Nature-inspired elegance. Soft emerald green, rose gold, and botanical details.', color: '#1E3A34' },
        { id: 'deco', name: 'Modern Deco', desc: 'Bold Gatsby-era geometric patterns. Navy blue, gold accents, and sharp typography.', color: '#070B14' },
    ];

    return (
        <div className="min-h-screen flex bg-bg-secondary font-body text-text-primary theme-jaipur">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-jaipur-burgundy text-white transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} shadow-2xl`}>
                <div className="flex items-center gap-3 p-6 border-b border-white/5">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                        <Gem className="w-5 h-5 text-jaipur-gold" />
                    </div>
                    <div>
                        <span className="font-display text-xl font-medium tracking-tight text-white">JewelryHub</span>
                        <span className="block text-[10px] text-jaipur-gold/70 uppercase tracking-[0.2em] font-bold">Reseller</span>
                    </div>
                </div>

                <nav className="p-4 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-500 ${item.active
                                ? 'bg-white/10 text-white border border-white/10 shadow-lg'
                                : 'text-white/50 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <item.icon className={`w-4 h-4 ${item.active ? 'text-jaipur-gold' : ''}`} />
                            <span className="text-sm font-medium tracking-wide">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="absolute bottom-6 left-0 right-0 p-4">
                    <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-white/40 hover:bg-white/5 hover:text-white transition-all duration-300">
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm font-medium">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Main Content */}
            <main className="flex-1 lg:ml-64 relative min-h-screen">
                <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-border-light px-6 lg:px-10 py-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <button className="lg:hidden text-text-primary p-2 hover:bg-bg-secondary rounded-lg transition-colors" onClick={() => setSidebarOpen(!sidebarOpen)}>
                                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                            <div>
                                <h1 className="text-2xl font-display font-medium text-text-primary tracking-tight">Identity</h1>
                                <p className="text-xs text-text-muted font-light uppercase tracking-widest mt-1">Configure your boutique storefront</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            {reseller?.slug && (
                                <a href={`/store/${reseller.slug}`} target="_blank" className="px-5 py-2.5 bg-bg-secondary text-text-primary rounded-full flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest hover:bg-white border border-border-light transition-all active:scale-95">
                                    <Eye className="w-4 h-4" /> Public View
                                </a>
                            )}
                            <button
                                form="settings-form"
                                disabled={saving || !isDirty}
                                className="px-5 py-2.5 bg-jaipur-burgundy text-white rounded-full flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest hover:bg-jaipur-burgundy/90 transition-all active:scale-95 shadow-lg shadow-black/10 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                            >
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Save View
                            </button>
                        </div>
                    </div>
                </header>

                <div className="p-6 lg:p-10 max-w-5xl mx-auto">
                    {loading ? (
                        <div className="flex items-center justify-center min-h-[400px]">
                            <div className="w-8 h-8 border-[3px] border-jaipur-gold/20 border-t-jaipur-gold rounded-full animate-spin" />
                        </div>
                    ) : (
                        <form id="settings-form" onSubmit={handleSave} className="space-y-10">
                            {error && <div className="p-4 bg-red-50 text-red-700 border border-red-100 rounded-2xl text-sm font-medium">{error}</div>}
                            {success && <div className="p-4 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-2xl text-sm font-medium flex items-center gap-2"><CheckCircle2 size={16} /> {success}</div>}

                            {/* Template Selector Section */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <Palette className="w-5 h-5 text-jaipur-gold" />
                                    <h3 className="font-display text-xl font-medium text-text-primary">Storefront Theme</h3>
                                </div>
                                <div className="grid sm:grid-cols-2 gap-6">
                                    {themes.map((theme) => (
                                        <div
                                            key={theme.id}
                                            onClick={() => setSelectedTheme(theme.id)}
                                            className={`relative group cursor-pointer rounded-3xl overflow-hidden border-2 transition-all p-1 ${selectedTheme === theme.id ? 'border-jaipur-gold bg-jaipur-gold/5' : 'border-transparent bg-white shadow-sm hover:shadow-md'
                                                }`}
                                        >
                                            <div className="aspect-[16/9] rounded-2xl mb-4 bg-neutral-100 flex items-center justify-center overflow-hidden">
                                                <div className="w-full h-full" style={{ backgroundColor: theme.color, opacity: 0.1 }} />
                                                <span className="absolute font-display font-medium text-lg uppercase tracking-widest text-text-primary/20">{theme.name}</span>
                                            </div>
                                            <div className="px-5 pb-5">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="font-display text-lg font-medium text-text-primary">{theme.name}</h4>
                                                    {selectedTheme === theme.id && <CheckCircle2 className="w-5 h-5 text-jaipur-gold" fill="currentColor" />}
                                                </div>
                                                <p className="text-xs text-text-muted font-light leading-relaxed">{theme.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid lg:grid-cols-3 gap-8">
                                {/* Left Column: Identity Info */}
                                <div className="lg:col-span-2 space-y-8">
                                    <div className="bg-white p-8 rounded-[2rem] border border-border-light shadow-sm space-y-6">
                                        <h3 className="font-display text-lg font-medium border-b border-bg-secondary pb-4 text-text-primary">Boutique Profile</h3>
                                        <div className="grid gap-6">
                                            <div>
                                                <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-2 block">Business Name</label>
                                                <input type="text" value={businessName} onChange={e => setBusinessName(e.target.value)} className="w-full px-5 py-3.5 bg-bg-secondary border border-transparent rounded-2xl focus:bg-white focus:border-jaipur-gold/20 outline-none transition-all text-sm font-medium text-text-primary" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-2 block">Boutique Description</label>
                                                <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full px-5 py-3.5 bg-bg-secondary border border-transparent rounded-2xl focus:bg-white focus:border-jaipur-gold/20 outline-none transition-all text-sm min-h-[120px] font-light text-text-primary" placeholder="Describe the soul of your boutique..." />
                                            </div>
                                            <div className="grid sm:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-2 block">Contact Phone</label>
                                                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-5 py-3.5 bg-bg-secondary border border-transparent rounded-2xl focus:bg-white focus:border-jaipur-gold/20 outline-none transition-all text-sm text-text-primary" />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-2 block">Brand Accent Color</label>
                                                    <div className="flex gap-3">
                                                        <div className="w-12 h-12 rounded-xl overflow-hidden relative border border-border-light">
                                                            <input type="color" value={accentColor} onChange={e => setAccentColor(e.target.value)} className="absolute inset-0 w-[200%] h-[200%] cursor-pointer -translate-x-1/4 -translate-y-1/4" />
                                                        </div>
                                                        <input type="text" value={accentColor} onChange={e => setAccentColor(e.target.value)} className="flex-1 px-5 py-3 bg-bg-secondary border border-transparent rounded-xl text-xs font-mono text-text-primary" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white p-8 rounded-[2rem] border border-border-light shadow-sm space-y-6">
                                        <h3 className="font-display text-lg font-medium border-b border-bg-secondary pb-4 text-text-primary">Social Connections</h3>
                                        <div className="grid sm:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3 p-1.5 pl-4 bg-bg-secondary rounded-2xl border border-transparent focus-within:border-jaipur-gold/20 transition-all">
                                                    <Instagram size={18} className="text-text-muted" />
                                                    <input type="text" placeholder="Instagram URL" value={socialLinks.instagram} onChange={e => setSocialLinks({ ...socialLinks, instagram: e.target.value })} className="bg-transparent text-sm w-full py-2.5 outline-none font-light text-text-primary" />
                                                </div>
                                                <div className="flex items-center gap-3 p-1.5 pl-4 bg-bg-secondary rounded-2xl border border-transparent focus-within:border-jaipur-gold/20 transition-all">
                                                    <Facebook size={18} className="text-text-muted" />
                                                    <input type="text" placeholder="Facebook URL" value={socialLinks.facebook} onChange={e => setSocialLinks({ ...socialLinks, facebook: e.target.value })} className="bg-transparent text-sm w-full py-2.5 outline-none font-light text-text-primary" />
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3 p-1.5 pl-4 bg-bg-secondary rounded-2xl border border-transparent focus-within:border-jaipur-gold/20 transition-all">
                                                    <Twitter size={18} className="text-text-muted" />
                                                    <input type="text" placeholder="Twitter URL" value={socialLinks.twitter} onChange={e => setSocialLinks({ ...socialLinks, twitter: e.target.value })} className="bg-transparent text-sm w-full py-2.5 outline-none font-light text-text-primary" />
                                                </div>
                                                <div className="flex items-center gap-3 p-1.5 pl-4 bg-bg-secondary rounded-2xl border border-transparent focus-within:border-jaipur-gold/20 transition-all">
                                                    <Phone size={18} className="text-text-muted" />
                                                    <input type="text" placeholder="WhatsApp Number" value={socialLinks.whatsapp} onChange={e => setSocialLinks({ ...socialLinks, whatsapp: e.target.value })} className="bg-transparent text-sm w-full py-2.5 outline-none font-light text-text-primary" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Media Assets */}
                                <div className="space-y-8">
                                    <div className="bg-white p-8 rounded-[2rem] border border-border-light shadow-sm space-y-6">
                                        <h3 className="font-display text-lg font-medium border-b border-bg-secondary pb-4 text-text-primary">Registry Identity</h3>

                                        <div>
                                            <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-4 block">Boutique Logo</label>
                                            <div className="flex flex-col items-center gap-6 p-6 border-2 border-dashed border-bg-secondary rounded-[2rem] hover:border-jaipur-gold/30 transition-all">
                                                {logoUrl ? (
                                                    <div className="relative group">
                                                        <img src={api.getMediaUrl(logoUrl)} alt="Logo" className="w-24 h-24 rounded-2xl object-contain bg-bg-secondary p-2" />
                                                        <button type="button" onClick={() => setLogoUrl('')} className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"><Minus className="w-4 h-4" /></button>
                                                    </div>
                                                ) : (
                                                    <label className="flex flex-col items-center justify-center cursor-pointer text-center group">
                                                        <input type="file" className="hidden" onChange={handleLogoUpload} accept="image/*" />
                                                        <div className="w-16 h-16 bg-bg-secondary rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                                            <Upload className="w-6 h-6 text-text-muted" />
                                                        </div>
                                                        <span className="text-[11px] font-bold text-text-primary uppercase tracking-widest">Select Logo</span>
                                                        <span className="text-[10px] text-text-muted font-light mt-1 px-4">Square image recommended</span>
                                                    </label>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-4 block">Hero Masterpiece</label>
                                            <div className="flex flex-col items-center gap-6 p-6 border-2 border-dashed border-bg-secondary rounded-[2rem] hover:border-jaipur-gold/30 transition-all">
                                                {bannerUrl ? (
                                                    <div className="relative group w-full">
                                                        <img src={api.getMediaUrl(bannerUrl)} alt="Banner" className="w-full h-32 rounded-2xl object-cover" />
                                                        <button type="button" onClick={() => setBannerUrl('')} className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"><Minus className="w-4 h-4" /></button>
                                                    </div>
                                                ) : (
                                                    <label className="flex flex-col items-center justify-center cursor-pointer text-center group">
                                                        <input type="file" className="hidden" onChange={handleBannerUpload} accept="image/*" />
                                                        <div className="w-16 h-16 bg-bg-secondary rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                                            <Upload className="w-6 h-6 text-text-muted" />
                                                        </div>
                                                        <span className="text-[11px] font-bold text-text-primary uppercase tracking-widest">Select Banner</span>
                                                        <span className="text-[10px] text-text-muted font-light mt-1 px-4">Landscape format (Hero section)</span>
                                                    </label>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-jaipur-burgundy p-8 rounded-[2rem] shadow-xl text-white relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                                        <h3 className="font-display text-lg font-medium mb-6 flex items-center gap-2">
                                            <MapPin size={18} className="text-jaipur-gold" /> Boutique HQ
                                        </h3>
                                        <div>
                                            <label className="text-[9px] font-bold text-white/40 uppercase tracking-[0.3em] mb-2 block">Address Details</label>
                                            <textarea value={address} onChange={e => setAddress(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs font-light outline-none focus:border-jaipur-gold/30 transition-all min-h-[100px]" placeholder="Add your boutique's physical office..." />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </main>
        </div>
    );
}
