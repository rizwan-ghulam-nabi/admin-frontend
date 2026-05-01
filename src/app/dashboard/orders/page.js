// 'use client';

// import { useState, useEffect } from 'react';

// export default function AdminOrdersPage() {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [statusFilter, setStatusFilter] = useState('');

//   const API_URL = 'http://localhost:5001/api/v1/admin';

//   // Get token from cookie
//   const getToken = () => {
//     const cookies = document.cookie.split('; ');
//     const tokenCookie = cookies.find(row => row.startsWith('accessToken='));
//     return tokenCookie ? tokenCookie.split('=')[1] : null;
//   };

//   useEffect(() => { fetchOrders(); }, [statusFilter]);

//   const fetchOrders = async () => {
//     setLoading(true);
//     try {
//       const token = getToken();
      
//       if (!token) {
//         console.error('No auth token found');
//         setLoading(false);
//         return;
//       }

//       const params = new URLSearchParams({ limit: '50' });
//       if (statusFilter) params.append('status', statusFilter);
      
//       const res = await fetch(`${API_URL}/orders?${params}`, {
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         credentials: 'include',
//       });
      
//       if (!res.ok) {
//         const errData = await res.json();
//         throw new Error(errData.message || `HTTP ${res.status}`);
//       }
      
//       const data = await res.json();
//       console.log('Orders loaded:', data);
//       setOrders(data.data || data.orders || []);
//     } catch (err) {
//       console.error('Error:', err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateStatus = async (orderId, newStatus) => {
//     try {
//       const token = getToken();
//       if (!token) return;

//       const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         credentials: 'include',
//         body: JSON.stringify({ status: newStatus }),
//       });
      
//       if (res.ok) {
//         fetchOrders();
//       }
//     } catch (err) {
//       console.error('Error:', err);
//     }
//   };

//   const formatPrice = (price) => {
//     return new Intl.NumberFormat('en-PK', { 
//       style: 'currency', currency: 'PKR', minimumFractionDigits: 0 
//     }).format((price || 0) * 280);
//   };

//   if (loading) return (
//     <div className="p-8 flex justify-center">
//       <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
//     </div>
//   );

//   return (
//     <div className="p-6">
//       <div className="flex justify-between mb-6">
//         <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
//         <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500">
//           <option value="">All Orders</option>
//           <option value="pending">Pending</option>
//           <option value="processing">Processing</option>
//           <option value="shipped">Shipped</option>
//           <option value="delivered">Delivered</option>
//           <option value="cancelled">Cancelled</option>
//         </select>
//       </div>

//       <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
//         <table className="w-full">
//           <thead className="bg-gray-50 border-b">
//             <tr>
//               <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Order #</th>
//               <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Customer</th>
//               <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Items</th>
//               <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Total</th>
//               <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Payment</th>
//               <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
//               <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
//               <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Action</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-100">
//             {orders.map((order) => (
//               <tr key={order._id} className="hover:bg-gray-50 transition-colors">
//                 <td className="px-6 py-4">
//                   <p className="font-medium text-sm text-gray-900">{order.orderNumber || order._id?.slice(-8)}</p>
//                 </td>
//                 <td className="px-6 py-4">
//                   <p className="text-sm font-medium text-gray-900">{order.shippingAddress?.fullName || order.user?.name || 'N/A'}</p>
//                   <p className="text-xs text-gray-500">{order.shippingAddress?.phone || ''}</p>
//                 </td>
//                 <td className="px-6 py-4">
//                   <p className="text-sm text-gray-900">{order.items?.length || 0} items</p>
//                 </td>
//                 <td className="px-6 py-4">
//                   <p className="text-sm font-semibold text-gray-900">{formatPrice(order.total)}</p>
//                 </td>
//                 <td className="px-6 py-4">
//                   <span className="text-xs capitalize text-gray-600">{(order.paymentMethod || 'cod').replace('_', ' ')}</span>
//                 </td>
//                 <td className="px-6 py-4">
//                   <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
//                     order.status === 'delivered' ? 'bg-green-100 text-green-700' :
//                     order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
//                     order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
//                     order.status === 'processing' ? 'bg-purple-100 text-purple-700' :
//                     'bg-yellow-100 text-yellow-700'
//                   }`}>{order.status}</span>
//                 </td>
//                 <td className="px-6 py-4">
//                   <p className="text-xs text-gray-500">{order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-PK') : 'N/A'}</p>
//                 </td>
//                 <td className="px-6 py-4">
//                   <select 
//                     value={order.status} 
//                     onChange={(e) => updateStatus(order._id, e.target.value)} 
//                     className="px-2 py-1 border border-gray-200 rounded text-xs focus:ring-2 focus:ring-indigo-500"
//                   >
//                     <option value="pending">Pending</option>
//                     <option value="processing">Processing</option>
//                     <option value="shipped">Shipped</option>
//                     <option value="delivered">Delivered</option>
//                     <option value="cancelled">Cancelled</option>
//                   </select>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         {orders.length === 0 && (
//           <div className="px-6 py-12 text-center text-gray-500">No orders found</div>
//         )}
//       </div>
//     </div>
//   );
// }




