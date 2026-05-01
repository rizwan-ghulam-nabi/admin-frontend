// AdminPanel/frontend/admin-frontend/src/app/dashboard/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import Layout from '@/components/Layout';
import {
  UserGroupIcon, ShoppingBagIcon, CurrencyDollarIcon,
  ArrowTrendingUpIcon, ClockIcon,
  SunIcon, MoonIcon, ArrowRightIcon, SignalIcon,
  EnvelopeIcon, UserPlusIcon,
} from '@heroicons/react/24/outline';
import {
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ComposedChart, Bar, Line
} from 'recharts';
import Link from 'next/link';
import { motion } from 'framer-motion';

// ============================================
// TIME-BASED GREETING SYSTEM
// ============================================
const getTimeInfo = () => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) return { 
    greeting: 'Good Morning', emoji: '🌅', icon: SunIcon, 
    gradient: 'from-amber-400 via-orange-400 to-yellow-500',
    message: 'A fresh day of opportunities awaits!'
  };
  if (hour >= 12 && hour < 17) return { 
    greeting: 'Good Afternoon', emoji: '☀️', icon: SunIcon,
    gradient: 'from-blue-400 via-cyan-400 to-teal-500',
    message: 'Keep the momentum rolling strong!'
  };
  if (hour >= 17 && hour < 20) return { 
    greeting: 'Good Evening', emoji: '🌅', icon: SunIcon,
    gradient: 'from-purple-400 via-pink-400 to-rose-500',
    message: 'Winding down? Review today\'s wins.'
  };
  return { 
    greeting: 'Good Night', emoji: '🌙', icon: MoonIcon,
    gradient: 'from-indigo-500 via-purple-500 to-blue-600',
    message: 'The night owl grind! Dream big.'
  };
};

// ============================================
// API CONFIGURATION
// ============================================
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';
const MAIN_API_URL = 'http://localhost:5000/api/v1';

// Helper to get auth token
const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
};

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

// ============================================
// COLORS
// ============================================
const COLORS = { 
  primary: '#3B82F6', 
  secondary: '#10B981', 
  accent: '#F59E0B', 
  purple: '#8B5CF6', 
  cyan: '#06B6D4' 
};

