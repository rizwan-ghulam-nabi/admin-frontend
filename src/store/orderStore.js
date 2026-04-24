'use client';

import { create } from 'zustand';
import { orderService } from '@/services/order.service';
import toast from 'react-hot-toast';

export const useOrderStore = create((set, get) => ({
  orders: [],
  selectedOrder: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
  loading: false,
  filters: {
    search: '',
    status: '',
    paymentStatus: '',
    sort: '-createdAt',
  },

  setFilters: (filters) => {
    set({ filters: { ...get().filters, ...filters } });
  },

  resetFilters: () => {
    set({
      filters: {
        search: '',
        status: '',
        paymentStatus: '',
        sort: '-createdAt',
      },
    });
  },

  fetchOrders: async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.log('⏭️ Skipping order fetch - no token');
      return;
    }

    const { pagination, filters } = get();
    set({ loading: true });
    
    try {
      const response = await orderService.getAll({
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      });
      
      set({
        orders: response.data || [],
        pagination: {
          ...pagination,
          total: response.pagination?.total || 0,
          totalPages: response.pagination?.totalPages || 1,
        },
        loading: false,
      });
    } catch (error) {
      if (!error.message?.includes('401')) {
        toast.error(error.message || 'Failed to fetch orders');
      }
      set({ loading: false, orders: [] });
    }
  },

  fetchOrder: async (id) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      toast.error('Please login first');
      return;
    }

    set({ loading: true });
    try {
      const response = await orderService.getById(id);
      set({ selectedOrder: response.data, loading: false });
      return response.data;
    } catch (error) {
      toast.error(error.message || 'Failed to fetch order');
      set({ loading: false });
      throw error;
    }
  },

  updateOrderStatus: async (id, status, note = '') => {
    set({ loading: true });
    try {
      const response = await orderService.updateStatus(id, status, note);
      toast.success(response.message || `Order status updated to ${status}`);
      await get().fetchOrders();
      if (get().selectedOrder?._id === id) {
        set({ selectedOrder: { ...get().selectedOrder, status } });
      }
      return response.data;
    } catch (error) {
      toast.error(error.message || 'Failed to update order status');
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updatePaymentStatus: async (id, paymentStatus, transactionId = '') => {
    set({ loading: true });
    try {
      const response = await orderService.updatePaymentStatus(id, paymentStatus, transactionId);
      toast.success(response.message || `Payment status updated to ${paymentStatus}`);
      await get().fetchOrders();
      if (get().selectedOrder?._id === id) {
        set({ selectedOrder: { ...get().selectedOrder, paymentStatus } });
      }
      return response.data;
    } catch (error) {
      toast.error(error.message || 'Failed to update payment status');
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  cancelOrder: async (id, reason = '') => {
    set({ loading: true });
    try {
      const response = await orderService.cancel(id, reason);
      toast.success(response.message || 'Order cancelled successfully');
      await get().fetchOrders();
      if (get().selectedOrder?._id === id) {
        set({ selectedOrder: { ...get().selectedOrder, status: 'cancelled' } });
      }
      return response.data;
    } catch (error) {
      toast.error(error.message || 'Failed to cancel order');
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  bulkUpdateOrders: async (orderIds, status, note = '') => {
    set({ loading: true });
    try {
      const response = await orderService.bulkUpdate(orderIds, status, note);
      toast.success(response.message || `${orderIds.length} orders updated`);
      await get().fetchOrders();
      return response.data;
    } catch (error) {
      toast.error(error.message || 'Failed to bulk update orders');
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  getOrderStats: async (period = 'month') => {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;

    try {
      const response = await orderService.getStats(period);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch order stats:', error);
      return null;
    }
  },

  setPage: (page) => {
    set({ pagination: { ...get().pagination, page } });
    get().fetchOrders();
  },

  clearSelected: () => {
    set({ selectedOrder: null });
  },
}));