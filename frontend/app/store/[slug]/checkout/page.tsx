'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CreditCard, Truck, Shield, Loader2, CheckCircle } from 'lucide-react';
import api from '@/lib/api';
import { useCartStore } from '@/lib/store';

export default function CheckoutPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;
    const { items, total, clearCart } = useCartStore();

    const [loading, setLoading] = useState(false);
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

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Placed!</h1>
                    <p className="text-gray-600 mb-4">
                        Thank you for your order. Your order number is:
                    </p>
                    <p className="text-xl font-mono font-bold text-purple-600 mb-6">{orderNumber}</p>
                    <p className="text-sm text-gray-500 mb-8">
                        We've sent a confirmation email to {formData.customer_email}
                    </p>
                    <Link
                        href={`/store/${slug}`}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
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
        <div className="min-h-screen bg-gray-50 text-gray-900">
            {/* Header */}
            <header className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <Link href={`/store/${slug}`} className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900">
                        <ArrowLeft className="w-5 h-5" />
                        Back to Store
                    </Link>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Form */}
                    <div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                                    {error}
                                </div>
                            )}

                            {/* Contact Info */}
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h2 className="font-semibold text-lg mb-4">Contact Information</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                                        <input
                                            type="text"
                                            name="customer_name"
                                            value={formData.customer_name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                            <input
                                                type="email"
                                                name="customer_email"
                                                value={formData.customer_email}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-2.5 bg-white text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                                            <input
                                                type="tel"
                                                name="customer_phone"
                                                value={formData.customer_phone}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-2.5 bg-white text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h2 className="font-semibold text-lg mb-4">Shipping Address</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1 *</label>
                                        <input
                                            type="text"
                                            name="shipping_address_line1"
                                            value={formData.shipping_address_line1}
                                            onChange={handleChange}
                                            required
                                            placeholder="House/Flat No., Building Name, Street"
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                                        <input
                                            type="text"
                                            name="shipping_address_line2"
                                            value={formData.shipping_address_line2}
                                            onChange={handleChange}
                                            placeholder="Landmark, Area"
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                                            <input
                                                type="text"
                                                name="shipping_city"
                                                value={formData.shipping_city}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-2.5 bg-white text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                                            <input
                                                type="text"
                                                name="shipping_state"
                                                value={formData.shipping_state}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-2.5 bg-white text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">PIN Code *</label>
                                            <input
                                                type="text"
                                                name="shipping_postal_code"
                                                value={formData.shipping_postal_code}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-2.5 bg-white text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                            <select
                                                name="shipping_country"
                                                value={formData.shipping_country}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2.5 bg-white text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                                            >
                                                <option value="India">India</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h2 className="font-semibold text-lg mb-4">Order Notes (Optional)</h2>
                                <textarea
                                    name="customer_notes"
                                    value={formData.customer_notes}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder="Any special instructions for delivery..."
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <CreditCard className="w-5 h-5" />
                                        Place Order - ₹{grandTotal.toLocaleString()}
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div>
                        <div className="bg-white rounded-xl p-6 shadow-sm sticky top-8">
                            <h2 className="font-semibold text-lg mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                {items.map((item) => (
                                    <div key={item.product_id} className="flex gap-4">
                                        <img
                                            src={item.image || 'https://via.placeholder.com/80'}
                                            alt={item.name}
                                            className="w-16 h-16 rounded-lg object-cover"
                                        />
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900 line-clamp-1">{item.name}</h4>
                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t pt-4 space-y-3">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className="text-green-600">Free</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>GST (18%)</span>
                                    <span>₹{tax.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold pt-3 border-t">
                                    <span>Total</span>
                                    <span>₹{grandTotal.toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Trust Badges */}
                            <div className="mt-6 pt-6 border-t grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <Truck className="w-6 h-6 mx-auto text-gray-400 mb-1" />
                                    <p className="text-xs text-gray-500">Free Shipping</p>
                                </div>
                                <div>
                                    <Shield className="w-6 h-6 mx-auto text-gray-400 mb-1" />
                                    <p className="text-xs text-gray-500">Secure Payment</p>
                                </div>
                                <div>
                                    <CreditCard className="w-6 h-6 mx-auto text-gray-400 mb-1" />
                                    <p className="text-xs text-gray-500">COD Available</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
