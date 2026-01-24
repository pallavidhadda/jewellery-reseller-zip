'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CreditCard, Truck, Shield, Loader2, CheckCircle, Gem } from 'lucide-react';
import api from '@/lib/api';
import { useCartStore } from '@/lib/store';
import { getThemeStyles } from '@/lib/theme-utils';

export default function CheckoutPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;
    const { items, total, clearCart } = useCartStore();

    const [loading, setLoading] = useState(false);
    const [initializing, setInitializing] = useState(true);
    const [store, setStore] = useState<any>(null);
    const [success, setSuccess] = useState(false);
    const [orderNumber, setOrderNumber] = useState('');
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        shipping_address_line1: '',
        shipping_address_line2: '',
        shipping_city: '',
        shipping_state: '',
        shipping_postal_code: '',
        shipping_country: 'India',
        customer_notes: '',
    });

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
            setInitializing(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const orderData = {
                ...formData,
                items: items.map((item) => ({
                    product_id: item.product_id,
                    quantity: item.quantity,
                })),
            };

            const result = await api.createOrder(slug, orderData) as any;
            setOrderNumber(result.order_number);
            setSuccess(true);
            clearCart();
        } catch (err: any) {
            setError(err.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    const subtotal = total();
    const shipping = 0; // Free shipping
    const tax = subtotal * 0.18;
    const grandTotal = subtotal + shipping + tax;

    // Default primary color fallback
    const primaryColor = store?.store?.accent_color || store?.store?.primary_color || '#722F37';
    const theme = store?.config?.theme || 'heritage';
    const styles = getThemeStyles(theme);

    if (initializing) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 text-neutral-900">
                <div className="w-8 h-8 border-2 border-neutral-300 border-t-neutral-800 rounded-full animate-spin" />
            </div>
        );
    }

    if (success) {
        return (
            <div className={`min-h-screen bg-gray-50 flex items-center justify-center p-4 ${styles.fontBody} text-neutral-900`}>
                <div className={`bg-white ${styles.cardRadius} shadow-lg p-8 max-w-md w-full text-center transition-all`}>
                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h1 className={`text-2xl ${styles.fontDisplay} font-medium text-gray-900 mb-2`}>Order Confirmed</h1>
                    <p className="text-gray-600 mb-4 text-sm font-light">
                        Thank you for your purchase. Your order number is:
                    </p>
                    <p className="text-xl font-mono font-bold mb-6" style={{ color: primaryColor }}>{orderNumber}</p>
                    <p className="text-xs text-gray-400 mb-8 uppercase tracking-widest">
                        Check your email {formData.customer_email} for details
                    </p>
                    <Link
                        href={`/store/${slug}`}
                        className={`inline-flex items-center gap-2 px-8 py-3 text-white ${styles.buttonRadius} text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all`}
                        style={{ backgroundColor: primaryColor }}
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        router.push(`/store/${slug}`);
        return null;
    }

    return (
        <div className={`min-h-screen bg-[#FDFCFB] text-neutral-900 ${styles.fontBody}`}>
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-neutral-100 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href={`/store/${slug}`} className="inline-flex items-center gap-2 text-neutral-500 hover:text-neutral-900 transition-colors uppercase tracking-widest text-[10px] font-bold">
                        <ArrowLeft className="w-4 h-4" />
                        Return to Boutique
                    </Link>
                    <div className="flex items-center gap-2 opacity-50">
                        <Shield size={12} />
                        <span className="text-[10px] uppercase tracking-widest font-bold">Secure Checkout</span>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex items-center gap-3 mb-8">
                    <Gem className="w-6 h-6" style={{ color: primaryColor }} />
                    <h1 className={`text-3xl ${styles.fontDisplay} font-medium text-neutral-900`}>Checkout</h1>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Form */}
                    <div>
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {error && (
                                <div className={`p-4 bg-red-50 border border-red-100 ${styles.borderRadius} text-red-700 text-sm`}>
                                    {error}
                                </div>
                            )}

                            {/* Contact Info */}
                            <div className={`bg-white ${styles.cardRadius} p-8 shadow-sm border border-neutral-100`}>
                                <h2 className={`${styles.fontDisplay} text-lg font-medium mb-6`}>Contact Information</h2>
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            name="customer_name"
                                            value={formData.customer_name}
                                            onChange={handleChange}
                                            required
                                            className={`w-full px-5 py-3 border border-neutral-200 ${styles.inputRadius} focus:outline-none focus:ring-1 transition-all text-sm`}
                                            style={{ outlineColor: primaryColor }}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Email</label>
                                            <input
                                                type="email"
                                                name="customer_email"
                                                value={formData.customer_email}
                                                onChange={handleChange}
                                                required
                                                className={`w-full px-5 py-3 border border-neutral-200 ${styles.inputRadius} focus:outline-none focus:ring-1 transition-all text-sm`}
                                                style={{ outlineColor: primaryColor }}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Phone</label>
                                            <input
                                                type="tel"
                                                name="customer_phone"
                                                value={formData.customer_phone}
                                                onChange={handleChange}
                                                required
                                                className={`w-full px-5 py-3 border border-neutral-200 ${styles.inputRadius} focus:outline-none focus:ring-1 transition-all text-sm`}
                                                style={{ outlineColor: primaryColor }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className={`bg-white ${styles.cardRadius} p-8 shadow-sm border border-neutral-100`}>
                                <h2 className={`${styles.fontDisplay} text-lg font-medium mb-6`}>Shipping Address</h2>
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Address Line 1</label>
                                        <input
                                            type="text"
                                            name="shipping_address_line1"
                                            value={formData.shipping_address_line1}
                                            onChange={handleChange}
                                            required
                                            placeholder="House/Flat No., Building Name, Street"
                                            className={`w-full px-5 py-3 border border-neutral-200 ${styles.inputRadius} focus:outline-none focus:ring-1 transition-all text-sm`}
                                            style={{ outlineColor: primaryColor }}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Address Line 2</label>
                                        <input
                                            type="text"
                                            name="shipping_address_line2"
                                            value={formData.shipping_address_line2}
                                            onChange={handleChange}
                                            placeholder="Landmark, Area"
                                            className={`w-full px-5 py-3 border border-neutral-200 ${styles.inputRadius} focus:outline-none focus:ring-1 transition-all text-sm`}
                                            style={{ outlineColor: primaryColor }}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">City</label>
                                            <input
                                                type="text"
                                                name="shipping_city"
                                                value={formData.shipping_city}
                                                onChange={handleChange}
                                                required
                                                className={`w-full px-5 py-3 border border-neutral-200 ${styles.inputRadius} focus:outline-none focus:ring-1 transition-all text-sm`}
                                                style={{ outlineColor: primaryColor }}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">State</label>
                                            <input
                                                type="text"
                                                name="shipping_state"
                                                value={formData.shipping_state}
                                                onChange={handleChange}
                                                required
                                                className={`w-full px-5 py-3 border border-neutral-200 ${styles.inputRadius} focus:outline-none focus:ring-1 transition-all text-sm`}
                                                style={{ outlineColor: primaryColor }}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">PIN Code</label>
                                            <input
                                                type="text"
                                                name="shipping_postal_code"
                                                value={formData.shipping_postal_code}
                                                onChange={handleChange}
                                                required
                                                className={`w-full px-5 py-3 border border-neutral-200 ${styles.inputRadius} focus:outline-none focus:ring-1 transition-all text-sm`}
                                                style={{ outlineColor: primaryColor }}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Country</label>
                                            <select
                                                name="shipping_country"
                                                value={formData.shipping_country}
                                                onChange={handleChange}
                                                className={`w-full px-5 py-3 border border-neutral-200 ${styles.inputRadius} focus:outline-none focus:ring-1 transition-all text-sm`}
                                                style={{ outlineColor: primaryColor }}
                                            >
                                                <option value="India">India</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Notes */}
                            <div className={`bg-white ${styles.cardRadius} p-8 shadow-sm border border-neutral-100`}>
                                <h2 className={`${styles.fontDisplay} text-lg font-medium mb-6`}>Delivery Instructions</h2>
                                <textarea
                                    name="customer_notes"
                                    value={formData.customer_notes}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder="Any special requests..."
                                    className={`w-full px-5 py-3 border border-neutral-200 ${styles.inputRadius} focus:outline-none focus:ring-1 transition-all text-sm`}
                                    style={{ outlineColor: primaryColor }}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-5 text-white ${styles.buttonRadius} font-bold uppercase tracking-widest text-xs hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50`}
                                style={{ backgroundColor: primaryColor }}
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <CreditCard className="w-5 h-5" />
                                        Confirm Order - ₹{grandTotal.toLocaleString()}
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div>
                        <div className={`bg-white ${styles.cardRadius} p-8 shadow-xl border border-neutral-100 sticky top-28`}>
                            <h2 className={`${styles.fontDisplay} text-lg font-medium mb-8 pb-4 border-b border-neutral-100`}>Your Selection</h2>

                            <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                                {items.map((item) => (
                                    <div key={item.product_id} className="flex gap-4">
                                        <div className={`w-16 h-16 ${styles.inputRadius} bg-neutral-50 overflow-hidden shrink-0 border border-neutral-100`}>
                                            <img
                                                src={item.image || 'https://via.placeholder.com/80'}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className={`${styles.fontDisplay} text-sm font-medium text-neutral-900 line-clamp-1`}>{item.name}</h4>
                                            <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold mt-1">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-sm" style={{ color: primaryColor }}>₹{(item.price * item.quantity).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 pt-6 border-t border-neutral-100">
                                <div className="flex justify-between text-sm text-neutral-500">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm text-neutral-500">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-bold text-xs uppercase tracking-widest">Complimentary</span>
                                </div>
                                <div className="flex justify-between text-sm text-neutral-500">
                                    <span>GST (18%)</span>
                                    <span>₹{tax.toLocaleString()}</span>
                                </div>
                                <div className={`flex justify-between text-xl ${styles.fontDisplay} font-medium pt-4 mt-2 border-t border-neutral-100`}>
                                    <span>Total</span>
                                    <span style={{ color: primaryColor }}>₹{grandTotal.toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Trust Badges */}
                            <div className="mt-8 pt-6 border-t border-neutral-100 grid grid-cols-3 gap-2 text-center opacity-60">
                                <div>
                                    <Truck className="w-5 h-5 mx-auto mb-2" style={{ color: primaryColor }} />
                                    <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-500">Global Shipping</p>
                                </div>
                                <div>
                                    <Shield className="w-5 h-5 mx-auto mb-2" style={{ color: primaryColor }} />
                                    <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-500">Secure Vault</p>
                                </div>
                                <div>
                                    <CreditCard className="w-5 h-5 mx-auto mb-2" style={{ color: primaryColor }} />
                                    <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-500">All Cards</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
