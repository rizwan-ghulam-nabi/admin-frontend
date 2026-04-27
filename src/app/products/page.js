
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import DataTable from '@/components/tables/DataTable';
import Pagination from '@/components/tables/Pagination';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import Loader from '@/components/common/Loader';
import { useProductStore } from '@/store/productStore';
import { usePermissions } from '@/lib/permissions';
import { PlusIcon, MagnifyingGlassIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function ProductsPage() {
  const { products, pagination, loading, filters, fetchProducts, deleteProduct, setPage, setFilters, resetFilters } = useProductStore();
  const { canManageProducts, canCreateProducts, canUpdateProducts, canDeleteProducts } = usePermissions();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ search: searchTerm });
  };

  const handleDelete = async () => {
    try {
      await deleteProduct(deleteId);
      setDeleteId(null);
      toast.success('Product deleted successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to delete product');
    }
  };

  const columns = [
    {
      key: 'image',
      header: 'Image',
      render: (_, row) => {
        const img = row.images?.find(i => i.isMain)?.url || row.images?.[0]?.url;
        return img ? <img src={img} alt={row.name} className="h-12 w-12 rounded object-cover" /> : <div className="h-12 w-12 rounded bg-gray-200 flex items-center justify-center"><span className="text-gray-400 text-xs">No img</span></div>;
      },
    },
    { key: 'name', header: 'Name', render: (value, row) => <div><p className="font-medium text-gray-900">{value}</p><p className="text-xs text-gray-500">{row.brand || '-'}</p></div> },
    { key: 'sku', header: 'SKU', render: (value) => value || '-' },
    { key: 'price', header: 'Price', render: (value) => `$${Number(value).toFixed(2)}` },
    { key: 'stock', header: 'Stock', render: (value) => <span className={`px-2 py-1 text-xs font-medium rounded-full ${value < 10 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>{value}</span> },
    { key: 'category', header: 'Category', render: (value) => value?.name || value || '-' },
    {
      key: 'isActive',
      header: 'Status',
      render: (value) => <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{value ? 'Active' : 'Inactive'}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, row) => (
        <div className="flex space-x-2">
          <Link href={`/products/${row._id}`} className="text-gray-600 hover:text-gray-900"><EyeIcon className="h-5 w-5" /></Link>
          {canUpdateProducts && <Link href={`/products/${row._id}/edit`} className="text-blue-600 hover:text-blue-900"><PencilIcon className="h-5 w-5" /></Link>}
          {canDeleteProducts && <button onClick={() => setDeleteId(row._id)} className="text-red-600 hover:text-red-900"><TrashIcon className="h-5 w-5" /></button>}
        </div>
      ),
    },
  ];

  if (!canManageProducts) {
    return <Layout><div className="text-center py-12"><h2 className="text-2xl font-semibold">Access Denied</h2><p className="text-gray-500 mt-2">You don&apos;t have permission to view products.</p></div></Layout>;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your product inventory</p>
          </div>
          {canCreateProducts && (
            <Link href="/products/create" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <PlusIcon className="h-5 w-5 mr-2" /> Add Product
            </Link>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg shadow space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <form onSubmit={handleSearch} className="sm:col-span-2 flex">
              <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search products..." className="flex-1 rounded-l-md border-gray-300 focus:ring-blue-500 focus:border-blue-500" />
              <button type="submit" className="px-4 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-200"><MagnifyingGlassIcon className="h-5 w-5 text-gray-500" /></button>
            </form>
            <select value={selectedCategory} onChange={(e) => { setSelectedCategory(e.target.value); setFilters({ category: e.target.value }); }} className="rounded-md border-gray-300">
              <option value="">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
              <option value="Books">Books</option>
              <option value="Home">Home</option>
            </select>
            <select value={selectedStatus} onChange={(e) => { setSelectedStatus(e.target.value); setFilters({ status: e.target.value }); }} className="rounded-md border-gray-300">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          {loading ? <div className="p-12 flex justify-center"><Loader /></div> : (
            <>
              <DataTable columns={columns} data={products} emptyMessage="No products found" />
              <Pagination currentPage={pagination.page} totalItems={pagination.total} pageSize={pagination.limit} onPageChange={setPage} />
            </>
          )}
        </div>
      </div>
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Product" message="Are you sure you want to delete this product?" />
    </Layout>
  );
}