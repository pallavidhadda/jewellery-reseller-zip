'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Diamond, Store, Palette, Globe,
    ShoppingBag, Check, ArrowRight, ArrowLeft,
    Loader2, Upload, Plus, Minus, Search
} from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';

interface Product {
    id: number;
    name: string;
    base_price: number;
    category: string;
    primary_image: string;
}

export default function OnboardingPage() {
    const router = useRouter();
    const { reseller, setReseller, user } = useAuthStore();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Step 1: Profile
    const [businessName, setBusinessName] = useState('');
    const [description, setDescription] = useState('');
    const [phone, setPhone] = useState('');

    // Step 2: Branding
    const [primaryColor, setPrimaryColor] = useState('#8B5CF6');
    const [logoUrl, setLogoUrl] = useState('');

    // Step 3: Domain
    const [subdomain, setSubdomain] = useState('');

    // Step 4: Products
    const [catalogProducts, setCatalogProducts] = useState<Product[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
    const [priceInput, setPriceInput] = useState<{ [key: number]: string }>({});

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }
        if (reseller) {
            setBusinessName(reseller.business_name || '');
            setDescription(reseller.description || '');
            setPhone(reseller.phone || '');
            setPrimaryColor(reseller.primary_color || '#8B5CF6');
            setSubdomain(reseller.subdomain || reseller.slug || '');
        }
        fetchCatalog();
    }, [reseller]);

    const fetchCatalog = async () => {
        try {
            const data = await api.getCatalog();
            setCatalogProducts(data as Product[]);
        } catch (err) {
            console.error('Failed to fetch catalog:', err);
        }
    };

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

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
            nextStep();
        } catch (err: any) {
            setError(err.message || 'Failed to save domain');
        } finally {
            setLoading(false);
        }
    };

    const handleAddProduct = async (product: Product) => {
        const price = parseFloat(priceInput[product.id]);
        if (isNaN(price) || price < product.base_price * 1.2) {
            alert(`Price must be at least ₹${Math.ceil(product.base_price * 1.2)}`);
            return;
        }

        try {
            await api.addProduct(product.id, price);
            setSelectedProducts([...selectedProducts, product.id]);
        } catch (err: any) {
            alert(err.message || 'Failed to add product');
        }
    };

    const handleComplete = async () => {
        if (selectedProducts.length === 0) {
            setError('Please add at least one product to your store');
            return;
        }

        setLoading(true);
        setError('');
        try {
            await api.publishStore();
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Failed to publish store');
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        { icon: Store, title: 'Profile' },
        { icon: Palette, title: 'Branding' },
        { icon: Globe, title: 'Domain' },
        { icon: ShoppingBag, title: 'Products' },
    ];

    return (
        <div className="min-h-screen bg-black text-white py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Diamond className="w-10 h-10 text-purple-400" />
                        <span className="font-display text-3xl font-bold gradient-text">JewelryHub</span>
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Welcome! Let's set up your store</h1>
                    <p className="text-white/60">Follow these simple steps to start selling</p>
                </div>

                {/* Progress Bar */}
                <div className="flex items-center justify-between mb-12 relative">
                    <div className="absolute top-5 left-0 right-0 h-px bg-white/10 -z-10" />
                    {steps.map((s, i) => (
                        <div key={i} className="flex flex-col items-center gap-2 bg-black px-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${step > i + 1 ? 'bg-emerald-500' :
                                step === i + 1 ? 'bg-purple-500' : 'bg-white/10'
                                }`}>
                                {step > i + 1 ? <Check className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
                            </div>
                            <span className={`text-xs ${step === i + 1 ? 'text-purple-400 font-bold' : 'text-white/40'}`}>
                                {s.title}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Step Content */}
                <div className="card max-w-2xl mx-auto">
                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-6 text-red-300 text-sm">
                            {error}
                        </div>
                    )}

                    {step === 1 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold mb-6">Business Profile</h2>
                            <div>
                                <label className="input-label">Business Name</label>
                                <input
                                    type="text"
                                    value={businessName}
                                    onChange={e => setBusinessName(e.target.value)}
                                    className="input"
                                    placeholder="Enter your store name"
                                />
                            </div>
                            <div>
                                <label className="input-label">Description</label>
                                <textarea
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    className="input min-h-[100px]"
                                    placeholder="Tell customers about your store"
                                />
                            </div>
                            <div>
                                <label className="input-label">Phone (Optional)</label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    className="input"
                                    placeholder="+91 98765 43210"
                                />
                            </div>
                            <button
                                onClick={handleSaveProfile}
                                disabled={loading || !businessName || !description}
                                className="btn-primary w-full flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Continue <ArrowRight className="w-5 h-5" /></>}
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold mb-6">Brand Identity</h2>
                            <div>
                                <label className="input-label">Store Theme Color</label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="color"
                                        value={primaryColor}
                                        onChange={e => setPrimaryColor(e.target.value)}
                                        className="w-16 h-16 rounded-xl bg-transparent cursor-pointer"
                                    />
                                    <div>
                                        <p className="font-medium">{primaryColor}</p>
                                        <p className="text-sm text-white/40">Choose a primary color for your store</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="input-label">Store Logo</label>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        {logoUrl ? (
                                            <div className="relative group">
                                                <img src={api.getMediaUrl(logoUrl)} alt="Logo" className="w-20 h-20 rounded-xl object-contain bg-white/5 border border-white/10" />
                                                <button
                                                    onClick={() => setLogoUrl('')}
                                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <label className="flex-1 border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:border-purple-500/50 transition-colors cursor-pointer block">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleLogoUpload}
                                                    className="hidden"
                                                />
                                                <Upload className="w-8 h-8 mx-auto mb-2 text-white/20" />
                                                <p className="text-sm text-white/60">Upload your logo</p>
                                                <p className="text-xs text-white/40 mt-1">Recommended size: 512x512px</p>
                                            </label>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={prevStep} className="btn-secondary flex-1">Back</button>
                                <button onClick={handleSaveBranding} className="btn-primary flex-[2] flex items-center justify-center gap-2">
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Next <ArrowRight className="w-5 h-5" /></>}
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold mb-6">Choose Your URL</h2>
                            <div>
                                <label className="input-label">Subdomain</label>
                                <div className="flex items-center gap-2">
                                    <div className="relative flex-1">
                                        <input
                                            type="text"
                                            value={subdomain}
                                            onChange={e => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                                            className="input"
                                            placeholder="my-awesome-store"
                                        />
                                    </div>
                                    <span className="text-white/40 font-medium">.jewelryhub.in</span>
                                </div>
                                <p className="text-xs text-white/40 mt-2">
                                    Customers will visit this link to buy from your store.
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={prevStep} className="btn-secondary flex-1">Back</button>
                                <button onClick={handleSaveDomain} className="btn-primary flex-[2] flex items-center justify-center gap-2">
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Next <ArrowRight className="w-5 h-5" /></>}
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold">Add Your First Products</h2>
                                <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-xs">
                                    {selectedProducts.length} selected
                                </span>
                            </div>

                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {catalogProducts.map(product => (
                                    <div key={product.id} className="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                                        <img src={product.primary_image} alt={product.name} className="w-20 h-20 object-cover rounded-lg" />
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-sm line-clamp-1">{product.name}</h3>
                                            <p className="text-xs text-white/40 mb-2">{product.category}</p>
                                            <p className="text-xs mb-1">Base Price: ₹{product.base_price.toLocaleString()}</p>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    placeholder={`Min: ₹${Math.ceil(product.base_price * 1.2)}`}
                                                    value={priceInput[product.id] || ''}
                                                    onChange={e => setPriceInput({ ...priceInput, [product.id]: e.target.value })}
                                                    className="input py-1.5 text-xs w-32"
                                                />
                                                {selectedProducts.includes(product.id) ? (
                                                    <div className="bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-lg text-xs font-bold border border-emerald-500/50 flex items-center gap-1">
                                                        <Check className="w-3 h-3" /> Added
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => handleAddProduct(product)}
                                                        className="btn-primary py-1.5 text-xs px-4"
                                                    >
                                                        Add
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button onClick={prevStep} className="btn-secondary flex-1">Back</button>
                                <button
                                    onClick={handleComplete}
                                    disabled={loading || selectedProducts.length === 0}
                                    className="btn-primary flex-[2] flex items-center justify-center gap-2"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Launch My Store!'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
