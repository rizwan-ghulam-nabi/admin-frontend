'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const ECOMM_API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export default function SalesPage() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSale, setEditingSale] = useState(null);
  const [filter, setFilter] = useState('all');

  const [form, setForm] = useState({
    product: '',
    saleType: 'seasonal',
    discountType: 'percentage',
    discountValue: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    badge: '',
    priority: 0,
    isActive: true
  });

  useEffect(() => {
    fetchSales();
    fetchProducts();
  }, []);

  const getToken = () => localStorage.getItem('token');
  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`
  });

  const fetchSales = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${ECOMM_API}/sales/admin/all`, { headers: getHeaders() });
      if (!res.ok) {
        const publicRes = await fetch(`${ECOMM_API}/sales`);
        const publicData = await publicRes.json();
        setSales(publicData.data || []);
      } else {
        const data = await res.json();
        setSales(data.data || []);
      }
    } catch (err) {
      toast.error('Failed to load sales');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${ECOMM_API}/products`);
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
      const method = editingSale ? 'PUT' : 'POST';
      const url = editingSale ? `${ECOMM_API}/sales/${editingSale._id}` : `${ECOMM_API}/sales`;
      
      const payload = {
        product: form.product,
        saleType: form.saleType,
        discountType: form.discountType,
        discountValue: parseFloat(form.discountValue),
        startDate: form.startDate,
        endDate: form.endDate,
        badge: form.badge || `${form.saleType.toUpperCase()} SALE`,
        priority: form.priority || 0,
        isActive: form.isActive
      };

      console.log('📤 Creating sale:', payload);

      const res = await fetch(url, { method, headers: getHeaders(), body: JSON.stringify(payload) });
      const data = await res.json();

      if (res.ok) {
        toast.success(editingSale ? 'Sale updated!' : 'Sale created!');
        fetchSales();
        fetchProducts();
        closeModal();
      } else {
        toast.error(data.message || 'Error saving sale');
      }
    } catch (err) {
      console.error('Submit error:', err);
      toast.error('Failed to save sale');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this sale?')) return;
    try {
      const res = await fetch(`${ECOMM_API}/sales/${id}`, { method: 'DELETE', headers: getHeaders() });
      if (res.ok) { 
        toast.success('Sale deleted!'); 
        fetchSales(); 
        fetchProducts(); 
      }
    } catch (err) { 
      toast.error('Failed to delete'); 
    }
  };

  const handleToggle = async (id, currentStatus) => {
    try {
      const res = await fetch(`${ECOMM_API}/sales/${id}/toggle`, {
        method: 'PUT', 
        headers: getHeaders(), 
        body: JSON.stringify({ isActive: !currentStatus })
      });
      if (res.ok) { 
        toast.success(`Sale ${!currentStatus ? 'activated' : 'deactivated'}!`); 
        fetchSales(); 
      }
    } catch (err) { 
      toast.error('Failed to update'); 
    }
  };

  const openEdit = (sale) => {
    setEditingSale(sale);
    setForm({
      product: sale.product?._id || sale.product,
      saleType: sale.saleType || 'seasonal',
      discountType: sale.discountType || 'percentage',
      discountValue: sale.discountValue || '',
      startDate: sale.startDate ? new Date(sale.startDate).toISOString().split('T')[0] : '',
      endDate: sale.endDate ? new Date(sale.endDate).toISOString().split('T')[0] : '',
      badge: sale.badge || '',
      priority: sale.priority || 0,
      isActive: sale.isActive
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSale(null);
    setForm({
      product: '',
      saleType: 'seasonal',
      discountType: 'percentage',
      discountValue: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      badge: '',
      priority: 0,
      isActive: true
    });
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

  const getStatus = (sale) => {
    const now = new Date();
    if (!sale.isActive) return { label: 'Inactive', color: 'gray' };
    if (new Date(sale.endDate) < now) return { label: 'Expired', color: 'red' };
    if (new Date(sale.startDate) > now) return { label: 'Scheduled', color: 'yellow' };
    return { label: 'Active', color: 'green' };
  };

  const getSaleTypeIcon = (type) => {
    switch(type) {
      case 'seasonal': return '🎉 Seasonal';
      case 'clearance': return '🏷️ Clearance';
      case 'holiday': return '🎄 Holiday';
      case 'festival': return '🎆 Festival';
      default: return type;
    }
  };

  const calcSalePrice = (sale) => {
    const price = getProductPrice(sale.product);
    if (sale.discountType === 'percentage') return price - (price * sale.discountValue / 100);
    return price - sale.discountValue;
  };

  const filteredSales = sales.filter(sale => filter === 'all' ? true : getStatus(sale).label.toLowerCase() === filter);

  const stats = {
    total: sales.length,
    active: sales.filter(s => getStatus(s).label === 'Active').length,
    scheduled: sales.filter(s => getStatus(s).label === 'Scheduled').length,
    expired: sales.filter(s => getStatus(s).label === 'Expired').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500"></div>
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">🛍️ Sales Management</h1>
          <p className="text-gray-400 text-sm mt-1">Create long-term sales & clearance events</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors text-sm"
        >
          <span className="text-lg">+</span> Create Sale
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <p className="text-gray-400 text-xs">All Sales</p>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-green-500/20">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
            <p className="text-gray-400 text-xs">Active</p>
          </div>
          <p className="text-2xl font-bold text-green-400">{stats.active}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-yellow-500/20">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
            <p className="text-gray-400 text-xs">Scheduled</p>
          </div>
          <p className="text-2xl font-bold text-yellow-400">{stats.scheduled}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-red-500/20">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
            <p className="text-gray-400 text-xs">Expired</p>
          </div>
          <p className="text-2xl font-bold text-red-400">{stats.expired}</p>
        </div>
      </div>

      {/* Sale Type Info Cards - Updated to match model */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl p-3 text-center border border-purple-500/30">
          <div className="text-xl mb-1">🎉</div>
          <div className="text-white text-sm font-semibold">Seasonal</div>
          <div className="text-purple-400 text-[10px]">Weeks to months</div>
        </div>
        <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-xl p-3 text-center border border-red-500/30">
          <div className="text-xl mb-1">🏷️</div>
          <div className="text-white text-sm font-semibold">Clearance</div>
          <div className="text-red-400 text-[10px]">End of season</div>
        </div>
        <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl p-3 text-center border border-green-500/30">
          <div className="text-xl mb-1">🎄</div>
          <div className="text-white text-sm font-semibold">Holiday</div>
          <div className="text-green-400 text-[10px]">Special events</div>
        </div>
        <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-xl p-3 text-center border border-orange-500/30">
          <div className="text-xl mb-1">🎆</div>
          <div className="text-white text-sm font-semibold">Festival</div>
          <div className="text-orange-400 text-[10px]">Celebration sale</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {['all', 'active', 'scheduled', 'expired', 'inactive'].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-colors ${
              filter === tab
                ? 'bg-purple-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Sales Table */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-700 bg-gray-800">
                <th className="text-left p-3 text-gray-300 text-xs font-semibold">Product</th>
                <th className="text-left p-3 text-gray-300 text-xs font-semibold">Discount</th>
                <th className="text-left p-3 text-gray-300 text-xs font-semibold">Type</th>
                <th className="text-left p-3 text-gray-300 text-xs font-semibold">Period</th>
                <th className="text-left p-3 text-gray-300 text-xs font-semibold">Status</th>
                <th className="text-right p-3 text-gray-300 text-xs font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map(sale => {
                const status = getStatus(sale);
                const originalPrice = getProductPrice(sale.product);
                const salePrice = calcSalePrice(sale);

                return (
                  <tr key={sale._id} className="border-b border-gray-700 hover:bg-gray-750 transition-colors">
                    <td className="p-3">
                      <p className="text-white text-sm font-medium">{getProductName(sale.product)}</p>
                      <p className="text-gray-400 text-[11px]">
                        Rs.{originalPrice * 280} → <span className="text-green-400">Rs.{Math.round(salePrice * 280)}</span>
                      </p>
                    </td>
                    <td className="p-3">
                      <span className="bg-purple-500 text-white px-2 py-0.5 rounded-full text-[11px] font-bold">
                        {sale.discountType === 'percentage' ? `-${sale.discountValue}%` : `-Rs.${sale.discountValue}`}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                        sale.saleType === 'seasonal' ? 'bg-purple-500/20 text-purple-400' :
                        sale.saleType === 'clearance' ? 'bg-red-500/20 text-red-400' :
                        sale.saleType === 'holiday' ? 'bg-green-500/20 text-green-400' :
                        'bg-orange-500/20 text-orange-400'
                      }`}>
                        {getSaleTypeIcon(sale.saleType)}
                      </span>
                    </td>
                    <td className="p-3 text-gray-300 text-[11px]">
                      <p>{new Date(sale.startDate).toLocaleDateString()}</p>
                      <p className="text-gray-500">to {new Date(sale.endDate).toLocaleDateString()}</p>
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                        status.color === 'green' ? 'bg-green-500 text-white' :
                        status.color === 'yellow' ? 'bg-yellow-500 text-white' :
                        status.color === 'red' ? 'bg-red-500 text-white' : 'bg-gray-600 text-white'
                      }`}>
                        <span className="w-1 h-1 rounded-full bg-white"></span>
                        {status.label}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handleToggle(sale._id, sale.isActive)}
                          className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                            sale.isActive ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                          }`}>
                          {sale.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button onClick={() => openEdit(sale)}
                          className="px-2 py-1 rounded-md text-[11px] font-medium bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(sale._id)}
                          className="px-2 py-1 rounded-md text-[11px] font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredSales.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center">
                    <span className="text-3xl block mb-2">🛍️</span>
                    <p className="text-gray-400 text-sm">No sales found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80" onClick={closeModal} />
          <div className="relative bg-gray-800 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl">
            <div className="sticky top-0 bg-gray-800 px-5 py-3 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-bold text-white">{editingSale ? 'Edit Sale' : 'Create Sale'}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-white text-xl">&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-3">
              {/* Product Select */}
              <div>
                <label className="block text-gray-300 text-xs font-medium mb-1">Product *</label>
                <select 
                  value={form.product} 
                  onChange={e => setForm({ ...form, product: e.target.value })} 
                  required
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                >
                  <option value="">Select product...</option>
                  {products.map(p => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                  ))}
                </select>
              </div>

              {/* Sale Type Buttons - Matching model enum */}
              <div>
                <label className="block text-gray-300 text-xs font-medium mb-1">Sale Type *</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'seasonal', label: '🎉 Seasonal', color: 'purple' },
                    { value: 'clearance', label: '🏷️ Clearance', color: 'red' },
                    { value: 'holiday', label: '🎄 Holiday', color: 'green' },
                    { value: 'festival', label: '🎆 Festival', color: 'orange' }
                  ].map(type => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setForm({ ...form, saleType: type.value })}
                      className={`py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                        form.saleType === type.value
                          ? `bg-${type.color}-500 text-white`
                          : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Discount Type & Value */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 text-xs font-medium mb-1">Discount Type</label>
                  <div className="flex gap-2">
                    {['percentage', 'fixed'].map(type => (
                      <button key={type} type="button" onClick={() => setForm({ ...form, discountType: type })}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-medium capitalize ${
                          form.discountType === type ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                        }`}>
                        {type === 'percentage' ? '%' : 'Rs'}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-gray-300 text-xs font-medium mb-1">Value *</label>
                  <input 
                    type="number" 
                    value={form.discountValue} 
                    onChange={e => setForm({ ...form, discountValue: e.target.value })}
                    required
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-purple-500"
                    placeholder={form.discountType === 'percentage' ? '30' : '500'}
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 text-xs font-medium mb-1">Start Date</label>
                  <input 
                    type="date" 
                    value={form.startDate} 
                    onChange={e => setForm({ ...form, startDate: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-1.5 text-white text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-xs font-medium mb-1">End Date *</label>
                  <input 
                    type="date" 
                    value={form.endDate} 
                    onChange={e => setForm({ ...form, endDate: e.target.value })}
                    required
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-1.5 text-white text-sm" 
                  />
                </div>
              </div>

              {/* Priority & Badge */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 text-xs font-medium mb-1">Priority</label>
                  <input 
                    type="number" 
                    value={form.priority} 
                    onChange={e => setForm({ ...form, priority: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-1.5 text-white text-sm"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-xs font-medium mb-1">Badge</label>
                  <input 
                    type="text" 
                    value={form.badge} 
                    onChange={e => setForm({ ...form, badge: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-1.5 text-white text-sm"
                    placeholder="SALE"
                  />
                </div>
              </div>

              {/* Active Status Toggle */}
              <div className="flex justify-between items-center bg-gray-700/50 rounded-lg p-3">
                <span className="text-gray-300 text-sm font-medium">Active Status</span>
                <button 
                  type="button" 
                  onClick={() => setForm({ ...form, isActive: !form.isActive })}
                  className={`w-12 h-6 rounded-full transition-colors relative ${form.isActive ? 'bg-purple-500' : 'bg-gray-500'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform shadow ${form.isActive ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal}
                  className="flex-1 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium">
                  Cancel
                </button>
                <button type="submit"
                  className="flex-1 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium">
                  {editingSale ? 'Update Sale' : 'Create Sale'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}