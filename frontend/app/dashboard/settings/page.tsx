'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    LayoutDashboard, ShoppingBag, Package, CreditCard,
    Settings, LogOut, Menu, X, Save, Upload,
    Instagram, Facebook, Twitter, Mail, Phone, MapPin,
    Eye, Loader2, Minus, Diamond
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

    // Form States
    const [businessName, setBusinessName] = useState('');
    const [description, setDescription] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');

    // Branding
    const [primaryColor, setPrimaryColor] = useState('#8B5CF6');
    const [logoUrl, setLogoUrl] = useState('');
    const [bannerUrl, setBannerUrl] = useState('');

    // Config
    const [socialLinks, setSocialLinks] = useState({
        instagram: '',
        facebook: '',
        twitter: '',
        whatsapp: ''
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const profile = await api.getResellerProfile() as any;
            const config = await api.getStorefrontConfig() as any;

            setBusinessName(profile.business_name || '');
            setDescription(profile.description || '');
            setPhone(profile.phone || '');
            setAddress(profile.address || '');
            setPrimaryColor(profile.primary_color || '#8B5CF6');
            setLogoUrl(profile.logo_url || '');
            setBannerUrl(config.hero_image || '');

            if (config.social_links) {
                setSocialLinks({
                    instagram: config.social_links.instagram || '',
                    facebook: config.social_links.facebook || '',
                    twitter: config.social_links.twitter || '',
                    whatsapp: config.social_links.whatsapp || ''
                });
            }
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
                primary_color: primaryColor,
                logo_url: logoUrl
            });

            // Update Config
            await api.updateStorefrontConfig({
                social_links: socialLinks,
                hero_image: bannerUrl
            });

            setReseller(updatedProfile as any);
            setSuccess('Settings saved successfully!');
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
        { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
        { icon: ShoppingBag, label: 'Products', href: '/dashboard/products' },
        { icon: Package, label: 'Orders', href: '/dashboard/orders' },
        { icon: CreditCard, label: 'Payouts', href: '/dashboard/payouts' },
        { icon: Settings, label: 'Settings', href: '/dashboard/settings', active: true },
    ];

    return (
        <div className="min-h-screen flex">
            {/* Sidebar (same as dashboard) */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/5 backdrop-blur-lg border-r border-white/10 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center gap-3 p-6 border-b border-white/10">
                    <Diamond className="w-8 h-8 text-purple-400" />
                    <span className="font-display text-xl font-bold">JewelryHub</span>
                </div>

                <nav className="p-4 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${item.active
                                ? 'bg-purple-500/20 text-purple-300'
                                : 'text-white/60 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
                    <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-white/60 hover:bg-white/5 hover:text-white">
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:ml-64">
                <header className="sticky top-0 z-30 glass border-b border-white/10 px-4 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button className="lg:hidden text-white" onClick={() => setSidebarOpen(!sidebarOpen)}>
                                {sidebarOpen ? <X /> : <Menu />}
                            </button>
                            <h1 className="text-xl font-semibold">Store Settings</h1>
                        </div>
                        <div className="flex items-center gap-3">
                            {reseller?.slug && (
                                <a href={`/store/${reseller.slug}`} target="_blank" className="btn-secondary py-2 px-4 text-sm flex items-center gap-2">
                                    <Eye className="w-4 h-4" /> View Store
                                </a>
                            )}
                            <button form="settings-form" disabled={saving} className="btn-primary py-2 px-6 text-sm flex items-center gap-2">
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Save Changes
                            </button>
                        </div>
                    </div>
                </header>

                <div className="p-4 lg:p-8 max-w-4xl mx-auto">
                    {loading ? (
                        <div className="flex items-center justify-center min-h-[400px]">
                            <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
                        </div>
                    ) : (
                        <form id="settings-form" onSubmit={handleSave} className="space-y-8">
                            {error && <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300">{error}</div>}
                            {success && <div className="p-4 bg-emerald-500/20 border border-emerald-500/50 rounded-xl text-emerald-300">{success}</div>}

                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Basic Info */}
                                <div className="card space-y-6">
                                    <h3 className="text-lg font-bold border-b border-white/10 pb-4">Business Profile</h3>
                                    <div>
                                        <label className="input-label">Business Name</label>
                                        <input type="text" value={businessName} onChange={e => setBusinessName(e.target.value)} className="input" />
                                    </div>
                                    <div>
                                        <label className="input-label">Description</label>
                                        <textarea value={description} onChange={e => setDescription(e.target.value)} className="input min-h-[100px]" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="input-label">Phone</label>
                                            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="input" />
                                        </div>
                                        <div>
                                            <label className="input-label">Theme Color</label>
                                            <div className="flex gap-2">
                                                <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="w-12 h-12 bg-transparent cursor-pointer" />
                                                <input type="text" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="input" />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="input-label">Address</label>
                                        <textarea value={address} onChange={e => setAddress(e.target.value)} className="input min-h-[80px]" />
                                    </div>
                                </div>

                                {/* Media */}
                                <div className="card space-y-6">
                                    <h3 className="text-lg font-bold border-b border-white/10 pb-4">Store Media</h3>

                                    <div>
                                        <label className="input-label">Logo</label>
                                        <div className="flex items-center gap-4 p-4 border border-white/10 rounded-xl bg-white/5">
                                            {logoUrl ? (
                                                <div className="relative group">
                                                    <img src={api.getMediaUrl(logoUrl)} alt="Logo" className="w-16 h-16 rounded-lg object-contain bg-white/10" />
                                                    <button onClick={() => setLogoUrl('')} className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><Minus className="w-3 h-3" /></button>
                                                </div>
                                            ) : (
                                                <label className="flex-1 flex flex-col items-center justify-center p-4 border-2 border-dashed border-white/20 rounded-lg hover:border-purple-500/50 cursor-pointer">
                                                    <input type="file" className="hidden" onChange={handleLogoUpload} accept="image/*" />
                                                    <Upload className="w-6 h-6 text-white/20 mb-1" />
                                                    <span className="text-xs text-white/40">Upload Logo</span>
                                                    <span className="text-[10px] text-white/20">Square, max 2MB (e.g. 512x512)</span>
                                                </label>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="input-label">Hero Banner</label>
                                        <div className="flex items-center gap-4 p-4 border border-white/10 rounded-xl bg-white/5">
                                            {bannerUrl ? (
                                                <div className="relative group w-full">
                                                    <img src={api.getMediaUrl(bannerUrl)} alt="Banner" className="w-full h-24 rounded-lg object-cover bg-white/10" />
                                                    <button onClick={() => setBannerUrl('')} className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><Minus className="w-3 h-3" /></button>
                                                </div>
                                            ) : (
                                                <label className="flex-1 flex flex-col items-center justify-center p-4 border-2 border-dashed border-white/20 rounded-lg hover:border-purple-500/50 cursor-pointer">
                                                    <input type="file" className="hidden" onChange={handleBannerUpload} accept="image/*" />
                                                    <Upload className="w-6 h-6 text-white/20 mb-1" />
                                                    <span className="text-xs text-white/40">Upload Banner Image</span>
                                                    <span className="text-[10px] text-white/20">Landscape, max 5MB (e.g. 1920x600)</span>
                                                </label>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Social Links */}
                                <div className="card space-y-6">
                                    <h3 className="text-lg font-bold border-b border-white/10 pb-4">Social Media Links</h3>
                                    <div className="grid gap-4">
                                        <div className="flex items-center gap-3">
                                            <Instagram className="text-pink-400" />
                                            <input type="text" placeholder="Instagram Profile URL" value={socialLinks.instagram} onChange={e => setSocialLinks({ ...socialLinks, instagram: e.target.value })} className="input py-2" />
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Facebook className="text-blue-400" />
                                            <input type="text" placeholder="Facebook Page URL" value={socialLinks.facebook} onChange={e => setSocialLinks({ ...socialLinks, facebook: e.target.value })} className="input py-2" />
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Twitter className="text-sky-400" />
                                            <input type="text" placeholder="Twitter Profile URL" value={socialLinks.twitter} onChange={e => setSocialLinks({ ...socialLinks, twitter: e.target.value })} className="input py-2" />
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Phone className="text-emerald-400" />
                                            <input type="text" placeholder="WhatsApp Number" value={socialLinks.whatsapp} onChange={e => setSocialLinks({ ...socialLinks, whatsapp: e.target.value })} className="input py-2" />
                                        </div>
                                    </div>
                                </div>

                                {/* Public Contact */}
                                <div className="card space-y-6">
                                    <h3 className="text-lg font-bold border-b border-white/10 pb-4">Storefront Contact</h3>
                                    <p className="text-sm text-white/50">These details will be shown to your customers.</p>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <Mail className="w-5 h-5 text-purple-400" />
                                            <span className="text-white/80">{user?.email}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Phone className="w-5 h-5 text-purple-400" />
                                            <span className="text-white/80">{phone || 'Not set'}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <MapPin className="w-5 h-5 text-purple-400" />
                                            <span className="text-white/80 line-clamp-1">{address || 'Not set'}</span>
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
