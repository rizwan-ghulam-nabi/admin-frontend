'use client';

import { create } from 'zustand';
import { productService } from '@/services/product.service';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie'; // ✅ Import Cookies

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
  },

  resetFilters: () => {
    set({
      filters: {
        search: '',
        category: '',
        status: '',
        sort: '-createdAt',
      },
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
      },
    });
  },

  // ✅ SINGLE fetchProducts function with token check
  fetchProducts: async () => {
    const token = Cookies.get('accessToken'); // ✅ Read from cookies
    
    if (!token) {
      console.log('⏭️ No token found, skipping product fetch');
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

      const { data: products, pagination: newPagination } = parseResponse(response, 'Products');

      console.log(`✅ Loaded ${products.length} products (Total: ${newPagination.total})`);

      set({
        products,
        pagination: {
          page: newPagination.page || pagination.page,
          limit: newPagination.limit || pagination.limit,
          total: newPagination.total || 0,
          totalPages: newPagination.pages || 1,
        },
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('❌ Fetch products error:', error);

      // Don't show toast for 401 errors
      if (error.status !== 401 && !error.message?.includes('401')) {
        toast.error(error.message || 'Failed to fetch products');
      }

      set({
        products: [],
        loading: false,
        error: error.message || 'Failed to fetch products',
      });
    }
  },

  // Fetch single product
  fetchProduct: async (id) => {
    const token = Cookies.get('accessToken'); // ✅ Read from cookies
    if (!token) {
      toast.error('Please login first');
      return null;
    }

    set({ loading: true, error: null });

    try {
      const response = await productService.getById(id);
      const { data: product } = parseResponse(response, 'Single Product');

      // Handle single object response
      const productData = Array.isArray(product) ? product[0] : product;

      console.log('✅ Product loaded:', productData?._id || productData?.id);

      set({
        selectedProduct: productData,
        loading: false,
        error: null,
      });

      return productData;
    } catch (error) {
      console.error('❌ Fetch product error:', error);

      if (error.status !== 401) {
        toast.error(error.message || 'Failed to fetch product');
      }

      set({
        loading: false,
        error: error.message || 'Failed to fetch product',
      });

      return null;
    }
  },

  // Create product
  createProduct: async (data) => {
    const token = getToken();

    if (!token) {
      const errorMsg = 'No authentication token found. Please login again.';
      console.error('❌', errorMsg);
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }

    set({ loading: true, error: null });

    try {
      console.log('📦 Creating product...');
      const response = await productService.create(data);
      console.log('✅ Product creation response:', response);

      const { data: newProduct, message } = parseResponse(response, 'Create Product');

      // Handle single object response
      const productData = Array.isArray(newProduct) ? newProduct[0] : newProduct;

      if (productData) {
        // Add new product to the beginning of the list
        set((state) => ({
          products: [productData, ...state.products],
          loading: false,
          error: null,
        }));
      }

      // Refresh products list to get updated data
      await get().fetchProducts();

      toast.success(message || 'Product created successfully! 🎉');
      return productData;
    } catch (error) {
      console.error('❌ Create product error:', error);

      // Handle validation errors
      if (error.errors) {
        const firstError = Object.values(error.errors)[0];
        toast.error(firstError);
      } else if (error.status === 401) {
        toast.error('Session expired. Please login again.');
      } else {
        toast.error(error.message || 'Failed to create product');
      }

      set({
        loading: false,
        error: error.message || 'Failed to create product',
      });

      throw error;
    }
  },

  // Update product
  updateProduct: async (id, data) => {
    const token = getToken();

    if (!token) {
      toast.error('Please login first');
      throw new Error('No authentication token');
    }

    set({ loading: true, error: null });

    try {
      console.log(`📦 Updating product ${id}...`);
      const response = await productService.update(id, data);
      console.log('✅ Product update response:', response);

      const { data: updatedProduct, message } = parseResponse(response, 'Update Product');

      // Handle single object response
      const productData = Array.isArray(updatedProduct) ? updatedProduct[0] : updatedProduct;

      if (productData) {
        // Update product in the list
        set((state) => ({
          products: state.products.map((p) =>
            p._id === id || p.id === id ? { ...p, ...productData } : p
          ),
          selectedProduct:
            state.selectedProduct?._id === id || state.selectedProduct?.id === id
              ? { ...state.selectedProduct, ...productData }
              : state.selectedProduct,
          loading: false,
          error: null,
        }));
      }

      // Refresh products list
      await get().fetchProducts();

      toast.success(message || 'Product updated successfully! ✨');
      return productData;
    } catch (error) {
      console.error('❌ Update product error:', error);

      if (error.errors) {
        const firstError = Object.values(error.errors)[0];
        toast.error(firstError);
      } else if (error.status === 401) {
        toast.error('Session expired. Please login again.');
      } else {
        toast.error(error.message || 'Failed to update product');
      }

      set({
        loading: false,
        error: error.message || 'Failed to update product',
      });

      throw error;
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true });
    try {
      const response = await productService.delete(id);
      toast.success(response.message || 'Product deleted successfully');
      await get().fetchProducts();
    } catch (error) {
      toast.error(error.message || 'Failed to delete product');
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // Bulk update products
  bulkUpdateProducts: async (productIds, updateData) => {
    const token = getToken();

    if (!token) {
      toast.error('Please login first');
      throw new Error('No authentication token');
    }

    set({ loading: true, error: null });

    try {
      console.log(`📦 Bulk updating ${productIds.length} products...`);
      const response = await productService.bulkUpdate(productIds, updateData);
      console.log('✅ Bulk update response:', response);

      const { message } = parseResponse(response, 'Bulk Update');

      toast.success(message || `Updated ${productIds.length} products successfully!`);

      // Refresh products list
      await get().fetchProducts();
    } catch (error) {
      console.error('❌ Bulk update error:', error);
      toast.error(error.message || 'Failed to bulk update products');

      set({
        loading: false,
        error: error.message || 'Failed to bulk update products',
      });

      throw error;
    }
  },

  // Update product stock
  updateStock: async (id, stock) => {
    try {
      console.log(`📦 Updating stock for product ${id} to ${stock}`);
      const response = await productService.updateStock(id, stock);
      console.log('✅ Stock update response:', response);

      // Update product in the list
      set((state) => ({
        products: state.products.map((p) =>
          p._id === id || p.id === id ? { ...p, stock } : p
        ),
        selectedProduct:
          state.selectedProduct?._id === id || state.selectedProduct?.id === id
            ? { ...state.selectedProduct, stock }
            : state.selectedProduct,
      }));

      toast.success(response?.message || 'Stock updated successfully! 📊');
    } catch (error) {
      console.error('❌ Update stock error:', error);
      toast.error(error.message || 'Failed to update stock');
      throw error;
    }
  },

  // Get low stock products
  getLowStock: async (threshold = 10) => {
    try {
      console.log(`📦 Fetching low stock products (threshold: ${threshold})`);
      const response = await productService.getLowStock(threshold);
      console.log('✅ Low stock response:', response);

      const { data: lowStockProducts } = parseResponse(response, 'Low Stock');

      return Array.isArray(lowStockProducts) ? lowStockProducts : [lowStockProducts];
    } catch (error) {
      console.error('❌ Get low stock error:', error);
      toast.error(error.message || 'Failed to fetch low stock products');
      return [];
    }
  },

  // ============ PAGINATION ============
  setPage: (page) => {
    set((state) => ({
      pagination: { ...state.pagination, page },
    }));
    get().fetchProducts();
  },

  setLimit: (limit) => {
    set((state) => ({
      pagination: { ...state.pagination, limit, page: 1 },
    }));
    get().fetchProducts();
  },

  // ============ UTILITY ACTIONS ============
  clearSelected: () => {
    set({ selectedProduct: null });
  },

  clearError: () => {
    set({ error: null });
  },

  // Reset entire store
  resetStore: () => {
    set({
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
    });
  },

  // Debug: Get current token info
  getTokenInfo: () => {
    const token = getToken();
    if (!token) {
      console.log('❌ No token found');
      return null;
    }
    console.log('✅ Token found:', token.substring(0, 30) + '...');
    console.log('Token source:', {
      localStorage: localStorage.getItem('accessToken') || localStorage.getItem('adminToken') || localStorage.getItem('token'),
      sessionStorage: sessionStorage.getItem('accessToken') || sessionStorage.getItem('adminToken'),
      cookies: Cookies.get('accessToken') || Cookies.get('adminToken') || Cookies.get('token'),
    });
    return token;
  },
}));

export default useProductStore;