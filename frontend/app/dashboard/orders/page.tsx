'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Diamond, LayoutDashboard, ShoppingBag, Package,
    CreditCard, Settings, LogOut, Menu, X, Search,
    Filter, Calendar, ChevronRight, Eye, MoreVertical, Gem, Download
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import api from '@/lib/api';

interface OrderItem {
    id: number;
    product_name: string;
    product_image: string;
    quantity: number;
    unit_price: number;
    total_price: number;
}

interface Order {
    id: number;
    order_number: string;
    customer_name: string;
    customer_email: string;
    total_amount: number;
    reseller_commission: number;
    status: string;
    created_at: string;
    items: OrderItem[];
}

export default function OrdersPage() {
    const router = useRouter();
    const { reseller, logout } = useAuthStore();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token || token === 'null' || token === 'undefined') {
            router.push('/login');
            return;
        }
        loadOrders();
    }, [statusFilter]);

    const loadOrders = async () => {
        setLoading(true);
        try {
            const data = await api.getOrders({ status_filter: statusFilter });
            // Safe data handling
            const orderList = Array.isArray(data) ? data : (data as any).items || [];
            setOrders(orderList as Order[]);
        } catch (err) {
            console.error('Failed to load orders:', err);
        } finally {
            setLoading(false);
        }
    };

    const downloadOrdersCSV = () => {
        if (!orders.length) return;

        const headers = ['Order Number', 'Date', 'Customer Name', 'Email', 'Status', 'Total Amount', 'Commission'];
        const csvContent = [
            headers.join(','),
            ...orders.map(order => [
                order.order_number,
                new Date(order.created_at).toLocaleDateString(),
                `"${order.customer_name}"`,
                order.customer_email,
                order.status,
                order.total_amount,
                order.reseller_commission
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        logout();
        router.push('/');
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending': return 'bg-amber-500/10 text-amber-600 border border-amber-200';
            case 'confirmed': return 'bg-blue-500/10 text-blue-600 border border-blue-200';
            case 'processing': return 'bg-purple-500/10 text-purple-600 border border-purple-200';
            case 'shipped': return 'bg-indigo-500/10 text-indigo-600 border border-indigo-200';
            case 'delivered': return 'bg-emerald-500/10 text-emerald-600 border border-emerald-200';
            case 'cancelled': return 'bg-red-500/10 text-red-600 border border-red-200';
            default: return 'bg-bg-secondary text-text-muted border border-border-light';
        }
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
        { icon: ShoppingBag, label: 'Products', href: '/dashboard/products' },
        { icon: Package, label: 'Orders', href: '/dashboard/orders', active: true },
        { icon: CreditCard, label: 'Payouts', href: '/dashboard/payouts' },
        { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
    ];

    return (
        <div className="min-h-screen flex bg-bg-secondary font-body theme-jaipur">
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
                                <h1 className="text-2xl font-display font-medium text-text-primary tracking-tight">Orders</h1>
                                <p className="text-xs text-text-muted font-light uppercase tracking-widest mt-1">Track and manage customer orders</p>
                            </div>
                        </div>

                        <button
                            onClick={downloadOrdersCSV}
                            disabled={orders.length === 0}
                            className="flex items-center gap-2 px-5 py-2.5 bg-jaipur-burgundy text-white rounded-full text-[11px] font-bold uppercase tracking-widest hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Download className="w-4 h-4" />
                            <span className="hidden sm:inline">Export CSV</span>
                        </button>
                    </div>
                </header>

                <div className="p-6 lg:p-10 relative z-10 max-w-7xl mx-auto">
                    <div className="flex flex-wrap gap-4 mb-8">
                        <div className="relative flex-1 min-w-[200px]">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                            <input
                                type="text"
                                placeholder="Search order # or customer..."
                                className="w-full h-[50px] pl-11 pr-4 rounded-2xl bg-white border border-border-light text-sm outline-none focus:border-jaipur-gold/30 transition-all font-light"
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="h-[50px] px-4 rounded-2xl bg-white border border-border-light text-sm outline-none focus:border-jaipur-gold/30 transition-all min-w-[180px] font-light"
                        >
                            <option value="">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>

                    <div className="bg-white rounded-[2rem] border border-border-light overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-border-light bg-bg-secondary/50">
                                        <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-widest">Order Info</th>
                                        <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-widest">Customer</th>
                                        <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-widest">Status</th>
                                        <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-widest text-right">Amount</th>
                                        <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-widest text-right">Commission</th>
                                        <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-widest"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-24 text-center">
                                                <div className="w-8 h-8 border-[3px] border-jaipur-gold/20 border-t-jaipur-gold rounded-full animate-spin mx-auto" />
                                            </td>
                                        </tr>
                                    ) : orders.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-24 text-center">
                                                <div className="w-16 h-16 bg-bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <Package className="w-8 h-8 text-text-muted" />
                                                </div>
                                                <p className="font-display text-lg text-text-primary mb-1">No orders yet</p>
                                                <p className="text-text-muted font-light">Your sales will appear here.</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        orders.map((order) => (
                                            <tr key={order.id} className="border-b border-border-light hover:bg-bg-secondary/30 transition-colors group">
                                                <td className="px-6 py-5">
                                                    <div className="font-bold text-text-primary group-hover:text-jaipur-burgundy transition-colors">
                                                        {order.order_number}
                                                    </div>
                                                    <div className="text-[11px] text-text-muted flex items-center gap-1 mt-1 font-medium">
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(order.created_at).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="font-medium text-text-primary">{order.customer_name}</div>
                                                    <div className="text-xs text-text-secondary font-light">{order.customer_email}</div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${getStatusColor(order.status)}`}>
                                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 text-right font-medium text-text-primary">
                                                    ₹{order.total_amount.toLocaleString()}
                                                </td>
                                                <td className="px-6 py-5 text-right text-emerald-600 font-bold">
                                                    ₹{order.reseller_commission.toLocaleString()}
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <button className="p-2 hover:bg-bg-secondary rounded-lg transition-colors text-text-muted hover:text-text-primary">
                                                        <ChevronRight className="w-5 h-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
