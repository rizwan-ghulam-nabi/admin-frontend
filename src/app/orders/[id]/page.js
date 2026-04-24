'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { useOrderStore } from '@/store/orderStore';
import { usePermissions } from '@/lib/permissions';
import { ArrowLeftIcon, TruckIcon, CheckCircleIcon, XCircleIcon, ClockIcon, PrinterIcon } from '@heroicons/react/24/outline';
import Loader from '@/components/common/Loader';
import toast from 'react-hot-toast';

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id;
  
  const { selectedOrder, fetchOrder, updateOrderStatus, loading } = useOrderStore();
  const { canUpdateOrders } = usePermissions();
  const [fetchLoading, setFetchLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        await fetchOrder(orderId);
      } catch {
        router.push('/orders');
      } finally {
        setFetchLoading(false);
      }
    };
    loadOrder();
  }, [orderId]);

  const handleStatusUpdate = async (status) => {
    setUpdating(true);
    try {
      await updateOrderStatus(orderId, status);
      toast.success(`Order status updated to ${status}`);
    } catch (error) {
      toast.error(error.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handlePrintInvoice = () => {
    window.open(`${process.env.NEXT_PUBLIC_API_URL}/admin/orders/${orderId}/invoice`, '_blank');
  };

  if (fetchLoading) {
    return <Layout><div className="flex justify-center py-12"><Loader /></div></Layout>;
  }

  if (!selectedOrder) {
    return <Layout><div className="text-center py-12"><h2 className="text-2xl font-semibold">Order not found</h2></div></Layout>;
  }

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link href="/orders" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"><ArrowLeftIcon className="h-4 w-4 mr-1" /> Back to Orders</Link>
            <h1 className="text-2xl font-semibold text-gray-900 mt-2">Order #{selectedOrder.orderNumber || selectedOrder._id?.slice(-6)}</h1>
          </div>
          <div className="flex space-x-3">
            <button onClick={handlePrintInvoice} className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50"><PrinterIcon className="h-4 w-4 mr-2" /> Print Invoice</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
              <div className="space-y-4">
                {selectedOrder.items?.map((item, i) => (
                  <div key={i} className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center space-x-4">
                      {item.image && <img src={item.image} alt={item.name} className="h-16 w-16 object-cover rounded" />}
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity} × ${item.price?.toFixed(2)}</p>
                      </div>
                    </div>
                    <p className="font-medium text-gray-900">${(item.quantity * item.price).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 space-y-2">
                <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span className="font-medium">${selectedOrder.subtotal?.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span className="font-medium">${selectedOrder.shippingCost?.toFixed(2) || '0.00'}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Tax</span><span className="font-medium">${selectedOrder.tax?.toFixed(2) || '0.00'}</span></div>
                <div className="flex justify-between text-lg font-bold border-t pt-2"><span>Total</span><span>${selectedOrder.total?.toFixed(2)}</span></div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h3>
              <div className="mb-4">
                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${statusColors[selectedOrder.status] || statusColors.pending}`}>{selectedOrder.status}</span>
              </div>
              {canUpdateOrders && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 mb-2">Update Status:</p>
                  <div className="flex flex-wrap gap-2">
                    {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
                      <button key={status} onClick={() => handleStatusUpdate(status)} disabled={updating || selectedOrder.status === status} className={`px-3 py-1.5 text-sm rounded-md border ${selectedOrder.status === status ? 'bg-gray-100 text-gray-800 border-gray-300' : 'bg-white hover:bg-gray-50'}`}>{status}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
              <div className="space-y-2">
                <p><span className="text-gray-500">Name:</span> {selectedOrder.shippingAddress?.fullName || selectedOrder.customer?.name || 'N/A'}</p>
                <p><span className="text-gray-500">Email:</span> {selectedOrder.customer?.email || 'N/A'}</p>
                <p><span className="text-gray-500">Phone:</span> {selectedOrder.shippingAddress?.phone || 'N/A'}</p>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h3>
              {selectedOrder.shippingAddress ? (
                <div className="space-y-1 text-gray-600">
                  <p>{selectedOrder.shippingAddress.fullName}</p>
                  <p>{selectedOrder.shippingAddress.street}</p>
                  <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}</p>
                  <p>{selectedOrder.shippingAddress.country}</p>
                </div>
              ) : <p className="text-gray-500">No shipping address</p>}
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
              <p><span className="text-gray-500">Method:</span> {selectedOrder.paymentMethod || 'N/A'}</p>
              <p><span className="text-gray-500">Status:</span> <span className={`inline-flex px-2 py-0.5 rounded-full text-xs ${selectedOrder.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{selectedOrder.paymentStatus || 'pending'}</span></p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}