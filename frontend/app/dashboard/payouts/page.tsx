'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Diamond, LayoutDashboard, ShoppingBag, Package,
    CreditCard, Settings, LogOut, Menu, X, DollarSign,
    TrendingUp, ArrowDownToLine, History, Check, AlertCircle,
    Loader2, Gem
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
            // Safe data handling
            const historyList = Array.isArray(historyData) ? historyData : (historyData as any).items || [];
            setHistory(historyList as PayoutRecord[]);
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
            case 'pending': return 'bg-amber-500/10 text-amber-600 border border-amber-200';
            case 'processing': return 'bg-blue-500/10 text-blue-600 border border-blue-200';
            case 'completed': return 'bg-emerald-500/10 text-emerald-600 border border-emerald-200';
            case 'failed': return 'bg-red-500/10 text-red-600 border border-red-200';
            default: return 'bg-bg-secondary text-text-muted border border-border-light';
        }
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
        { icon: ShoppingBag, label: 'Products', href: '/dashboard/products' },
        { icon: Package, label: 'Orders', href: '/dashboard/orders' },
        { icon: CreditCard, label: 'Payouts', href: '/dashboard/payouts', active: true },
        { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
    ];

    return (
        <div className="min-h-screen flex bg-bg-secondary font-body">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-jaipur-burgundy text-white transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} shadow-2xl`}>
                <div className="flex items-center gap-3 p-6 border-b border-white/5">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                        <Gem className="w-5 h-5 text-jaipur-gold" />
                    </div>
                    <div>
                        <span className="font-display text-xl font-medium tracking-tight">JewelryHub</span>
                        <span className="block text-[10px] text-jaipur-gold/70 uppercase tracking-[0.2em] font-bold">Reseller</span>
                    </div>
                </div>

                <nav className="p-4 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-500 ${item.active
                                ? 'bg-white/10 text-white border border-white/10 shadow-lg'
                                : 'text-white/50 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <item.icon className={`w-4 h-4 ${item.active ? 'text-jaipur-gold' : ''}`} />
                            <span className="text-sm font-medium tracking-wide">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="absolute bottom-6 left-0 right-0 p-4">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-white/40 hover:bg-white/5 hover:text-white transition-all duration-300"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm font-medium">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Main content */}
            <main className="flex-1 lg:ml-64 relative min-h-screen">
                <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-border-light px-6 lg:px-10 py-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <button className="lg:hidden text-text-primary p-2 hover:bg-bg-secondary rounded-lg transition-colors" onClick={() => setSidebarOpen(!sidebarOpen)}>
                                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                            <div>
                                <h1 className="text-2xl font-display font-medium text-text-primary tracking-tight">Payouts</h1>
                                <p className="text-xs text-text-muted font-light uppercase tracking-widest mt-1">Manage your earnings and withdrawals</p>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-6 lg:p-10 relative z-10 max-w-7xl mx-auto">
                    {message && (
                        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600' : 'bg-red-500/10 border border-red-500/20 text-red-600'}`}>
                            {message.type === 'success' ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                            {message.text}
                            <button onClick={() => setMessage(null)} className="ml-auto">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="w-8 h-8 border-[3px] border-jaipur-gold/20 border-t-jaipur-gold rounded-full animate-spin" />
                        </div>
                    ) : (
                        <>
                            <div className="grid md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-jaipur-burgundy rounded-[2rem] p-6 text-white relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 blur-xl" />
                                    <div className="flex items-center justify-between mb-4">
                                        <p className="text-sm font-medium text-white/80">Available Balance</p>
                                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                            <DollarSign className="w-5 h-5 text-jaipur-gold" />
                                        </div>
                                    </div>
                                    <p className="text-3xl font-display font-bold mb-6">₹{(balance?.available || 0).toLocaleString()}</p>
                                    <button
                                        onClick={handleRequestPayout}
                                        disabled={requesting || (balance?.available || 0) < 100}
                                        className="w-full py-3 bg-white text-jaipur-burgundy rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-jaipur-gold hover:text-white transition-all shadow-lg flex items-center justify-center gap-2"
                                    >
                                        {requesting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowDownToLine className="w-4 h-4" />}
                                        Withdraw Funds
                                    </button>
                                </div>

                                <div className="bg-white rounded-[2rem] border border-border-light p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <p className="text-sm font-medium text-text-muted">Total Earned</p>
                                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                            <TrendingUp className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <p className="text-3xl font-display font-bold text-text-primary">₹{(balance?.total_earned || 0).toLocaleString()}</p>
                                    <p className="text-xs text-text-muted mt-2 font-light">Commission from delivered orders</p>
                                </div>

                                <div className="bg-white rounded-[2rem] border border-border-light p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <p className="text-sm font-medium text-text-muted">Total Withdrawn</p>
                                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                                            <History className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <p className="text-3xl font-display font-bold text-text-primary">₹{(balance?.total_paid || 0).toLocaleString()}</p>
                                    <p className="text-xs text-text-muted mt-2 font-light">Paid out to your bank account</p>
                                </div>
                            </div>

                            <h2 className="text-lg font-display font-medium mb-4 text-text-primary">Payout History</h2>
                            <div className="bg-white rounded-[2rem] border border-border-light overflow-hidden shadow-sm">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-border-light bg-bg-secondary/50">
                                                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-widest">Date</th>
                                                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-widest">Method</th>
                                                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-widest">Status</th>
                                                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-widest text-right">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {history.length === 0 ? (
                                                <tr>
                                                    <td colSpan={4} className="px-6 py-12 text-center text-text-muted font-light italic">
                                                        No payout history found
                                                    </td>
                                                </tr>
                                            ) : (
                                                history.map((record) => (
                                                    <tr key={record.id} className="border-b border-border-light hover:bg-bg-secondary/30 transition-colors">
                                                        <td className="px-6 py-4 text-sm font-medium text-text-primary">
                                                            {new Date(record.requested_at).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm capitalize text-text-secondary">
                                                            {record.payment_method.replace('_', ' ')}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${getStatusColor(record.status)}`}>
                                                                {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-right font-bold text-text-primary">
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
