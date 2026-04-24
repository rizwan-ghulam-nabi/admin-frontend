'use client';

import { create } from 'zustand';
import { categoryService } from '@/services/category.service';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

// ✅ Helper to get token from multiple sources
const getToken = () => {
  // Try cookies first
  const cookieToken = Cookies.get('accessToken');
  if (cookieToken) return cookieToken;
  
  // Try localStorage
  const localToken = localStorage.getItem('accessToken');
  if (localToken) return localToken;
  
  // Try sessionStorage
  const sessionToken = sessionStorage.getItem('accessToken');
  if (sessionToken) return sessionToken;
  
  return null;
};

export const useCategoryStore = create((set, get) => ({
  categories: [],
  categoryTree: [],
  selectedCategory: null,
  loading: false,

  fetchCategories: async () => {
    const token = getToken();
    
    console.log('🔑 Token found:', !!token);
    
    if (!token) {
      console.log('⏭️ No token found, skipping category fetch');
      return;
    }

    set({ loading: true });
    try {
      const response = await categoryService.getAll();
      console.log('📦 Categories response:', response);
      
      let categories = [];
      if (response.data) {
        categories = Array.isArray(response.data) ? response.data : [];
      }
      
      console.log('✅ Categories loaded:', categories.length);
      set({ categories, loading: false });
    } catch (error) {
      console.error('❌ Fetch error:', error);
      set({ loading: false, categories: [] });
    }
  },

  fetchCategoryTree: async () => {
    const token = getToken();
    if (!token) return;

    set({ loading: true });
    try {
      const response = await categoryService.getTree();
      set({ categoryTree: response.data || [], loading: false });
    } catch (error) {
      set({ loading: false, categoryTree: [] });
    }
  },

  createCategory: async (data) => {
    set({ loading: true });
    try {
      const response = await categoryService.create(data);
      toast.success(response.message || 'Category created successfully');
      await get().fetchCategories();
      await get().fetchCategoryTree();
      return response.data;
    } catch (error) {
      toast.error(error.message || 'Failed to create category');
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateCategory: async (id, data) => {
    set({ loading: true });
    try {
      const response = await categoryService.update(id, data);
      toast.success(response.message || 'Category updated successfully');
      await get().fetchCategories();
      await get().fetchCategoryTree();
      return response.data;
    } catch (error) {
      toast.error(error.message || 'Failed to update category');
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteCategory: async (id) => {
    set({ loading: true });
    try {
      const response = await categoryService.delete(id);
      toast.success(response.message || 'Category deleted successfully');
      await get().fetchCategories();
      await get().fetchCategoryTree();
    } catch (error) {
      toast.error(error.message || 'Failed to delete category');
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  reorderCategories: async (categories) => {
    set({ loading: true });
    try {
      const response = await categoryService.reorder(categories);
      toast.success(response.message || 'Categories reordered successfully');
      await get().fetchCategoryTree();
    } catch (error) {
      toast.error(error.message || 'Failed to reorder categories');
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  clearSelected: () => set({ selectedCategory: null }),
}));