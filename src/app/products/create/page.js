'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '@/components/Layout';
import { useProductStore } from '@/store/productStore';
import { useCategoryStore } from '@/store/categoryStore';
import { usePermissions } from '@/lib/permissions';
import {
  ArrowLeftIcon,
  SparklesIcon,
  TagIcon,
  CurrencyDollarIcon,
  CubeIcon,
  DocumentTextIcon,
  HashtagIcon,
  GlobeAltIcon,
  CheckCircleIcon,
  StarIcon,
  PhotoIcon,
  XMarkIcon,
  InformationCircleIcon,
  PlusIcon,
  TrashIcon,
  CloudArrowUpIcon,
  FolderPlusIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

// ============================================
// CONSTANTS
// ============================================
const MAX_IMAGES = 5;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

// ============================================
// ANIMATED INPUT COMPONENT
// ============================================
const AnimatedInput = ({ icon: Icon, label, error, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <motion.div
        animate={{ boxShadow: isFocused ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : '0 0 0 0 rgba(59, 130, 246, 0)' }}
        className="relative rounded-xl transition-all duration-200"
      >
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Icon className={`h-5 w-5 transition-colors duration-200 ${isFocused ? 'text-blue-500' : 'text-gray-400'}`} />
        </div>
        <input
          {...props}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`block w-full pl-12 pr-4 py-3.5 bg-white border rounded-xl shadow-sm transition-all duration-200
            ${isFocused ? 'border-blue-400 ring-0' : 'border-gray-200 hover:border-gray-300'}
            ${error ? 'border-red-300 focus:border-red-400' : ''}
            text-gray-900 placeholder-gray-400 sm:text-sm`}
        />
      </motion.div>
      {error && (
        <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-1.5 text-sm text-red-500 flex items-center">
          <InformationCircleIcon className="h-4 w-4 mr-1" /> {error}
        </motion.p>
      )}
    </div>
  );
};

// ============================================
// ANIMATED TEXTAREA COMPONENT
// ============================================
const AnimatedTextarea = ({ icon: Icon, label, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <motion.div
        animate={{ boxShadow: isFocused ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : '0 0 0 0 rgba(59, 130, 246, 0)' }}
        className="relative rounded-xl transition-all duration-200"
      >
        <div className="absolute top-3.5 left-4 pointer-events-none">
          <Icon className={`h-5 w-5 transition-colors duration-200 ${isFocused ? 'text-blue-500' : 'text-gray-400'}`} />
        </div>
        <textarea
          {...props}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`block w-full pl-12 pr-4 py-3.5 bg-white border rounded-xl shadow-sm transition-all duration-200
            ${isFocused ? 'border-blue-400 ring-0' : 'border-gray-200 hover:border-gray-300'}
            text-gray-900 placeholder-gray-400 sm:text-sm resize-none`}
        />
      </motion.div>
    </div>
  );
};

// ============================================
// ANIMATED SELECT WITH ADD CATEGORY BUTTON
// ============================================
const AnimatedSelectWithAction = ({ icon: Icon, label, options, error, onAddNew, onRefresh, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={onRefresh}
            className="inline-flex items-center text-xs text-gray-500 hover:text-gray-700 font-medium"
            title="Refresh categories"
          >
            <ArrowPathIcon className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={onAddNew}
            className="inline-flex items-center text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            <FolderPlusIcon className="h-3.5 w-3.5 mr-1" />
            Add Category
          </button>
        </div>
      </div>
      <motion.div
        animate={{ boxShadow: isFocused ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : '0 0 0 0 rgba(59, 130, 246, 0)' }}
        className="relative rounded-xl transition-all duration-200"
      >
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Icon className={`h-5 w-5 transition-colors duration-200 ${isFocused ? 'text-blue-500' : 'text-gray-400'}`} />
        </div>
        <select
          {...props}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`block w-full pl-12 pr-10 py-3.5 bg-white border rounded-xl shadow-sm transition-all duration-200 appearance-none
            ${isFocused ? 'border-blue-400 ring-0' : 'border-gray-200 hover:border-gray-300'}
            ${error ? 'border-red-300' : ''}
            text-gray-900 sm:text-sm cursor-pointer`}
        >
          {options}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </motion.div>
      {error && (
        <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-1.5 text-sm text-red-500 flex items-center">
          <InformationCircleIcon className="h-4 w-4 mr-1" /> {error}
        </motion.p>
      )}
    </div>
  );
};

