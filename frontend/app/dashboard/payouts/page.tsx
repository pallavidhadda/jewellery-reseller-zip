'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Diamond, LayoutDashboard, ShoppingBag, Package,
    CreditCard, Settings, LogOut, Menu, X, DollarSign,
    TrendingUp, ArrowDownToLine, History, Check, AlertCircle,
    Loader2
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import api from '@/lib/api';

interface PayoutBalance {
    available: number;
    pending: number;
    total_paid: number;
    total_earned: number;
}

interface PayoutRecord {
    id: number;
    amount: number;
    status: string;
    payment_method: string;
    requested_at: string;
    completed_at?: string;
}

export default function PayoutsPage() {
    const router = useRouter();
    const { reseller, logout } = useAuthStore();
    const [balance, setBalance] = useState<PayoutBalance | null>(null);
    const [history, setHistory] = useState<PayoutRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [requesting, setRequesting] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [balanceData, historyData] = await Promise.all([
                api.getPayoutBalance(),
                api.getPayouts()
            ]);
            setBalance(balanceData as PayoutBalance);
            setHistory(historyData as PayoutRecord[]);
        } catch (err) {
            console.error('Failed to load payout data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRequestPayout = async () => {
        if (!balance || balance.available < 100) {
            setMessage({ type: 'error', text: 'Minimum payout is ₹100' });
            return;
        }

        setRequesting(true);
        setMessage(null);
        try {
            await api.requestPayout();
            setMessage({ type: 'success', text: 'Payout request submitted successfully!' });
            loadData();
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || 'Failed to request payout' });
        } finally {
            setRequesting(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        logout();
        router.push('/');
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending': return 'bg-amber-500/20 text-amber-400';
            case 'processing': return 'bg-blue-500/20 text-blue-400';
            case 'completed': return 'bg-emerald-500/20 text-emerald-400';
            case 'failed': return 'bg-red-500/20 text-red-400';
            default: return 'bg-white/10 text-white/60';
        }
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
        { icon: ShoppingBag, label: 'Products', href: '/dashboard/products' },
        { icon: Package, label: 'Orders', href: '/dashboard/orders' },
        { icon: CreditCard, label: 'Payouts', href: '/dashboard/payouts', active: true },
        { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
    ];

    return (
        <div className="min-h-screen flex">
            {/* Sidebar (same as dashboard) */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/5 backdrop-blur-lg border-r border-white/10 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center gap-3 p-6 border-b border-white/10">
                    <Diamond className="w-8 h-8 text-purple-400" />
                    <span className="font-display text-xl font-bold">JewelryHub</span>
                </div>
                <nav className="p-4 space-y-1">
                    {navItems.map((item) => (
                        <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${item.active ? 'bg-purple-500/20 text-purple-300' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </Link>
                    ))}
                </nav>
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
                    <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-white/60 hover:bg-white/5 hover:text-white transition-colors">
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </button>
                </div>
            </aside>

            <main className="flex-1 lg:ml-64">
                <header className="sticky top-0 z-30 glass border-b border-white/10 px-4 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button className="lg:hidden text-white p-2" onClick={() => setSidebarOpen(!sidebarOpen)}>
                                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                            <div>
                                <h1 className="text-xl font-semibold">Payouts</h1>
                                <p className="text-sm text-white/50">Manage your earnings and withdrawals</p>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-4 lg:p-8">
                    {message && (
                        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300' : 'bg-red-500/20 border border-red-500/50 text-red-300'}`}>
                            {message.type === 'success' ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                            {message.text}
                            <button onClick={() => setMessage(null)} className="ml-auto">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : (
                        <>
                            <div className="grid md:grid-cols-3 gap-6 mb-8">
                                <div className="card bg-purple-500/10 border-purple-500/30">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-sm text-purple-300/70">Available Balance</p>
                                        <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                            <DollarSign className="w-4 h-4 text-purple-400" />
                                        </div>
                                    </div>
                                    <p className="text-3xl font-bold mb-4">₹{(balance?.available || 0).toLocaleString()}</p>
                                    <button
                                        onClick={handleRequestPayout}
                                        disabled={requesting || (balance?.available || 0) < 100}
                                        className="btn-primary w-full text-sm flex items-center justify-center gap-2"
                                    >
                                        {requesting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowDownToLine className="w-4 h-4" />}
                                        Withdraw Funds
                                    </button>
                                </div>

                                <div className="card">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-sm text-white/40">Total Earned</p>
                                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                                            <TrendingUp className="w-4 h-4 text-emerald-400" />
                                        </div>
                                    </div>
                                    <p className="text-3xl font-bold">₹{(balance?.total_earned || 0).toLocaleString()}</p>
                                    <p className="text-xs text-white/30 mt-2">Commission from delivered orders</p>
                                </div>

                                <div className="card">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-sm text-white/40">Total Withdrawn</p>
                                        <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center">
                                            <History className="w-4 h-4 text-pink-400" />
                                        </div>
                                    </div>
                                    <p className="text-3xl font-bold">₹{(balance?.total_paid || 0).toLocaleString()}</p>
                                    <p className="text-xs text-white/30 mt-2">Paid out to your bank account</p>
                                </div>
                            </div>

                            <h2 className="text-lg font-semibold mb-4">Payout History</h2>
                            <div className="card overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-white/10 bg-white/5">
                                                <th className="px-6 py-4 text-sm font-semibold text-white/60">Date</th>
                                                <th className="px-6 py-4 text-sm font-semibold text-white/60">Method</th>
                                                <th className="px-6 py-4 text-sm font-semibold text-white/60">Status</th>
                                                <th className="px-6 py-4 text-sm font-semibold text-white/60 text-right">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {history.length === 0 ? (
                                                <tr>
                                                    <td colSpan={4} className="px-6 py-12 text-center text-white/40">
                                                        No payout history found
                                                    </td>
                                                </tr>
                                            ) : (
                                                history.map((record) => (
                                                    <tr key={record.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                                                        <td className="px-6 py-4 text-sm">
                                                            {new Date(record.requested_at).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm capitalize">
                                                            {record.payment_method.replace('_', ' ')}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                                                                {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-right font-medium">
                                                            ₹{record.amount.toLocaleString()}
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
