// 'use client';

// import { create } from 'zustand';
// import { productService } from '@/services/product.service';
// import toast from 'react-hot-toast';

// export const useProductStore = create((set, get) => ({
//   products: [],
//   selectedProduct: null,
//   pagination: {
//     page: 1,
//     limit: 20,
//     total: 0,
//     totalPages: 0,
//   },
//   loading: false,
//   filters: {
//     search: '',
//     category: '',
//     status: '',
//     sort: '-createdAt',
//   },

//   setFilters: (filters) => {
//     set({ filters: { ...get().filters, ...filters } });
//   },

//   resetFilters: () => {
//     set({
//       filters: {
//         search: '',
//         category: '',
//         status: '',
//         sort: '-createdAt',
//       },
//     });
//   },

//   fetchProducts: async () => {
//     const { pagination, filters } = get();
//     set({ loading: true });
    
//     try {
//       const response = await productService.getAll({
//         page: pagination.page,
//         limit: pagination.limit,
//         ...filters,
//       });
      
//       set({
//         products: response.data || [],
//         pagination: {
//           ...pagination,
//           total: response.pagination?.total || 0,
//           totalPages: response.pagination?.totalPages || 0,
//         },
//         loading: false,
//       });
//     } catch (error) {
//       toast.error(error.message || 'Failed to fetch products');
//       set({ loading: false });
//     }
//   },

//   // fetchProduct: async (id) => {
//   //   set({ loading: true });
//   //   try {
//   //     const response = await productService.getById(id);
//   //     set({ selectedProduct: response.data, loading: false });
//   //     return response.data;
//   //   } catch (error) {
//   //     toast.error(error.message || 'Failed to fetch product');
//   //     set({ loading: false });
//   //     throw error;
//   //   }
//   // },



//   fetchProducts: async () => {
//   const { pagination, filters } = get();
//   set({ loading: true });
  
//   try {
//     const response = await productService.getAll({
//       page: pagination.page,
//       limit: pagination.limit,
//       ...filters,
//     });
    
//     console.log('📦 Products response:', response);
    
//     // ✅ Handle the response structure
//     let products = [];
//     let total = 0;
//     let totalPages = 1;
    
//     if (response.data) {
//       products = Array.isArray(response.data) ? response.data : [];
//       total = response.pagination?.total || products.length;
//       totalPages = response.pagination?.totalPages || 1;
//     }
    
//     console.log('✅ Loaded products:', products.length);
    
//     set({
//       products: products,
//       pagination: {
//         page: response.pagination?.page || pagination.page,
//         limit: response.pagination?.limit || pagination.limit,
//         total: total,
//         totalPages: totalPages,
//       },
//       loading: false,
//     });
//   } catch (error) {
//     console.error('Fetch products error:', error);
//     toast.error(error.message || 'Failed to fetch products');
//     set({ 
//       products: [],
//       loading: false 
//     });
//   }
// },

//   createProduct: async (data) => {
//     set({ loading: true });
//     try {
//       const response = await productService.create(data);
//       toast.success(response.message || 'Product created successfully');
//       await get().fetchProducts();
//       return response.data;
//     } catch (error) {
//       toast.error(error.message || 'Failed to create product');
//       throw error;
//     } finally {
//       set({ loading: false });
//     }
//   },

//   updateProduct: async (id, data) => {
//     set({ loading: true });
//     try {
//       const response = await productService.update(id, data);
//       toast.success(response.message || 'Product updated successfully');
//       await get().fetchProducts();
//       return response.data;
//     } catch (error) {
//       toast.error(error.message || 'Failed to update product');
//       throw error;
//     } finally {
//       set({ loading: false });
//     }
//   },

//   deleteProduct: async (id) => {
//     set({ loading: true });
//     try {
//       const response = await productService.delete(id);
//       toast.success(response.message || 'Product deleted successfully');
//       await get().fetchProducts();
//     } catch (error) {
//       toast.error(error.message || 'Failed to delete product');
//       throw error;
//     } finally {
//       set({ loading: false });
//     }
//   },

//   bulkUpdateProducts: async (productIds, updateData) => {
//     set({ loading: true });
//     try {
//       const response = await productService.bulkUpdate(productIds, updateData);
//       toast.success(response.message);
//       await get().fetchProducts();
//     } catch (error) {
//       toast.error(error.message || 'Failed to bulk update products');
//       throw error;
//     } finally {
//       set({ loading: false });
//     }
//   },

