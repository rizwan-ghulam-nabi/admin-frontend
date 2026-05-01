// store/productStore.js
'use client';

import { create } from 'zustand';
import { productService } from '@/services/product.service';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

// Helper to get token
const getToken = () => {
  return Cookies.get('accessToken') || 
         (typeof window !== 'undefined' && localStorage.getItem('accessToken'));
};

export const useProductStore = create((set, get) => ({
  // ============ STATE ============
  products: [],
  selectedProduct: null,
  loading: false,
  error: null,

  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },

  filters: {
    search: '',
    category: '',
    status: '',
    sort: '-createdAt',
  },

  // ============ FILTER ACTIONS ============
  setFilters: (filters) => {
    set({ filters: { ...get().filters, ...filters } });
    get().fetchProducts();
  },

  resetFilters: () => {
    set({
      filters: { search: '', category: '', status: '', sort: '-createdAt' },
      pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
    });
  },

  // ============ FETCH PRODUCTS ============
  fetchProducts: async () => {
    const token = getToken();
    
    if (!token) {
      console.log('⏭️ No token, skipping fetch');
      set({ products: [], loading: false });
      return;
    }

    const { pagination, filters } = get();
    set({ loading: true, error: null });

    try {
      const response = await productService.getAll({
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      });

      console.log('📦 Products response:', response);

      // Handle different response structures
      const products = response.data || response.products || response || [];
      const newPagination = response.pagination || {
        page: pagination.page,
        limit: pagination.limit,
        total: Array.isArray(products) ? products.length : 0,
        totalPages: 1,
      };

      console.log(`✅ Loaded ${Array.isArray(products) ? products.length : 0} products`);

      set({
        products: Array.isArray(products) ? products : [],
        pagination: {
          page: newPagination.page || pagination.page,
          limit: newPagination.limit || pagination.limit,
          total: newPagination.total || 0,
          totalPages: newPagination.totalPages || newPagination.pages || 1,
        },
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('❌ Fetch products error:', error);
      set({ 
        products: [], 
        loading: false, 
        error: error.message || 'Failed to fetch products' 
      });
      if (!error.message?.includes('401')) {
        toast.error(error.message || 'Failed to fetch products');
      }
    }
  },

  // ============ FETCH SINGLE PRODUCT ============
  fetchProduct: async (id) => {
    if (!id) return null;

    const token = getToken();
    if (!token) {
      toast.error('Please login first');
      return null;
    }

    set({ loading: true, error: null });

    try {
      const response = await productService.getById(id);
      console.log('📦 Single product response:', response);

      const product = response.data || response.product || response;

      set({
        selectedProduct: product,
        loading: false,
        error: null,
      });

      return product;
    } catch (error) {
      console.error('❌ Fetch product error:', error);
      set({ loading: false, error: error.message });
      if (!error.message?.includes('401')) {
        toast.error(error.message || 'Failed to fetch product');
      }
      return null;
    }
  },

  // ============ CREATE PRODUCT ============
  createProduct: async (data) => {
    set({ loading: true, error: null });

    try {
      console.log('📦 Creating product...');
      const response = await productService.create(data);
      console.log('✅ Create response:', response);

      const newProduct = response.data || response.product || response;
      const message = response.message || 'Product created successfully!';

      toast.success(message);
      await get().fetchProducts();
      
      return newProduct;
    } catch (error) {
      console.error('❌ Create error:', error);
      toast.error(error.message || 'Failed to create product');
      set({ loading: false, error: error.message });
      throw error;
    }
  },

  // ============ UPDATE PRODUCT ============
  updateProduct: async (id, data) => {
    set({ loading: true, error: null });

    try {
      console.log(`📦 Updating product ${id}...`);
      const response = await productService.update(id, data);
      console.log('✅ Update response:', response);

      const updatedProduct = response.data || response.product || response;
      const message = response.message || 'Product updated successfully!';

      toast.success(message);
      await get().fetchProducts();

      return updatedProduct;
    } catch (error) {
      console.error('❌ Update error:', error);
      toast.error(error.message || 'Failed to update product');
      set({ loading: false, error: error.message });
      throw error;
    }
  },

  // ============ DELETE PRODUCT ============
  deleteProduct: async (id) => {
    console.log('🔴 deleteProduct called, ID:', id);
    
    if (!id) {
      toast.error('No product ID provided');
      return;
    }

    set({ loading: true, error: null });

    try {
      const response = await productService.delete(id);
      console.log('✅ Delete response:', response);

      // Remove from local state immediately
      set(state => ({
        products: state.products.filter(p => p._id !== id && p.id !== id),
        selectedProduct: state.selectedProduct?._id === id ? null : state.selectedProduct,
        loading: false,
      }));

      toast.success(response.message || 'Product deleted successfully!');
      
      // Refresh in background
      setTimeout(() => get().fetchProducts(), 500);
    } catch (error) {
      console.error('❌ Delete error:', error);
      toast.error(error.message || 'Failed to delete product');
      set({ loading: false, error: error.message });
      throw error;
    }
  },

  // ============ BULK UPDATE ============
  bulkUpdateProducts: async (productIds, updateData) => {
    set({ loading: true, error: null });

    try {
      console.log(`📦 Bulk updating ${productIds.length} products...`);
      const response = await productService.bulkUpdate(productIds, updateData);
      console.log('✅ Bulk update response:', response);

      toast.success(response.message || `Updated ${productIds.length} products!`);
      await get().fetchProducts();
    } catch (error) {
      console.error('❌ Bulk update error:', error);
      toast.error(error.message || 'Failed to bulk update');
      set({ loading: false, error: error.message });
      throw error;
    }
  },

  // ============ UPDATE STOCK ============
  updateStock: async (id, stock) => {
    try {
      console.log(`📦 Updating stock for ${id} to ${stock}`);
      const response = await productService.updateStock(id, stock);
      console.log('✅ Stock update response:', response);

      // Update in local state
      set(state => ({
        products: state.products.map(p =>
          (p._id === id || p.id === id) ? { ...p, stock } : p
        ),
        selectedProduct: state.selectedProduct?._id === id || state.selectedProduct?.id === id
          ? { ...state.selectedProduct, stock }
          : state.selectedProduct,
      }));

      toast.success(response.message || 'Stock updated!');
    } catch (error) {
      console.error('❌ Stock update error:', error);
      toast.error(error.message || 'Failed to update stock');
      throw error;
    }
  },

  // ============ LOW STOCK ============
  getLowStock: async (threshold = 10) => {
    try {
      console.log(`📦 Fetching low stock (threshold: ${threshold})`);
      const response = await productService.getLowStock(threshold);
      console.log('✅ Low stock response:', response);

      const products = response.data || response.products || response || [];
      return Array.isArray(products) ? products : [];
    } catch (error) {
      console.error('❌ Low stock error:', error);
      toast.error(error.message || 'Failed to fetch low stock');
      return [];
    }
  },

  // ============ PAGINATION ============
  setPage: (page) => {
    set(state => ({ pagination: { ...state.pagination, page } }));
    get().fetchProducts();
  },

  // ============ UTILITY ============
  clearSelected: () => set({ selectedProduct: null }),
  clearError: () => set({ error: null }),

  resetStore: () => {
    set({
      products: [],
      selectedProduct: null,
      loading: false,
      error: null,
      pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
      filters: { search: '', category: '', status: '', sort: '-createdAt' },
    });
  },
}));

export default useProductStore;