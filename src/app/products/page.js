'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';               // adjust path if needed
import DataTable from '@/components/tables/DataTable';
import Pagination from '@/components/tables/Pagination';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import Loader from '@/components/common/Loader';
import { useProductStore } from '@/store/productStore';
import { usePermissions } from '@/lib/permissions';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function ProductsPage() {
  const {
    products,
    pagination,
    loading,
    error,
    fetchProducts,
    deleteProduct,
    setPage,
    setFilters,
  } = useProductStore();

  const { canManageProducts, canCreateProducts, canUpdateProducts, canDeleteProducts } =
    usePermissions();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  // Search / Filters
  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ search: searchTerm });
  };

  const handleCategoryFilter = (e) => {
    const val = e.target.value;
    setSelectedCategory(val);
    setFilters({ category: val });
  };

  const handleStatusFilter = (e) => {
    const val = e.target.value;
    setSelectedStatus(val);
    setFilters({ status: val });
  };

  // Delete handlers
  const handleDeleteClick = (product) => {
    console.log('🗑️ Delete clicked:', product._id, product.name);
    setDeletingProduct(product);
    setDeleteId(product._id);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    console.log('🗑️ Confirming delete for:', deleteId);
    setIsDeleting(true);
    try {
      await deleteProduct(deleteId);
      toast.success('Product deleted successfully');
      // Reset
      setDeleteId(null);
      setDeletingProduct(null);
    } catch (err) {
      toast.error(err.message || 'Delete failed');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteId(null);
    setDeletingProduct(null);
  };

  // Table columns
  const columns = [
    // {
    //   key: 'image',
    //   header: 'Image',
    //   render: (_, row) => {
    //     const img = row.images?.find((i) => i.isMain)?.url || row.images?.[0]?.url || row.image;
    //     return img ? (
    //       <img src={img} alt={row.name} className="h-12 w-12 rounded object-cover" />
    //     ) : (
    //       <div className="h-12 w-12 rounded bg-gray-200 flex items-center justify-center text-xs text-gray-400">
    //         No img
    //       </div>
    //     );
    //   },
    // },





  
   // In app/products/page.js - Image column
{
  key: 'image',
  header: 'Image',
  render: (_, row) => {
    // Get image from Cloudinary URL
    let imageUrl = null;
    
    // Check images array (Cloudinary format)
    if (row.images && Array.isArray(row.images) && row.images.length > 0) {
      imageUrl = row.images[0]?.url;
    }
    
    // Check single image field
    if (!imageUrl) {
      imageUrl = row.image || row.imageUrl;
    }
    
    // Skip if undefined or null
    if (!imageUrl || imageUrl === 'undefined' || imageUrl === 'null' || imageUrl.includes('undefined')) {
      const colors = ['from-blue-400 to-blue-600', 'from-green-400 to-green-600', 'from-purple-400 to-purple-600', 'from-pink-400 to-pink-600', 'from-yellow-400 to-yellow-600', 'from-red-400 to-red-600'];
      const colorIndex = (row.name || 'P').charCodeAt(0) % colors.length;
      
      return (
        <div className={`h-12 w-12 rounded bg-gradient-to-br ${colors[colorIndex]} flex items-center justify-center shadow-sm`}>
          <span className="text-white font-bold text-lg">
            {(row.name || 'P').charAt(0).toUpperCase()}
          </span>
        </div>
      );
    }
    
    console.log('🖼️ Image URL:', imageUrl);
    
    return (
      <img 
        src={imageUrl} 
        alt={row.name || 'Product'} 
        className="h-12 w-12 rounded object-cover border border-gray-200 shadow-sm"
        onError={(e) => {
          e.target.style.display = 'none';
          const colors = ['from-blue-400 to-blue-600', 'from-green-400 to-green-600', 'from-purple-400 to-purple-600', 'from-pink-400 to-pink-600'];
          const colorIndex = (row.name || 'P').charCodeAt(0) % colors.length;
          e.target.parentElement.innerHTML = `<div class="h-12 w-12 rounded bg-gradient-to-br ${colors[colorIndex]} flex items-center justify-center shadow-sm"><span class="text-white font-bold text-lg">${(row.name || 'P').charAt(0).toUpperCase()}</span></div>`;
        }}
      />
    );
  },
},




    {
      key: 'name',
      header: 'Name',
      render: (value, row) => (
        <div>
          <p className="font-medium text-gray-900">{value || 'Unnamed'}</p>
          <p className="text-xs text-gray-500">{row.brand || '-'}</p>
        </div>
      ),
    },
    { key: 'sku', header: 'SKU', render: (v) => v || '-' },
    { key: 'price', header: 'Price', render: (v) => (v ? `$${Number(v).toFixed(2)}` : '-') },
    {
      key: 'stock',
      header: 'Stock',
      render: (v) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            v < 10 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
          }`}
        >
          {v ?? 0}
        </span>
      ),
    },
    { key: 'category', header: 'Category', render: (v) => v?.name || v || '-' },
    {
      key: 'isActive',
      header: 'Status',
      render: (v) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
            v ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}
        >
          {v ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, row) => (
        <div className="flex space-x-2">
          <Link href={`/products/${row._id}`} className="text-gray-600 hover:text-gray-900">
            <EyeIcon className="h-5 w-5" />
          </Link>
          {canUpdateProducts && (
            <Link
              href={`/products/${row._id}/edit`}
              className="text-blue-600 hover:text-blue-900"
            >
              <PencilIcon className="h-5 w-5" />
            </Link>
          )}
          {canDeleteProducts && (
            <button
              onClick={() => handleDeleteClick(row)}
              disabled={isDeleting}
              className="text-red-600 hover:text-red-900 disabled:opacity-50"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      ),
    },
  ];

  if (!canManageProducts) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold">Access Denied</h2>
          <p className="text-gray-500 mt-2">You don&apos;t have permission to view products.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
            <p className="text-sm text-gray-500 mt-1">
              {products.length > 0
                ? `Showing ${products.length} of ${pagination.total} products`
                : 'Manage your product inventory'}
            </p>
          </div>
          {canCreateProducts && (
            <Link
              href="/products/create"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <PlusIcon className="h-5 w-5 mr-2" /> Add Product
            </Link>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm">
              <strong>Error:</strong> {error}
            </p>
            <button
              onClick={() => fetchProducts()}
              className="mt-2 text-sm text-red-600 underline hover:text-red-800"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <form onSubmit={handleSearch} className="sm:col-span-2 flex">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="flex-1 rounded-l-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-200"
              >
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
              </button>
            </form>
            <select
              value={selectedCategory}
              onChange={handleCategoryFilter}
              className="rounded-md border-gray-300 px-3 py-2"
            >
              <option value="">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
              <option value="Books">Books</option>
              <option value="Home">Home</option>
              {/* Add more as needed */}
            </select>
            <select
              value={selectedStatus}
              onChange={handleStatusFilter}
              className="rounded-md border-gray-300 px-3 py-2"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-12 flex justify-center">
              <Loader />
            </div>
          ) : products.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500 text-lg mb-2">No products found</p>
              {canCreateProducts && (
                <Link
                  href="/products/create"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <PlusIcon className="h-5 w-5 mr-2" /> Create Product
                </Link>
              )}
            </div>
          ) : (
            <>
              <DataTable
                columns={columns}
                data={products}
                emptyMessage="No products found"
              />
              {pagination && pagination.totalPages > 1 && (
                <Pagination
                  currentPage={pagination.page}
                  totalItems={pagination.total}
                  pageSize={pagination.limit}
                  onPageChange={setPage}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Delete confirmation dialog */}
      {deleteId && (
        <ConfirmDialog
          open={!!deleteId}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          title="Delete Product"
          message={
            deletingProduct
              ? `Are you sure you want to delete "${deletingProduct.name}"?`
              : 'Are you sure you want to delete this product?'
          }
          confirmText={isDeleting ? 'Deleting...' : 'Delete'}
          loading={isDeleting}
          variant="danger"
        />
      )}
    </Layout>
  );
}