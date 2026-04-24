'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { useUserStore } from '@/store/userStore';
import { usePermissions } from '@/lib/permissions';
import { ArrowLeftIcon, EnvelopeIcon, PhoneIcon, MapPinIcon, CalendarIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import Loader from '@/components/common/Loader';
import DataTable from '@/components/tables/DataTable';
import toast from 'react-hot-toast';

export default function CustomerDetailPage() {
  const router = useRouter();
  const params = useParams();
  const customerId = params.id;
  
  const { selectedUser, fetchUser, updateUserStatus, userOrders, fetchUserOrders, loading } = useUserStore();
  const { canUpdateUsers } = usePermissions();
  const [fetchLoading, setFetchLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchUser(customerId), fetchUserOrders(customerId)]);
      } catch {
        router.push('/customers');
      } finally {
        setFetchLoading(false);
      }
    };
    loadData();
  }, [customerId]);

  const handleStatusUpdate = async (status) => {
    setUpdating(true);
    try {
      await updateUserStatus(customerId, status);
      toast.success(`Customer status updated to ${status}`);
    } catch (error) {
      toast.error(error.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const orderColumns = [
    { key: 'orderNumber', header: 'Order #', render: (value, row) => value || `#${row._id?.slice(-6)}` },
    { key: 'total', header: 'Total', render: (value) => `$${Number(value).toFixed(2)}` },
    { key: 'status', header: 'Status', render: (value) => <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${value === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{value}</span> },
    { key: 'createdAt', header: 'Date', render: (value) => new Date(value).toLocaleDateString() },
    { key: 'actions', header: '', render: (_, row) => <Link href={`/orders/${row._id}`} className="text-blue-600 hover:text-blue-900">View</Link> },
  ];

  if (fetchLoading) {
    return <Layout><div className="flex justify-center py-12"><Loader /></div></Layout>;
  }

  if (!selectedUser) {
    return <Layout><div className="text-center py-12"><h2 className="text-2xl font-semibold">Customer not found</h2></div></Layout>;
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link href="/customers" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"><ArrowLeftIcon className="h-4 w-4 mr-1" /> Back to Customers</Link>
          <h1 className="text-2xl font-semibold text-gray-900 mt-2">{selectedUser.name || 'Customer Details'}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center"><span className="text-3xl text-blue-600">{selectedUser.name?.charAt(0) || '?'}</span></div>
              <div>
                <h3 className="text-xl font-semibold">{selectedUser.name || 'N/A'}</h3>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${selectedUser.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{selectedUser.status || 'active'}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-gray-600"><EnvelopeIcon className="h-5 w-5 mr-3 text-gray-400" />{selectedUser.email}</div>
              {selectedUser.phone && <div className="flex items-center text-gray-600"><PhoneIcon className="h-5 w-5 mr-3 text-gray-400" />{selectedUser.phone}</div>}
              <div className="flex items-center text-gray-600"><CalendarIcon className="h-5 w-5 mr-3 text-gray-400" />Joined {new Date(selectedUser.createdAt).toLocaleDateString()}</div>
            </div>

            {canUpdateUsers && (
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-gray-600 mb-3">Update Status:</p>
                <div className="flex gap-2">
                  {['active', 'inactive', 'blocked'].map(status => (
                    <button key={status} onClick={() => handleStatusUpdate(status)} disabled={updating || selectedUser.status === status} className={`px-3 py-1.5 text-sm rounded-md border ${selectedUser.status === status ? 'bg-gray-100 text-gray-800 border-gray-300' : 'bg-white hover:bg-gray-50'}`}>{status}</button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg"><p className="text-2xl font-bold text-gray-900">{selectedUser.totalOrders || 0}</p><p className="text-sm text-gray-500">Total Orders</p></div>
                <div className="text-center p-4 bg-gray-50 rounded-lg"><p className="text-2xl font-bold text-gray-900">${(selectedUser.totalSpent || 0).toFixed(2)}</p><p className="text-sm text-gray-500">Total Spent</p></div>
                <div className="text-center p-4 bg-gray-50 rounded-lg"><p className="text-2xl font-bold text-gray-900">${((selectedUser.totalSpent || 0) / (selectedUser.totalOrders || 1)).toFixed(2)}</p><p className="text-sm text-gray-500">Avg Order Value</p></div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b"><h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3></div>
              {userOrders.length > 0 ? <DataTable columns={orderColumns} data={userOrders} /> : <p className="p-6 text-center text-gray-500">No orders yet</p>}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}