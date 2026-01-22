'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Sparkles, Diamond, Store, TrendingUp, CreditCard,
    CheckCircle, ArrowRight, Star, ShoppingBag, Users,
    Palette, Globe, BarChart3, Headphones, ChevronRight,
    Play, Menu, X, Gem
} from 'lucide-react';

export default function HomePage() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-bg-primary text-text-primary overflow-x-hidden">
            {/* Pattern Overlay for whole page */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.02] z-0"
                style={{ backgroundImage: 'url("/lib/patterns/geometric-jali.svg")', backgroundSize: '150px' }} />

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border-light transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 rounded-full bg-jaipur-pink/20 flex items-center justify-center border border-jaipur-pink group-hover:border-jaipur-gold transition-colors">
                                <Gem className="w-5 h-5 text-jaipur-burgundy" />
                            </div>
                            <span className="font-display text-2xl font-semibold text-text-primary tracking-tight">JewelryHub</span>
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center gap-8">
                            <Link href="#features" className="text-text-secondary hover:text-jaipur-terra font-medium text-sm transition-colors">Features</Link>
                            <Link href="#how-it-works" className="text-text-secondary hover:text-jaipur-terra font-medium text-sm transition-colors">How It Works</Link>
                            <Link href="#pricing" className="text-text-secondary hover:text-jaipur-terra font-medium text-sm transition-colors">Pricing</Link>
                            <div className="h-4 w-px bg-border-medium rounded-full"></div>
                            <Link href="/login" className="text-text-primary hover:text-jaipur-gold font-semibold text-sm transition-colors">Sign In</Link>
                            <Link href="/register" className="btn-primary text-sm shadow-gold">Get Started</Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 text-text-primary"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden glass border-t border-border-light animate-slide-down absolute w-full">
                        <div className="px-6 py-6 space-y-4 shadow-xl">
                            <Link href="#features" className="block text-text-secondary hover:text-jaipur-terra font-medium">Features</Link>
                            <Link href="#how-it-works" className="block text-text-secondary hover:text-jaipur-terra font-medium">How It Works</Link>
                            <Link href="#pricing" className="block text-text-secondary hover:text-jaipur-terra font-medium">Pricing</Link>
                            <div className="border-t border-border-light my-2"></div>
                            <Link href="/login" className="block text-text-primary font-semibold">Sign In</Link>
                            <Link href="/register" className="btn-primary block text-center mt-4">Get Started</Link>
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4 overflow-hidden z-10">
                {/* Decorative Pattern Background */}
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-[0.04] bg-mandala-pattern bg-no-repeat bg-right-top bg-contain pointer-events-none"
                    style={{ backgroundImage: 'url("/lib/patterns/mandala-1.svg")' }} />

                <div className="max-w-7xl mx-auto relative">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="text-left animate-slide-up">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-jaipur-sand/30 border border-jaipur-gold/20 mb-8 backdrop-blur-sm">
                                <Sparkles className="w-4 h-4 text-jaipur-gold" />
                                <span className="text-xs font-semibold text-jaipur-peacock uppercase tracking-wider">The Future of Jewelry Retail</span>
                            </div>

                            <h1 className="font-display text-5xl md:text-7xl font-medium mb-6 leading-[0.9] text-text-primary">
                                Launch Your <br />
                                <span className="text-jaipur-terra italic font-light">Luxury Brand</span>
                            </h1>

                            <p className="text-lg text-text-secondary mb-10 max-w-lg leading-relaxed font-light">
                                Curate stunning jewelry from India's finest artisans.
                                We handle inventory and logistics—you focus on building your legacy.
                            </p>

                            <div className="flex flex-col sm:flex-row items-start gap-4 mb-16">
                                <Link href="/register" className="btn-primary flex items-center gap-2 text-lg px-8 py-4">
                                    Start Selling Free
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                                <button className="btn-ghost flex items-center gap-2 text-lg px-8 py-4 bg-white/50 backdrop-blur-sm">
                                    <Play className="w-5 h-5 text-jaipur-peacock" />
                                    Watch Demo
                                </button>
                            </div>
                        </div>

                        {/* Abstract Hero Visualization */}
                        <div className="relative hidden md:block animate-fade-in">
                            <div className="absolute inset-0 bg-gradient-radial from-jaipur-sand/20 to-transparent blur-3xl" />
                            <div className="relative z-10 grid grid-cols-2 gap-4">
                                <div className="space-y-4 pt-12">
                                    <div className="card bg-white p-4 shadow-gold border-jaipur-gold/30 transform rotate-[-2deg]">
                                        <div className="aspect-square bg-jaipur-sand/10 rounded-lg mb-3 overflow-hidden relative">
                                            {/* Abstract jewelry representation */}
                                            <div className="absolute inset-0 flex items-center justify-center text-jaipur-gold/20">
                                                <Gem size={64} strokeWidth={1} />
                                            </div>
                                        </div>
                                        <div className="h-2 w-16 bg-jaipur-terra/20 rounded-full mb-2"></div>
                                        <div className="h-2 w-10 bg-jaipur-gold/20 rounded-full"></div>
                                    </div>
                                    <div className="card bg-white p-4 shadow-lg border-border-light opacity-80 scale-95 origin-top-left">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-8 h-8 rounded-full bg-jaipur-peacock/10"></div>
                                            <div className="h-2 w-20 bg-text-muted/20 rounded-full"></div>
                                        </div>
                                        <div className="h-2 w-full bg-text-muted/10 rounded-full"></div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="card bg-jaipur-peacock text-white p-6 shadow-peacock transform rotate-[2deg] mt-8">
                                        <div className="text-3xl font-display font-bold mb-1">₹45k+</div>
                                        <div className="text-white/70 text-sm">Monthly Profit</div>
                                    </div>
                                    <div className="card bg-white p-4 shadow-lg border-border-light">
                                        <div className="aspect-[4/5] bg-jaipur-sand/10 rounded-lg relative overflow-hidden">
                                            <div className="absolute inset-0 flex items-center justify-center text-jaipur-burgundy/20">
                                                <Diamond size={64} strokeWidth={1} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-border-light/50 bg-white/30 backdrop-blur-sm rounded-2xl px-8 mt-8">
                        {[
                            { label: 'Active Retailers', value: '2,500+' },
                            { label: 'Artisan Designs', value: '10,000+' },
                            { label: 'Orders Shipped', value: '150K+' },
                            { label: 'Avg. Margin', value: '35%' },
                        ].map((stat, i) => (
                            <div key={i} className="text-center group">
                                <div className="text-3xl font-display font-medium text-text-primary mb-1 group-hover:text-jaipur-terra transition-colors">{stat.value}</div>
                                <div className="text-sm font-medium text-text-secondary uppercase tracking-wider">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Decorative Divider */}
            <div className="w-full h-12 bg-[url('/lib/patterns/divider.svg')] bg-center bg-no-repeat opacity-40 my-8"></div>

            {/* Features Section */}
            <section id="features" className="py-24 px-4 bg-bg-secondary relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 max-w-3xl mx-auto">
                        <span className="text-jaipur-peacock font-semibold tracking-wider uppercase text-sm mb-2 block">Why Choose Us</span>
                        <h2 className="text-4xl md:text-5xl font-display font-medium mb-6 text-text-primary">
                            Tradition Meets <span className="italic text-jaipur-terra">Technology</span>
                        </h2>
                        <p className="text-lg text-text-secondary font-light">
                            We bridge the gap between India's legendary craftsmanship and modern e-commerce tools.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Store,
                                title: 'Branded Storefront',
                                description: 'Get a clean, Apple-style store with your own domain, logo, and brand identity.',
                                color: 'text-jaipur-peacock'
                            },
                            {
                                icon: Gem,
                                title: 'Curated Catalog',
                                description: 'Access thousands of certified Kundan, Polki, and modern jewelry pieces directly from Jaipur.',
                                color: 'text-jaipur-burgundy'
                            },
                            {
                                icon: TrendingUp,
                                title: 'Profitable Margins',
                                description: 'Set your own retail prices. Control your profit on every single piece you sell.',
                                color: 'text-jaipur-gold'
                            },
                            {
                                icon: CreditCard,
                                title: 'Automated Payouts',
                                description: 'Secure payment processing and weekly payouts directly to your bank account.',
                                color: 'text-jaipur-terra'
                            },
                            {
                                icon: Palette,
                                title: 'Custom Themes',
                                description: 'Choose from 4 luxury store templates and customize colors to match your brand.',
                                color: 'text-jaipur-peacock'
                            },
                            {
                                icon: BarChart3,
                                title: 'Business Analytics',
                                description: 'Track sales, identify bestsellers, and grow your business with data-driven insights.',
                                color: 'text-jaipur-burgundy'
                            },
                        ].map((feature, i) => (
                            <div key={i} className="card card-hover group bg-white">
                                <div className={`w-12 h-12 rounded-xl bg-bg-secondary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-border-light`}>
                                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                                </div>
                                <h3 className="text-xl font-display font-medium mb-3 text-text-primary">{feature.title}</h3>
                                <p className="text-text-secondary leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-24 px-4 relative bg-jaipur-sand/10">
                <div className="max-w-7xl mx-auto relative">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="text-jaipur-terra font-semibold tracking-wider uppercase text-sm mb-2 block">The Process</span>
                            <h2 className="text-4xl md:text-5xl font-display font-medium mb-8 text-text-primary">
                                Launch in <span className="italic">3 Steps</span>
                            </h2>

                            <div className="space-y-12">
                                {[
                                    {
                                        step: '01',
                                        title: 'Create Your Brand',
                                        description: 'Sign up, name your store, and choose a theme that fits your style. No coding needed.',
                                        icon: Palette
                                    },
                                    {
                                        step: '02',
                                        title: 'Curate Collection',
                                        description: 'Select jewelry pieces you love from our catalog. Set your prices and add them to your store.',
                                        icon: Diamond
                                    },
                                    {
                                        step: '03',
                                        title: 'Start Selling',
                                        description: 'Share your store link. We handle packing, shipping, and insurance. You keep the profit.',
                                        icon: TrendingUp
                                    },
                                ].map((step, i) => (
                                    <div key={i} className="flex gap-6 relative">
                                        {i < 2 && <div className="absolute left-6 top-16 bottom-[-48px] w-px bg-border-accent/30 border-l border-dashed border-jaipur-gold"></div>}
                                        <div className="w-12 h-12 rounded-full bg-white border border-jaipur-gold/50 flex items-center justify-center shrink-0 z-10 shadow-sm">
                                            <span className="font-display font-bold text-jaipur-terra">{step.step}</span>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold mb-2 text-text-primary">{step.title}</h3>
                                            <p className="text-text-secondary max-w-md">{step.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <div className="aspect-[4/5] rounded-tl-[100px] rounded-br-[100px] bg-jaipur-peacock/5 overflow-hidden border border-jaipur-peacock/10 p-8">
                                <div className="h-full w-full bg-white rounded-tl-[80px] rounded-br-[80px] shadow-2xl border border-border-light flex flex-col items-center justify-center text-center p-8 relative">
                                    <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('/lib/patterns/mandala-1.svg')] bg-cover"></div>
                                    <div className="relative z-10">
                                        <div className="inline-block p-4 rounded-full bg-jaipur-sand/20 mb-6">
                                            <Gem className="w-16 h-16 text-jaipur-burgundy" strokeWidth={1} />
                                        </div>
                                        <h3 className="font-display text-3xl mb-2">Heritage Quality</h3>
                                        <p className="text-text-secondary mb-8">Authentic designs, verified for purity.</p>
                                        <button className="btn-primary w-full shadow-gold">Start Your Journey</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 px-4 bg-white relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-jaipur-gold/50 to-transparent"></div>

                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-display font-medium mb-4 text-text-primary">
                            Success <span className="italic text-jaipur-peacock">Stories</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                name: 'Priya Sharma',
                                role: 'Fashion Influencer',
                                quote: 'I started my jewelry store as a side hustle, now it\'s my full-time income. The platform is incredibly elegant.'
                            },
                            {
                                name: 'Rahul Kapoor',
                                role: 'Entrepreneur',
                                quote: 'Best business decision. Zero inventory headaches, and the Jaipuri designs fly off the shelves.'
                            },
                            {
                                name: 'Anjali Patel',
                                role: 'Store Owner',
                                quote: 'My customers love the quality. The automatic fulfillment saves me hours every day.'
                            },
                        ].map((testimonial, i) => (
                            <div key={i} className="card bg-bg-secondary border-none">
                                <div className="flex items-center gap-1 mb-6">
                                    {[...Array(5)].map((_, j) => (
                                        <Star key={j} className="w-4 h-4 fill-jaipur-gold text-jaipur-gold" />
                                    ))}
                                </div>
                                <p className="text-text-primary text-lg italic mb-6 leading-relaxed font-display">"{testimonial.quote}"</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-jaipur-terra/20 flex items-center justify-center font-display font-bold text-jaipur-terra">
                                        {testimonial.name[0]}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-text-primary text-sm">{testimonial.name}</div>
                                        <div className="text-xs text-text-secondary uppercase tracking-widest">{testimonial.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-jaipur-peacock z-0"></div>
                <div className="absolute inset-0 bg-[url('/lib/patterns/mandala-1.svg')] opacity-10 bg-center bg-cover z-0 animation-spin-slow"></div>

                <div className="max-w-4xl mx-auto relative z-10 text-center">
                    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 border border-white/20 shadow-2xl">
                        <Sparkles className="w-10 h-10 text-jaipur-gold mx-auto mb-6" />
                        <h2 className="text-4xl md:text-6xl font-display font-medium mb-6 text-white text-shadow-sm">
                            Ready to shine?
                        </h2>
                        <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
                            Join thousands of entrepreneurs building their jewelry empire.
                            Start for free, no credit card required.
                        </p>
                        <Link href="/register" className="inline-flex items-center gap-3 bg-white text-jaipur-peacock px-10 py-4 rounded-xl font-semibold text-lg hover:bg-jaipur-sand transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                            Create Your Store Now
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-text-primary text-white py-16 px-4 border-t-4 border-jaipur-gold">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-12 mb-12">
                        <div className="col-span-1 md:col-span-1">
                            <Link href="/" className="flex items-center gap-2 mb-6">
                                <Gem className="w-8 h-8 text-jaipur-gold" />
                                <span className="font-display text-2xl font-bold">JewelryHub</span>
                            </Link>
                            <p className="text-white/60 text-sm leading-relaxed mb-6">
                                Empowering entrepreneurs with India's finest jewelry craftsmanship and modern technology.
                            </p>
                            <div className="flex gap-4">
                                {/* Social icons placeholders */}
                                <div className="w-8 h-8 rounded-full bg-white/10 hover:bg-jaipur-gold/50 cursor-pointer transition-colors"></div>
                                <div className="w-8 h-8 rounded-full bg-white/10 hover:bg-jaipur-gold/50 cursor-pointer transition-colors"></div>
                                <div className="w-8 h-8 rounded-full bg-white/10 hover:bg-jaipur-gold/50 cursor-pointer transition-colors"></div>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-6 text-jaipur-sand">Platform</h4>
                            <ul className="space-y-3 text-sm text-white/60">
                                <li><Link href="#features" className="hover:text-jaipur-gold transition-colors">Features</Link></li>
                                <li><Link href="#pricing" className="hover:text-jaipur-gold transition-colors">Pricing</Link></li>
                                <li><Link href="/catalog" className="hover:text-jaipur-gold transition-colors">Product Catalog</Link></li>
                                <li><Link href="/themes" className="hover:text-jaipur-gold transition-colors">Store Themes</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-6 text-jaipur-sand">Resources</h4>
                            <ul className="space-y-3 text-sm text-white/60">
                                <li><Link href="/help" className="hover:text-jaipur-gold transition-colors">Help Center</Link></li>
                                <li><Link href="/blog" className="hover:text-jaipur-gold transition-colors">Reseller Blog</Link></li>
                                <li><Link href="/academy" className="hover:text-jaipur-gold transition-colors">Sales Academy</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-6 text-jaipur-sand">Legal</h4>
                            <ul className="space-y-3 text-sm text-white/60">
                                <li><Link href="/privacy" className="hover:text-jaipur-gold transition-colors">Privacy Policy</Link></li>
                                <li><Link href="/terms" className="hover:text-jaipur-gold transition-colors">Terms of Service</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-white/10 pt-8 text-center text-sm text-white/40 font-light flex justify-between items-center">
                        <span>© 2024 JewelryHub. All rights reserved.</span>
                        <span className="flex items-center gap-2">Made with <span className="text-jaipur-pink">♥</span> in Jaipur</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
