'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '@/components/Layout';
import { useOrderStore } from '@/store/orderStore';
import { usePermissions } from '@/lib/permissions';
import { 
  MagnifyingGlassIcon, 
  EyeIcon, 
  TruckIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon,
  FunnelIcon,
  ArrowPathIcon,
  DocumentArrowDownIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  UsersIcon,
  ChartBarIcon,
  SparklesIcon,
  CalendarIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import Loader from '@/components/common/Loader';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

// ============================================
// STAT CARD COMPONENT
// ============================================
const StatCard = ({ title, value, icon: Icon, trend, color }) => {
  const gradients = {
    blue: 'from-blue-500 to-cyan-500',
    green: 'from-emerald-500 to-teal-500',
    purple: 'from-purple-500 to-pink-500',
    orange: 'from-amber-500 to-orange-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradients[color]} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${gradients[color]} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          {trend !== undefined && trend !== 0 && (
            <span className={`text-sm font-medium ${trend > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {trend > 0 ? '+' : ''}{trend}%
            </span>
          )}
        </div>
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1 tracking-tight">{value}</p>
        </div>
      </div>
    </motion.div>
  );
};

// ============================================
// ORDER ROW COMPONENT
// ============================================
const OrderRow = ({ order, index }) => {
  const getStatusBadge = (status) => {
    const configs = {
      pending: { gradient: 'from-amber-400 to-orange-400', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: ClockIcon, label: 'Pending' },
      processing: { gradient: 'from-blue-400 to-cyan-400', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: ClockIcon, label: 'Processing' },
      shipped: { gradient: 'from-purple-400 to-indigo-400', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', icon: TruckIcon, label: 'Shipped' },
      delivered: { gradient: 'from-emerald-400 to-teal-400', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircleIcon, label: 'Delivered' },
      cancelled: { gradient: 'from-rose-400 to-red-400', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', icon: XCircleIcon, label: 'Cancelled' },
    };
    const config = configs[status] || configs.pending;
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
        <Icon className="h-3.5 w-3.5 mr-1" />
        {config.label}
      </span>
    );
  };

  const getPaymentBadge = (status) => {
    const configs = {
      paid: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Paid' },
      pending: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Pending' },
      failed: { bg: 'bg-rose-50', text: 'text-rose-700', label: 'Failed' },
      refunded: { bg: 'bg-gray-50', text: 'text-gray-700', label: 'Refunded' },
    };
    const config = configs[status] || configs.pending;
    return <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${config.bg} ${config.text}`}>{config.label}</span>;
  };

  return (
    <motion.tr
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-transparent transition-all duration-200"
    >
      <td className="px-6 py-5 whitespace-nowrap">
        <Link href={`/orders/${order._id}`} className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
          {order.orderNumber || `#${order._id?.slice(-6)}`}
        </Link>
      </td>
      <td className="px-6 py-5 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mr-3">
            <span className="text-sm font-medium text-gray-600">
              {order.customer?.name?.charAt(0) || order.user?.email?.charAt(0) || 'G'}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{order.customer?.name || order.user?.name || order.shippingAddress?.fullName || 'Guest'}</p>
            <p className="text-xs text-gray-500">{order.customer?.email || order.user?.email || 'No email'}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-5 whitespace-nowrap">
        <span className="font-semibold text-gray-900">${Number(order.total || 0).toFixed(2)}</span>
        <p className="text-xs text-gray-500">{order.items?.length || 0} items</p>
       </td>
      <td className="px-6 py-5 whitespace-nowrap">
        {getPaymentBadge(order.paymentStatus || order.paymentMethod === 'card' ? 'paid' : 'pending')}
       </td>
      <td className="px-6 py-5 whitespace-nowrap">
        {getStatusBadge(order.status)}
       </td>
      <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500">
        <div className="flex items-center">
          <CalendarIcon className="h-4 w-4 mr-1.5 text-gray-400" />
          {new Date(order.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </div>
       </td>
      <td className="px-6 py-5 whitespace-nowrap text-right">
        <Menu as="div" className="relative inline-block text-left">
          <Menu.Button className="p-2 rounded-lg hover:bg-gray-100 transition-colors group-hover:opacity-100">
            <svg className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </Menu.Button>
          <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
            <Menu.Items className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-xl bg-white shadow-xl border border-gray-100 focus:outline-none">
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <Link href={`/orders/${order._id}`} className={`flex items-center px-4 py-2.5 text-sm ${active ? 'bg-gray-50 text-blue-600' : 'text-gray-700'}`}>
                      <EyeIcon className="h-4 w-4 mr-3" /> View Details
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button className={`flex items-center w-full px-4 py-2.5 text-sm ${active ? 'bg-gray-50 text-blue-600' : 'text-gray-700'}`}>
                      <DocumentArrowDownIcon className="h-4 w-4 mr-3" /> Download Invoice
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button className={`flex items-center w-full px-4 py-2.5 text-sm ${active ? 'bg-gray-50 text-blue-600' : 'text-gray-700'}`}>
                      <TruckIcon className="h-4 w-4 mr-3" /> Update Status
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
       </td>
    </motion.tr>
  );
};

// ============================================
// PAGINATION COMPONENT
// ============================================
const ModernPagination = ({ currentPage, totalItems, pageSize, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / pageSize);
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage - 2);
  let end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);

  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
      <p className="text-sm text-gray-500">
        Showing <span className="font-medium">{((currentPage - 1) * pageSize) + 1}</span> to{' '}
        <span className="font-medium">{Math.min(currentPage * pageSize, totalItems)}</span> of{' '}
        <span className="font-medium">{totalItems}</span> orders
      </p>
      <nav className="flex items-center space-x-1">
        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        {start > 1 && <span className="px-2 text-gray-400">...</span>}
        {pages.map(page => (
          <button key={page} onClick={() => onPageChange(page)} className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${page === currentPage ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'}`}>{page}</button>
        ))}
        {end < totalPages && <span className="px-2 text-gray-400">...</span>}
        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </nav>
    </div>
  );
};

// ============================================
// MAIN ORDERS PAGE
// ============================================
export default function OrdersPage() {
  const { orders, pagination, loading, filters, fetchOrders, setPage, setFilters, resetFilters } = useOrderStore();
  const { canManageOrders } = usePermissions();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // ============ REAL STATS STATE ============
  const [realStats, setRealStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    avgOrderValue: 0,
    trends: { orders: 0, revenue: 0, pending: 0, avg: 0 }
  });

  // ============ CALCULATE REAL STATS FROM ORDERS ============
  useEffect(() => {
    if (orders && orders.length > 0) {
      // Calculate real stats from actual order data
      const totalOrders = pagination?.total || orders.length;
      const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
      const pendingOrders = orders.filter(order => order.status === 'pending').length;
      const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
      
      // Calculate trends (compare with previous period if available)
      const currentMonthOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        const now = new Date();
        return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
      });
      
      const lastMonthOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        const now = new Date();
        const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
        const lastMonthYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
        return orderDate.getMonth() === lastMonth && orderDate.getFullYear() === lastMonthYear;
      });
      
      const ordersTrend = lastMonthOrders.length > 0
        ? ((currentMonthOrders.length - lastMonthOrders.length) / lastMonthOrders.length) * 100
        : 0;
      
      const currentRevenue = currentMonthOrders.reduce((sum, o) => sum + (o.total || 0), 0);
      const lastRevenue = lastMonthOrders.reduce((sum, o) => sum + (o.total || 0), 0);
      const revenueTrend = lastRevenue > 0 ? ((currentRevenue - lastRevenue) / lastRevenue) * 100 : 0;
      
      setRealStats({
        totalOrders: totalOrders,
        totalRevenue: totalRevenue,
        pendingOrders: pendingOrders,
        avgOrderValue: avgOrderValue,
        trends: {
          orders: Number(ordersTrend.toFixed(1)),
          revenue: Number(revenueTrend.toFixed(1)),
          pending: 0,
          avg: 0
        }
      });
    }
  }, [orders, pagination]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setTimeout(() => setRefreshing(false), 500);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ search: searchTerm });
  };

  // ============ REMOVED MOCK STATS - NOW USING REAL DATA ============

  if (!canManageOrders) {
    return (
      <Layout>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
          <div className="inline-flex p-5 bg-red-50 rounded-2xl mb-4">
            <XCircleIcon className="h-12 w-12 text-red-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Access Denied</h2>
          <p className="text-gray-500 mt-2">You don't have permission to view orders.</p>
        </motion.div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8 pb-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <ShoppingBagIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Orders</h1>
                <p className="text-gray-500 mt-0.5">Manage and track all customer orders</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <ArrowPathIcon className={`h-5 w-5 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
            </motion.button>
            <Link href="/orders/export" className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition font-medium flex items-center space-x-2 shadow-sm">
              <DocumentArrowDownIcon className="h-5 w-5" />
              <span>Export</span>
            </Link>
          </div>
        </motion.div>

        {/* Stats Cards - NOW USING REAL DATA */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Total Orders" 
            value={realStats.totalOrders.toLocaleString()} 
            icon={ShoppingBagIcon} 
            trend={realStats.trends.orders} 
            color="blue" 
          />
          <StatCard 
            title="Total Revenue" 
            value={`$${realStats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
            icon={CurrencyDollarIcon} 
            trend={realStats.trends.revenue} 
            color="green" 
          />
          <StatCard 
            title="Pending Orders" 
            value={realStats.pendingOrders} 
            icon={ClockIcon} 
            trend={undefined} 
            color="orange" 
          />
          <StatCard 
            title="Avg Order Value" 
            value={`$${realStats.avgOrderValue.toFixed(2)}`} 
            icon={ChartBarIcon} 
            trend={undefined} 
            color="purple" 
          />
        </div>

        {/* Filters Bar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="flex flex-wrap items-center gap-3">
            <form onSubmit={handleSearch} className="flex-1 min-w-[280px]">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by order #, customer name or email..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50"
                />
              </div>
            </form>

            <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center px-5 py-3 border rounded-xl transition-all ${showFilters ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-gray-200 hover:bg-gray-50 text-gray-700'}`}>
              <FunnelIcon className="h-5 w-5 mr-2" /> Filters
              <ChevronDownIcon className={`h-4 w-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            <select value={selectedStatus} onChange={(e) => { setSelectedStatus(e.target.value); setFilters({ status: e.target.value }); }} className="px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select value={selectedPaymentStatus} onChange={(e) => { setSelectedPaymentStatus(e.target.value); setFilters({ paymentStatus: e.target.value }); }} className="px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="">All Payments</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>

            {(filters.search || filters.status || filters.paymentStatus) && (
              <button onClick={() => { resetFilters(); setSearchTerm(''); setSelectedStatus(''); setSelectedPaymentStatus(''); }} className="text-sm text-blue-600 hover:text-blue-700 font-medium">Clear all</button>
            )}
          </div>

          {/* Extended Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 mt-4 border-t border-gray-100">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Date Range</label>
                    <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg">
                      <option>Today</option>
                      <option>Yesterday</option>
                      <option>Last 7 days</option>
                      <option>Last 30 days</option>
                      <option>Custom</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Min Amount</label>
                    <input type="number" placeholder="$ Min" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Max Amount</label>
                    <input type="number" placeholder="$ Max" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Orders Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-16 flex justify-center">
              <div className="flex flex-col items-center space-y-3">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full blur-xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-30 animate-pulse"></div>
                  <div className="relative animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
                </div>
                <p className="text-gray-500 animate-pulse">Loading orders...</p>
              </div>
            </div>
          ) : orders.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Order #</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {orders.map((order, index) => (
                      <OrderRow key={order._id} order={order} index={index} />
                    ))}
                  </tbody>
                </table>
              </div>
              <ModernPagination
                currentPage={pagination.page}
                totalItems={pagination.total}
                pageSize={pagination.limit}
                onPageChange={setPage}
              />
            </>
          ) : (
            <div className="p-16 text-center">
              <div className="inline-flex p-4 bg-gray-50 rounded-2xl mb-4">
                <ShoppingBagIcon className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">No orders found</h3>
              <p className="text-gray-500 mt-1">Try adjusting your filters or search terms.</p>
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
}