'use client';

import { useState } from 'react';
import {
    ShoppingCart, Search, Menu, X, Heart,
    Instagram, Facebook, Twitter, Phone, Mail,
    Plus, Minus, ArrowRight
} from 'lucide-react';
import api from '@/lib/api';
import Link from 'next/link';

interface TemplateProps {
    store: any;
    products: any[];
    categories: string[];
    selectedCategory: string;
    onCategoryChange: (cat: string) => void;
    onSearchChange: (search: string) => void;
    onAddToCart: (product: any) => void;
    cartItemCount: number;
    setCartOpen: (open: boolean) => void;
    primaryColor?: string;
    accentColor?: string;
}

export default function MinimalistChicTemplate({
    store, products, categories, selectedCategory,
    onCategoryChange, onSearchChange, onAddToCart,
    cartItemCount, setCartOpen, primaryColor: propPrimaryColor, accentColor: propAccentColor
}: TemplateProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Main Brand Color from Dashboard Accent Color
    const brandColor = propAccentColor || propPrimaryColor || store.store.accent_color || store.store.primary_color || '#171717';

    return (
        <div className="min-h-screen bg-white font-sans text-neutral-900 selection:bg-neutral-100 selection:text-neutral-900">
            {/* Minimal Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm">
                <div className="max-w-[1800px] mx-auto px-8 lg:px-12 h-20 flex items-center justify-between">
                    <button className="lg:hidden p-2 text-neutral-500" onClick={() => setMobileMenuOpen(true)}>
                        <Menu size={20} strokeWidth={1.5} />
                    </button>

                    <nav className="hidden lg:flex items-center gap-10 text-[11px] uppercase tracking-[0.2em] font-medium text-neutral-400">
                        {[
                            { label: 'Shop', href: `/store/${store.store.slug}` },
                            { label: 'About', href: `/store/${store.store.slug}/about` },
                            { label: 'Contact', href: `/store/${store.store.slug}/contact` }
                        ].map(item => (
                            <Link key={item.label} href={item.href} className="hover:opacity-70 transition-colors" style={{ color: brandColor }}>{item.label}</Link>
                        ))}
                    </nav>

                    <div className="absolute left-1/2 -translate-x-1/2">
                        {store.store.logo_url ? (
                            <img src={api.getMediaUrl(store.store.logo_url)} alt={store.store.name} className="h-8 w-auto grayscale" />
                        ) : (
                            <span className="text-lg font-bold uppercase tracking-[0.3em] font-mono" style={{ color: brandColor }}>{store.store.name}</span>
                        )}
                    </div>

                    <div className="flex items-center gap-8">
                        <button className="text-neutral-400 hover:text-neutral-900 transition-colors">
                            <Search size={18} strokeWidth={1.5} />
                        </button>
                        <button className="relative text-neutral-400 hover:text-neutral-900 transition-colors" onClick={() => setCartOpen(true)}>
                            <ShoppingCart size={18} strokeWidth={1.5} />
                            {cartItemCount > 0 && (
                                <span className="absolute -top-2 -right-2 text-[9px] font-bold" style={{ color: brandColor }}>
                                    ({cartItemCount})
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Static Hero */}
            <section className="pt-20">
                <div className="grid lg:grid-cols-2 h-[80vh]">
                    <div className="bg-[#F9F9F8] flex flex-col justify-center items-start px-12 lg:px-24">
                        <span className="text-[10px] uppercase tracking-[0.4em] text-neutral-400 mb-6">{store.config?.hero_subtitle || 'Spring Collection 2024'}</span>
                        <h1 className="text-4xl lg:text-5xl font-light tracking-tight mb-8 leading-[1.1] max-w-md">
                            {store.config?.hero_title || 'Refined aesthetics for the modern soul.'}
                        </h1>
                        <button
                            className="px-10 py-4 text-white text-[11px] uppercase tracking-[0.2em] font-medium transition-colors hover:opacity-90"
                            style={{ backgroundColor: brandColor }}
                        >
                            {store.config?.hero_cta_text || 'View Selection'}
                        </button>
                    </div>
                    <div className="hidden lg:block relative overflow-hidden">
                        <img
                            src={store.config?.hero_image ? api.getMediaUrl(store.config.hero_image) : 'https://images.unsplash.com/photo-1573408302354-010549b15265?w=1000'}
                            className="w-full h-full object-cover grayscale-[0.2]"
                            alt="Luxury Jewelry"
                        />
                    </div>
                </div>
            </section>

            {/* Sub-nav Category Filter */}
            <div className="sticky top-20 z-40 bg-white/90 backdrop-blur-md border-y border-neutral-100">
                <div className="max-w-[1800px] mx-auto px-8 lg:px-12 h-16 flex items-center justify-center gap-12 overflow-x-auto no-scrollbar">
                    <button
                        onClick={() => onCategoryChange('')}
                        className={`text-[10px] uppercase tracking-[0.2em] transition-colors ${selectedCategory === '' ? 'font-bold border-b' : 'text-neutral-400 hover:text-neutral-600'
                            }`}
                        style={selectedCategory === '' ? { color: brandColor, borderColor: brandColor } : {}}
                    >
                        Index
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => onCategoryChange(cat)}
                            className={`text-[10px] uppercase tracking-[0.2em] transition-colors ${selectedCategory === cat ? 'font-bold border-b' : 'text-neutral-400 hover:text-neutral-600'
                                }`}
                            style={selectedCategory === cat ? { color: brandColor, borderColor: brandColor } : {}}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Product Display */}
            <main className="max-w-[1800px] mx-auto px-8 lg:px-12 py-20">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-1 gap-y-16">
                    {products.map((product) => (
                        <div key={product.id} className="group relative">
                            <div className="aspect-[3/4] bg-[#F9F9F8] overflow-hidden mb-6 relative">
                                <img
                                    src={api.getMediaUrl(product.primary_image)}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale-[0.1]"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />

                                <button
                                    className="absolute bottom-6 left-6 right-6 py-4 bg-white/95 backdrop-blur-sm text-[10px] uppercase tracking-[0.2em] font-bold translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:text-white"
                                    style={{ color: brandColor }}
                                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = brandColor; e.currentTarget.style.color = 'white'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.color = brandColor; }}
                                    onClick={() => onAddToCart(product)}
                                >
                                    Quick Addition
                                </button>
                            </div>

                            <div className="flex justify-between items-start gap-4">
                                <div>
                                    <h3 className="text-xs uppercase tracking-widest font-medium mb-1">{product.name}</h3>
                                    <p className="text-[10px] text-neutral-400 tracking-wider">#{product.category.toUpperCase()}</p>
                                </div>
                                <span className="text-xs font-medium" style={{ color: brandColor }}>₹{product.price.toLocaleString()}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {products.length === 0 && (
                    <div className="text-center py-40">
                        <p className="text-neutral-300 text-[11px] uppercase tracking-[0.4em]">Selection is currently empty</p>
                    </div>
                )}
            </main>

            {/* Minimal Footer */}
            <footer className="bg-neutral-50 px-8 lg:px-12 py-24 border-t border-neutral-100">
                <div className="max-w-[1800px] mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
                        <div className="md:col-span-1">
                            <span className="text-sm font-bold uppercase tracking-[0.3em] font-mono block mb-8" style={{ color: brandColor }}>{store.store.name}</span>
                            <p className="text-xs text-neutral-400 leading-relaxed font-light italic">
                                "{store.store.description || 'Purity in form, excellence in execution.'}"
                            </p>
                        </div>

                        <div className="flex flex-col gap-4 text-[11px] uppercase tracking-[0.2em] text-neutral-400">
                            <span className="font-bold mb-4" style={{ color: brandColor }}>Contact</span>
                            <p>{store.store.phone || '+91 912 345 6789'}</p>
                            <p>sales@{store.store.slug}.com</p>
                        </div>

                        <div className="flex flex-col gap-4 text-[11px] uppercase tracking-[0.2em] text-neutral-400">
                            <span className="font-bold mb-4" style={{ color: brandColor }}>Follow</span>
                            {['Instagram', 'Facebook', 'Pinterest'].map(s => (
                                <button key={s} className="text-left hover:text-neutral-900 transition-colors uppercase">{s}</button>
                            ))}
                        </div>

                        <div className="flex flex-col gap-4 text-[11px] uppercase tracking-[0.2em] text-neutral-400">
                            <span className="font-bold mb-4" style={{ color: brandColor }}>Support</span>
                            {['Shipping', 'Taxes', 'Terms'].map(s => (
                                <button key={s} className="text-left hover:text-neutral-900 transition-colors uppercase">{s}</button>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-between items-center text-[9px] uppercase tracking-[0.3em] text-neutral-300">
                        <p>© {new Date().getFullYear()} {store.store.name.toUpperCase()}</p>
                        <p>Powered by JewelryHub System</p>
                    </div>
                </div>
            </footer>

            {/* Minimal Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-[60] bg-white flex flex-col p-12">
                    <button className="absolute top-8 right-12 text-neutral-900" onClick={() => setMobileMenuOpen(false)}>
                        <X size={20} strokeWidth={1} />
                    </button>
                    <div className="flex-1 flex flex-col justify-center gap-10">
                        {[
                            { label: 'Shop Catalogue', href: `/store/${store.store.slug}` },
                            { label: 'Our Philosophy', href: `/store/${store.store.slug}/about` },
                            { label: 'Contact Concierge', href: `/store/${store.store.slug}/contact` }
                        ].map(item => (
                            <Link key={item.label} href={item.href} className="text-2xl font-light tracking-tight text-neutral-900 text-left border-b border-neutral-50 pb-4 hover:opacity-70 transition-opacity" style={{ color: brandColor }}>
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