// ============================================
// IMAGE UPLOAD COMPONENT
// ============================================
const ImageUploader = ({ images, setImages, maxImages = 5 }) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const validateFile = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error(`${file.name} is not a supported image format`);
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error(`${file.name} is larger than 5MB`);
      return false;
    }
    return true;
  };

  const processFiles = (files) => {
    const remainingSlots = maxImages - images.length;
    if (remainingSlots <= 0) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    const filesToProcess = Array.from(files).slice(0, remainingSlots);
    const newImages = [];

    filesToProcess.forEach((file) => {
      if (validateFile(file)) {
        const reader = new FileReader();
        reader.onload = (e) => {
          newImages.push({
            file,
            preview: e.target.result,
            isMain: images.length === 0 && newImages.length === 1,
          });
          
          if (newImages.length === filesToProcess.filter(f => validateFile(f)).length) {
            setImages([...images, ...newImages]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
    e.target.value = '';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    if (images[index].isMain && newImages.length > 0) {
      newImages[0].isMain = true;
    }
    setImages(newImages);
  };

  const setAsMain = (index) => {
    const newImages = images.map((img, i) => ({
      ...img,
      isMain: i === index,
    }));
    setImages(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-md">
            <PhotoIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Product Images</h3>
            <p className="text-sm text-gray-500">Add up to {maxImages} images. First image will be the main display.</p>
          </div>
        </div>
        <span className="text-sm text-gray-400">{images.length}/{maxImages} images</span>
      </div>

      <motion.div
        animate={{
          borderColor: isDragging ? '#3B82F6' : '#E5E7EB',
          backgroundColor: isDragging ? '#EFF6FF' : '#FFFFFF',
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="hidden"
          onChange={handleFileSelect}
        />
        <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm font-medium text-gray-900">
          Drag & drop images here, or <span className="text-blue-600">browse</span>
        </p>
        <p className="mt-1 text-xs text-gray-500">
          PNG, JPG, WEBP, GIF up to 5MB each
        </p>
      </motion.div>

      {images.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          <AnimatePresence>
            {images.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative group"
              >
                <div className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                  <img src={image.preview} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                  {image.isMain && (
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded-md shadow">Main</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-2">
                    {!image.isMain && (
                      <button type="button" onClick={() => setAsMain(index)} className="p-2 bg-white rounded-lg hover:bg-gray-100 transition">
                        <StarIcon className="h-4 w-4 text-blue-600" />
                      </button>
                    )}
                    <button type="button" onClick={() => removeImage(index)} className="p-2 bg-white rounded-lg hover:bg-red-50 transition">
                      <TrashIcon className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {images.length < maxImages && (
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center hover:border-blue-400 hover:bg-blue-50 transition-all group"
            >
              <PlusIcon className="h-8 w-8 text-gray-400 group-hover:text-blue-500" />
              <span className="mt-1 text-xs text-gray-500 group-hover:text-blue-600">Add Image</span>
            </motion.button>
          )}
        </motion.div>
      )}
    </div>
  );
};

// ============================================
// TOGGLE SWITCH COMPONENT
// ============================================
const ToggleSwitch = ({ label, name, checked, onChange, activeColor = 'bg-green-500', icon: Icon }) => {
  return (
    <label className="flex items-center cursor-pointer group">
      <div className="relative inline-flex items-center">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        <div className={`w-12 h-7 rounded-full transition-colors duration-200 ease-in-out ${checked ? activeColor : 'bg-gray-300'}`}>
          <div
            className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
              checked ? 'translate-x-5' : 'translate-x-0.5'
            }`}
          />
        </div>
      </div>
      {Icon && <Icon className={`h-4 w-4 ml-3 transition-colors duration-200 ${checked ? 'text-green-600' : 'text-gray-400'}`} />}
      <span className={`ml-2 text-sm font-medium transition-colors duration-200 ${checked ? 'text-gray-900' : 'text-gray-500'}`}>
        {label}
      </span>
    </label>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function CreateProductPage() {
  const router = useRouter();
  const { createProduct, loading } = useProductStore();
  const { categories: apiCategories, fetchCategories } = useCategoryStore();
  const { canCreateProducts } = usePermissions();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    comparePrice: '',
    category: '',
    stock: '',
    sku: '',
    brand: '',
    isActive: true,
    isFeatured: false,
    tags: '',
  });
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  const categories = apiCategories;

  const loadCategories = async () => {
    setCategoriesLoading(true);
    await fetchCategories();
    setCategoriesLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    console.log('📋 Categories loaded:', categories.length, categories);
    if (categories.length > 0) {
      console.log('📋 First category:', categories[0]);
    }
  }, [categories]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required';
    if (!formData.stock || parseInt(formData.stock) < 0) newErrors.stock = 'Valid stock is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('📤 Submitting product with category:', formData.category);
    
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }
    
    setSubmitting(true);
    
    try {
      const formDataToSend = new FormData();
      
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('description', formData.description || '');
      formDataToSend.append('price', parseFloat(formData.price) || 0);
      if (formData.comparePrice) formDataToSend.append('comparePrice', parseFloat(formData.comparePrice));
      if (formData.category) formDataToSend.append('category', formData.category);
      formDataToSend.append('stock', parseInt(formData.stock) || 0);
      if (formData.sku) formDataToSend.append('sku', formData.sku.trim());
      if (formData.brand) formDataToSend.append('brand', formData.brand.trim());
      formDataToSend.append('isActive', formData.isActive);
      formDataToSend.append('isFeatured', formData.isFeatured);
      
      const tags = formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : [];
      tags.forEach(tag => formDataToSend.append('tags[]', tag));
      
      images.forEach((img, index) => {
        formDataToSend.append('images', img.file);
        if (img.isMain) formDataToSend.append('mainImageIndex', index.toString());
      });
      
      await createProduct(formDataToSend);
      toast.success('🎉 Product created successfully!');
      router.push('/products');
    } catch (error) {
      console.error('Create product error:', error);
      
      if (error.errors) {
        const firstError = Object.values(error.errors)[0];
        toast.error(firstError);
        setErrors(error.errors);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('Failed to create product');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddCategory = () => {
    router.push('/categories?redirect=/products/create');
  };

  if (!canCreateProducts) {
    return (
      <Layout>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
          <div className="inline-flex p-4 bg-red-50 rounded-full mb-4">
            <XMarkIcon className="h-12 w-12 text-red-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Access Denied</h2>
          <p className="text-gray-500 mt-2">You don't have permission to create products.</p>
        </motion.div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto pb-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Link href="/products" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
            <ArrowLeftIcon className="h-4 w-4 mr-1" /> Back to Products
          </Link>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <SparklesIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Product</h1>
              <p className="text-gray-500">Add a new product to your inventory</p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <ImageUploader images={images} setImages={setImages} maxImages={MAX_IMAGES} />
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <AnimatedInput
                icon={TagIcon}
                label="Product Name *"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Wireless Headphones Pro"
                error={errors.name}
              />

              <AnimatedTextarea
                icon={DocumentTextIcon}
                label="Description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your product..."
              />

              <div className="grid grid-cols-2 gap-4">
                <AnimatedInput
                  icon={CurrencyDollarIcon}
                  label="Price *"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  error={errors.price}
                />
                <AnimatedInput
                  icon={CurrencyDollarIcon}
                  label="Compare Price"
                  name="comparePrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.comparePrice}
                  onChange={handleChange}
                  placeholder="0.00"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <AnimatedInput
                  icon={CubeIcon}
                  label="Stock *"
                  name="stock"
                  type="number"
                  min="0"
                  required
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="0"
                  error={errors.stock}
                />
                <AnimatedSelectWithAction
                  icon={GlobeAltIcon}
                  label="Category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  onAddNew={handleAddCategory}
                  onRefresh={loadCategories}
                  options={
                    <>
                      <option value="">{categoriesLoading ? 'Loading...' : 'Select a category'}</option>
                      {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </>
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <AnimatedInput
                  icon={HashtagIcon}
                  label="SKU"
                  name="sku"
                  type="text"
                  value={formData.sku}
                  onChange={handleChange}
                  placeholder="e.g., WH-PRO-001"
                />
                <AnimatedInput
                  icon={TagIcon}
                  label="Brand"
                  name="brand"
                  type="text"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="e.g., AudioTech"
                />
              </div>

              <AnimatedInput
                icon={TagIcon}
                label="Tags"
                name="tags"
                type="text"
                value={formData.tags}
                onChange={handleChange}
                placeholder="electronics, wireless, premium (comma separated)"
              />

              {/* FIXED TOGGLE SECTION - No more jumping */}
              <div className="flex gap-8 p-5 bg-gray-50 rounded-xl border border-gray-100">
                <ToggleSwitch
                  label="Active"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  activeColor="bg-green-500"
                  icon={CheckCircleIcon}
                />
                <ToggleSwitch
                  label="Featured"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  activeColor="bg-amber-500"
                  icon={StarIcon}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
                <Link href="/products" className="px-6 py-3 border border-gray-200 rounded-xl text-gray-600 bg-white hover:bg-gray-50 font-medium transition-colors duration-200">
                  Cancel
                </Link>
                <motion.button
                  type="submit"
                  disabled={submitting || loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl font-medium disabled:opacity-50 flex items-center space-x-2 transition-all duration-200"
                >
                  {submitting || loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="h-4 w-4" />
                      <span>Create Product</span>
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}