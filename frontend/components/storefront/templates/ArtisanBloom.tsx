'use client';

import { useState } from 'react';
import {
    ShoppingCart, Search, Menu, X, Heart,
    Instagram, Facebook, Twitter, Phone, Mail,
    Leaf, Sparkles, Star
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

export default function ArtisanBloomTemplate({
    store, products, categories, selectedCategory,
    onCategoryChange, onSearchChange, onAddToCart,
    cartItemCount, setCartOpen, primaryColor: propPrimaryColor, accentColor: propAccentColor
}: TemplateProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Unified Accent Color from Dashboard
    const accentColor = propAccentColor || store.store.accent_color || '#D4AF37';
    // Main theme color (Green for Bloom)
    const primaryColor = propAccentColor || propPrimaryColor || store.store.accent_color || store.store.primary_color || '#1E3A34';

    return (
        <div className="min-h-screen bg-[#FDFCFB] font-body text-[#2D3A3A]">
            {/* Top Announcement */}
            <div className="py-2.5 text-[10px] uppercase tracking-[0.25em] font-medium text-center" style={{ backgroundColor: primaryColor, color: `${accentColor}cc` }}>
                Inspired by the delicate geometry of nature
            </div>

            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#1E3A34]/5">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <button className="lg:hidden p-2" onClick={() => setMobileMenuOpen(true)} style={{ color: primaryColor }}>
                        <Menu size={22} />
                    </button>

                    <nav className="hidden lg:flex items-center gap-10 text-[11px] uppercase tracking-widest font-bold">
                        {[
                            { label: 'Boutique', href: `/store/${store.store.slug}` },
                            { label: 'Artisan Story', href: `/store/${store.store.slug}/about` }
                        ].map(item => (
                            <Link key={item.label} href={item.href} className="transition-colors border-b border-transparent hover:opacity-70" style={{ color: primaryColor }}>
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex flex-col items-center">
                        {store.store.logo_url ? (
                            <img src={api.getMediaUrl(store.store.logo_url)} alt={store.store.name} className="h-10 w-auto" />
                        ) : (
                            <>
                                <span className="font-display text-2xl font-semibold tracking-tight" style={{ color: primaryColor }}>{store.store.name}</span>
                                <div className="flex items-center gap-2 -mt-1">
                                    <div className="h-px w-3" style={{ backgroundColor: accentColor }} />
                                    <Leaf size={8} style={{ color: accentColor }} />
                                    <div className="h-px w-3" style={{ backgroundColor: accentColor }} />
                                </div>
                            </>
                        )}
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="hover:opacity-70 transition-colors" style={{ color: primaryColor }}>
                            <Search size={20} />
                        </button>
                        <button className="relative hover:opacity-70 transition-colors" onClick={() => setCartOpen(true)} style={{ color: primaryColor }}>
                            <ShoppingCart size={20} />
                            {cartItemCount > 0 && (
                                <span className="absolute -top-2 -right-2 w-4 h-4 text-[9px] font-bold flex items-center justify-center rounded-full border border-white" style={{ backgroundColor: accentColor, color: primaryColor }}>
                                    {cartItemCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative py-24 px-6 overflow-hidden">
                <div className="absolute inset-0 bg-[#F4F1ED]" />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] opacity-5 rounded-full -mr-48 -mt-48 blur-3xl" style={{ backgroundColor: primaryColor }} />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full -ml-32 -mb-32 blur-3xl" style={{ backgroundColor: `${accentColor}1a` }} />

                <div className="max-w-7xl mx-auto relative flex flex-col lg:flex-row items-center gap-16">
                    <div className="flex-1 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 mb-6" style={{ color: accentColor }}>
                            <Sparkles size={16} />
                            <span className="text-xs uppercase tracking-[0.3em] font-bold">New Bloom 2024</span>
                        </div>
                        <h1 className="text-5xl lg:text-6xl font-display font-medium mb-8 leading-[1.1]" style={{ color: primaryColor }}>
                            {store.config?.hero_title || 'Where Fine Art Meets the Garden’s Whisper'}
                        </h1>
                        <p className="text-lg font-light text-[#2D3A3A]/70 mb-10 max-w-lg leading-relaxed">
                            {store.config?.hero_subtitle || 'Discover our curated selection of rose gold and emerald pieces, hand-crafted with botanical precision.'}
                        </p>
                        <button
                            className="px-10 py-5 text-white text-[11px] uppercase tracking-[0.2em] font-bold hover:shadow-lg transition-all active:scale-95"
                            style={{ backgroundColor: primaryColor }}
                        >
                            {store.config?.hero_cta_text || 'Curate Your Collection'}
                        </button>
                    </div>

                    <div className="flex-1 relative">
                        <div className="aspect-[4/5] relative rounded-[3rem] overflow-hidden shadow-2xl">
                            <img
                                src={store.config?.hero_image ? api.getMediaUrl(store.config.hero_image) : 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800'}
                                alt="Artisan Jewelry"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white rounded-[2.5rem] p-6 shadow-xl flex flex-col items-center justify-center text-center">
                            <Star className="mb-1" size={16} fill="currentColor" style={{ color: accentColor }} />
                            <span className="text-[10px] uppercase font-bold tracking-widest" style={{ color: primaryColor }}>Boutique Exclusive</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bloom Category Selection */}
            <div className="py-16 text-center overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-wrap justify-center gap-3">
                        <button
                            onClick={() => onCategoryChange('')}
                            className={`px-8 py-3 rounded-2xl text-[10px] uppercase tracking-[0.2em] font-bold transition-all ${selectedCategory === ''
                                ? 'bg-white shadow-lg'
                                : 'hover:opacity-70'
                                }`}
                            style={selectedCategory === ''
                                ? { color: primaryColor, boxShadow: `0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05), 0 0 0 1px ${primaryColor}` }
                                : { color: `${primaryColor}66` }
                            }
                        >
                            Complete Garden
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => onCategoryChange(cat)}
                                className={`px-8 py-3 rounded-2xl text-[10px] uppercase tracking-[0.2em] font-bold transition-all ${selectedCategory === cat
                                    ? 'bg-white shadow-lg'
                                    : 'hover:opacity-70'
                                    }`}
                                style={selectedCategory === cat
                                    ? { color: primaryColor, boxShadow: `0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05), 0 0 0 1px ${primaryColor}` }
                                    : { color: `${primaryColor}66` }
                                }
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Product Petals (Grid) */}
            <main className="max-w-7xl mx-auto px-6 pb-24">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
                    {products.map((product) => (
                        <div key={product.id} className="group flex flex-col bg-white rounded-[2rem] p-4 shadow-sm hover:shadow-xl transition-all duration-500 border border-[#1E3A34]/5">
                            <div className="aspect-square rounded-[1.5rem] overflow-hidden mb-6 relative">
                                <img
                                    src={api.getMediaUrl(product.primary_image)}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <button className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:text-red-500 transition-colors" style={{ color: `${primaryColor}66` }}>
                                    <Heart size={18} />
                                </button>

                                <button
                                    className="absolute inset-x-4 bottom-4 py-4 text-white text-[10px] uppercase tracking-widest font-bold translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 rounded-xl"
                                    style={{ backgroundColor: primaryColor }}
                                    onClick={() => onAddToCart(product)}
                                >
                                    Add Piece
                                </button>
                            </div>

                            <div className="px-2">
                                <span className="text-[10px] uppercase tracking-[0.2em] font-bold mb-2 block" style={{ color: accentColor }}>{product.category}</span>
                                <h3 className="text-base font-display font-medium mb-3" style={{ color: primaryColor }}>{product.name}</h3>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold" style={{ color: primaryColor }}>₹{product.price.toLocaleString()}</span>
                                    {product.compare_at_price > product.price && (
                                        <span className="text-[10px] line-through" style={{ color: `${primaryColor}66` }}>₹{product.compare_at_price.toLocaleString()}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {products.length === 0 && (
                    <div className="text-center py-40 bg-opacity-20 rounded-[3rem]" style={{ backgroundColor: `${primaryColor}05` }}>
                        <Leaf className="w-12 h-12 mx-auto mb-6 opacity-20" style={{ color: primaryColor }} />
                        <p className="text-sm font-light italic opacity-40" style={{ color: primaryColor }}>Currently tending to this selection...</p>
                    </div>
                )}
            </main>

            {/* Botanical Footer */}
            <footer className="text-white pt-24 pb-12 px-6" style={{ backgroundColor: primaryColor }}>
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
                        <div className="md:col-span-2">
                            <span className="font-display text-3xl font-medium block mb-8 leading-tight">{store.store.name}</span>
                            <p className="text-sm font-light text-white/60 leading-relaxed max-w-sm mb-10 italic">
                                "{store.store.description || 'Our pieces are born from the observation of delicate structures in nature, rendered in the finest materials.'}"
                            </p>
                            <div className="flex gap-4">
                                {[Instagram, Facebook, Twitter].map((Icon, i) => (
                                    <button key={i} className="w-11 h-11 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-white/20 transition-all" style={{ color: accentColor }}>
                                        <Icon size={18} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-widest mb-10" style={{ color: accentColor }}>Bespoke Inquiries</h4>
                            <ul className="space-y-4 text-sm font-light text-white/60">
                                <li className="hover:text-white cursor-pointer transition-colors flex items-center gap-3">
                                    <Phone size={14} />
                                    {store.store.phone || '+91 888 777 6666'}
                                </li>
                                <li className="hover:text-white cursor-pointer transition-colors flex items-center gap-3">
                                    <Mail size={14} />
                                    bloom@{store.store.slug}.com
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-widest mb-10" style={{ color: accentColor }}>Artisan Services</h4>
                            <ul className="space-y-4 text-sm font-light text-white/60">
                                <li className="hover:text-white cursor-pointer transition-colors">Stone Sourcing</li>
                                <li className="hover:text-white cursor-pointer transition-colors">Gift Presentation</li>
                                <li className="hover:text-white cursor-pointer transition-colors">Jewelry Lifecycle</li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] uppercase tracking-[0.3em] text-white/30">
                        <p>© {new Date().getFullYear()} Art of the Bloom</p>
                        <div className="flex items-center gap-3">
                            <div className="h-px w-8 bg-white/10" />
                            <p>JewelryHub Boutique</p>
                            <div className="h-px w-8 bg-white/10" />
                        </div>
                    </div>
                </div>
            </footer>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-[60] flex flex-col p-12 transition-all duration-500" style={{ backgroundColor: primaryColor }}>
                    <button className="absolute top-8 right-8 text-white/60" onClick={() => setMobileMenuOpen(false)}>
                        <X size={28} />
                    </button>
                    <div className="flex-1 flex flex-col justify-center gap-12">
                        {[
                            { label: 'The Garden', href: `/store/${store.store.slug}` },
                            { label: 'Artisan Story', href: `/store/${store.store.slug}/about` },
                            { label: 'Contact', href: `/store/${store.store.slug}/contact` }
                        ].map(item => (
                            <Link key={item.label} href={item.href} className="text-4xl font-display text-white text-left transition-colors leading-[1.1]" style={{ color: 'white' }} onMouseEnter={(e) => e.currentTarget.style.color = accentColor} onMouseLeave={(e) => e.currentTarget.style.color = 'white'}>
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
