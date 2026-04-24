
// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter, useParams } from 'next/navigation';
// import Link from 'next/link';
// import Layout from '@/components/Layout';
// import { useProductStore } from '@/store/productStore';
// import { useCategoryStore } from '@/store/categoryStore';
// import { usePermissions } from '@/lib/permissions';
// import { ArrowLeftIcon, TrashIcon } from '@heroicons/react/24/outline';
// import Loader from '@/components/common/Loader';
// import ConfirmDialog from '@/components/common/ConfirmDialog';
// import toast from 'react-hot-toast';

// export default function EditProductPage() {
//   const router = useRouter();
//   const params = useParams();
//   const productId = params.id;
  
//   const {
//     selectedProduct,
//     fetchProduct,
//     updateProduct,
//     deleteProduct,
//     loading,
//     clearSelected,
//   } = useProductStore();
  
//   const { categories, fetchCategories } = useCategoryStore();
//   const { canUpdateProducts, canDeleteProducts } = usePermissions();
  
//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     price: '',
//     comparePrice: '',
//     category: '',
//     stock: '',
//     sku: '',
//     brand: '',
//     isActive: true,
//     isFeatured: false,
//     tags: '',
//   });
//   const [submitting, setSubmitting] = useState(false);
//   const [fetchLoading, setFetchLoading] = useState(true);
//   const [showDeleteDialog, setShowDeleteDialog] = useState(false);

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         await fetchCategories();
//         const product = await fetchProduct(productId);
        
//         if (product) {
//           setFormData({
//             name: product.name || '',
//             description: product.description || '',
//             price: product.price || '',
//             comparePrice: product.comparePrice || '',
//             category: product.category?._id || product.category || '',
//             stock: product.stock || '',
//             sku: product.sku || '',
//             brand: product.brand || '',
//             isActive: product.isActive !== undefined ? product.isActive : true,
//             isFeatured: product.isFeatured || false,
//             tags: product.tags?.join(', ') || '',
//           });
//         }
//       } catch (error) {
//         toast.error('Failed to load product');
//         router.push('/products');
//       } finally {
//         setFetchLoading(false);
//       }
//     };
    
//     loadData();
    
//     return () => clearSelected();
//   }, [productId]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);
    
//     try {
//       const updateData = {
//         ...formData,
//         price: parseFloat(formData.price),
//         comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : undefined,
//         stock: parseInt(formData.stock),
//         tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : [],
//       };
      
//       await updateProduct(productId, updateData);
//       toast.success('Product updated successfully');
//       router.push('/products');
//     } catch (error) {
//       toast.error(error.message || 'Failed to update product');
//     } finally {
//       setSubmitting(false);
//     }
//   };

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

//   if (!canUpdateProducts) {
//     return (
//       <Layout>
//         <div className="text-center py-12">
//           <h2 className="text-2xl font-semibold text-gray-900">Access Denied</h2>
//           <p className="text-gray-500 mt-2">You don&apos;t have permission to edit products.</p>
//         </div>
//       </Layout>
//     );
//   }

//   if (fetchLoading) {
//     return (
//       <Layout>
//         <div className="flex justify-center py-12">
//           <Loader />
//         </div>
//       </Layout>
//     );
//   }

//   // Flatten categories for select
//   const flattenCategories = (cats, level = 0) => {
//     let result = [];
//     cats?.forEach(cat => {
//       result.push({
//         _id: cat._id,
//         name: '—'.repeat(level) + ' ' + cat.name,
//       });
//       if (cat.children?.length) {
//         result = result.concat(flattenCategories(cat.children, level + 1));
//       }
//     });
//     return result;
//   };

//   const flatCategories = flattenCategories(categories);

//   return (
//     <Layout>
//       <div className="max-w-4xl mx-auto">
//         {/* Header */}
//         <div className="mb-6 flex items-center justify-between">
//           <div>
//             <Link
//               href="/products"
//               className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
//             >
//               <ArrowLeftIcon className="h-4 w-4 mr-1" />
//               Back to Products
//             </Link>
//             <h1 className="text-2xl font-semibold text-gray-900 mt-2">Edit Product</h1>
//           </div>
          
//           {canDeleteProducts && (
//             <button
//               onClick={() => setShowDeleteDialog(true)}
//               className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50"
//             >
//               <TrashIcon className="h-4 w-4 mr-2" />
//               Delete Product
//             </button>
//           )}
//         </div>

//         {/* Form */}
//         <div className="bg-white shadow rounded-lg p-6">
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Basic Info */}
//             <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
//               <div className="sm:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Product Name *
//                 </label>
//                 <input
//                   type="text"
//                   name="name"
//                   required
//                   value={formData.name}
//                   onChange={handleChange}
//                   className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
//                 />
//               </div>