'use client';

import { useState, useEffect } from 'react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const API_URL = 'http://localhost:5001/api/v1/admin';

  const getToken = () => {
    const cookies = document.cookie.split('; ');
    const tokenCookie = cookies.find(row => row.startsWith('accessToken='));
    return tokenCookie ? tokenCookie.split('=')[1] : null;
  };

  useEffect(() => { fetchOrders(); }, [statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = getToken();
      if (!token) { setLoading(false); return; }

      const params = new URLSearchParams({ limit: '50' });
      if (statusFilter) params.append('status', statusFilter);
      
      const res = await fetch(`${API_URL}/orders?${params}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });
      
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      const data = await res.json();
      setOrders(data.data || data.orders || []);
    } catch (err) {
      console.error('Error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      const token = getToken();
      if (!token) return;

      const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (res.ok) fetchOrders();
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PK', { 
      style: 'currency', currency: 'PKR', minimumFractionDigits: 0 
    }).format((price || 0) * 280);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-PK', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const getPaymentBadge = (method) => {
    if (!method) return { text: 'COD', color: 'bg-gray-100 text-gray-700' };
    if (method === 'card' || method === 'stripe') return { text: '💳 Card', color: 'bg-blue-100 text-blue-700' };
    if (method === 'cash_on_delivery') return { text: '💵 COD', color: 'bg-green-100 text-green-700' };
    return { text: method.replace('_', ' '), color: 'bg-gray-100 text-gray-700' };
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { color: 'bg-yellow-100 text-yellow-700', icon: '⏳' },
      processing: { color: 'bg-purple-100 text-purple-700', icon: '🔄' },
      shipped: { color: 'bg-blue-100 text-blue-700', icon: '🚚' },
      delivered: { color: 'bg-green-100 text-green-700', icon: '✅' },
      cancelled: { color: 'bg-red-100 text-red-700', icon: '❌' },
    };
    return badges[status] || { color: 'bg-gray-100 text-gray-700', icon: '📋' };
  };

  if (loading) return (
    <div className="p-8 flex justify-center">
      <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-1">{orders.length} orders found</p>
        </div>
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)} 
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Orders</option>
          <option value="pending">⏳ Pending</option>
          <option value="processing">🔄 Processing</option>
          <option value="shipped">🚚 Shipped</option>
          <option value="delivered">✅ Delivered</option>
          <option value="cancelled">❌ Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Order #</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Customer</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Items</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Total</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Payment</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => {
                const paymentBadge = getPaymentBadge(order.paymentMethod);
                const statusBadge = getStatusBadge(order.status);
                
                return (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <button 
                        onClick={() => setSelectedOrder(selectedOrder?._id === order._id ? null : order)}
                        className="font-medium text-sm text-indigo-600 hover:text-indigo-800 hover:underline"
                      >
                        {order.orderNumber || order._id?.slice(-8)}
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm font-medium text-gray-900">
                        {order.shippingAddress?.fullName || order.user?.name || 'N/A'}
                      </p>
                      <p className="text-xs text-gray-500">{order.shippingAddress?.phone || ''}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-gray-900">{order.items?.length || 0} items</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm font-semibold text-gray-900">{formatPrice(order.total)}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${paymentBadge.color}`}>
                        {paymentBadge.text}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}>
                        {statusBadge.icon} {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                    </td>
                    <td className="px-4 py-4">
                      <select 
                        value={order.status} 
                        onChange={(e) => updateStatus(order._id, e.target.value)} 
                        className="px-2 py-1 border border-gray-200 rounded text-xs focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {orders.length === 0 && (
          <div className="px-6 py-12 text-center text-gray-500">
            <div className="text-4xl mb-3">📦</div>
            <p>No orders found</p>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold">Order #{selectedOrder.orderNumber || selectedOrder._id?.slice(-8)}</h2>
                <p className="text-sm text-gray-500">{formatDate(selectedOrder.createdAt)}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-xl">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Items */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Items ({selectedOrder.items?.length || 0})</h3>
              <div className="space-y-2">
                {selectedOrder.items?.map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b text-sm">
                    <div className="flex items-center gap-3">
                      {item.image && <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />}
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-gray-500">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                      </div>
                    </div>
                    <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t">
                <span>Total</span>
                <span className="text-indigo-600">{formatPrice(selectedOrder.total)}</span>
              </div>
            </div>

            {/* Shipping Details */}
            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              <div>
                <h3 className="font-semibold mb-2">Shipping Address</h3>
                <p>{selectedOrder.shippingAddress?.fullName}</p>
                <p>{selectedOrder.shippingAddress?.street}</p>
                <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.zipCode}</p>
                <p>{selectedOrder.shippingAddress?.phone}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Payment</h3>
                <p className="capitalize">{(selectedOrder.paymentMethod || 'cod').replace('_', ' ')}</p>
                {selectedOrder.paymentDetails?.status && (
                  <p className="capitalize">Status: {selectedOrder.paymentDetails.status}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}