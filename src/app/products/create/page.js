
// // app/products/create/page.js
// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import Layout from '@/components/Layout';
// import { useProductStore } from '@/store/productStore';
// import toast from 'react-hot-toast';

// export default function CreateProductPage() {
//   const router = useRouter();
//   const { createProduct, loading } = useProductStore();

//   const [form, setForm] = useState({
//     name: '',
//     price: '',
//     stock: '',
//     description: '',
//     brand: '',
//     sku: '',
//     category: '',
//     isActive: true,
//   });

//   const [imageFile, setImageFile] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [uploading, setUploading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setForm(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//     }));
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     // Validate file type
//     const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
//     if (!allowedTypes.includes(file.type)) {
//       toast.error('Only JPEG, PNG, and WebP images are allowed');
//       return;
//     }

//     // Validate file size (max 5MB)
//     if (file.size > 5 * 1024 * 1024) {
//       toast.error('Image must be less than 5MB');
//       return;
//     }

//     setImageFile(file);
//     setImagePreview(URL.createObjectURL(file));
//     console.log('📸 Image selected:', file.name, file.size, file.type);
//   };



// const handleSubmit = async (e) => {
//   e.preventDefault();

//   if (!form.name || !form.price || !form.stock) {
//     toast.error('Please fill in all required fields');
//     return;
//   }

//   setUploading(true);

//   try {
//     const submitData = new FormData();
//     submitData.append('name', form.name);
//     submitData.append('price', form.price);
//     submitData.append('stock', form.stock);
//     submitData.append('description', form.description);
//     submitData.append('brand', form.brand);
//     submitData.append('sku', form.sku);
//     submitData.append('category', form.category);
//     submitData.append('isActive', form.isActive);

//     // ✅ FIXED: Use 'images' (not 'image') to match backend
//     if (imageFile) {
//       submitData.append('images', imageFile);
//     }

//     console.log('📦 Submitting...');
//     await createProduct(submitData);
//     toast.success('Product created successfully!');
//     router.push('/products');
//   } catch (error) {
//     toast.error(error.message || 'Failed to create product');
//   } finally {
//     setUploading(false);
//   }
// };


//   return (
//     <Layout>
//       <div className="max-w-3xl mx-auto py-8">
//         <div className="flex items-center justify-between mb-6">
//           <h1 className="text-2xl font-semibold text-gray-900">Create Product</h1>
//           <Link href="/products" className="text-sm text-blue-600 hover:text-blue-800">
//             ← Back to Products
//           </Link>
//         </div>

//         <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow space-y-6">
//           {/* Image Upload */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
//             <div className="flex items-start gap-4">
//               {/* Preview */}
//               <div className="flex-shrink-0">
//                 {imagePreview ? (
//                   <img
//                     src={imagePreview}
//                     alt="Preview"
//                     className="h-32 w-32 rounded-lg object-cover border border-gray-200"
//                   />
//                 ) : (
//                   <div className="h-32 w-32 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
//                     <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                     </svg>
//                   </div>
//                 )}
//               </div>

//               {/* Upload button */}
//               <div className="flex-1">
//                 <input
//                   type="file"
//                   accept="image/jpeg,image/png,image/webp"
//                   onChange={handleImageChange}
//                   className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//                 />
//                 <p className="text-xs text-gray-400 mt-1">PNG, JPG, or WebP. Max 5MB.</p>
//                 {imageFile && (
//                   <p className="text-xs text-green-600 mt-1">
//                     Selected: {imageFile.name} ({(imageFile.size / 1024).toFixed(1)} KB)
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Product Details */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
//               <input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
//               <input type="text" name="sku" value={form.sku} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
//               <input type="number" step="0.01" name="price" value={form.price} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
//               <input type="number" name="stock" value={form.stock} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
//               <input type="text" name="brand" value={form.brand} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
//               <select name="category" value={form.category} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
//                 <option value="">Select category</option>
//                 <option value="Electronics">Electronics</option>
//                 <option value="Fashion">Fashion</option>
//                 <option value="Books">Books</option>
//                 <option value="Home">Home</option>
//                 <option value="Sports">Sports</option>
//               </select>
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//             <textarea name="description" value={form.description} onChange={handleChange} rows={4} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
//           </div>

