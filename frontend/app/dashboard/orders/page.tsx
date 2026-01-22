'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Diamond, LayoutDashboard, ShoppingBag, Package,
    CreditCard, Settings, LogOut, Menu, X, Search,
    Filter, Calendar, ChevronRight, Eye, MoreVertical
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
        if (!token) {
            router.push('/login');
            return;
        }
        loadOrders();
    }, [statusFilter]);

    const loadOrders = async () => {
        setLoading(true);
        try {
            const data = await api.getOrders({ status_filter: statusFilter });
            setOrders(data as Order[]);
        } catch (err) {
            console.error('Failed to load orders:', err);
        } finally {
            setLoading(false);
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
            case 'confirmed': return 'bg-blue-500/20 text-blue-400';
            case 'processing': return 'bg-purple-500/20 text-purple-400';
            case 'shipped': return 'bg-indigo-500/20 text-indigo-400';
            case 'delivered': return 'bg-emerald-500/20 text-emerald-400';
            case 'cancelled': return 'bg-red-500/20 text-red-400';
            default: return 'bg-white/10 text-white/60';
        }
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
        { icon: ShoppingBag, label: 'Products', href: '/dashboard/products' },
        { icon: Package, label: 'Orders', href: '/dashboard/orders', active: true },
        { icon: CreditCard, label: 'Payouts', href: '/dashboard/payouts' },
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
                                <h1 className="text-xl font-semibold">Orders</h1>
                                <p className="text-sm text-white/50">Manage your sales and customers</p>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-4 lg:p-8">
                    <div className="flex flex-wrap gap-4 mb-6">
                        <div className="relative flex-1 min-w-[200px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                            <input type="text" placeholder="Search order # or customer..." className="input pl-10" />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="input w-auto min-w-[150px]"
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

                    <div className="card overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/10 bg-white/5">
                                        <th className="px-6 py-4 text-sm font-semibold text-white/60">Order Info</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-white/60">Customer</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-white/60">Status</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-white/60 text-right">Amount</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-white/60 text-right">Commission</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-white/60"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center">
                                                <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
                                            </td>
                                        </tr>
                                    ) : orders.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center">
                                                <Package className="w-12 h-12 mx-auto text-white/20 mb-3" />
                                                <p className="text-white/50">No orders found</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        orders.map((order) => (
                                            <tr key={order.id} className="border-b border-white/10 hover:bg-white/5 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="font-semibold text-white group-hover:text-purple-400 transition-colors">
                                                        {order.order_number}
                                                    </div>
                                                    <div className="text-xs text-white/40 flex items-center gap-1 mt-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(order.created_at).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-medium">{order.customer_name}</div>
                                                    <div className="text-xs text-white/40">{order.customer_email}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right font-medium">
                                                    ₹{order.total_amount.toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 text-right text-purple-400 font-semibold">
                                                    ₹{order.reseller_commission.toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                                        <ChevronRight className="w-5 h-5 text-white/40" />
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
