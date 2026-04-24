'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuthStore } from '@/store/authStore';
import Layout from '@/components/Layout';
import {
  UserGroupIcon, ShoppingBagIcon, CurrencyDollarIcon, ChartBarIcon,
  ArrowTrendingUpIcon, ArrowTrendingDownIcon, ClockIcon, SparklesIcon,
  FireIcon, TrophyIcon, CubeIcon, ArrowRightIcon, BellIcon,
  SunIcon, MoonIcon, CloudIcon, BoltIcon, EyeIcon, SignalIcon,
  WrenchScrewdriverIcon, RocketLaunchIcon, PresentationChartLineIcon,
} from '@heroicons/react/24/outline';
import {
  AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, ComposedChart,
} from 'recharts';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================
// TIME-BASED GREETING SYSTEM
// ============================================
const getTimeInfo = () => {
  const hour = new Date().getHours();
  const minute = new Date().getMinutes();
  const timeValue = hour + minute / 60;
  
  if (timeValue >= 5 && timeValue < 12) return { 
    greeting: 'Good Morning', emoji: '🌅', icon: SunIcon, 
    gradient: 'from-amber-400 via-orange-400 to-yellow-500',
    bgGradient: 'from-amber-50 via-orange-50 to-yellow-50',
    message: 'A fresh day of opportunities awaits!'
  };
  if (timeValue >= 12 && timeValue < 14) return { 
    greeting: 'Good Noon', emoji: '☀️', icon: SunIcon,
    gradient: 'from-yellow-400 via-amber-400 to-orange-500',
    bgGradient: 'from-yellow-50 via-amber-50 to-orange-50',
    message: 'Peak performance time! Make it count.'
  };
  if (timeValue >= 14 && timeValue < 17) return { 
    greeting: 'Good Afternoon', emoji: '🌤️', icon: CloudIcon,
    gradient: 'from-orange-400 via-rose-400 to-pink-500',
    bgGradient: 'from-orange-50 via-rose-50 to-pink-50',
    message: 'Keep the momentum rolling strong!'
  };
  if (timeValue >= 17 && timeValue < 20) return { 
    greeting: 'Good Evening', emoji: '🌅', icon: SunIcon,
    gradient: 'from-purple-400 via-pink-400 to-rose-500',
    bgGradient: 'from-purple-50 via-pink-50 to-rose-50',
    message: 'Winding down? Review today\'s wins.'
  };
  return { 
    greeting: 'Good Night', emoji: '🌙', icon: MoonIcon,
    gradient: 'from-indigo-500 via-purple-500 to-blue-600',
    bgGradient: 'from-indigo-50 via-purple-50 to-blue-50',
    message: 'The night owl grind! Dream big.'
  };
};

