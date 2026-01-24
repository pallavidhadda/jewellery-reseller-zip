'use client';

import { useState } from 'react';
import {
    ShoppingCart, Search, Menu, X, Heart,
    Instagram, Facebook, Twitter, Phone, Mail,
    ChevronDown, Gem, Star, ArrowRight
} from 'lucide-react';
import api from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';

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

export default function RoyalHeritageTemplate({
    store, products, categories, selectedCategory,
    onCategoryChange, onSearchChange, onAddToCart,
    cartItemCount, setCartOpen, primaryColor: propPrimaryColor, accentColor: propAccentColor
}: TemplateProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Unified Brand Color: prioritize the "Brand Accent Color" from the dashboard
    const brandColor = propAccentColor || propPrimaryColor || store.store.accent_color || store.store.primary_color || '#722F37';
    // Use a lightened/adjusted version of the brand color for borders/accents if needed, 
    // but primarily use brandColor for the main aesthetic.
    const goldAccent = propAccentColor || store.store.accent_color || '#C0A062';
    const primaryColor = brandColor;

    return (
        <div className="min-h-screen bg-[#FFFDF9] font-body text-text-primary">
            {/* Top Bar */}
            <div className="text-white py-2 px-4 text-center" style={{ backgroundColor: primaryColor }}>
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold">
                    Exquisite craftsmanship from the heart of Jaipur
                </p>
            </div>

            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b" style={{ borderColor: `${goldAccent}1a` }}>
                <div className="max-w-7xl mx-auto px-4 h-24 flex items-center justify-between">
                    <button className="lg:hidden p-2" onClick={() => setMobileMenuOpen(true)}>
                        <Menu size={24} />
                    </button>

                    <div className="flex-1 flex justify-center lg:justify-start">
                        {store.store.logo_url ? (
                            <div className="relative h-16 w-32">
                                <Image
                                    src={api.getMediaUrl(store.store.logo_url)}
                                    alt={store.store.name}
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        ) : (
                            <Link href={`/store/${store.store.slug}`} className="flex flex-col items-center">
                                <span className="font-display text-2xl font-semibold tracking-tight" style={{ color: primaryColor }}>{store.store.name}</span>
                                <span className="text-[8px] uppercase tracking-[0.4em] font-bold" style={{ color: goldAccent }}>Heritage Jewelry</span>
                            </Link>
                        )}
                    </div>

                    <div className="hidden lg:flex flex-[2] items-center justify-center gap-8">
                        {[
                            { label: 'Collections', href: `/store/${store.store.slug}` },
                            { label: 'About', href: `/store/${store.store.slug}/about` },
                            { label: 'Contact', href: `/store/${store.store.slug}/contact` }
                        ].map(item => (
                            <Link key={item.label} href={item.href} className="text-[11px] uppercase tracking-[0.2em] font-bold hover:opacity-70 transition-colors" style={{ color: primaryColor }}>
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    <div className="flex-1 flex items-center justify-end gap-6">
                        <button className="hidden sm:block hover:opacity-70 transition-colors" style={{ color: primaryColor }}>
                            <Search size={20} />
                        </button>
                        <button className="relative hover:opacity-70 transition-colors" onClick={() => setCartOpen(true)} style={{ color: primaryColor }}>
                            <ShoppingCart size={22} />
                            {cartItemCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 text-white text-[8px] flex items-center justify-center rounded-full ring-2 ring-white" style={{ backgroundColor: primaryColor }}>
                                    {cartItemCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 transition-transform duration-10000 hover:scale-110">
                    <Image
                        src={store.config?.hero_image ? api.getMediaUrl(store.config.hero_image) : 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600'}
                        alt="Hero background"
                        fill
                        className="object-cover"
                        priority
                        sizes="100vw"
                    />
                </div>
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{ backgroundImage: 'url("/lib/patterns/geometric-jali.svg")', backgroundSize: '200px' }} />

                <div className="relative text-center text-white px-4">
                    <div className="w-px h-16 mx-auto mb-8 animate-grow-y" style={{ backgroundColor: goldAccent }} />
                    <p className="text-xs uppercase tracking-[0.4em] font-bold mb-4 animate-fade-in-up" style={{ color: goldAccent }}>
                        {store.config?.hero_subtitle || 'The pinnacle of luxury'}
                    </p>
                    <h1 className="text-5xl md:text-7xl font-display font-medium mb-8 animate-fade-in-up delay-100">
                        {store.config?.hero_title || 'Eternal Elegance'}
                    </h1>
                    <button className="group relative px-10 py-4 border text-xs font-bold uppercase tracking-[0.3em] overflow-hidden transition-all hover:text-white" style={{ borderColor: goldAccent, color: goldAccent }}>
                        <div className="absolute inset-0 translate-y-full transition-transform group-hover:translate-y-0" style={{ backgroundColor: primaryColor }} />
                        <span className="relative z-10">{store.config?.hero_cta_text || 'Explore Collection'}</span>
                    </button>
                </div>
            </section>

            {/* Collections / Categories */}
            <section className="py-24 px-4 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <p className="text-[10px] uppercase tracking-[0.5em] font-bold mb-2" style={{ color: goldAccent }}>Refine Your Choice</p>
                    <h2 className="text-3xl font-display" style={{ color: primaryColor }}>Curated Catalog</h2>
                </div>

                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    <button
                        onClick={() => onCategoryChange('')}
                        className={`px-8 py-3 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold transition-all border ${selectedCategory === ''
                            ? 'text-white shadow-lg'
                            : 'bg-white border hover:border-jaipur-gold'
                            }`}
                        style={selectedCategory === '' ? { backgroundColor: primaryColor, borderColor: primaryColor } : { color: primaryColor, borderColor: `${goldAccent}33` }}
                    >
                        Aura (All)
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => onCategoryChange(cat)}
                            className={`px-8 py-3 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold transition-all border ${selectedCategory === cat
                                ? 'text-white shadow-lg'
                                : 'bg-white border hover:border-jaipur-gold'
                                }`}
                            style={selectedCategory === cat ? { backgroundColor: primaryColor, borderColor: primaryColor } : { color: primaryColor, borderColor: `${goldAccent}33` }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Product Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
                    {products.map((product) => (
                        <div key={product.id} className="group flex flex-col items-center">
                            <div className="relative w-full aspect-[4/5] bg-bg-secondary overflow-hidden mb-6 rounded-t-full border" style={{ borderColor: `${goldAccent}1a` }}>
                                <Image
                                    src={api.getMediaUrl(product.primary_image)}
                                    alt={product.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                />
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 pointer-events-none transition-opacity" style={{ backgroundColor: primaryColor }} />

                                <button className="absolute bottom-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 hover:text-white"
                                    style={{ color: primaryColor }} // Default color
                                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = primaryColor; e.currentTarget.style.color = 'white'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.color = primaryColor; }}
                                    onClick={() => onAddToCart(product)}>
                                    <ShoppingCart size={18} />
                                </button>

                                {product.compare_at_price > product.price && (
                                    <span className="text-white text-[8px] font-bold uppercase tracking-widest px-3 py-1 rounded-full absolute top-8 right-8" style={{ backgroundColor: goldAccent }}>
                                        Limited
                                    </span>
                                )}
                            </div>

                            <div className="text-center px-4">
                                <p className="text-[10px] uppercase tracking-widest font-bold mb-2" style={{ color: goldAccent }}>{product.category}</p>
                                <h3 className="font-display text-lg mb-2 tracking-tight" style={{ color: primaryColor }}>{product.name}</h3>
                                <div className="flex items-center justify-center gap-3">
                                    <span className="font-medium text-text-primary">₹{product.price.toLocaleString()}</span>
                                    {product.compare_at_price > product.price && (
                                        <span className="text-sm text-text-muted line-through opacity-50">₹{product.compare_at_price.toLocaleString()}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {products.length === 0 && (
                    <div className="text-center py-24 border border-dashed rounded-[3rem]" style={{ borderColor: `${goldAccent}33` }}>
                        <Gem className="w-12 h-12 mx-auto mb-4" style={{ color: `${goldAccent}33` }} />
                        <p className="italic font-light" style={{ color: primaryColor, opacity: 0.6 }}>No pieces found in this selection.</p>
                    </div>
                )}
            </section>

            {/* Showcase Section */}
            <section className="py-24 relative overflow-hidden text-center text-white mt-12" style={{ backgroundColor: primaryColor }}>
                <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'url("/lib/patterns/mandala-1.svg")', backgroundSize: '600px', backgroundPosition: 'center' }} />
                <div className="relative z-10 max-w-3xl mx-auto px-4">
                    <Gem className="w-10 h-10 mx-auto mb-8" style={{ color: goldAccent }} />
                    <h2 className="text-4xl font-display mb-6 uppercase tracking-wider">A Legacy of Jaipur</h2>
                    <p className="text-white/70 font-light leading-relaxed mb-10 italic">
                        "For every jewel tells a story, and every story carries the soul of the artisan who breathed life into it."
                    </p>
                    <div className="h-px w-20 mx-auto" style={{ backgroundColor: goldAccent }} />
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#1A1110] text-[#D4CFC7] pt-24 pb-12 px-8">
                <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-16">
                    <div className="md:col-span-2">
                        <div className="mb-8">
                            <span className="font-display text-3xl font-semibold tracking-tight text-white">{store.store.name}</span>
                            <span className="block text-[8px] uppercase tracking-[0.4em] font-bold mt-1" style={{ color: goldAccent }}>Heritage Collection</span>
                        </div>
                        <p className="text-sm font-light leading-relaxed max-w-md mb-8">
                            {store.store.description || 'Exploring the intersection of tradition and modernity through the lens of exquisite jewelry craftsmanship.'}
                        </p>
                        <div className="flex gap-4">
                            {[Instagram, Facebook, Twitter].map((Icon, i) => (
                                <button key={i} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                                    <Icon size={16} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-8">Concierge</h4>
                        <ul className="space-y-4 text-sm font-light">
                            <li className="cursor-pointer transition-colors hover:opacity-80" style={{ color: goldAccent }}>Private Viewing</li>
                            <li className="cursor-pointer transition-colors hover:opacity-80" style={{ color: goldAccent }}>Heritage Care</li>
                            <li className="cursor-pointer transition-colors hover:opacity-80" style={{ color: goldAccent }}>Shipping & Returns</li>
                            <li className="cursor-pointer transition-colors hover:opacity-80" style={{ color: goldAccent }}>Bespoke Requests</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-8">Reach Us</h4>
                        <ul className="space-y-4 text-sm font-light">
                            <li className="flex items-center gap-3">
                                <Phone size={14} style={{ color: goldAccent }} />
                                {store.store.phone || '+91 98765 43210'}
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={14} style={{ color: goldAccent }} />
                                contact@{store.store.slug}.com
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] uppercase tracking-[0.2em] opacity-40">© 2024 {store.store.name}. All Rights Reserved.</p>
                    <div className="flex items-center gap-2">
                        <Star size={12} style={{ color: goldAccent }} />
                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Curated by JewelryHub Registry</span>
                    </div>
                </div>
            </footer>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-[60] flex flex-col p-12 animate-fade-in" style={{ backgroundColor: primaryColor }}>
                    <button className="absolute top-8 right-8 text-white" onClick={() => setMobileMenuOpen(false)}>
                        <X size={32} />
                    </button>
                    <div className="flex-1 flex flex-col justify-center gap-8">
                        {[
                            { label: 'Collections', href: `/store/${store.store.slug}` },
                            { label: 'About', href: `/store/${store.store.slug}/about` },
                            { label: 'Contact', href: `/store/${store.store.slug}/contact` }
                        ].map(item => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="text-3xl font-display text-white text-left transition-colors"
                                style={{ color: 'white' }}
                                onMouseEnter={(e) => e.currentTarget.style.color = goldAccent}
                                onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
