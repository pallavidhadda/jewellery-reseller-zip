'use client';

import { useState } from 'react';
import {
    ShoppingCart, Search, Menu, X, Heart,
    Instagram, Facebook, Twitter, Phone, Mail,
    Dribbble, Landmark, Send
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

export default function ModernDecoTemplate({
    store, products, categories, selectedCategory,
    onCategoryChange, onSearchChange, onAddToCart,
    cartItemCount, setCartOpen, primaryColor: propPrimaryColor, accentColor: propAccentColor
}: TemplateProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Main Brand Color derived from Dashboard Accent Color
    const primaryColor = propAccentColor || propPrimaryColor || store.store.accent_color || store.store.primary_color || '#D4AF37';

    return (
        <div className="min-h-screen bg-[#070B14] font-body text-[#DADADA]">
            {/* Geometric Top Bar */}
            <div className="text-[#070B14] py-1.5 overflow-hidden whitespace-nowrap border-b" style={{ backgroundColor: primaryColor, borderColor: primaryColor }}>
                <div className="flex animate-marquee gap-12 text-[10px] font-bold uppercase tracking-[0.4em]">
                    {Array(10).fill(<span>Sophistication Reimagined • Art Deco Heritage • Modern Precision</span>)}
                </div>
            </div>

            {/* Header */}
            <header className="sticky top-0 z-40 bg-[#070B14]/90 backdrop-blur-md border-b" style={{ borderColor: `${primaryColor}33` }}>
                <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
                    <button className="lg:hidden p-2" onClick={() => setMobileMenuOpen(true)} style={{ color: primaryColor }}>
                        <Menu size={24} />
                    </button>

                    <div className="hidden lg:flex flex-1 items-center gap-8 text-[11px] uppercase tracking-[0.3em] font-bold">
                        {[
                            { label: 'Boutique', href: `/store/${store.store.slug}` },
                            { label: 'Manifesto', href: `/store/${store.store.slug}/about` }
                        ].map(item => (
                            <Link key={item.label} href={item.href} className="hover:text-white transition-colors" style={{ color: primaryColor }}>
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    <div className="flex flex-col items-center flex-1">
                        {store.store.logo_url ? (
                            <img src={api.getMediaUrl(store.store.logo_url)} alt={store.store.name} className="h-12 w-auto border-2 p-1" style={{ borderColor: primaryColor, boxShadow: `0 0 15px ${primaryColor}33` }} />
                        ) : (
                            <div className="border-[3px] px-6 py-1 relative" style={{ borderColor: primaryColor }}>
                                <span className="font-display text-3xl font-bold tracking-tighter text-white uppercase italic">{store.store.name}</span>
                                <div className="absolute -top-1 -left-1 w-2 h-2" style={{ backgroundColor: primaryColor }} />
                                <div className="absolute -bottom-1 -right-1 w-2 h-2" style={{ backgroundColor: primaryColor }} />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 flex items-center justify-end gap-8">
                        <button className="hidden sm:block hover:text-white transition-colors" style={{ color: primaryColor }}>
                            <Search size={22} strokeWidth={1.5} />
                        </button>
                        <button className="relative hover:text-white transition-colors" onClick={() => setCartOpen(true)} style={{ color: primaryColor }}>
                            <ShoppingCart size={22} strokeWidth={1.5} />
                            {cartItemCount > 0 && (
                                <span className="absolute -top-2 -right-2 w-5 h-5 text-[#070B14] text-[10px] font-bold flex items-center justify-center rounded-none transform rotate-45 shadow-lg" style={{ backgroundColor: primaryColor }}>
                                    <span className="-rotate-45">{cartItemCount}</span>
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Deco Hero */}
            <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden border-b-[8px]" style={{ borderColor: primaryColor }}>
                <div
                    className="absolute inset-0 bg-cover bg-fixed grayscale-[0.2]"
                    style={{ backgroundImage: `url(${store.config?.hero_image ? api.getMediaUrl(store.config.hero_image) : 'https://images.unsplash.com/photo-1594913785162-e678329b3595?w=1600'})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#070B14] via-[#070B14]/40 to-[#070B14]" />
                <div className="absolute inset-0 opacity-[0.15]"
                    style={{ backgroundImage: `linear-gradient(45deg, ${primaryColor} 25%, transparent 25%), linear-gradient(-45deg, ${primaryColor} 25%, transparent 25%), linear-gradient(45deg, transparent 75%, ${primaryColor} 75%), linear-gradient(-45deg, transparent 75%, ${primaryColor} 75%)`, backgroundSize: '60px 60px' }}
                />

                <div className="relative text-center max-w-5xl px-6">
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent" style={{ '--tw-gradient-to': primaryColor } as any} />
                        <Landmark size={24} style={{ color: primaryColor }} />
                        <div className="h-px flex-1 bg-gradient-to-l from-transparent" style={{ '--tw-gradient-to': primaryColor } as any} />
                    </div>

                    <h1 className="text-6xl md:text-8xl font-display font-black tracking-tighter text-white uppercase italic leading-none mb-4 drop-shadow-[0_15px_15px_rgba(30,30,30,0.5)]">
                        {store.config?.hero_title || 'Modern Deco'}
                    </h1>
                    <p className="text-xl font-light uppercase tracking-[0.5em] mb-12" style={{ color: primaryColor }}>
                        {store.config?.hero_subtitle || 'The Bold Art of Precision'}
                    </p>

                    <div className="flex justify-center gap-0">
                        <button
                            className="px-12 py-5 text-[#070B14] text-xs font-black uppercase tracking-[0.3em] hover:bg-white transition-all shadow-[10px_10px_0px_rgba(255,255,255,0.1)] active:scale-95"
                            style={{ backgroundColor: primaryColor }}
                        >
                            {store.config?.hero_cta_text || 'See The Vault'}
                        </button>
                    </div>
                </div>
            </section>

            {/* Deco Navigation */}
            <div className="sticky top-24 z-30 bg-[#070B14] border-b" style={{ borderColor: `${primaryColor}1a` }}>
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-center gap-12 text-[10px] uppercase font-black tracking-[0.3em]">
                    <button
                        onClick={() => onCategoryChange('')}
                        className={`transition-all ${selectedCategory === '' ? 'text-white border-b-2 pb-1' : 'hover:opacity-100'}`}
                        style={selectedCategory === ''
                            ? { borderColor: primaryColor }
                            : { color: primaryColor, opacity: 0.4 }
                        }
                    >
                        Foundation
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => onCategoryChange(cat)}
                            className={`transition-all ${selectedCategory === cat ? 'text-white border-b-2 pb-1' : 'hover:opacity-100'}`}
                            style={selectedCategory === cat
                                ? { borderColor: primaryColor }
                                : { color: primaryColor, opacity: 0.4 }
                            }
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Product Display (Geometric Grid) */}
            <main className="max-w-7xl mx-auto px-6 py-32 relative">
                <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none"
                    style={{ backgroundImage: `radial-gradient(${primaryColor} 0.5px, transparent 0.5px)`, backgroundSize: '24px 24px' }}
                />

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-16">
                    {products.map((product) => (
                        <div key={product.id} className="group flex flex-col items-center">
                            <div className="relative w-full aspect-square mb-12 border p-4 transition-all duration-700" style={{ borderColor: `${primaryColor}33` }}>
                                <div className="absolute -top-3 -left-3 w-8 h-8 border-t-2 border-l-2 group-hover:w-full group-hover:h-full transition-all duration-700" style={{ borderColor: primaryColor }} />
                                <div className="absolute -bottom-3 -right-3 w-8 h-8 border-b-2 border-r-2 group-hover:w-full group-hover:h-full transition-all duration-700" style={{ borderColor: primaryColor }} />

                                <div className="w-full h-full overflow-hidden bg-[#0A0F1B]">
                                    <img
                                        src={api.getMediaUrl(product.primary_image)}
                                        alt={product.name}
                                        className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110"
                                    />
                                </div>

                                <button
                                    className="absolute bottom-10 left-1/2 -translate-x-1/2 px-8 py-4 text-[#070B14] text-[10px] font-black uppercase tracking-widest opacity-0 translate-y-8 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500"
                                    style={{ backgroundColor: primaryColor }}
                                    onClick={() => onAddToCart(product)}
                                >
                                    Secure Item
                                </button>
                            </div>

                            <div className="text-center px-4">
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] mb-3 block" style={{ color: primaryColor }}>{product.category}</span>
                                <h3 className="text-xl font-display font-medium text-white mb-4 uppercase tracking-tighter italic">{product.name}</h3>
                                <div className="h-px w-10 mx-auto mb-4" style={{ backgroundColor: `${primaryColor}4d` }} />
                                <p className="text-lg font-light text-white tracking-[0.2em]">₹{product.price.toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {products.length === 0 && (
                    <div className="text-center py-48 border" style={{ borderColor: `${primaryColor}1a` }}>
                        <p className="text-xs font-black uppercase tracking-[0.5em]" style={{ color: `${primaryColor}4d` }}>Inventory Sync Required</p>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="bg-[#0A0F1B] pt-32 pb-16 px-6 border-t-[8px]" style={{ borderColor: primaryColor }}>
                <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-24 mb-32">
                    <div className="md:col-span-2">
                        <div className="border-[3px] px-6 py-2 inline-block mb-12" style={{ borderColor: primaryColor }}>
                            <span className="font-display text-4xl font-bold tracking-tighter text-white uppercase italic">{store.store.name}</span>
                        </div>
                        <p className="text-sm font-light leading-relaxed max-w-md italic mb-12 uppercase tracking-widest px-4 border-l-2" style={{ color: `${primaryColor}99`, borderColor: `${primaryColor}4d` }}>
                            {store.store.description || 'Defying standard luxury with bold, geometric precision.'}
                        </p>
                        <div className="flex gap-8">
                            {[Instagram, Facebook, Twitter].map((Icon, i) => (
                                <button key={i} className="hover:text-white transition-all transform hover:scale-125" style={{ color: `${primaryColor}66` }}>
                                    <Icon size={22} strokeWidth={1.5} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-10">
                        <h4 className="text-white text-[11px] font-black uppercase tracking-[0.4em]">Operations</h4>
                        <ul className="space-y-6 text-sm font-light" style={{ color: `${primaryColor}99` }}>
                            <li className="hover:text-white cursor-pointer transition-colors uppercase tracking-widest">Authentication</li>
                            <li className="hover:text-white cursor-pointer transition-colors uppercase tracking-widest">Global Logistics</li>
                            <li className="hover:text-white cursor-pointer transition-colors uppercase tracking-widest">Contact Head Office</li>
                        </ul>
                    </div>

                    <div className="flex flex-col gap-10" style={{ color: primaryColor }}>
                        <h4 className="text-white text-[11px] font-black uppercase tracking-[0.4em]">Inquiries</h4>
                        <div className="space-y-4">
                            <p className="text-lg font-display tracking-tight text-white italic">{store.store.phone || '+91 7000 8000'}</p>
                            <p className="text-sm font-light opacity-60">HQ@MODERNDECO.IN</p>
                            <button className="flex items-center gap-2 border-b pb-1 text-[10px] font-black uppercase tracking-widest hover:text-white hover:border-white transition-all" style={{ borderColor: primaryColor }}>
                                Send Signal <Send size={10} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.5em]" style={{ color: `${primaryColor}33` }}>
                    <p>© EST. 2024 MODERN DECO ARCHIVE</p>
                    <p>SYSTEM BY JEWELRYHUB</p>
                </div>
            </footer>

            {/* Overlay Menu */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-[60] bg-[#070B14] flex flex-col p-12 overflow-hidden">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `linear-gradient(90deg, ${primaryColor} 1px, transparent 1px), linear-gradient(${primaryColor} 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
                    <button className="absolute top-8 right-8" onClick={() => setMobileMenuOpen(false)} style={{ color: primaryColor }}>
                        <X size={32} strokeWidth={1} />
                    </button>
                    <div className="flex-1 flex flex-col justify-center gap-12 relative z-10">
                        {[
                            { label: 'Catalogue', href: `/store/${store.store.slug}` },
                            { label: 'Our Method', href: `/store/${store.store.slug}/about` },
                            { label: 'Contact', href: `/store/${store.store.slug}/contact` }
                        ].map(item => (
                            <Link key={item.label} href={item.href} className="text-5xl font-display font-black text-white text-left hover:text-opacity-80 transition-all uppercase italic tracking-tighter" style={{ color: primaryColor }}>
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
