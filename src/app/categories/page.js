'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '@/components/Layout';
import { useCategoryStore } from '@/store/categoryStore';
import { usePermissions } from '@/lib/permissions';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  FolderIcon,
  ArrowLeftIcon,
  XMarkIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

// ============================================
// CATEGORY FORM MODAL
// ============================================
const CategoryFormModal = ({ isOpen, onClose, onSubmit, initialData, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true,
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name || '',
          description: initialData.description || '',
          isActive: initialData.isActive !== false,
        });
      } else {
        setFormData({ name: '', description: '', isActive: true });
      }
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Category name is required');
      return;
    }
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl">
                <FolderIcon className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                {initialData ? 'Edit Category' : 'Create Category'}
              </h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <XMarkIcon className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="e.g., Electronics"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                placeholder="Brief description..."
              />
            </div>

            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="sr-only"
              />
              <div className={`w-11 h-6 rounded-full transition-all ${formData.isActive ? 'bg-green-500' : 'bg-gray-300'}`}>
                <motion.div animate={{ x: formData.isActive ? 22 : 2 }} className="absolute w-5 h-5 bg-white rounded-full shadow" />
              </div>
              <span className="ml-3 text-sm font-medium text-gray-700">Active</span>
            </label>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
              <button type="button" onClick={onClose} className="px-5 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 font-medium">
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl shadow-lg hover:shadow-xl font-medium disabled:opacity-50"
              >
                {loading ? 'Saving...' : initialData ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ============================================
// MAIN CATEGORIES PAGE
// ============================================
export default function CategoriesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/products';
  
  const { categories, loading, fetchCategories, createCategory, updateCategory, deleteCategory } = useCategoryStore();
  const { canManageCategories } = usePermissions();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadCategories = async () => {
    console.log('🔄 Loading categories...');
    console.log('📋 Token exists:', !!localStorage.getItem('accessToken'));
    await fetchCategories();
    console.log('✅ Categories loaded');
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Debug: Watch categories state
  useEffect(() => {
    console.log('📋 Categories state:', categories.length, categories);
  }, [categories]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadCategories();
    setRefreshing(false);
  };

  const handleCreate = () => {
    setEditingCategory(null);
    setModalOpen(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await deleteCategory(id);
      toast.success('Category deleted successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to delete category');
    }
  };

  const handleSubmit = async (data) => {
    setSubmitting(true);
    try {
      if (editingCategory) {
        await updateCategory(editingCategory._id, data);
        toast.success('Category updated successfully');
      } else {
        await createCategory(data);
        toast.success('Category created successfully');
      }
      setModalOpen(false);
      setEditingCategory(null);
    } catch (error) {
      toast.error(error.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    router.push(redirectUrl);
  };

  if (!canManageCategories) {
    return (
      <Layout>
        <div className="text-center py-20">
          <XMarkIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold">Access Denied</h2>
          <p className="text-gray-500">You don't have permission to manage categories.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto pb-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <button onClick={handleBack} className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
            <ArrowLeftIcon className="h-4 w-4 mr-1" /> Back
          </button>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg">
                <FolderIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
                <p className="text-gray-500">Manage your product categories</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={handleRefresh} 
                disabled={refreshing}
                className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition"
                title="Refresh"
              >
                <ArrowPathIcon className={`h-5 w-5 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              <button onClick={handleCreate} className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl shadow-lg hover:shadow-xl font-medium">
                <PlusIcon className="h-5 w-5 mr-2" /> Add Category
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-12 flex justify-center">
              <div className="animate-spin h-8 w-8 border-4 border-amber-500 border-t-transparent rounded-full" />
            </div>
          ) : categories.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {categories.map((category) => (
                <div key={category._id} className="p-4 hover:bg-gray-50 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FolderIcon className="h-5 w-5 text-amber-500" />
                    <div>
                      <p className="font-medium text-gray-900">{category.name}</p>
                      {category.description && <p className="text-sm text-gray-500">{category.description}</p>}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${category.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {category.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <button onClick={() => handleEdit(category)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(category._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <FolderIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No categories yet</h3>
              <p className="text-gray-500 mt-1">Create your first category to get started.</p>
              <button onClick={handleCreate} className="mt-4 inline-flex items-center px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600">
                <PlusIcon className="h-4 w-4 mr-2" /> Create Category
              </button>
              <button onClick={handleRefresh} className="mt-2 text-sm text-blue-600 hover:underline">
                Refresh
              </button>
            </div>
          )}
        </motion.div>

        <AnimatePresence>
          {modalOpen && (
            <CategoryFormModal
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
              onSubmit={handleSubmit}
              initialData={editingCategory}
              loading={submitting}
            />
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}