//   updateStock: async (id, stock) => {
//     try {
//       const response = await productService.updateStock(id, stock);
//       toast.success(response.message || 'Stock updated');
//       await get().fetchProducts();
//     } catch (error) {
//       toast.error(error.message || 'Failed to update stock');
//       throw error;
//     }
//   },

//   getLowStock: async (threshold = 10) => {
//     try {
//       const response = await productService.getLowStock(threshold);
//       return response.data;
//     } catch (error) {
//       toast.error(error.message || 'Failed to fetch low stock products');
//       throw error;
//     }
//   },

//   setPage: (page) => {
//     set({ pagination: { ...get().pagination, page } });
//     get().fetchProducts();
//   },

//   clearSelected: () => {
//     set({ selectedProduct: null });
//   },
// }));










































'use client';

import { create } from 'zustand';
import { productService } from '@/services/product.service';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie'; // ✅ Import Cookies

export const useProductStore = create((set, get) => ({
  products: [],
  selectedProduct: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
  loading: false,
  filters: {
    search: '',
    category: '',
    status: '',
    sort: '-createdAt',
  },

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
    });
  },

  // ✅ SINGLE fetchProducts function with token check
  fetchProducts: async () => {
    const token = Cookies.get('accessToken'); // ✅ Read from cookies
    
    if (!token) {
      console.log('⏭️ No token, skipping product fetch');
      return;
    }

    const { pagination, filters } = get();
    set({ loading: true });
    
    try {
      const response = await productService.getAll({
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      });
      
      console.log('📦 Products response:', response);
      
      let products = [];
      let total = 0;
      let totalPages = 1;
      
      if (response.data) {
        products = Array.isArray(response.data) ? response.data : [];
        total = response.pagination?.total || products.length;
        totalPages = response.pagination?.totalPages || 1;
      }
      
      console.log('✅ Loaded products:', products.length);
      
      set({
        products: products,
        pagination: {
          page: response.pagination?.page || pagination.page,
          limit: response.pagination?.limit || pagination.limit,
          total: total,
          totalPages: totalPages,
        },
        loading: false,
      });
    } catch (error) {
      console.error('Fetch products error:', error);
      if (!error.message?.includes('401')) {
        toast.error(error.message || 'Failed to fetch products');
      }
      set({ products: [], loading: false });
    }
  },

  fetchProduct: async (id) => {
    const token = Cookies.get('accessToken'); // ✅ Read from cookies
    if (!token) {
      toast.error('Please login first');
      return;
    }

    set({ loading: true });
    try {
      const response = await productService.getById(id);
      set({ selectedProduct: response.data, loading: false });
      return response.data;
    } catch (error) {
      toast.error(error.message || 'Failed to fetch product');
      set({ loading: false });
      throw error;
    }
  },

  createProduct: async (data) => {
    set({ loading: true });
    try {
      const response = await productService.create(data);
      toast.success(response.message || 'Product created successfully');
      await get().fetchProducts();
      return response.data;
    } catch (error) {
      toast.error(error.message || 'Failed to create product');
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateProduct: async (id, data) => {
    set({ loading: true });
    try {
      const response = await productService.update(id, data);
      toast.success(response.message || 'Product updated successfully');
      await get().fetchProducts();
      return response.data;
    } catch (error) {
      toast.error(error.message || 'Failed to update product');
      throw error;
    } finally {
      set({ loading: false });
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

  bulkUpdateProducts: async (productIds, updateData) => {
    set({ loading: true });
    try {
      const response = await productService.bulkUpdate(productIds, updateData);
      toast.success(response.message);
      await get().fetchProducts();
    } catch (error) {
      toast.error(error.message || 'Failed to bulk update products');
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateStock: async (id, stock) => {
    try {
      const response = await productService.updateStock(id, stock);
      toast.success(response.message || 'Stock updated');
      await get().fetchProducts();
    } catch (error) {
      toast.error(error.message || 'Failed to update stock');
      throw error;
    }
  },

  getLowStock: async (threshold = 10) => {
    try {
      const response = await productService.getLowStock(threshold);
      return response.data;
    } catch (error) {
      toast.error(error.message || 'Failed to fetch low stock products');
      throw error;
    }
  },

  setPage: (page) => {
    set({ pagination: { ...get().pagination, page } });
    get().fetchProducts();
  },

  clearSelected: () => {
    set({ selectedProduct: null });
  },
}));