'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import DataTable from '@/components/tables/DataTable';
import Pagination from '@/components/tables/Pagination';
import Loader from '@/components/common/Loader';
import { useUserStore } from '@/store/userStore';
import { usePermissions } from '@/lib/permissions';
import { MagnifyingGlassIcon, EyeIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

export default function CustomersPage() {
  const { users, pagination, loading, filters, fetchUsers, setPage, setFilters } = useUserStore();
  const { canManageUsers } = usePermissions();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ search: searchTerm });
  };

  const columns = [
    { key: 'name', header: 'Name', render: (value, row) => <div className="flex items-center"><div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3"><span className="text-gray-500">{value?.charAt(0) || '?'}</span></div><div><p className="font-medium">{value || 'N/A'}</p><p className="text-xs text-gray-500">{row.email}</p></div></div> },
    { key: 'phone', header: 'Phone', render: (value) => value || '-' },
    { key: 'totalOrders', header: 'Orders', render: (value) => value || 0 },
    { key: 'totalSpent', header: 'Total Spent', render: (value) => `$${Number(value || 0).toFixed(2)}` },
    { key: 'createdAt', header: 'Joined', render: (value) => new Date(value).toLocaleDateString() },
    {
      key: 'status',
      header: 'Status',
      render: (value) => <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${value === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{value || 'active'}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, row) => (
        <div className="flex space-x-2">
          <Link href={`/customers/${row._id}`} className="text-blue-600 hover:text-blue-900"><EyeIcon className="h-5 w-5" /></Link>
          <a href={`mailto:${row.email}`} className="text-gray-600 hover:text-gray-900"><EnvelopeIcon className="h-5 w-5" /></a>
        </div>
      ),
    },
  ];

  if (!canManageUsers) {
    return <Layout><div className="text-center py-12"><h2 className="text-2xl font-semibold">Access Denied</h2></div></Layout>;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Customers</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your customer accounts</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <form onSubmit={handleSearch} className="sm:col-span-2 flex">
              <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by name or email..." className="flex-1 rounded-l-md border-gray-300 focus:ring-blue-500 focus:border-blue-500" />
              <button type="submit" className="px-4 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-200"><MagnifyingGlassIcon className="h-5 w-5 text-gray-500" /></button>
            </form>
            <select value={selectedStatus} onChange={(e) => { setSelectedStatus(e.target.value); setFilters({ status: e.target.value }); }} className="rounded-md border-gray-300">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          {loading ? <div className="p-12 flex justify-center"><Loader /></div> : (
            <>
              <DataTable columns={columns} data={users} emptyMessage="No customers found" />
              <Pagination currentPage={pagination.page} totalItems={pagination.total} pageSize={pagination.limit} onPageChange={setPage} />
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}