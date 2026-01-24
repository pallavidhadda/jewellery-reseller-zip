'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Sparkles, Diamond, Store, TrendingUp, CreditCard,
    CheckCircle, ArrowRight, Star, ShoppingBag, Users,
    Palette, Globe, BarChart3, Headphones, ChevronRight,
    Play, Menu, X, Gem, Mail
} from 'lucide-react';

export default function HomePage() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-bg-primary text-text-primary overflow-x-hidden font-body theme-jaipur selection:bg-jaipur-gold/30">
            {/* Pattern Overlay */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
                style={{ backgroundImage: 'url("/lib/patterns/geometric-jali.svg")', backgroundSize: '150px' }} />

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-jaipur-gold/20 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 rounded-full bg-jaipur-burgundy flex items-center justify-center border border-jaipur-gold group-hover:scale-105 transition-transform shadow-lg shadow-jaipur-burgundy/20">
                                <Gem className="w-5 h-5 text-jaipur-gold" />
                            </div>
                            <span className="font-display text-2xl font-bold text-jaipur-burgundy tracking-tight">JewelryHub</span>
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center gap-8">
                            <Link href="#features" className="text-text-secondary hover:text-jaipur-burgundy font-medium text-sm transition-colors uppercase tracking-widest">Features</Link>
                            <Link href="#how-it-works" className="text-text-secondary hover:text-jaipur-burgundy font-medium text-sm transition-colors uppercase tracking-widest">How It Works</Link>
                            <Link href="/login" className="text-jaipur-burgundy font-bold text-sm transition-colors uppercase tracking-widest hover:underline decoration-jaipur-gold underline-offset-4">Sign In</Link>
                            <Link href="/register" className="px-6 py-2.5 bg-jaipur-burgundy text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-jaipur-burgundy/90 hover:shadow-lg hover:shadow-jaipur-burgundy/20 transition-all active:scale-95 border border-jaipur-burgundy">
                                Get Started
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 text-jaipur-burgundy hover:bg-jaipur-sand/20 rounded-lg transition-colors"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-white border-t border-jaipur-gold/20 animate-slide-down absolute w-full shadow-xl">
                        <div className="px-6 py-8 space-y-6">
                            <Link href="#features" className="block text-text-secondary hover:text-jaipur-burgundy font-medium text-center uppercase tracking-widest" onClick={() => setMobileMenuOpen(false)}>Features</Link>
                            <Link href="#how-it-works" className="block text-text-secondary hover:text-jaipur-burgundy font-medium text-center uppercase tracking-widest" onClick={() => setMobileMenuOpen(false)}>How It Works</Link>
                            <Link href="/login" className="block text-jaipur-burgundy font-bold text-center uppercase tracking-widest" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                            <Link href="/register" className="block w-full py-3 bg-jaipur-burgundy text-white rounded-full text-xs font-bold uppercase tracking-widest text-center shadow-lg" onClick={() => setMobileMenuOpen(false)}>
                                Get Started
                            </Link>
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4 overflow-hidden z-10 min-h-[90vh] flex items-center">
                <div className="absolute top-0 right-0 w-2/3 h-full opacity-5 bg-[url('/lib/patterns/mandala-1.svg')] bg-no-repeat bg-right-center bg-contain pointer-events-none animate-spin-slow" />

                <div className="max-w-7xl mx-auto relative w-full">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="text-left animate-slide-up max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-jaipur-gold/10 border border-jaipur-gold/30 mb-8 backdrop-blur-sm">
                                <Sparkles className="w-3 h-3 text-jaipur-burgundy" />
                                <span className="text-[10px] font-bold text-jaipur-burgundy uppercase tracking-[0.2em]">The Future of Jewelry Retail</span>
                            </div>

                            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-medium mb-8 leading-[0.9] text-jaipur-burgundy">
                                Launch Your <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-jaipur-gold to-amber-600 italic font-light pr-4">Luxury Brand</span>
                            </h1>

                            <p className="text-xl text-text-secondary mb-12 max-w-lg leading-relaxed font-light border-l-2 border-jaipur-gold/30 pl-6">
                                Curate stunning jewelry from India's finest artisans.
                                We handle inventory and logistics—you focus on building your legacy.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
                                <Link href="/register" className="bg-jaipur-burgundy text-white flex items-center justify-center gap-2 text-lg px-8 py-4 rounded-full font-semibold shadow-lg hover:bg-jaipur-burgundy/90 hover:shadow-jaipur-burgundy/25 transition-all w-full sm:w-auto min-w-[200px]">
                                    Start Selling Free
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                                <button className="flex items-center justify-center gap-2 text-lg px-8 py-4 bg-white hover:bg-jaipur-sand/10 border border-jaipur-gold/30 rounded-full font-light text-jaipur-burgundy w-full sm:w-auto transition-all backdrop-blur-sm">
                                    <Play className="w-5 h-5 text-jaipur-gold" />
                                    Watch Demo
                                </button>
                            </div>
                        </div>

                        {/* Hero Image / Visual */}
                        <div className="relative hidden lg:block animate-fade-in group perspective-1000">
                            <div className="absolute inset-0 bg-jaipur-gold/20 blur-[100px] rounded-full opacity-50"></div>

                            <div className="relative z-10 grid grid-cols-2 gap-6 transform rotate-y-12 rotate-x-6 group-hover:rotate-y-6 group-hover:rotate-x-3 transition-transform duration-700 ease-out">
                                <div className="space-y-6 pt-12">
                                    <div className="bg-white p-4 rounded-[2rem] shadow-2xl border border-white/40 backdrop-blur-sm">
                                        <div className="aspect-[4/5] bg-bg-secondary rounded-2xl overflow-hidden relative">
                                            <img src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1000&auto=format&fit=crop" alt="Jewelry" className="w-full h-full object-cover" />
                                            <div className="absolute bottom-4 left-4 right-4 p-3 bg-white/90 backdrop-blur-md rounded-xl border border-white/50 shadow-sm">
                                                <div className="flex justify-between items-end">
                                                    <div>
                                                        <p className="text-[10px] font-bold uppercase tracking-widest text-jaipur-burgundy">Kundan Choker</p>
                                                        <p className="font-display text-lg text-text-primary">₹45,000</p>
                                                    </div>
                                                    <div className="w-8 h-8 rounded-full bg-jaipur-burgundy text-jaipur-gold flex items-center justify-center">
                                                        <ArrowRight className="w-4 h-4" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="bg-jaipur-burgundy p-6 rounded-[2rem] shadow-2xl text-white border border-white/10 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-jaipur-gold/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
                                        <div className="relative z-10">
                                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-4 border border-white/20">
                                                <TrendingUp className="w-5 h-5 text-jaipur-gold" />
                                            </div>
                                            <div className="text-3xl font-display font-bold mb-1">₹1.2L+</div>
                                            <div className="text-white/60 text-xs font-bold uppercase tracking-widest">Avg. Monthly Profit</div>
                                        </div>
                                    </div>
                                    <div className="bg-white p-4 rounded-[2rem] shadow-2xl border border-white/40 backdrop-blur-sm">
                                        <div className="aspect-square bg-bg-secondary rounded-2xl overflow-hidden relative">
                                            <img src="https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=1000&auto=format&fit=crop" alt="Earrings" className="w-full h-full object-cover" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 px-4 bg-bg-secondary relative z-10 clip-path-slant-top">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20 max-w-3xl mx-auto">
                        <span className="text-jaipur-burgundy font-bold tracking-[0.2em] uppercase text-[10px] mb-4 block">Why Choose JewelryHub</span>
                        <h2 className="text-4xl md:text-6xl font-display font-medium mb-6 text-jaipur-burgundy">
                            Tradition Meets <span className="italic font-light text-jaipur-gold">Technology</span>
                        </h2>
                        <p className="text-lg text-text-secondary font-light max-w-2xl mx-auto">
                            The first platform empowering resellers with direct access to India's finest jewelry manufacturers.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: CrownIcon,
                                title: 'Royal Heritage',
                                description: 'Authentic Polki and Kundan designs sourced directly from Jaipur\'s master artisans.',
                            },
                            {
                                icon: Store,
                                title: 'Zero Inventory',
                                description: 'Start your brand without buying stock. We ship directly to your customers in your packaging.',
                            },
                            {
                                icon: Diamond,
                                title: 'Premium Quality',
                                description: 'Every piece is hallmarked and certified, ensuring trust and lasting value for your clients.',
                            },
                        ].map((feature, i) => (
                            <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-border-light shadow-sm hover:shadow-xl hover:border-jaipur-gold/30 hover:-translate-y-2 transition-all duration-500 group">
                                <div className="w-16 h-16 rounded-2xl bg-bg-secondary flex items-center justify-center mb-8 group-hover:bg-jaipur-burgundy transition-colors duration-500">
                                    <feature.icon className="w-8 h-8 text-jaipur-burgundy group-hover:text-jaipur-gold transition-colors duration-500" strokeWidth={1.5} />
                                </div>
                                <h3 className="text-2xl font-display font-medium mb-4 text-jaipur-burgundy">{feature.title}</h3>
                                <p className="text-text-secondary leading-relaxed font-light">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-24 px-4 relative bg-white">
                <div className="max-w-7xl mx-auto relative">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="order-2 md:order-1">
                            <span className="text-jaipur-burgundy font-bold tracking-[0.2em] uppercase text-[10px] mb-3 block">The Process</span>
                            <h2 className="text-4xl md:text-5xl font-display font-medium mb-8 text-jaipur-burgundy">
                                Launch in <span className="italic font-light text-jaipur-gold">3 Steps</span>
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
                                    <div key={i} className="flex gap-6 relative group">
                                        {i < 2 && <div className="absolute left-6 top-16 bottom-[-48px] w-px bg-border-medium border-l border-dashed border-jaipur-gold/30"></div>}
                                        <div className="w-12 h-12 rounded-full bg-white border border-jaipur-gold/30 flex items-center justify-center shrink-0 z-10 shadow-sm group-hover:bg-jaipur-gold group-hover:text-white group-hover:border-jaipur-gold transition-all duration-300">
                                            <span className="font-display font-bold text-jaipur-gold group-hover:text-white text-lg transition-colors">{step.step}</span>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold mb-2 text-jaipur-burgundy">{step.title}</h3>
                                            <p className="text-text-secondary max-w-md font-light text-sm leading-relaxed">{step.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative order-1 md:order-2">
                            <div className="aspect-[4/5] rounded-tl-[100px] rounded-br-[100px] bg-jaipur-sand/20 overflow-hidden border border-jaipur-sand/30 p-8">
                                <div className="h-full w-full bg-white rounded-tl-[80px] rounded-br-[80px] shadow-2xl border border-border-light flex flex-col items-center justify-center text-center p-8 relative overflow-hidden group">
                                    <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[url('/lib/patterns/mandala-1.svg')] bg-cover group-hover:scale-110 transition-transform duration-700"></div>
                                    <div className="relative z-10">
                                        <div className="inline-block p-4 rounded-full bg-bg-secondary mb-6 border border-border-light group-hover:rotate-12 transition-transform duration-500">
                                            <Gem className="w-16 h-16 text-jaipur-burgundy" strokeWidth={0.8} />
                                        </div>
                                        <h3 className="font-display text-3xl mb-2 text-jaipur-burgundy">Heritage Quality</h3>
                                        <p className="text-text-secondary mb-8 font-light">Authentic designs, verified for purity.</p>
                                        <Link href="/register" className="bg-jaipur-burgundy text-white px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-jaipur-burgundy/90 transition-all shadow-gold inline-flex justify-center items-center">
                                            Start Your Journey
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 px-4 bg-bg-secondary relative">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-display font-medium mb-4 text-jaipur-burgundy">
                            Success <span className="italic text-jaipur-gold">Stories</span>
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
                            <div key={i} className="bg-white p-8 rounded-[2rem] border border-border-light hover:border-jaipur-gold/30 hover:shadow-lg transition-all duration-300">
                                <div className="flex items-center gap-1 mb-6">
                                    {[...Array(5)].map((_, j) => (
                                        <Star key={j} className="w-3 h-3 fill-jaipur-gold text-jaipur-gold" />
                                    ))}
                                </div>
                                <p className="text-text-primary text-lg italic mb-6 leading-relaxed font-display font-light">"{testimonial.quote}"</p>
                                <div className="flex items-center gap-4 border-t border-border-light pt-6">
                                    <div className="w-10 h-10 rounded-full bg-jaipur-sand/30 flex items-center justify-center font-display font-bold text-jaipur-burgundy border border-jaipur-gold/20">
                                        {testimonial.name[0]}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-jaipur-burgundy text-sm">{testimonial.name}</div>
                                        <div className="text-xs text-text-secondary uppercase tracking-widest">{testimonial.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-4 relative overflow-hidden bg-jaipur-burgundy">
                <div className="absolute inset-0 bg-[url('/lib/patterns/mandala-1.svg')] opacity-5 bg-center bg-cover z-0 animate-mandala"></div>

                <div className="max-w-4xl mx-auto relative z-10 text-center">
                    <div className="bg-white/5 backdrop-blur-md rounded-3xl p-12 border border-white/10 shadow-2xl">
                        <Sparkles className="w-10 h-10 text-jaipur-gold mx-auto mb-6" />
                        <h2 className="text-4xl md:text-6xl font-display font-medium mb-6 text-white text-shadow-sm">
                            Ready to shine?
                        </h2>
                        <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
                            Join thousands of entrepreneurs building their jewelry empire.
                            Start for free, no credit card required.
                        </p>
                        <Link href="/register" className="inline-flex items-center gap-3 bg-white text-jaipur-burgundy px-10 py-4 rounded-xl font-semibold text-lg hover:bg-jaipur-sand transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                            Create Your Store Now
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-neutral-900 text-white py-16 px-4 border-t-2 border-jaipur-gold">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-12 mb-12">
                        <div className="col-span-1 md:col-span-1">
                            <Link href="/" className="flex items-center gap-2 mb-6">
                                <Gem className="w-8 h-8 text-jaipur-gold" />
                                <span className="font-display text-2xl font-bold tracking-wide">JewelryHub</span>
                            </Link>
                            <p className="text-white/60 text-sm leading-relaxed mb-6 font-light">
                                Empowering entrepreneurs with India's finest jewelry craftsmanship and modern technology.
                            </p>
                            <div className="flex gap-4">
                                {/* Social icons placeholders */}
                                <div className="w-8 h-8 rounded-full bg-white/5 hover:bg-jaipur-gold/20 hover:text-jaipur-gold cursor-pointer transition-colors border border-white/10 flex items-center justify-center">
                                    <Globe className="w-4 h-4" />
                                </div>
                                <div className="w-8 h-8 rounded-full bg-white/5 hover:bg-jaipur-gold/20 hover:text-jaipur-gold cursor-pointer transition-colors border border-white/10 flex items-center justify-center">
                                    <Mail className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-6 text-jaipur-sand font-display text-lg">Platform</h4>
                            <ul className="space-y-3 text-sm text-white/50 font-light">
                                <li><Link href="#features" className="hover:text-jaipur-gold transition-colors">Features</Link></li>
                                <li><Link href="#pricing" className="hover:text-jaipur-gold transition-colors">Pricing</Link></li>
                                <li><Link href="/catalog" className="hover:text-jaipur-gold transition-colors">Product Catalog</Link></li>
                                <li><Link href="/themes" className="hover:text-jaipur-gold transition-colors">Store Themes</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-6 text-jaipur-sand font-display text-lg">Resources</h4>
                            <ul className="space-y-3 text-sm text-white/50 font-light">
                                <li><Link href="/help" className="hover:text-jaipur-gold transition-colors">Help Center</Link></li>
                                <li><Link href="/blog" className="hover:text-jaipur-gold transition-colors">Reseller Blog</Link></li>
                                <li><Link href="/academy" className="hover:text-jaipur-gold transition-colors">Sales Academy</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-6 text-jaipur-sand font-display text-lg">Legal</h4>
                            <ul className="space-y-3 text-sm text-white/50 font-light">
                                <li><Link href="/privacy" className="hover:text-jaipur-gold transition-colors">Privacy Policy</Link></li>
                                <li><Link href="/terms" className="hover:text-jaipur-gold transition-colors">Terms of Service</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-white/10 pt-8 text-center text-sm text-white/30 font-light flex flex-col md:flex-row justify-between items-center gap-4">
                        <span>© 2024 JewelryHub. All rights reserved.</span>
                        <span className="flex items-center gap-2">Made with <span className="text-jaipur-burgundy">♥</span> in Jaipur</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function CrownIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
        </svg>
    )
}