//               <div className="sm:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Description
//                 </label>
//                 <textarea
//                   name="description"
//                   rows={4}
//                   value={formData.description}
//                   onChange={handleChange}
//                   className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Price *
//                 </label>
//                 <div className="relative">
//                   <span className="absolute left-3 top-2 text-gray-500">$</span>
//                   <input
//                     type="number"
//                     name="price"
//                     step="0.01"
//                     min="0"
//                     required
//                     value={formData.price}
//                     onChange={handleChange}
//                     className="block w-full pl-7 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Compare Price
//                 </label>
//                 <div className="relative">
//                   <span className="absolute left-3 top-2 text-gray-500">$</span>
//                   <input
//                     type="number"
//                     name="comparePrice"
//                     step="0.01"
//                     min="0"
//                     value={formData.comparePrice}
//                     onChange={handleChange}
//                     className="block w-full pl-7 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Category *
//                 </label>
//                 <select
//                   name="category"
//                   required
//                   value={formData.category}
//                   onChange={handleChange}
//                   className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
//                 >
//                   <option value="">Select Category</option>
//                   {flatCategories.map((cat) => (
//                     <option key={cat._id} value={cat._id}>{cat.name}</option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Stock *
//                 </label>
//                 <input
//                   type="number"
//                   name="stock"
//                   min="0"
//                   required
//                   value={formData.stock}
//                   onChange={handleChange}
//                   className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   SKU
//                 </label>
//                 <input
//                   type="text"
//                   name="sku"
//                   value={formData.sku}
//                   onChange={handleChange}
//                   className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Brand
//                 </label>
//                 <input
//                   type="text"
//                   name="brand"
//                   value={formData.brand}
//                   onChange={handleChange}
//                   className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
//                 />
//               </div>

//               <div className="sm:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Tags (comma separated)
//                 </label>
//                 <input
//                   type="text"
//                   name="tags"
//                   value={formData.tags}
//                   onChange={handleChange}
//                   placeholder="electronics, wireless, audio"
//                   className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
//                 />
//               </div>
//             </div>

//             {/* Checkboxes */}
//             <div className="flex space-x-6">
//               <label className="flex items-center">
//                 <input
//                   type="checkbox"
//                   name="isActive"
//                   checked={formData.isActive}
//                   onChange={handleChange}
//                   className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
//                 />
//                 <span className="ml-2 text-sm text-gray-700">Active</span>
//               </label>
              
//               <label className="flex items-center">
//                 <input
//                   type="checkbox"
//                   name="isFeatured"
//                   checked={formData.isFeatured}
//                   onChange={handleChange}
//                   className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
//                 />
//                 <span className="ml-2 text-sm text-gray-700">Featured</span>
//               </label>
//             </div>

//             {/* Product Images (Read-only display) */}
//             {selectedProduct?.images && selectedProduct.images.length > 0 && (
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Product Images
//                 </label>
//                 <div className="flex flex-wrap gap-3">
//                   {selectedProduct.images.map((img, index) => (
//                     <div key={index} className="relative">
//                       <img
//                         src={img.url}
//                         alt={`Product ${index + 1}`}
//                         className="h-20 w-20 object-cover rounded border"
//                       />
//                       {img.isMain && (
//                         <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs px-1 rounded">
//                           Main
//                         </span>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//                 <p className="text-xs text-gray-500 mt-1">Images can be managed in the media section</p>
//               </div>
//             )}

//             {/* Form Actions */}
//             <div className="flex justify-end space-x-3 pt-4 border-t">
//               <Link
//                 href="/products"
//                 className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
//               >
//                 Cancel
//               </Link>
//               <button
//                 type="submit"
//                 disabled={submitting}
//                 className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
//               >
//                 {submitting ? 'Saving...' : 'Save Changes'}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>

//       {/* Delete Confirmation Dialog */}
//       <ConfirmDialog
//         open={showDeleteDialog}
//         onClose={() => setShowDeleteDialog(false)}
//         onConfirm={handleDelete}
//         title="Delete Product"
//         message={`Are you sure you want to delete "${selectedProduct?.name}"? This action cannot be undone.`}
//         confirmText="Delete"
//         variant="danger"
//       />
//     </Layout>
//   );
// }





