//           <div className="flex items-center">
//             <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="h-4 w-4 text-blue-600 rounded border-gray-300" />
//             <label className="ml-2 text-sm text-gray-700">Active (visible to customers)</label>
//           </div>

//           {/* Submit Buttons */}
//           <div className="flex gap-3 pt-4 border-t">
//             <button
//               type="submit"
//               disabled={uploading || loading}
//               className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
//             >
//               {uploading || loading ? (
//                 <>
//                   <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
//                   </svg>
//                   Creating...
//                 </>
//               ) : (
//                 'Create Product'
//               )}
//             </button>
//             <Link href="/products" className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
//               Cancel
//             </Link>
//           </div>
//         </form>
//       </div>
//     </Layout>
//   );
// }












// app/products/create/page.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { useProductStore } from '@/store/productStore';
import toast from 'react-hot-toast';
import { StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

export default function CreateProductPage() {
  const router = useRouter();
  const { createProduct, loading } = useProductStore();

  const [form, setForm] = useState({
    name: '',
    price: '',
    stock: '',
    description: '',
    brand: '',
    sku: '',
    category: '',
    isActive: true,
    isFeatured: false, // ✅ ADDED
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPEG, PNG, and WebP images are allowed');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    console.log('📸 Image selected:', file.name, file.size, file.type);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.price || !form.stock) {
      toast.error('Please fill in all required fields');
      return;
    }

    setUploading(true);

    try {
      const submitData = new FormData();
      submitData.append('name', form.name);
      submitData.append('price', form.price);
      submitData.append('stock', form.stock);
      submitData.append('description', form.description);
      submitData.append('brand', form.brand);
      submitData.append('sku', form.sku);
      submitData.append('category', form.category);
      submitData.append('isActive', form.isActive);
      submitData.append('isFeatured', form.isFeatured); // ✅ ADDED

      if (imageFile) {
        submitData.append('images', imageFile);
      }

      console.log('📦 Submitting...', form);
      await createProduct(submitData);
      toast.success('Product created successfully!');
      router.push('/products');
    } catch (error) {
      toast.error(error.message || 'Failed to create product');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Create Product</h1>
          <Link href="/products" className="text-sm text-blue-600 hover:text-blue-800">
            ← Back to Products
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="h-32 w-32 rounded-lg object-cover border border-gray-200" />
                ) : (
                  <div className="h-32 w-32 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                    <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, or WebP. Max 5MB.</p>
                {imageFile && (
                  <p className="text-xs text-green-600 mt-1">Selected: {imageFile.name} ({(imageFile.size / 1024).toFixed(1)} KB)</p>
                )}
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
              <input type="text" name="sku" value={form.sku} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
              <input type="number" step="0.01" name="price" value={form.price} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
              <input type="number" name="stock" value={form.stock} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
              <input type="text" name="brand" value={form.brand} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select name="category" value={form.category} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Select category</option>
                <option value="Electronics">Electronics</option>
                <option value="Fashion">Fashion</option>
                <option value="Books">Books</option>
                <option value="Home">Home</option>
                <option value="Sports">Sports</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={4} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>

          {/* Status & Featured Toggles */}
          <div className="space-y-3 bg-gray-50 p-4 rounded-xl">
            {/* Active Toggle */}
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input 
                  type="checkbox" 
                  name="isActive" 
                  checked={form.isActive} 
                  onChange={handleChange} 
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-300 peer-checked:bg-green-500 rounded-full peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Active</span>
                <p className="text-xs text-gray-500">Product will be visible to customers</p>
              </div>
            </label>

            {/* ✅ Featured Toggle */}
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input 
                  type="checkbox" 
                  name="isFeatured" 
                  checked={form.isFeatured} 
                  onChange={handleChange} 
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-300 peer-checked:bg-yellow-500 rounded-full peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <StarIconSolid className="h-4 w-4 text-yellow-500" />
                  Featured
                </span>
                <p className="text-xs text-gray-500">Product will appear in the Featured Products section</p>
              </div>
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="submit"
              disabled={uploading || loading}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              {uploading || loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating...
                </>
              ) : (
                'Create Product'
              )}
            </button>
            <Link href="/products" className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </Layout>
  );
}
