'use client';

import { useAuthStore } from '@/store/authStore';

export const PERMISSIONS = {
  // Dashboard
  VIEW_DASHBOARD: 'view_dashboard',
  
  // Products
  MANAGE_PRODUCTS: 'manage_products',
  VIEW_PRODUCTS: 'view_products',
  CREATE_PRODUCTS: 'create_products',
  UPDATE_PRODUCTS: 'update_products',
  DELETE_PRODUCTS: 'delete_products',
  
  // Orders
  MANAGE_ORDERS: 'manage_orders',
  VIEW_ORDERS: 'view_orders',
  
  // Users
  MANAGE_USERS: 'manage_users',
  VIEW_USERS: 'view_users',
  
  // Categories
  MANAGE_CATEGORIES: 'manage_categories',
  
  // Coupons
  MANAGE_COUPONS: 'manage_coupons',
  
  // Reports
  VIEW_REPORTS: 'view_reports',
  
  // Settings
  MANAGE_SETTINGS: 'manage_settings',
  
  // Backups
  MANAGE_BACKUPS: 'manage_backups',
  
  // Logs
  VIEW_LOGS: 'view_logs',
};

export const usePermissions = () => {
  const { permissions } = useAuthStore();
  
  const hasPermission = (permission) => {
    if (!permissions || permissions.length === 0) return false;
    if (permissions.includes('*')) return true;
    return permissions.includes(permission);
  };
  
  return {
    hasPermission,
    canViewDashboard: hasPermission(PERMISSIONS.VIEW_DASHBOARD),
    canManageProducts: hasPermission(PERMISSIONS.MANAGE_PRODUCTS),
    canViewProducts: hasPermission(PERMISSIONS.VIEW_PRODUCTS),
    canCreateProducts: hasPermission(PERMISSIONS.CREATE_PRODUCTS),
    canUpdateProducts: hasPermission(PERMISSIONS.UPDATE_PRODUCTS),
    canDeleteProducts: hasPermission(PERMISSIONS.DELETE_PRODUCTS),
    canManageOrders: hasPermission(PERMISSIONS.MANAGE_ORDERS),
    canViewOrders: hasPermission(PERMISSIONS.VIEW_ORDERS),
    canManageUsers: hasPermission(PERMISSIONS.MANAGE_USERS),
    canViewUsers: hasPermission(PERMISSIONS.VIEW_USERS),
    canManageCategories: hasPermission(PERMISSIONS.MANAGE_CATEGORIES),
    canManageCoupons: hasPermission(PERMISSIONS.MANAGE_COUPONS),
    canViewReports: hasPermission(PERMISSIONS.VIEW_REPORTS),
    canManageSettings: hasPermission(PERMISSIONS.MANAGE_SETTINGS),
    canManageBackups: hasPermission(PERMISSIONS.MANAGE_BACKUPS),
    canViewLogs: hasPermission(PERMISSIONS.VIEW_LOGS),
  };
};