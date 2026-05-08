
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const ADMIN_API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';
const ECOMM_API = 'http://localhost:5000/api/v1';

export default function DealsPage() {
  const [deals, setDeals] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);
  const [filter, setFilter] = useState('all');

  const [form, setForm] = useState({
    product: '',
    discountType: 'percentage',
    discountValue: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    badge: '',
    priority: 0,
    isActive: true
  });

  useEffect(() => {
    fetchDeals();
    fetchProducts();
  }, []);

  const getToken = () => localStorage.getItem('token');
  const getEcommHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`
  });

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${ECOMM_API}/deals/admin`, { headers: getEcommHeaders() });
      if (!res.ok) {
        const publicRes = await fetch(`${ECOMM_API}/deals`);
        const publicData = await publicRes.json();
        setDeals(publicData.data || []);
      } else {
        const data = await res.json();
        setDeals(data.data || []);
      }
    } catch (err) {
      toast.error('Failed to load deals');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      let res = await fetch(`${ECOMM_API}/products`);
      if (!res.ok) res = await fetch(`${ECOMM_API}/products`, { headers: getEcommHeaders() });
      if (!res.ok) res = await fetch(`${ECOMM_API}/deals/available-products`, { headers: getEcommHeaders() });
      const data = await res.json();
      let productList = [];
      if (data.data?.products) productList = data.data.products;
      else if (data.products) productList = data.products;
      else if (Array.isArray(data.data)) productList = data.data;
      else if (Array.isArray(data)) productList = data;
      setProducts(productList);
    } catch (err) {
      toast.error('Failed to load products');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.product || !form.discountValue || !form.endDate) {
      toast.error('Please fill all required fields');
      return;
    }
    try {
      const method = editingDeal ? 'PUT' : 'POST';
      const url = editingDeal ? `${ECOMM_API}/deals/${editingDeal._id}` : `${ECOMM_API}/deals`;
      const res = await fetch(url, { method, headers: getEcommHeaders(), body: JSON.stringify(form) });
      const data = await res.json();
      if (res.ok) {
        toast.success(editingDeal ? 'Deal updated!' : 'Deal created!');
        fetchDeals(); fetchProducts(); closeModal();
      } else {
        toast.error(data.message || 'Error saving deal');
      }
    } catch (err) {
      toast.error('Failed to save deal');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this deal?')) return;
    try {
      const res = await fetch(`${ECOMM_API}/deals/${id}`, { method: 'DELETE', headers: getEcommHeaders() });
      if (res.ok) { toast.success('Deal deleted!'); fetchDeals(); fetchProducts(); }
    } catch (err) { toast.error('Failed to delete'); }
  };

  const handleToggle = async (id, currentStatus) => {
    try {
      const res = await fetch(`${ECOMM_API}/deals/${id}`, {
        method: 'PUT', headers: getEcommHeaders(), body: JSON.stringify({ isActive: !currentStatus })
      });
      if (res.ok) { toast.success(`Deal ${!currentStatus ? 'activated' : 'deactivated'}!`); fetchDeals(); }
    } catch (err) { toast.error('Failed to update'); }
  };

  const openEdit = (deal) => {
    setEditingDeal(deal);
    setForm({
      product: deal.product?._id || deal.product,
      discountType: deal.discountType || 'percentage',
      discountValue: deal.discountValue || '',
      startDate: deal.startDate ? new Date(deal.startDate).toISOString().split('T')[0] : '',
      endDate: deal.endDate ? new Date(deal.endDate).toISOString().split('T')[0] : '',
      badge: deal.badge || '', priority: deal.priority || 0, isActive: deal.isActive
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false); setEditingDeal(null);
    setForm({ product: '', discountType: 'percentage', discountValue: '', startDate: new Date().toISOString().split('T')[0], endDate: '', badge: '', priority: 0, isActive: true });
  };

  const getProductName = (product) => {
    if (!product) return 'Unknown';
    if (typeof product === 'object') return product.name || 'Unknown';
    return products.find(p => p._id === product)?.name || 'Unknown';
  };

  const getProductPrice = (product) => {
    if (!product) return 0;
    if (typeof product === 'object') return product.price || 0;
    return products.find(p => p._id === product)?.price || 0;
  };

  const getStatus = (deal) => {
    const now = new Date();
    if (!deal.isActive) return { label: 'Inactive', color: 'gray' };
    if (new Date(deal.endDate) < now) return { label: 'Expired', color: 'red' };
    if (new Date(deal.startDate) > now) return { label: 'Scheduled', color: 'yellow' };
    return { label: 'Active', color: 'green' };
  };

  const calcSalePrice = (deal) => {
    const price = getProductPrice(deal.product);
    if (deal.discountType === 'percentage') return price - (price * deal.discountValue / 100);
    return price - deal.discountValue;
  };

  const filteredDeals = deals.filter(deal => filter === 'all' ? true : getStatus(deal).label.toLowerCase() === filter);

  const stats = {
    total: deals.length,
    active: deals.filter(d => getStatus(d).label === 'Active').length,
    scheduled: deals.filter(d => getStatus(d).label === 'Scheduled').length,
    expired: deals.filter(d => getStatus(d).label === 'Expired').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">🏷️ Deals Management</h1>
          <p className="text-gray-400 text-sm mt-1">Create deals & auto-update product prices</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary-500 hover:bg-primary-600 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <span className="text-lg">+</span> Create Deal
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <p className="text-gray-400 text-sm">All Deals</p>
          <p className="text-3xl font-bold text-white mt-1">{stats.total}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-5 border border-green-500/20">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-green-400"></span>
            <p className="text-gray-400 text-sm">Active</p>
          </div>
          <p className="text-3xl font-bold text-green-400">{stats.active}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-5 border border-yellow-500/20">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
            <p className="text-gray-400 text-sm">Scheduled</p>
          </div>
          <p className="text-3xl font-bold text-yellow-400">{stats.scheduled}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-5 border border-red-500/20">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-red-400"></span>
            <p className="text-gray-400 text-sm">Expired</p>
          </div>
          <p className="text-3xl font-bold text-red-400">{stats.expired}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {['all', 'active', 'scheduled', 'expired', 'inactive'].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
              filter === tab
                ? 'bg-primary-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white border border-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Deals Table */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700 bg-gray-800">
              <th className="text-left p-4 text-gray-300 text-sm font-semibold">Product</th>
              <th className="text-left p-4 text-gray-300 text-sm font-semibold">Discount</th>
              <th className="text-left p-4 text-gray-300 text-sm font-semibold">Period</th>
              <th className="text-left p-4 text-gray-300 text-sm font-semibold">Status</th>
              <th className="text-right p-4 text-gray-300 text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDeals.map(deal => {
              const status = getStatus(deal);
              const originalPrice = getProductPrice(deal.product);
              const salePrice = calcSalePrice(deal);

              return (
                <tr key={deal._id} className="border-b border-gray-700 hover:bg-gray-750 transition-colors">
                  <td className="p-4">
                    <p className="text-white font-medium">{getProductName(deal.product)}</p>
                    <p className="text-gray-400 text-xs mt-0.5">
                      Rs.{originalPrice * 280} → <span className="text-green-400">Rs.{Math.round(salePrice * 280)}</span>
                    </p>
                  </td>
                  <td className="p-4">
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      {deal.discountType === 'percentage' ? `-${deal.discountValue}%` : `-Rs.${deal.discountValue}`}
                    </span>
                  </td>
                  <td className="p-4 text-gray-300 text-sm">
                    <p>{new Date(deal.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                    <p className="text-gray-500">to {new Date(deal.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                      status.color === 'green' ? 'bg-green-500 text-white' :
                      status.color === 'yellow' ? 'bg-yellow-500 text-white' :
                      status.color === 'red' ? 'bg-red-500 text-white' : 'bg-gray-600 text-white'
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                      {status.label}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleToggle(deal._id, deal.isActive)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          deal.isActive ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                        }`}>
                        {deal.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button onClick={() => openEdit(deal)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(deal._id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredDeals.length === 0 && (
              <tr>
                <td colSpan={5} className="p-12 text-center">
                  <span className="text-4xl block mb-3">🏷️</span>
                  <p className="text-gray-400">No deals found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80" onClick={closeModal} />
          <div className="relative bg-gray-800 rounded-2xl w-full max-w-lg border border-gray-700 shadow-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">{editingDeal ? 'Edit Deal' : 'Create New Deal'}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1.5">Product *</label>
                <select value={form.product} onChange={e => setForm({ ...form, product: e.target.value })} required
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary-500 transition-colors">
                  <option value="">Select product...</option>
                  {products.map(p => (
                    <option key={p._id} value={p._id}>{p.name} - Rs.{p.price * 280}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1.5">Discount Type</label>
                <div className="flex gap-2">
                  {['percentage', 'fixed'].map(type => (
                    <button key={type} type="button" onClick={() => setForm({ ...form, discountType: type })}
                      className={`flex-1 py-3 rounded-xl text-sm font-medium capitalize transition-all ${
                        form.discountType === type ? 'bg-primary-500 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                      }`}>
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1.5">Value ({form.discountType === 'percentage' ? '%' : 'Rs.'}) *</label>
                <input type="number" value={form.discountValue} onChange={e => setForm({ ...form, discountValue: e.target.value })} required
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary-500 transition-colors"
                  placeholder={form.discountType === 'percentage' ? 'e.g., 30' : 'e.g., 500'} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1.5">Start Date</label>
                  <input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1.5">End Date *</label>
                  <input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} required
                    className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary-500 transition-colors" />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1.5">Badge (optional)</label>
                <input type="text" value={form.badge} onChange={e => setForm({ ...form, badge: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary-500 transition-colors"
                  placeholder="e.g., Flash Sale" />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1.5">Priority</label>
                <input type="number" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary-500 transition-colors" />
              </div>

              <div className="flex items-center justify-between bg-gray-700 rounded-xl p-4">
                <span className="text-gray-300 text-sm font-medium">Active Status</span>
                <button type="button" onClick={() => setForm({ ...form, isActive: !form.isActive })}
                  className={`w-14 h-7 rounded-full transition-colors relative ${form.isActive ? 'bg-primary-500' : 'bg-gray-500'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform shadow ${form.isActive ? 'translate-x-8' : 'translate-x-1'}`} />
                </button>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal}
                  className="flex-1 py-3 bg-gray-700 text-gray-300 rounded-xl hover:bg-gray-600 transition-colors text-sm font-medium">
                  Cancel
                </button>
                <button type="submit"
                  className="flex-1 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors text-sm font-medium">
                  {editingDeal ? 'Update Deal' : 'Create Deal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}