'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { useProductStore } from '@/store/productStore';
import { usePermissions } from '@/lib/permissions';
import { ArrowLeftIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import Loader from '@/components/common/Loader';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id;
  
  const { selectedProduct, fetchProduct, deleteProduct, loading, clearSelected } = useProductStore();
  const { canUpdateProducts, canDeleteProducts } = usePermissions();
  const [fetchLoading, setFetchLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        await fetchProduct(productId);
      } catch {
        router.push('/products');
      } finally {
        setFetchLoading(false);
      }
    };
    loadProduct();
    return () => clearSelected();
  }, [productId]);

  const handleDelete = async () => {
    try {
      await deleteProduct(productId);
      toast.success('Product deleted successfully');
      router.push('/products');
    } catch (error) {
      toast.error(error.message || 'Failed to delete product');
    } finally {
      setShowDeleteDialog(false);
    }
  };

  if (fetchLoading) {
    return <Layout><div className="flex justify-center py-12"><Loader /></div></Layout>;
  }

  if (!selectedProduct) {
    return <Layout><div className="text-center py-12"><h2 className="text-2xl font-semibold">Product not found</h2></div></Layout>;
  }

  const mainImage = selectedProduct.images?.find(i => i.isMain)?.url || selectedProduct.images?.[0]?.url;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link href="/products" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"><ArrowLeftIcon className="h-4 w-4 mr-1" /> Back to Products</Link>
            <h1 className="text-2xl font-semibold text-gray-900 mt-2">{selectedProduct.name}</h1>
            <p className="text-sm text-gray-500 mt-1">SKU: {selectedProduct.sku || 'N/A'}</p>
          </div>
          <div className="flex space-x-3">
            {canUpdateProducts && (
              <Link href={`/products/${productId}/edit`} className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50">
                <PencilIcon className="h-4 w-4 mr-2" /> Edit
              </Link>
            )}
            {canDeleteProducts && (
              <button onClick={() => setShowDeleteDialog(true)} className="inline-flex items-center px-4 py-2 border border-red-300 rounded-lg text-red-700 bg-white hover:bg-red-50">
                <TrashIcon className="h-4 w-4 mr-2" /> Delete
              </button>
            )}
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            <div>
              {mainImage ? (
                <img src={mainImage} alt={selectedProduct.name} className="w-full h-80 object-cover rounded-lg" />
              ) : (
                <div className="w-full h-80 bg-gray-200 rounded-lg flex items-center justify-center"><span className="text-gray-400">No image</span></div>
              )}
              {selectedProduct.images && selectedProduct.images.length > 1 && (
                <div className="flex mt-4 space-x-2 overflow-x-auto">
                  {selectedProduct.images.map((img, i) => (
                    <img key={i} src={img.url} alt="" className="h-16 w-16 object-cover rounded border" />
                  ))}
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Details</h3>
                <p className="text-gray-600 mt-2">{selectedProduct.description || 'No description'}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div><span className="text-sm text-gray-500">Price</span><p className="text-2xl font-bold text-gray-900">${selectedProduct.price?.toFixed(2)}</p></div>
                <div><span className="text-sm text-gray-500">Compare Price</span><p className="text-lg text-gray-500 line-through">${selectedProduct.comparePrice?.toFixed(2) || '-'}</p></div>
                <div><span className="text-sm text-gray-500">Stock</span><p className={`text-lg font-semibold ${selectedProduct.stock < 10 ? 'text-red-600' : 'text-gray-900'}`}>{selectedProduct.stock} units</p></div>
                <div><span className="text-sm text-gray-500">Category</span><p className="text-gray-900">{selectedProduct.category?.name || selectedProduct.category || '-'}</p></div>
                <div><span className="text-sm text-gray-500">Brand</span><p className="text-gray-900">{selectedProduct.brand || '-'}</p></div>
                <div><span className="text-sm text-gray-500">Status</span><span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${selectedProduct.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{selectedProduct.isActive ? 'Active' : 'Inactive'}</span></div>
                <div><span className="text-sm text-gray-500">Featured</span><span className={selectedProduct.isFeatured ? 'text-yellow-500' : 'text-gray-400'}>{selectedProduct.isFeatured ? '★ Yes' : '☆ No'}</span></div>
                <div><span className="text-sm text-gray-500">Created</span><p className="text-gray-900">{new Date(selectedProduct.createdAt).toLocaleDateString()}</p></div>
              </div>
              
              {selectedProduct.tags && selectedProduct.tags.length > 0 && (
                <div><span className="text-sm text-gray-500">Tags</span><div className="flex flex-wrap gap-2 mt-1">{selectedProduct.tags.map((tag, i) => <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">{tag}</span>)}</div></div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <ConfirmDialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} onConfirm={handleDelete} title="Delete Product" message={`Are you sure you want to delete "${selectedProduct.name}"?`} variant="danger" />
    </Layout>
  );
}