// ============================================
// LIVE PRODUCT TRACKER
// ============================================
const LiveProductTracker = () => {
  const [products, setProducts] = useState([
    { id: 1, name: 'Wireless Headphones', stock: 45, sales: 245, status: 'active', trend: 'up' },
    { id: 2, name: 'Gaming Mouse', stock: 12, sales: 189, status: 'warning', trend: 'up' },
    { id: 3, name: 'Mechanical Keyboard', stock: 3, sales: 156, status: 'critical', trend: 'down' },
    { id: 4, name: 'USB-C Hub', stock: 28, sales: 134, status: 'active', trend: 'up' },
    { id: 5, name: 'Smart Watch', stock: 8, sales: 98, status: 'warning', trend: 'up' },
    { id: 6, name: 'Bluetooth Speaker', stock: 0, sales: 67, status: 'out', trend: 'down' },
  ]);

  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setProducts(prev => prev.map(p => ({
        ...p,
        stock: Math.max(0, p.stock + (Math.random() > 0.7 ? -1 : 0)),
        sales: p.sales + (Math.random() > 0.8 ? 1 : 0),
      })));
      setLastUpdate(new Date());
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getStatusConfig = (status) => {
    const configs = {
      active: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', label: 'Active' },
      warning: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500', label: 'Low Stock' },
      critical: { bg: 'bg-rose-50', text: 'text-rose-700', dot: 'bg-rose-500', label: 'Critical' },
      out: { bg: 'bg-gray-50', text: 'text-gray-700', dot: 'bg-gray-500', label: 'Out of Stock' },
    };
    return configs[status];
  };

  const totalSales = products.reduce((sum, p) => sum + p.sales, 0);
  const lowStockCount = products.filter(p => p.stock <= 10).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-950 text-white shadow-2xl"
    >
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl shadow-lg">
              <SignalIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Live Product Tracker</h3>
              <p className="text-xs text-gray-400">Real-time inventory monitoring</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-xs text-gray-400">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
            <span>Live • Updated {lastUpdate.toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-white">{products.length}</p>
            <p className="text-xs text-gray-400">Total Products</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-amber-400">{lowStockCount}</p>
            <p className="text-xs text-gray-400">Low Stock</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-rose-400">{outOfStockCount}</p>
            <p className="text-xs text-gray-400">Out of Stock</p>
          </div>
        </div>

        {/* Product List */}
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1 scrollbar-thin">
          <AnimatePresence>
            {products.map((product, index) => {
              const statusConfig = getStatusConfig(product.status);
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between bg-white/5 hover:bg-white/10 rounded-xl p-3 transition-all"
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <div className={`w-2 h-2 rounded-full ${statusConfig.dot} animate-pulse`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{product.name}</p>
                      <div className="flex items-center space-x-3 mt-0.5">
                        <span className={`text-xs ${statusConfig.text}`}>{statusConfig.label}</span>
                        <span className="text-xs text-gray-500">{product.sales} sales</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${product.stock <= 5 ? 'text-rose-400' : product.stock <= 15 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {product.stock}
                    </p>
                    <p className="text-xs text-gray-500">in stock</p>
                  </div>
                  <div className="ml-3">
                    {product.trend === 'up' ? (
                      <ArrowTrendingUpIcon className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <ArrowTrendingDownIcon className="h-4 w-4 text-rose-400" />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
          <Link href="/products" className="flex-1 text-center py-2 bg-white/10 rounded-xl text-sm text-white hover:bg-white/20 transition">View All</Link>
          <Link href="/products/create" className="flex-1 text-center py-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl text-sm text-white hover:shadow-lg transition">Add Product</Link>
          <Link href="/products/low-stock" className="flex-1 text-center py-2 bg-white/10 rounded-xl text-sm text-white hover:bg-white/20 transition">Low Stock</Link>
        </div>
      </div>
    </motion.div>
  );
};

// ============================================
// COLORS & DATA
// ============================================
const COLORS = { primary: '#3B82F6', secondary: '#10B981', accent: '#F59E0B', danger: '#EF4444', purple: '#8B5CF6', cyan: '#06B6D4' };
const CHART_COLORS = [COLORS.primary, COLORS.secondary, COLORS.accent, COLORS.danger, COLORS.purple, COLORS.cyan];

const mockSalesData = [
  { name: 'Jan', revenue: 45000, profit: 22000 }, { name: 'Feb', revenue: 52000, profit: 26000 },
  { name: 'Mar', revenue: 48000, profit: 24000 }, { name: 'Apr', revenue: 61000, profit: 31000 },
  { name: 'May', revenue: 55000, profit: 27000 }, { name: 'Jun', revenue: 67000, profit: 34000 },
  { name: 'Jul', revenue: 72000, profit: 38000 }, { name: 'Aug', revenue: 68000, profit: 35000 },
  { name: 'Sep', revenue: 78000, profit: 40000 }, { name: 'Oct', revenue: 85000, profit: 44000 },
  { name: 'Nov', revenue: 92000, profit: 48000 }, { name: 'Dec', revenue: 105000, profit: 55000 },
];

const mockCategoryData = [
  { name: 'Electronics', value: 45, color: COLORS.primary },
  { name: 'Fashion', value: 25, color: COLORS.secondary },
  { name: 'Books', value: 12, color: COLORS.accent },
  { name: 'Home', value: 10, color: COLORS.purple },
  { name: 'Sports', value: 8, color: COLORS.cyan },
];

const mockHourlyData = [
  { hour: '6AM', orders: 12 }, { hour: '8AM', orders: 25 }, { hour: '10AM', orders: 45 },
  { hour: '12PM', orders: 68 }, { hour: '2PM', orders: 55 }, { hour: '4PM', orders: 72 },
  { hour: '6PM', orders: 85 }, { hour: '8PM', orders: 48 }, { hour: '10PM', orders: 22 },
];

const mockRecentOrders = [
  { id: '1', order: 'ORD-001', customer: 'John Doe', amount: 299.99, status: 'delivered', time: '2 min ago' },
  { id: '2', order: 'ORD-002', customer: 'Jane Smith', amount: 149.50, status: 'processing', time: '5 min ago' },
  { id: '3', order: 'ORD-003', customer: 'Bob Johnson', amount: 89.99, status: 'pending', time: '12 min ago' },
  { id: '4', order: 'ORD-004', customer: 'Alice Brown', amount: 450.00, status: 'shipped', time: '25 min ago' },
];

// ============================================
// CUSTOM TOOLTIP
// ============================================
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-gray-100">
        <p className="text-sm font-semibold text-gray-700 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm flex items-center gap-2" style={{ color: entry.color }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
            {entry.name}: <span className="font-semibold">{typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ============================================
// STAT CARD
// ============================================
const StatCard = ({ stat, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    whileHover={{ y: -5, scale: 1.02 }}
    className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300"
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
    <div className="relative z-10">
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <stat.icon className="h-6 w-6 text-white" />
        </div>
        {stat.change !== 0 && (
          <div className={`flex items-center text-sm font-medium ${stat.change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {stat.change >= 0 ? <ArrowTrendingUpIcon className="h-4 w-4 mr-1" /> : <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />}
            {Math.abs(stat.change)}%
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium text-gray-500">{stat.name}</p>
        <p className="text-3xl font-bold text-gray-900 mt-1 tracking-tight">{stat.value}</p>
      </div>
      <div className="mt-3 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(Math.abs(stat.change) * 5, 100)}%` }}
          transition={{ duration: 1, delay: index * 0.1 }}
          className={`h-full rounded-full ${stat.change >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}
        />
      </div>
    </div>
  </motion.div>
);

// ============================================
// MAIN DASHBOARD
// ============================================
export default function DashboardPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeInfo, setTimeInfo] = useState(getTimeInfo());
  const [timezone, setTimezone] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setTimeInfo(getTimeInfo());
    }, 1000);
    setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    setTimeout(() => setLoading(false), 800);
    return () => clearInterval(timer);
  }, []);

  const GreetingIcon = timeInfo.icon;

  const statCards = [
    { name: 'Total Revenue', value: '$284,590', icon: CurrencyDollarIcon, change: 18.5, gradient: 'from-blue-500 to-cyan-500', bgGradient: 'from-blue-50 to-cyan-50' },
    { name: 'Total Orders', value: '2,847', icon: ShoppingBagIcon, change: 12.3, gradient: 'from-emerald-500 to-teal-500', bgGradient: 'from-emerald-50 to-teal-50' },
    { name: 'Total Customers', value: '6,892', icon: UserGroupIcon, change: 22.1, gradient: 'from-purple-500 to-pink-500', bgGradient: 'from-purple-50 to-pink-50' },
    { name: 'Conversion', value: '4.8%', icon: ChartBarIcon, change: 3.2, gradient: 'from-amber-500 to-orange-500', bgGradient: 'from-amber-50 to-orange-50' },
  ];

  const getStatusBadge = (status) => {
    const config = {
      pending: 'bg-amber-50 text-amber-700 border-amber-200',
      processing: 'bg-blue-50 text-blue-700 border-blue-200',
      shipped: 'bg-purple-50 text-purple-700 border-purple-200',
      delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
    };
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${config[status] || config.pending}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col justify-center items-center h-[80vh] space-y-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-full blur-xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-50 animate-pulse"></div>
            <div className="relative animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600"></div>
          </div>
          <p className="text-gray-500 animate-pulse text-lg">Loading your dashboard...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 pb-8">
        {/* ============================================ */}
        {/* HERO HEADER */}
        {/* ============================================ */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${timeInfo.gradient} p-8 text-white shadow-2xl`}
        >
          <div className="absolute inset-0">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            {[...Array(15)].map((_, i) => (
              <div key={i} className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 3}s`, opacity: Math.random() * 0.5 + 0.2 }} />
            ))}
          </div>

          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    <GreetingIcon className="h-5 w-5" />
                    <span className="text-sm font-medium">{currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-sm px-3 py-2 rounded-full">
                    <ClockIcon className="h-4 w-4" />
                    <span className="text-xs font-medium">{timezone}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-5xl">{timeInfo.emoji}</span>
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                      {timeInfo.greeting}, <span className="text-white/90">{user?.name?.split(' ')[0] || 'Admin'}</span>!
                    </h1>
                    <p className="text-white/70 text-lg mt-1">{timeInfo.message}</p>
                  </div>
                </div>
              </div>

              {/* Clock */}
              <div className="hidden lg:block">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20">
                  <div className="flex items-center space-x-4">
                    <div className="relative h-16 w-16">
                      <svg className="h-16 w-16 -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                        <line x1="50" y1="50" x2="50" y2="28" stroke="white" strokeWidth="3" transform={`rotate(${(currentTime.getHours() % 12) * 30 + currentTime.getMinutes() * 0.5}, 50, 50)`} />
                        <line x1="50" y1="50" x2="50" y2="18" stroke="white" strokeWidth="2" transform={`rotate(${currentTime.getMinutes() * 6}, 50, 50)`} />
                        <line x1="50" y1="55" x2="50" y2="15" stroke="#FCD34D" strokeWidth="1.5" transform={`rotate(${currentTime.getSeconds() * 6}, 50, 50)`} />
                        <circle cx="50" cy="50" r="3" fill="white" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-5xl font-mono font-bold tracking-wider">
                        {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3 mt-6">
              <Link href="/orders" className="inline-flex items-center px-5 py-2.5 bg-white/15 backdrop-blur-sm text-white rounded-xl hover:bg-white/25 text-sm font-medium border border-white/20">
                View Orders <ArrowRightIcon className="h-4 w-4 ml-2" />
              </Link>
              <Link href="/products/create" className="inline-flex items-center px-5 py-2.5 bg-white text-gray-900 rounded-xl hover:bg-gray-50 text-sm font-medium shadow-lg">
                <ShoppingBagIcon className="h-4 w-4 mr-2" />Add Product
              </Link>
              <Link href="/reports" className="inline-flex items-center px-5 py-2.5 bg-white/15 backdrop-blur-sm text-white rounded-xl hover:bg-white/25 text-sm font-medium border border-white/20">
                <ChartBarIcon className="h-4 w-4 mr-2" />Reports
              </Link>
            </div>
          </div>
        </motion.div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat, i) => <StatCard key={stat.name} stat={stat} index={i} />)}
        </div>

        {/* CHARTS + LIVE TRACKER */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Revenue Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2 bg-white rounded-2xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <div><h3 className="text-lg font-semibold">Revenue vs Profit</h3><p className="text-sm text-gray-500">Monthly performance</p></div>
              <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg">+23.5% YoY</span>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={mockSalesData}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3}/><stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/></linearGradient>
                  <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={COLORS.secondary} stopOpacity={0.3}/><stop offset="95%" stopColor={COLORS.secondary} stopOpacity={0}/></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v.toLocaleString()}`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="revenue" fill={COLORS.primary} radius={[4, 4, 0, 0]} barSize={20} />
                <Line type="monotone" dataKey="profit" stroke={COLORS.secondary} strokeWidth={2} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Live Product Tracker */}
          <LiveProductTracker />
        </div>

        {/* BOTTOM ROW */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Recent Orders */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="lg:col-span-2 bg-white rounded-2xl shadow-sm border overflow-hidden">
            <div className="px-6 py-5 border-b flex justify-between"><h3 className="text-lg font-semibold">Recent Orders</h3><Link href="/orders" className="text-sm text-blue-600">View all →</Link></div>
            <div className="divide-y">
              {mockRecentOrders.map((order, i) => (
                <motion.div key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 + i * 0.05 }} className="px-6 py-4 hover:bg-gray-50 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-sm font-semibold">
                      {order.customer.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium">{order.order}</p>
                      <p className="text-sm text-gray-500">{order.customer}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <p className="font-semibold">${order.amount.toFixed(2)}</p>
                    {getStatusBadge(order.status)}
                    <span className="text-xs text-gray-400">{order.time}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Today's Stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="space-y-6">
            {/* Hourly Orders */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">Today's Orders</h3>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={mockHourlyData}>
                  <defs><linearGradient id="hourlyGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={COLORS.purple} stopOpacity={0.3}/><stop offset="95%" stopColor={COLORS.purple} stopOpacity={0}/></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                  <XAxis dataKey="hour" tick={{ fill: '#6B7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#6B7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="orders" stroke={COLORS.purple} strokeWidth={2} fill="url(#hourlyGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Category Chart */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">Categories</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={mockCategoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                    {mockCategoryData.map((entry, i) => <Cell key={i} fill={entry.color} strokeWidth={0} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}






















// 'use client';

// import { useEffect, useState, useCallback } from 'react';
// import { useAuthStore } from '@/store/authStore';
// import Layout from '@/components/Layout';
// import {
//   UserGroupIcon, ShoppingBagIcon, CurrencyDollarIcon, ChartBarIcon,
//   ArrowTrendingUpIcon, ArrowTrendingDownIcon, ClockIcon, SparklesIcon,
//   FireIcon, TrophyIcon, CubeIcon, ArrowRightIcon, BellIcon,
//   SunIcon, MoonIcon, CloudIcon, SignalIcon, BoltIcon,
//   ExclamationTriangleIcon,
// } from '@heroicons/react/24/outline';
// import {
//   AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar,
//   XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
//   LineChart, Line, ComposedChart,
// } from 'recharts';
// import Link from 'next/link';
// import { motion, AnimatePresence } from 'framer-motion';
// import Cookies from 'js-cookie';

// // ============================================
// // API CONFIG
// // ============================================
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';

// // ============================================
// // TIME-BASED GREETING
// // ============================================
// const getTimeInfo = () => {
//   const hour = new Date().getHours();
//   if (hour >= 5 && hour < 12) return { greeting: 'Good Morning', emoji: '🌅', icon: SunIcon, gradient: 'from-amber-400 via-orange-400 to-yellow-500' };
//   if (hour >= 12 && hour < 14) return { greeting: 'Good Noon', emoji: '☀️', icon: SunIcon, gradient: 'from-yellow-400 via-amber-400 to-orange-500' };
//   if (hour >= 14 && hour < 17) return { greeting: 'Good Afternoon', emoji: '🌤️', icon: CloudIcon, gradient: 'from-orange-400 via-rose-400 to-pink-500' };
//   if (hour >= 17 && hour < 20) return { greeting: 'Good Evening', emoji: '🌅', icon: SunIcon, gradient: 'from-purple-400 via-pink-400 to-rose-500' };
//   return { greeting: 'Good Night', emoji: '🌙', icon: MoonIcon, gradient: 'from-indigo-500 via-purple-500 to-blue-600' };
// };

// // ============================================
// // COLORS
// // ============================================
// const COLORS = { primary: '#3B82F6', secondary: '#10B981', accent: '#F59E0B', danger: '#EF4444', purple: '#8B5CF6', cyan: '#06B6D4' };
// const CHART_COLORS = [COLORS.primary, COLORS.secondary, COLORS.accent, COLORS.danger, COLORS.purple, COLORS.cyan];

// // ============================================
// // API HELPER
// // ============================================
// const fetchAPI = async (endpoint) => {
//   const token = Cookies.get('accessToken') || localStorage.getItem('accessToken');
//   if (!token) return null;
  
//   try {
//     const response = await fetch(`${API_BASE_URL}${endpoint}`, {
//       headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
//       credentials: 'include',
//     });
//     if (!response.ok) return null;
//     return await response.json();
//   } catch (error) {
//     console.error(`API Error (${endpoint}):`, error.message);
//     return null;
//   }
// };

// // ============================================
// // CUSTOM TOOLTIP
// // ============================================
// const CustomTooltip = ({ active, payload, label }) => {
//   if (active && payload && payload.length) {
//     return (
//       <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-gray-100">
//         <p className="text-sm font-semibold text-gray-700 mb-2">{label}</p>
//         {payload.map((entry, index) => (
//           <p key={index} className="text-sm flex items-center gap-2" style={{ color: entry.color }}>
//             <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
//             {entry.name}: <span className="font-semibold">{typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}</span>
//           </p>
//         ))}
//       </div>
//     );
//   }
//   return null;
// };

// // ============================================
// // MAIN DASHBOARD
// // ============================================
// export default function DashboardPage() {
//   const { user } = useAuthStore();
//   const [loading, setLoading] = useState(true);
//   const [currentTime, setCurrentTime] = useState(new Date());
//   const [timeInfo, setTimeInfo] = useState(getTimeInfo());
//   const [timezone, setTimezone] = useState('');
  
//   // Real data states (null = not loaded, [] = empty from API)
//   const [dashboardStats, setDashboardStats] = useState(null);
//   const [products, setProducts] = useState(null);
//   const [recentOrders, setRecentOrders] = useState(null);
//   const [revenueData, setRevenueData] = useState(null);
//   const [categoryData, setCategoryData] = useState(null);

//   // Fetch all dashboard data
//   const loadDashboardData = useCallback(async () => {
//     setLoading(true);
    
//     const [statsRes, productsRes, ordersRes, revenueRes] = await Promise.allSettled([
//       fetchAPI('/admin/dashboard/stats'),
//       fetchAPI('/admin/products?limit=10&sort=-createdAt'),
//       fetchAPI('/admin/orders?limit=5&sort=-createdAt'),
//       fetchAPI('/admin/dashboard/revenue-chart?period=month'),
//     ]);
    
//     if (statsRes.status === 'fulfilled' && statsRes.value?.data) {
//       setDashboardStats(statsRes.value.data);
//     }
//     if (productsRes.status === 'fulfilled' && productsRes.value?.data) {
//       setProducts(productsRes.value.data);
//     }
//     if (ordersRes.status === 'fulfilled' && ordersRes.value?.data) {
//       setRecentOrders(ordersRes.value.data);
//     }
//     if (revenueRes.status === 'fulfilled' && revenueRes.value?.data) {
//       setRevenueData(revenueRes.value.data);
//     }
    
//     // Build category data from products
//     if (productsRes.status === 'fulfilled' && productsRes.value?.data) {
//       const catMap = {};
//       productsRes.value.data.forEach(p => {
//         const catName = p.category?.name || p.category || 'Uncategorized';
//         catMap[catName] = (catMap[catName] || 0) + 1;
//       });
//       const catData = Object.entries(catMap).map(([name, value], i) => ({
//         name,
//         value,
//         color: CHART_COLORS[i % CHART_COLORS.length],
//       }));
//       if (catData.length > 0) setCategoryData(catData);
//     }
    
//     setLoading(false);
//   }, []);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentTime(new Date());
//       setTimeInfo(getTimeInfo());
//     }, 1000);
//     setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
//     loadDashboardData();
//     return () => clearInterval(timer);
//   }, [loadDashboardData]);

//   const GreetingIcon = timeInfo.icon;

//   // Dynamic stat cards from real data
//   const statCards = dashboardStats ? [
//     { name: 'Total Revenue', value: `$${(dashboardStats.totalRevenue || 0).toLocaleString()}`, icon: CurrencyDollarIcon, change: dashboardStats.revenueChange || 0, gradient: 'from-blue-500 to-cyan-500', bgGradient: 'from-blue-50 to-cyan-50' },
//     { name: 'Total Orders', value: (dashboardStats.totalOrders || 0).toLocaleString(), icon: ShoppingBagIcon, change: dashboardStats.ordersChange || 0, gradient: 'from-emerald-500 to-teal-500', bgGradient: 'from-emerald-50 to-teal-50' },
//     { name: 'Total Customers', value: (dashboardStats.totalCustomers || 0).toLocaleString(), icon: UserGroupIcon, change: dashboardStats.customersChange || 0, gradient: 'from-purple-500 to-pink-500', bgGradient: 'from-purple-50 to-pink-50' },
//     { name: 'Total Products', value: (dashboardStats.totalProducts || 0).toLocaleString(), icon: CubeIcon, change: dashboardStats.productsChange || 0, gradient: 'from-amber-500 to-orange-500', bgGradient: 'from-amber-50 to-orange-50' },
//   ] : [];

//   const getStatusBadge = (status) => {
//     const config = {
//       pending: 'bg-amber-50 text-amber-700 border-amber-200',
//       processing: 'bg-blue-50 text-blue-700 border-blue-200',
//       shipped: 'bg-purple-50 text-purple-700 border-purple-200',
//       delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
//       cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
//     };
//     return (
//       <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${config[status] || config.pending}`}>
//         {status?.charAt(0).toUpperCase() + status?.slice(1)}
//       </span>
//     );
//   };

//   if (loading) {
//     return (
//       <Layout>
//         <div className="flex flex-col justify-center items-center h-[80vh] space-y-4">
//           <div className="relative">
//             <div className="absolute inset-0 rounded-full blur-xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-50 animate-pulse"></div>
//             <div className="relative animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600"></div>
//           </div>
//           <p className="text-gray-500 animate-pulse text-lg">Loading real-time data...</p>
//         </div>
//       </Layout>
//     );
//   }

//   return (
//     <Layout>
//       <div className="space-y-6 pb-8">
//         {/* ============================================ */}
//         {/* HERO HEADER */}
//         {/* ============================================ */}
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${timeInfo.gradient} p-8 text-white shadow-2xl`}
//         >
//           <div className="absolute inset-0">
//             <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
//             <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
//           </div>
//           <div className="relative z-10">
//             <div className="flex items-start justify-between">
//               <div className="flex-1">
//                 <div className="flex items-center space-x-3 mb-4">
//                   <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
//                     <GreetingIcon className="h-5 w-5" />
//                     <span className="text-sm font-medium">{currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
//                   </div>
//                   <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-sm px-3 py-2 rounded-full">
//                     <ClockIcon className="h-4 w-4" /><span className="text-xs font-medium">{timezone}</span>
//                   </div>
//                 </div>
//                 <div className="flex items-center space-x-3 mb-2">
//                   <span className="text-5xl">{timeInfo.emoji}</span>
//                   <div>
//                     <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
//                       {timeInfo.greeting}, <span className="text-white/90">{user?.name?.split(' ')[0] || 'Admin'}</span>!
//                     </h1>
//                     {dashboardStats ? (
//                       <p className="text-white/70 text-lg mt-1">
//                         You have <span className="font-semibold text-white">{dashboardStats.totalOrders || 0} orders</span> and{' '}
//                         <span className="font-semibold text-white">${(dashboardStats.totalRevenue || 0).toLocaleString()}</span> in revenue.
//                       </p>
//                     ) : (
//                       <p className="text-white/70 text-lg mt-1">Connect your backend to see live stats.</p>
//                     )}
//                   </div>
//                 </div>
//               </div>
//               <div className="hidden lg:block">
//                 <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20">
//                   <div className="relative h-16 w-16">
//                     <svg className="h-16 w-16 -rotate-90" viewBox="0 0 100 100">
//                       <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
//                       <line x1="50" y1="50" x2="50" y2="28" stroke="white" strokeWidth="3" transform={`rotate(${(currentTime.getHours() % 12) * 30 + currentTime.getMinutes() * 0.5}, 50, 50)`} />
//                       <line x1="50" y1="50" x2="50" y2="18" stroke="white" strokeWidth="2" transform={`rotate(${currentTime.getMinutes() * 6}, 50, 50)`} />
//                       <line x1="50" y1="55" x2="50" y2="15" stroke="#FCD34D" strokeWidth="1.5" transform={`rotate(${currentTime.getSeconds() * 6}, 50, 50)`} />
//                       <circle cx="50" cy="50" r="3" fill="white" />
//                     </svg>
//                   </div>
//                   <div className="text-center mt-2">
//                     <div className="text-2xl font-mono font-bold">{currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}</div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="flex flex-wrap gap-3 mt-6">
//               <Link href="/orders" className="inline-flex items-center px-5 py-2.5 bg-white/15 backdrop-blur-sm text-white rounded-xl hover:bg-white/25 text-sm font-medium border border-white/20">View Orders <ArrowRightIcon className="h-4 w-4 ml-2" /></Link>
//               <Link href="/products/create" className="inline-flex items-center px-5 py-2.5 bg-white text-gray-900 rounded-xl hover:bg-gray-50 text-sm font-medium shadow-lg"><ShoppingBagIcon className="h-4 w-4 mr-2" />Add Product</Link>
//             </div>
//           </div>
//         </motion.div>

//         {/* ============================================ */}
//         {/* STATS CARDS - Only show if real data exists */}
//         {/* ============================================ */}
//         {statCards.length > 0 && (
//           <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
//             {statCards.map((stat, i) => (
//               <motion.div
//                 key={stat.name}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: i * 0.1 }}
//                 whileHover={{ y: -5 }}
//                 className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300"
//               >
//                 <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
//                 <div className="relative z-10">
//                   <div className="flex items-center justify-between">
//                     <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg group-hover:scale-110 transition-transform`}>
//                       <stat.icon className="h-6 w-6 text-white" />
//                     </div>
//                     {stat.change !== 0 && (
//                       <div className={`flex items-center text-sm font-medium ${stat.change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
//                         {stat.change >= 0 ? <ArrowTrendingUpIcon className="h-4 w-4 mr-1" /> : <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />}
//                         {Math.abs(stat.change)}%
//                       </div>
//                     )}
//                   </div>
//                   <div className="mt-4"><p className="text-sm font-medium text-gray-500">{stat.name}</p><p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p></div>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         )}

//         {/* ============================================ */}
//         {/* CHARTS SECTION - Only show if data exists */}
//         {/* ============================================ */}
//         {(revenueData || categoryData) && (
//           <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
//             {revenueData && revenueData.length > 0 && (
//               <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 bg-white rounded-2xl shadow-sm border p-6">
//                 <div className="flex items-center justify-between mb-6"><h3 className="text-lg font-semibold">Revenue Analytics</h3><span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg">Real data</span></div>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <AreaChart data={revenueData}>
//                     <defs><linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3}/><stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/></linearGradient></defs>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
//                     <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
//                     <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v.toLocaleString()}`} />
//                     <Tooltip content={<CustomTooltip />} />
//                     <Area type="monotone" dataKey="sales" stroke={COLORS.primary} strokeWidth={3} fill="url(#revGrad)" />
//                   </AreaChart>
//                 </ResponsiveContainer>
//               </motion.div>
//             )}

//             {categoryData && categoryData.length > 0 && (
//               <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border p-6">
//                 <div className="flex items-center justify-between mb-6"><h3 className="text-lg font-semibold">Categories</h3><span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg">Real data</span></div>
//                 <ResponsiveContainer width="100%" height={280}>
//                   <PieChart>
//                     <Pie data={categoryData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={3} dataKey="value">
//                       {categoryData.map((entry, i) => <Cell key={i} fill={entry.color} strokeWidth={0} />)}
//                     </Pie>
//                     <Tooltip content={<CustomTooltip />} /><Legend iconType="circle" />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </motion.div>
//             )}
//           </div>
//         )}

//         {/* ============================================ */}
//         {/* BOTTOM SECTION */}
//         {/* ============================================ */}
//         <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
//           {/* Recent Orders - Only show if real data exists */}
//           {recentOrders && recentOrders.length > 0 && (
//             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 bg-white rounded-2xl shadow-sm border overflow-hidden">
//               <div className="px-6 py-5 border-b flex justify-between">
//                 <h3 className="text-lg font-semibold">Recent Orders</h3>
//                 <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg">Real data</span>
//               </div>
//               <div className="divide-y">
//                 {recentOrders.map((order) => (
//                   <div key={order._id} className="px-6 py-4 hover:bg-gray-50 flex items-center justify-between">
//                     <div className="flex items-center space-x-4">
//                       <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-sm font-semibold">
//                         {order.customer?.name?.split(' ').map(n => n[0]).join('') || 'G'}
//                       </div>
//                       <div>
//                         <p className="font-medium">{order.orderNumber || `#${order._id?.slice(-6)}`}</p>
//                         <p className="text-sm text-gray-500">{order.customer?.name || 'Guest'}</p>
//                       </div>
//                     </div>
//                     <div className="flex items-center space-x-6">
//                       <p className="font-semibold">${order.total?.toFixed(2)}</p>
//                       {getStatusBadge(order.status)}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </motion.div>
//           )}

//           {/* Live Products - Only show if real data exists */}
//           {products && products.length > 0 && (
//             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-950 rounded-2xl shadow-xl overflow-hidden text-white">
//               <div className="p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <div className="flex items-center space-x-2">
//                     <SignalIcon className="h-5 w-5 text-emerald-400" />
//                     <h3 className="text-lg font-bold">Live Products</h3>
//                   </div>
//                   <span className="text-xs text-emerald-400 flex items-center"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-1 animate-pulse"></span>LIVE</span>
//                 </div>
//                 <div className="space-y-2 max-h-[400px] overflow-y-auto">
//                   {products.slice(0, 8).map((product) => (
//                     <div key={product._id} className="flex items-center justify-between bg-white/5 rounded-xl p-3 hover:bg-white/10 transition">
//                       <div className="flex items-center space-x-3 flex-1">
//                         <div className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-emerald-400' : product.stock > 0 ? 'bg-amber-400' : 'bg-rose-400'} animate-pulse`}></div>
//                         <div className="flex-1">
//                           <p className="text-sm font-medium text-white truncate">{product.name}</p>
//                           <p className="text-xs text-gray-400">{product.sku || '-'}</p>
//                         </div>
//                       </div>
//                       <div className="text-right">
//                         <p className={`text-lg font-bold ${product.stock > 10 ? 'text-emerald-400' : product.stock > 0 ? 'text-amber-400' : 'text-rose-400'}`}>
//                           {product.stock}
//                         </p>
//                         <p className="text-xs text-gray-500">in stock</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </motion.div>
//           )}
//         </div>

//         {/* ============================================ */}
//         {/* NO DATA MESSAGE - Only show if nothing loaded */}
//         {/* ============================================ */}
//         {!dashboardStats && !products && !recentOrders && !revenueData && !categoryData && (
//           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
//             <div className="inline-flex p-4 bg-amber-50 rounded-full mb-4">
//               <ExclamationTriangleIcon className="h-12 w-12 text-amber-500" />
//             </div>
//             <h2 className="text-2xl font-bold text-gray-900">No Data Available</h2>
//             <p className="text-gray-500 mt-2 max-w-md mx-auto">
//               Could not fetch real-time data from the backend. Make sure your backend is running and accessible.
//             </p>
//             <button onClick={loadDashboardData} className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:shadow-lg transition font-medium">
//               Retry Connection
//             </button>
//           </motion.div>
//         )}
//       </div>
//     </Layout>
//   );
// }