// ============================================
// STAT CARD
// ============================================
const StatCard = ({ title, value, icon: Icon, color, link, extra }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -4 }}
    className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300"
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
    <div className="relative z-10">
      <div className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg w-fit`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div className="mt-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          {link && <Link href={link} className="text-xs text-blue-600 hover:underline">View all</Link>}
        </div>
        <p className="text-3xl font-bold text-gray-900 mt-1 tracking-tight">{value}</p>
        {extra && <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">{extra}</p>}
      </div>
    </div>
  </motion.div>
);

// ============================================
// LIVE PRODUCT TRACKER
// ============================================
const LiveProductTracker = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      setError(null);
      const token = getAuthToken();
      
      if (!token) {
        setError('Not authenticated');
        setLoading(false);
        return;
      }

      const response = await fetch(`${BASE_URL}/admin/products`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        let productsList = [];
        
        if (data.success) {
          productsList = Array.isArray(data.data) ? data.data : data.data?.products || [];
        } else if (Array.isArray(data)) {
          productsList = data;
        }
        
        setProducts(productsList);
      } else if (response.status === 401) {
        setError('Session expired');
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return;
      } else {
        setError(`HTTP ${response.status}`);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const lowStockCount = products.filter(p => (p.stock || 0) <= 10 && (p.stock || 0) > 0).length;
  const outOfStockCount = products.filter(p => (p.stock || 0) === 0).length;

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-slate-800 to-indigo-950 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-slate-800 to-indigo-950 rounded-2xl p-6 text-white">
        <div className="text-center py-8">
          <p className="text-red-400">Unable to load products</p>
          <p className="text-xs text-gray-400 mt-2">{error}</p>
          <button onClick={fetchProducts} className="mt-4 px-4 py-2 bg-white/10 rounded-lg text-sm hover:bg-white/20">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-800 to-indigo-950 rounded-2xl shadow-xl overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl">
              <SignalIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Product Tracker</h3>
              <p className="text-xs text-gray-400">Inventory monitoring</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-white">{products.length}</p>
            <p className="text-xs text-gray-400">Total</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-amber-400">{lowStockCount}</p>
            <p className="text-xs text-gray-400">Low Stock</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-rose-400">{outOfStockCount}</p>
            <p className="text-xs text-gray-400">Out of Stock</p>
          </div>
        </div>

        <div className="space-y-2 max-h-[350px] overflow-y-auto">
          {products.length === 0 ? (
            <div className="text-center py-8 text-gray-400">No products found</div>
          ) : (
            products.slice(0, 15).map((product) => {
              const stock = product.stock || 0;
              const stockColor = stock === 0 ? 'text-rose-400' : stock <= 5 ? 'text-rose-400' : stock <= 15 ? 'text-amber-400' : 'text-emerald-400';
              
              return (
                <div key={product._id} className="flex items-center justify-between bg-white/5 hover:bg-white/10 rounded-xl p-3 transition-all">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{product.name || 'Unnamed'}</p>
                    <p className="text-xs text-gray-500">ID: {product._id?.slice(-6)}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${stockColor}`}>{stock}</p>
                    <p className="text-xs text-gray-500">in stock</p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
          <Link href="/products" className="flex-1 text-center py-2 bg-white/10 rounded-xl text-sm text-white hover:bg-white/20 transition">View All</Link>
          <Link href="/products/create" className="flex-1 text-center py-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl text-sm text-white hover:opacity-90 transition">Add Product</Link>
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN DASHBOARD
// ============================================
export default function DashboardPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeInfo, setTimeInfo] = useState(getTimeInfo());
  const [error, setError] = useState(null);
  
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [newsletterStats, setNewsletterStats] = useState({
    totalActive: 0,
    totalUnsubscribed: 0,
    newThisMonth: 0,
  });

  useEffect(() => {
    fetchDashboardData();
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setTimeInfo(getTimeInfo());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setError(null);
      setLoading(true);
      
      const token = getAuthToken();
      
      console.log('🔑 Token:', token ? `Found (${token.substring(0, 20)}...)` : 'MISSING!');
      
      if (!token) {
        window.location.href = '/login';
        return;
      }
      
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
      
      // ===== FETCH ORDERS =====
      console.log('📡 Fetching orders...');
      
      let orders = [];
      
      try {
        const ordersRes = await fetch(`${BASE_URL}/admin/orders`, { headers });
        console.log('Orders status:', ordersRes.status);
        
        if (ordersRes.status === 401) {
          localStorage.removeItem('accessToken');
          window.location.href = '/login';
          return;
        }
        
        if (ordersRes.ok) {
          const data = await ordersRes.json();
          if (data.success) {
            orders = Array.isArray(data.data) ? data.data : data.data?.orders || [];
          } else if (Array.isArray(data)) {
            orders = data;
          }
          console.log(`✅ ${orders.length} orders loaded`);
        }
      } catch (err) {
        console.warn('Orders fetch error:', err.message);
      }
      
      // ===== FETCH PRODUCTS =====
      let products = [];
      try {
        const productsRes = await fetch(`${BASE_URL}/admin/products`, { headers });
        if (productsRes.ok) {
          const data = await productsRes.json();
          products = Array.isArray(data.data) ? data.data : data.data?.products || [];
        }
      } catch (err) {
        console.warn('Products fetch error:', err.message);
      }
      
      // ===== FETCH NEWSLETTER (from main backend) =====
      try {
        const newsRes = await fetch(`${MAIN_API_URL}/newsletter/stats`);
        if (newsRes.ok) {
          const data = await newsRes.json();
          if (data.success) {
            setNewsletterStats(data.data);
          }
        }
      } catch (err) {
        console.warn('Newsletter fetch error (non-critical):', err.message);
      }
      
      // ===== CALCULATE STATS =====
      const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
      const totalOrders = orders.length;
      const pendingOrders = orders.filter(o => o.status === 'pending').length;
      const uniqueCustomers = new Set(orders.map(o => o.user?._id || o.user).filter(Boolean));
      
      setStats({
        totalRevenue,
        totalOrders,
        pendingOrders,
        totalCustomers: uniqueCustomers.size || 0,
        totalProducts: products.length,
      });
      
      // ===== RECENT ORDERS =====
      setRecentOrders(orders.slice(0, 5).map(o => ({
        id: o._id,
        orderNumber: o.orderNumber || `#${o._id?.slice(-6)}`,
        customer: o.user?.email?.split('@')[0] || o.shippingAddress?.fullName || 'Guest',
        total: o.total || 0,
        status: o.status,
        date: new Date(o.createdAt).toLocaleDateString(),
      })));
      
      // ===== SALES DATA =====
      const monthlyData = {};
      orders.forEach(o => {
        if (o.createdAt) {
          const month = new Date(o.createdAt).toLocaleString('default', { month: 'short' });
          monthlyData[month] = (monthlyData[month] || 0) + (o.total || 0);
        }
      });
      
      const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const chartData = monthOrder.filter(m => monthlyData[m]).map(m => ({
        name: m,
        revenue: monthlyData[m],
        profit: monthlyData[m] * 0.4,
      }));
      
      setSalesData(chartData.length > 0 ? chartData : [{ name: 'No Data', revenue: 0, profit: 0 }]);
      
      setLoading(false);
      
    } catch (err) {
      console.error('Dashboard error:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-amber-100 text-amber-700',
      processing: 'bg-blue-100 text-blue-700',
      delivered: 'bg-emerald-100 text-emerald-700',
      cancelled: 'bg-rose-100 text-rose-700',
    };
    return colors[status?.toLowerCase()] || colors.pending;
  };

  const GreetingIcon = timeInfo.icon;

  // ============================================
  // LOADING STATE
  // ============================================
  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[80vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // ============================================
  // ERROR STATE
  // ============================================
  if (error) {
    return (
      <Layout>
        <div className="flex flex-col justify-center items-center h-[80vh] text-center px-4">
          <div className="bg-red-50 rounded-full p-4 mb-4">
            <svg className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Connection Error</h2>
          <p className="text-gray-500 mb-4">{error}</p>
          <p className="text-sm text-gray-400 mb-6">Make sure backend is running on port 5001</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Retry
          </button>
        </div>
      </Layout>
    );
  }

  // ============================================
  // MAIN DASHBOARD
  // ============================================
  return (
    <Layout>
      <div className="space-y-6 pb-8">
        {/* Greeting Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${timeInfo.gradient} p-8 text-white shadow-2xl`}
        >
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <GreetingIcon className="h-5 w-5" />
                <span className="text-sm font-medium">
                  {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </span>
              </div>
              <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-sm px-3 py-2 rounded-full">
                <ClockIcon className="h-4 w-4" />
                <span className="text-xs font-medium">{currentTime.toLocaleTimeString()}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 mb-2">
              <span className="text-5xl">{timeInfo.emoji}</span>
              <div>
                <h1 className="text-4xl font-bold tracking-tight">
                  {timeInfo.greeting}, <span className="text-white/90">{user?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'Admin'}</span>!
                </h1>
                <p className="text-white/70 text-lg mt-1">{timeInfo.message}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-6">
              <Link href="/orders" className="inline-flex items-center px-5 py-2.5 bg-white/15 backdrop-blur-sm rounded-xl hover:bg-white/25 text-sm font-medium">
                View Orders <ArrowRightIcon className="h-4 w-4 ml-2" />
              </Link>
              <Link href="/products/create" className="inline-flex items-center px-5 py-2.5 bg-white text-gray-900 rounded-xl hover:bg-gray-50 text-sm font-medium shadow-lg">
                <ShoppingBagIcon className="h-4 w-4 mr-2" />Add Product
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards Row 1 */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Revenue" value={`$${stats.totalRevenue.toLocaleString()}`} icon={CurrencyDollarIcon} color="from-blue-500 to-cyan-500" />
          <StatCard title="Total Orders" value={stats.totalOrders.toLocaleString()} icon={ShoppingBagIcon} color="from-emerald-500 to-teal-500" />
          <StatCard title="Pending Orders" value={stats.pendingOrders.toLocaleString()} icon={ClockIcon} color="from-amber-500 to-orange-500" />
          <StatCard title="Total Customers" value={stats.totalCustomers.toLocaleString()} icon={UserGroupIcon} color="from-purple-500 to-pink-500" />
        </div>

        {/* Stats Cards Row 2 */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard title="Total Products" value={stats.totalProducts.toLocaleString()} icon={ShoppingBagIcon} color="from-cyan-500 to-blue-500" />
          <StatCard 
            title="Newsletter" 
            value={newsletterStats.totalActive.toLocaleString()} 
            icon={EnvelopeIcon} 
            color="from-[#70C285] to-[#3D8F52]"
            link="/newsletter"
            extra={newsletterStats.newThisMonth > 0 ? `+${newsletterStats.newThisMonth} this month` : null}
          />
          <StatCard 
            title="Avg Order" 
            value={stats.totalOrders > 0 ? `$${(stats.totalRevenue / stats.totalOrders).toFixed(2)}` : '$0'} 
            icon={ArrowTrendingUpIcon} 
            color="from-rose-500 to-pink-500" 
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4">Revenue Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 12 }} />
                <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill={COLORS.primary} radius={[4, 4, 0, 0]} barSize={30} />
                <Line type="monotone" dataKey="profit" stroke={COLORS.secondary} strokeWidth={2} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <LiveProductTracker />
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">Recent Orders</h3>
              <Link href="/orders" className="text-sm text-blue-600 hover:underline">View all →</Link>
            </div>
            <div className="divide-y">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <div key={order.id} className="px-6 py-4 hover:bg-gray-50 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{order.orderNumber}</p>
                      <p className="text-sm text-gray-500">{order.customer}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <p className="font-semibold">${order.total.toFixed(2)}</p>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(order.status)}`}>
                        {order.status}
                      </span>
                      <span className="text-xs text-gray-400">{order.date}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-8 text-center text-gray-500">No orders found</div>
              )}
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={[
                  { name: 'Electronics', value: 45, color: COLORS.primary },
                  { name: 'Fashion', value: 25, color: COLORS.secondary },
                  { name: 'Books', value: 12, color: COLORS.accent },
                  { name: 'Home', value: 10, color: COLORS.purple },
                  { name: 'Sports', value: 8, color: COLORS.cyan },
                ]} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                  {[
                    { name: 'Electronics', value: 45, color: COLORS.primary },
                    { name: 'Fashion', value: 25, color: COLORS.secondary },
                    { name: 'Books', value: 12, color: COLORS.accent },
                    { name: 'Home', value: 10, color: COLORS.purple },
                    { name: 'Sports', value: 8, color: COLORS.cyan },
                  ].map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {[
                { name: 'Electronics', color: COLORS.primary },
                { name: 'Fashion', color: COLORS.secondary },
                { name: 'Books', color: COLORS.accent },
                { name: 'Home', color: COLORS.purple },
                { name: 'Sports', color: COLORS.cyan },
              ].map((cat, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></div>
                  <span className="text-xs text-gray-600">{cat.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}