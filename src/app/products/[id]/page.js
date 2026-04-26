// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter, useParams } from 'next/navigation';
// import Link from 'next/link';
// import Layout from '@/components/Layout';
// import { useProductStore } from '@/store/productStore';
// import { usePermissions } from '@/lib/permissions';
// import { ArrowLeftIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
// import Loader from '@/components/common/Loader';
// import ConfirmDialog from '@/components/common/ConfirmDialog';
// import toast from 'react-hot-toast';

// export default function ProductDetailPage() {
//   const router = useRouter();
//   const params = useParams();
//   const productId = params.id;
  
//   const { selectedProduct, fetchProduct, deleteProduct, loading, clearSelected } = useProductStore();
//   const { canUpdateProducts, canDeleteProducts } = usePermissions();
//   const [fetchLoading, setFetchLoading] = useState(true);
//   const [showDeleteDialog, setShowDeleteDialog] = useState(false);

//   useEffect(() => {
//     const loadProduct = async () => {
//       try {
//         await fetchProduct(productId);
//       } catch {
//         router.push('/products');
//       } finally {
//         setFetchLoading(false);
//       }
//     };
//     loadProduct();
//     return () => clearSelected();
//   }, [productId]);

//   const handleDelete = async () => {
//     try {
//       await deleteProduct(productId);
//       toast.success('Product deleted successfully');
//       router.push('/products');
//     } catch (error) {
//       toast.error(error.message || 'Failed to delete product');
//     } finally {
//       setShowDeleteDialog(false);
//     }
//   };

//   if (fetchLoading) {
//     return <Layout><div className="flex justify-center py-12"><Loader /></div></Layout>;
//   }

//   if (!selectedProduct) {
//     return <Layout><div className="text-center py-12"><h2 className="text-2xl font-semibold">Product not found</h2></div></Layout>;
//   }

//   const mainImage = selectedProduct.images?.find(i => i.isMain)?.url || selectedProduct.images?.[0]?.url;

//   return (
//     <Layout>
//       <div className="max-w-4xl mx-auto">
//         <div className="mb-6 flex items-center justify-between">
//           <div>
//             <Link href="/products" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"><ArrowLeftIcon className="h-4 w-4 mr-1" /> Back to Products</Link>
//             <h1 className="text-2xl font-semibold text-gray-900 mt-2">{selectedProduct.name}</h1>
//             <p className="text-sm text-gray-500 mt-1">SKU: {selectedProduct.sku || 'N/A'}</p>
//           </div>
//           <div className="flex space-x-3">
//             {canUpdateProducts && (
//               <Link href={`/products/${productId}/edit`} className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50">
//                 <PencilIcon className="h-4 w-4 mr-2" /> Edit
//               </Link>
//             )}
//             {canDeleteProducts && (
//               <button onClick={() => setShowDeleteDialog(true)} className="inline-flex items-center px-4 py-2 border border-red-300 rounded-lg text-red-700 bg-white hover:bg-red-50">
//                 <TrashIcon className="h-4 w-4 mr-2" /> Delete
//               </button>
//             )}
//           </div>
//         </div>

//         <div className="bg-white shadow rounded-lg overflow-hidden">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
//             <div>
//               {mainImage ? (
//                 <img src={mainImage} alt={selectedProduct.name} className="w-full h-80 object-cover rounded-lg" />
//               ) : (
//                 <div className="w-full h-80 bg-gray-200 rounded-lg flex items-center justify-center"><span className="text-gray-400">No image</span></div>
//               )}
//               {selectedProduct.images && selectedProduct.images.length > 1 && (
//                 <div className="flex mt-4 space-x-2 overflow-x-auto">
//                   {selectedProduct.images.map((img, i) => (
//                     <img key={i} src={img.url} alt="" className="h-16 w-16 object-cover rounded border" />
//                   ))}
//                 </div>
//               )}
//             </div>
            
//             <div className="space-y-4">
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-900">Details</h3>
//                 <p className="text-gray-600 mt-2">{selectedProduct.description || 'No description'}</p>
//               </div>
              
//               <div className="grid grid-cols-2 gap-4">
//                 <div><span className="text-sm text-gray-500">Price</span><p className="text-2xl font-bold text-gray-900">${selectedProduct.price?.toFixed(2)}</p></div>
//                 <div><span className="text-sm text-gray-500">Compare Price</span><p className="text-lg text-gray-500 line-through">${selectedProduct.comparePrice?.toFixed(2) || '-'}</p></div>
//                 <div><span className="text-sm text-gray-500">Stock</span><p className={`text-lg font-semibold ${selectedProduct.stock < 10 ? 'text-red-600' : 'text-gray-900'}`}>{selectedProduct.stock} units</p></div>
//                 <div><span className="text-sm text-gray-500">Category</span><p className="text-gray-900">{selectedProduct.category?.name || selectedProduct.category || '-'}</p></div>
//                 <div><span className="text-sm text-gray-500">Brand</span><p className="text-gray-900">{selectedProduct.brand || '-'}</p></div>
//                 <div><span className="text-sm text-gray-500">Status</span><span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${selectedProduct.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{selectedProduct.isActive ? 'Active' : 'Inactive'}</span></div>
//                 <div><span className="text-sm text-gray-500">Featured</span><span className={selectedProduct.isFeatured ? 'text-yellow-500' : 'text-gray-400'}>{selectedProduct.isFeatured ? '★ Yes' : '☆ No'}</span></div>
//                 <div><span className="text-sm text-gray-500">Created</span><p className="text-gray-900">{new Date(selectedProduct.createdAt).toLocaleDateString()}</p></div>
//               </div>
              
//               {selectedProduct.tags && selectedProduct.tags.length > 0 && (
//                 <div><span className="text-sm text-gray-500">Tags</span><div className="flex flex-wrap gap-2 mt-1">{selectedProduct.tags.map((tag, i) => <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">{tag}</span>)}</div></div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
      
//       <ConfirmDialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} onConfirm={handleDelete} title="Delete Product" message={`Are you sure you want to delete "${selectedProduct.name}"?`} variant="danger" />
//     </Layout>
//   );
// }























'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Layout from '@/components/Layout';
import { useProductStore } from '@/store/productStore';
import Loader from '@/components/common/Loader';
import toast from 'react-hot-toast';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const { selectedProduct, fetchProduct, updateProduct, loading } = useProductStore();
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (id) {
      fetchProduct(id).catch(() => {
        toast.error('Product not found');
        router.push('/products');
      });
    }
  }, [id]);

  useEffect(() => {
    if (selectedProduct) {
      setForm({
        name: selectedProduct.name || '',
        price: selectedProduct.price || 0,
        stock: selectedProduct.stock || 0,
        description: selectedProduct.description || '',
      });
    }
  }, [selectedProduct]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProduct(id, form);
      toast.success('Product updated');
      router.push('/products');
    } catch (err) {
      toast.error(err.message || 'Update failed');
    }
  };

  if (!selectedProduct || !form) {
    return (
      <Layout>
        <div className="p-12 flex justify-center"><Loader /></div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-8">
        <h1 className="text-2xl font-semibold mb-6">Edit Product</h1>
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <input
              type="number"
              step="0.01"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Stock</label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              rows={4}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </Layout>
  );
}