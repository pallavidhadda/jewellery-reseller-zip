'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Sparkles, Diamond, Store, TrendingUp, CreditCard,
    CheckCircle, ArrowRight, Star, ShoppingBag, Users,
    Palette, Globe, BarChart3, Headphones, ChevronRight,
    Play, Menu, X
} from 'lucide-react';

export default function HomePage() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 glass">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/" className="flex items-center gap-2">
                            <Diamond className="w-8 h-8 text-purple-400" />
                            <span className="font-display text-xl font-bold gradient-text">JewelryHub</span>
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center gap-8">
                            <Link href="#features" className="text-white/70 hover:text-white transition-colors">Features</Link>
                            <Link href="#how-it-works" className="text-white/70 hover:text-white transition-colors">How It Works</Link>
                            <Link href="#pricing" className="text-white/70 hover:text-white transition-colors">Pricing</Link>
                            <Link href="/login" className="text-white/70 hover:text-white transition-colors">Sign In</Link>
                            <Link href="/register" className="btn-primary text-sm">Get Started Free</Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden text-white p-2"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden glass border-t border-white/10 animate-slide-down">
                        <div className="px-4 py-4 space-y-4">
                            <Link href="#features" className="block text-white/70 hover:text-white">Features</Link>
                            <Link href="#how-it-works" className="block text-white/70 hover:text-white">How It Works</Link>
                            <Link href="#pricing" className="block text-white/70 hover:text-white">Pricing</Link>
                            <Link href="/login" className="block text-white/70 hover:text-white">Sign In</Link>
                            <Link href="/register" className="btn-primary block text-center">Get Started Free</Link>
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-3xl" />
                </div>

                <div className="max-w-7xl mx-auto relative">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-8">
                            <Sparkles className="w-4 h-4 text-purple-400" />
                            <span className="text-sm text-purple-300">Launch your jewelry business in minutes</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight">
                            Your Own <span className="gradient-text">Jewelry Store</span>
                            <br />Without the Hassle
                        </h1>

                        <p className="text-xl text-white/60 mb-10 max-w-2xl mx-auto">
                            Curate stunning jewelry from top manufacturers, set your own prices,
                            and launch your branded online store. We handle inventory and shipping—you focus on selling.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                            <Link href="/register" className="btn-primary flex items-center gap-2 text-lg">
                                Start Selling Free
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <button className="btn-secondary flex items-center gap-2 text-lg">
                                <Play className="w-5 h-5" />
                                Watch Demo
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {[
                                { label: 'Active Resellers', value: '2,500+' },
                                { label: 'Products Available', value: '10,000+' },
                                { label: 'Orders Fulfilled', value: '150K+' },
                                { label: 'Average Margin', value: '35%' },
                            ].map((stat, i) => (
                                <div key={i} className="card text-center">
                                    <div className="text-3xl font-bold gradient-text mb-1">{stat.value}</div>
                                    <div className="text-sm text-white/50">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
                            Everything You Need to <span className="gradient-text">Succeed</span>
                        </h2>
                        <p className="text-xl text-white/60 max-w-2xl mx-auto">
                            All the tools to build, launch, and grow your jewelry business
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                icon: Store,
                                title: 'Branded Storefront',
                                description: 'Get your own professional store with custom domain, logo, and personalized branding.',
                                color: 'purple'
                            },
                            {
                                icon: ShoppingBag,
                                title: 'Curated Catalog',
                                description: 'Browse thousands of jewelry pieces from verified manufacturers. Pick what sells.',
                                color: 'pink'
                            },
                            {
                                icon: TrendingUp,
                                title: 'Set Your Prices',
                                description: 'Control your margins with flexible pricing. Set markups that work for your business.',
                                color: 'amber'
                            },
                            {
                                icon: CreditCard,
                                title: 'Easy Payouts',
                                description: 'Get your commissions paid out weekly. Track earnings in real-time dashboard.',
                                color: 'emerald'
                            },
                            {
                                icon: Palette,
                                title: 'Theme Customization',
                                description: 'Choose colors, fonts, and layouts. Make your store uniquely yours.',
                                color: 'blue'
                            },
                            {
                                icon: BarChart3,
                                title: 'Analytics Dashboard',
                                description: 'Track sales, bestsellers, and revenue. Make data-driven decisions.',
                                color: 'violet'
                            },
                        ].map((feature, i) => (
                            <div key={i} className="card card-hover group">
                                <div className={`w-12 h-12 rounded-xl bg-${feature.color}-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <feature.icon className={`w-6 h-6 text-${feature.color}-400`} />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                <p className="text-white/60">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-24 px-4 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent pointer-events-none" />

                <div className="max-w-7xl mx-auto relative">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
                            Launch in <span className="gradient-text">3 Simple Steps</span>
                        </h2>
                        <p className="text-xl text-white/60 max-w-2xl mx-auto">
                            From signup to first sale in under 30 minutes
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                step: '01',
                                title: 'Create Your Store',
                                description: 'Sign up, name your store, upload your logo, and choose your brand colors. Done in 5 minutes.',
                                icon: Store
                            },
                            {
                                step: '02',
                                title: 'Pick Your Products',
                                description: 'Browse our catalog, select jewelry you love, set your retail prices, and add to your store.',
                                icon: Diamond
                            },
                            {
                                step: '03',
                                title: 'Start Earning',
                                description: 'Share your store link, customers order, we ship directly. You earn your commission.',
                                icon: TrendingUp
                            },
                        ].map((step, i) => (
                            <div key={i} className="relative">
                                <div className="card text-center py-10">
                                    <div className="text-7xl font-display font-bold text-white/5 absolute top-4 left-1/2 -translate-x-1/2">
                                        {step.step}
                                    </div>
                                    <div className="relative z-10">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-6 glow-purple">
                                            <step.icon className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
                                        <p className="text-white/60">{step.description}</p>
                                    </div>
                                </div>
                                {i < 2 && (
                                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                                        <ChevronRight className="w-8 h-8 text-purple-500/50" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
                            Loved by <span className="gradient-text">Thousands</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                name: 'Priya Sharma',
                                role: 'Fashion Influencer',
                                image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
                                quote: 'I started my jewelry store as a side hustle, now it\'s my full-time income. The platform is incredibly easy to use!'
                            },
                            {
                                name: 'Rahul Kapoor',
                                role: 'Entrepreneur',
                                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
                                quote: 'Best decision I made for my business. Zero inventory headaches, and the margins are fantastic.'
                            },
                            {
                                name: 'Anjali Patel',
                                role: 'Store Owner',
                                image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
                                quote: 'My customers love the jewelry quality. The automatic fulfillment saves me hours every day.'
                            },
                        ].map((testimonial, i) => (
                            <div key={i} className="card">
                                <div className="flex items-center gap-1 mb-4">
                                    {[...Array(5)].map((_, j) => (
                                        <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                    ))}
                                </div>
                                <p className="text-white/80 mb-6">"{testimonial.quote}"</p>
                                <div className="flex items-center gap-3">
                                    <img
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div>
                                        <div className="font-semibold">{testimonial.name}</div>
                                        <div className="text-sm text-white/50">{testimonial.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="card bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-purple-500/30 text-center py-16 px-8">
                        <Sparkles className="w-12 h-12 text-amber-400 mx-auto mb-6" />
                        <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
                            Ready to Start Your Journey?
                        </h2>
                        <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
                            Join thousands of entrepreneurs building their jewelry empire.
                            Start for free, no credit card required.
                        </p>
                        <Link href="/register" className="btn-accent inline-flex items-center gap-2 text-lg">
                            Create Your Store Now
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/10 py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <Link href="/" className="flex items-center gap-2 mb-4">
                                <Diamond className="w-8 h-8 text-purple-400" />
                                <span className="font-display text-xl font-bold">JewelryHub</span>
                            </Link>
                            <p className="text-white/50 text-sm">
                                Empowering jewelry entrepreneurs worldwide with a complete platform for success.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Platform</h4>
                            <ul className="space-y-2 text-sm text-white/50">
                                <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                                <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                                <li><Link href="/catalog" className="hover:text-white transition-colors">Product Catalog</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Resources</h4>
                            <ul className="space-y-2 text-sm text-white/50">
                                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm text-white/50">
                                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-white/10 pt-8 text-center text-sm text-white/40">
                        © 2024 JewelryHub. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
