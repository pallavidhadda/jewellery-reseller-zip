'use client';

import { X, ShoppingBag, Minus, Plus, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { useCartStore } from '@/lib/store';
import { getThemeStyles } from '@/lib/theme-utils';

interface CartSidebarProps {
    open: boolean;
    onClose: () => void;
    slug: string;
    primaryColor?: string;
    theme?: string;
}

export default function CartSidebar({
    open,
    onClose,
    slug,
    primaryColor = '#1e3a34',
    theme = 'heritage'
}: CartSidebarProps) {
    const { items, removeItem, updateQuantity, total, itemCount } = useCartStore();
    const styles = getThemeStyles(theme);

    if (!open) return null;

    return (
        <div className={`fixed inset-0 z-[100] overflow-hidden ${styles.fontBody} text-neutral-900`}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
            <div className={`absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-left`}>
                {/* Header */}
                <div className="flex items-center justify-between p-8 border-b border-neutral-100">
                    <div>
                        <h2 className={`text-xl ${styles.fontDisplay} font-medium`} style={{ color: primaryColor }}>Your Selection</h2>
                        <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold mt-1">{itemCount()} items in cart</p>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 border border-neutral-100 rounded-full flex items-center justify-center hover:bg-neutral-50 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {items.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                        <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mb-6">
                            <ShoppingBag className="w-8 h-8 text-neutral-300" />
                        </div>
                        <h3 className={`text-lg ${styles.fontDisplay} mb-2`}>Cart is empty</h3>
                        <p className="text-sm text-neutral-400 font-light mb-8">Discover our curated collection and find your next masterpiece.</p>
                        <button
                            onClick={onClose}
                            className={`w-full max-w-xs py-3 text-white text-xs font-bold uppercase tracking-widest ${styles.buttonRadius} hover:opacity-90 transition-opacity`}
                            style={{ backgroundColor: primaryColor }}
                        >
                            Back to Boutique
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                            {items.map((item) => (
                                <div key={item.product_id} className="flex gap-6 items-center">
                                    <div className={`w-24 h-24 shrink-0 bg-neutral-50 ${styles.inputRadius} overflow-hidden border border-neutral-100`}>
                                        <img
                                            src={api.getMediaUrl(item.image)}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className={`${styles.fontDisplay} text-base font-medium mb-1 truncate`} style={{ color: primaryColor }}>{item.name}</h4>
                                        <p className="text-sm font-bold mb-4 opacity-70">
                                            ₹{item.price.toLocaleString()}
                                        </p>
                                        <div className="flex items-center gap-4">
                                            <div className={`flex items-center border border-neutral-100 ${styles.inputRadius} p-1`}>
                                                <button
                                                    onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                                                    className="w-6 h-6 flex items-center justify-center hover:bg-neutral-50 rounded"
                                                >
                                                    <Minus size={12} />
                                                </button>
                                                <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                                                    className="w-6 h-6 flex items-center justify-center hover:bg-neutral-50 rounded"
                                                >
                                                    <Plus size={12} />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.product_id)}
                                                className="text-[10px] uppercase tracking-widest font-bold text-red-400 hover:text-red-600 transition-colors"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-8 bg-neutral-50 border-t border-neutral-200">
                            <div className="flex items-center justify-between mb-8">
                                <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-400">Total Value</span>
                                <span className={`text-2xl ${styles.fontDisplay} font-medium`} style={{ color: primaryColor }}>₹{total().toLocaleString()}</span>
                            </div>
                            <Link
                                href={`/store/${slug}/checkout`}
                                className={`w-full flex items-center justify-center gap-3 h-14 text-white ${styles.buttonRadius} font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-opacity`}
                                style={{ backgroundColor: primaryColor }}
                            >
                                Proceed to Checkout <ArrowRight size={18} />
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
