'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Gem, MapPin, Mail, Phone, Loader2 } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';

export default function AboutPage() {
    const params = useParams();
    const slug = params.slug as string;
    const [store, setStore] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStore();
    }, [slug]);

    const loadStore = async () => {
        try {
            const data = await api.getStorefront(slug);
            setStore(data);
        } catch (err) {
            console.error('Failed to load store:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-8 h-8 border-2 border-neutral-300 border-t-neutral-800 rounded-full animate-spin" />
            </div>
        );
    }

    if (!store) return null;

    // Use store's primary accent color
    const primaryColor = store.store.primary_color || '#171717';

    return (
        <div className="min-h-screen bg-white text-neutral-900 font-sans">
            {/* Header */}
            <header className="border-b border-neutral-100 sticky top-0 bg-white/80 backdrop-blur-md z-40">
                <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
                    <Link href={`/store/${slug}`} className="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 transition-colors group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-medium uppercase tracking-widest">Back to Store</span>
                    </Link>

                    <div className="absolute left-1/2 -translate-x-1/2">
                        {store.store.logo_url ? (
                            <img src={api.getMediaUrl(store.store.logo_url)} alt={store.store.name} className="h-8 w-auto mix-blend-multiply" />
                        ) : (
                            <span className="text-lg font-bold uppercase tracking-[0.3em]" style={{ color: primaryColor }}>{store.store.name}</span>
                        )}
                    </div>

                    <div className="w-20" /> {/* Spacer */}
                </div>
            </header>

            <main>
                {/* Hero / Intro */}
                <section className="py-24 px-4 bg-gray-50">
                    <div className="max-w-3xl mx-auto text-center">
                        <span className="inline-block px-4 py-1 rounded-full bg-white border border-neutral-200 text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-500 mb-6">
                            Our Story
                        </span>
                        <h1 className="text-4xl md:text-5xl font-light mb-8 leading-tight" style={{ color: primaryColor }}>
                            {store.config?.hero_title || `Welcome to ${store.store.name}`}
                        </h1>
                        <div className="w-24 h-1 mx-auto rounded-full mb-8" style={{ backgroundColor: primaryColor }} />
                    </div>
                </section>

                {/* Main Content */}
                <section className="py-24 px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="prose prose-lg prose-neutral mx-auto">
                            <p className="text-xl font-light leading-relaxed text-neutral-600 mb-12 text-center">
                                {store.store.description || "We are a boutique jewelry store dedicated to bringing you the finest craftsmanship and timeless designs. Our collection is curated with passion and an eye for elegance."}
                            </p>

                            <div className="grid md:grid-cols-2 gap-12 not-prose mt-20">
                                <div className="bg-gray-50 p-8 rounded-3xl">
                                    <Gem className="w-8 h-8 mb-4" style={{ color: primaryColor }} />
                                    <h3 className="text-xl font-medium mb-2">Heritage</h3>
                                    <p className="text-neutral-500 font-light">
                                        Celebrating the rich tradition of jewelry making, honoring the artisans who bring these pieces to life.
                                    </p>
                                </div>
                                <div className="bg-gray-50 p-8 rounded-3xl">
                                    <MapPin className="w-8 h-8 mb-4" style={{ color: primaryColor }} />
                                    <h3 className="text-xl font-medium mb-2">Location</h3>
                                    <p className="text-neutral-500 font-light">
                                        {store.store.address || "Based in Jaipur, accessible worldwide."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact Banner */}
                <section className="py-20 bg-neutral-900 text-white text-center px-4" style={{ backgroundColor: primaryColor }}>
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-3xl font-light mb-6">Get in Touch</h2>
                        <p className="text-white/80 mb-10 font-light">
                            Have questions about our collection or need assistance? Our concierge team is here to help.
                        </p>
                        <Link
                            href={`/store/${slug}/contact`}
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-neutral-900 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-neutral-100 transition-colors"
                        >
                            Contact Us
                        </Link>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-neutral-100 py-12 px-4 text-center">
                <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400">© 2024 {store.store.name}. All Rights Reserved.</p>
            </footer>
        </div>
    );
}
