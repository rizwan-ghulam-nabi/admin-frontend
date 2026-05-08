// 'use client';

// import { useAuthStore } from '@/store/authStore';

// export const PERMISSIONS = {
//   // Dashboard
//   VIEW_DASHBOARD: 'view_dashboard',
  
//   // Products
//   MANAGE_PRODUCTS: 'manage_products',
//   VIEW_PRODUCTS: 'view_products',
//   CREATE_PRODUCTS: 'create_products',
//   UPDATE_PRODUCTS: 'update_products',
//   DELETE_PRODUCTS: 'delete_products',
  
//   // Orders
//   MANAGE_ORDERS: 'manage_orders',
//   VIEW_ORDERS: 'view_orders',
  
//   // Users
//   MANAGE_USERS: 'manage_users',
//   VIEW_USERS: 'view_users',
  
//   // Categories
//   MANAGE_CATEGORIES: 'manage_categories',
  
//   // Coupons
//   MANAGE_COUPONS: 'manage_coupons',
  
//   // Reports
//   VIEW_REPORTS: 'view_reports',
  
//   // Settings
//   MANAGE_SETTINGS: 'manage_settings',
  
//   // Backups
//   MANAGE_BACKUPS: 'manage_backups',
  
//   // Logs
//   VIEW_LOGS: 'view_logs',
// };

// export const usePermissions = () => {
//   const { permissions } = useAuthStore();
  
//   const hasPermission = (permission) => {
//     if (!permissions || permissions.length === 0) return false;
//     if (permissions.includes('*')) return true;
//     return permissions.includes(permission);
//   };
  
//   return {
//     hasPermission,
//     canViewDashboard: hasPermission(PERMISSIONS.VIEW_DASHBOARD),
//     canManageProducts: hasPermission(PERMISSIONS.MANAGE_PRODUCTS),
//     canViewProducts: hasPermission(PERMISSIONS.VIEW_PRODUCTS),
//     canCreateProducts: hasPermission(PERMISSIONS.CREATE_PRODUCTS),
//     canUpdateProducts: hasPermission(PERMISSIONS.UPDATE_PRODUCTS),
//     canDeleteProducts: hasPermission(PERMISSIONS.DELETE_PRODUCTS),
//     canManageOrders: hasPermission(PERMISSIONS.MANAGE_ORDERS),
//     canViewOrders: hasPermission(PERMISSIONS.VIEW_ORDERS),
//     canManageUsers: hasPermission(PERMISSIONS.MANAGE_USERS),
//     canViewUsers: hasPermission(PERMISSIONS.VIEW_USERS),
//     canManageCategories: hasPermission(PERMISSIONS.MANAGE_CATEGORIES),
//     canManageCoupons: hasPermission(PERMISSIONS.MANAGE_COUPONS),
//     canViewReports: hasPermission(PERMISSIONS.VIEW_REPORTS),
//     canManageSettings: hasPermission(PERMISSIONS.MANAGE_SETTINGS),
//     canManageBackups: hasPermission(PERMISSIONS.MANAGE_BACKUPS),
//     canViewLogs: hasPermission(PERMISSIONS.VIEW_LOGS),
//   };
// };





'use client';

import { useAuthStore } from '@/store/authStore';

export const PERMISSIONS = {
  // Dashboard
  VIEW_DASHBOARD: 'dashboard.view',
  
  // Products
  MANAGE_PRODUCTS: 'products.view',  // Changed from 'manage_products'
  VIEW_PRODUCTS: 'products.view',
  CREATE_PRODUCTS: 'products.create',
  UPDATE_PRODUCTS: 'products.update',
  DELETE_PRODUCTS: 'products.delete',
  
  // Orders
  MANAGE_ORDERS: 'orders.view',
  VIEW_ORDERS: 'orders.view',
  UPDATE_ORDERS: 'orders.update',
  DELETE_ORDERS: 'orders.delete',
  
  // Users
  MANAGE_USERS: 'users.view',
  VIEW_USERS: 'users.view',
  CREATE_USERS: 'users.create',
  UPDATE_USERS: 'users.update',
  DELETE_USERS: 'users.delete',
  
  // Categories
  MANAGE_CATEGORIES: 'categories.view',
  CREATE_CATEGORIES: 'categories.create',
  UPDATE_CATEGORIES: 'categories.update',
  DELETE_CATEGORIES: 'categories.delete',
  
  // Coupons
  MANAGE_COUPONS: 'coupons.view',
  CREATE_COUPONS: 'coupons.create',
  UPDATE_COUPONS: 'coupons.update',
  DELETE_COUPONS: 'coupons.delete',
  
  // Reports
  VIEW_REPORTS: 'reports.view',
  EXPORT_REPORTS: 'reports.export',
  
  // Settings
  MANAGE_SETTINGS: 'settings.view',
  UPDATE_SETTINGS: 'settings.update',
  
  // Backups
  MANAGE_BACKUPS: 'backups.view',
  CREATE_BACKUPS: 'backups.create',
  RESTORE_BACKUPS: 'backups.restore',
  
  // Logs
  VIEW_LOGS: 'logs.view',
  DELETE_LOGS: 'logs.delete',
  
  // Roles
  MANAGE_ROLES: 'roles.view',
  CREATE_ROLES: 'roles.create',
  UPDATE_ROLES: 'roles.update',
  DELETE_ROLES: 'roles.delete',
};

export const usePermissions = () => {
  const { permissions, user } = useAuthStore();
  
  const hasPermission = (permission) => {
    // 🚨 EMERGENCY BYPASS - Your email gets all permissions
    if (user?.email === 'sheikhrizwanghulamnabi555@gmail.com') {
      return true;
    }
    
    // Check if permissions array exists
    if (!permissions || permissions.length === 0) return false;
    
    // Check for wildcard (Super Admin)
    if (permissions.includes('*')) return true;
    
    // Check for specific permission
    return permissions.includes(permission);
  };
  
  return {
    hasPermission,
    
    // Dashboard
    canViewDashboard: hasPermission(PERMISSIONS.VIEW_DASHBOARD),
    
    // Products
    canManageProducts: hasPermission(PERMISSIONS.MANAGE_PRODUCTS),
    canViewProducts: hasPermission(PERMISSIONS.VIEW_PRODUCTS),
    canCreateProducts: hasPermission(PERMISSIONS.CREATE_PRODUCTS),
    canUpdateProducts: hasPermission(PERMISSIONS.UPDATE_PRODUCTS),
    canDeleteProducts: hasPermission(PERMISSIONS.DELETE_PRODUCTS),
    
    // Orders
    canManageOrders: hasPermission(PERMISSIONS.MANAGE_ORDERS),
    canViewOrders: hasPermission(PERMISSIONS.VIEW_ORDERS),
    canUpdateOrders: hasPermission(PERMISSIONS.UPDATE_ORDERS),
    canDeleteOrders: hasPermission(PERMISSIONS.DELETE_ORDERS),
    
    // Users
    canManageUsers: hasPermission(PERMISSIONS.MANAGE_USERS),
    canViewUsers: hasPermission(PERMISSIONS.VIEW_USERS),
    canCreateUsers: hasPermission(PERMISSIONS.CREATE_USERS),
    canUpdateUsers: hasPermission(PERMISSIONS.UPDATE_USERS),
    canDeleteUsers: hasPermission(PERMISSIONS.DELETE_USERS),
    
    // Categories
    canManageCategories: hasPermission(PERMISSIONS.MANAGE_CATEGORIES),
    canCreateCategories: hasPermission(PERMISSIONS.CREATE_CATEGORIES),
    canUpdateCategories: hasPermission(PERMISSIONS.UPDATE_CATEGORIES),
    canDeleteCategories: hasPermission(PERMISSIONS.DELETE_CATEGORIES),
    
    // Coupons
    canManageCoupons: hasPermission(PERMISSIONS.MANAGE_COUPONS),
    canCreateCoupons: hasPermission(PERMISSIONS.CREATE_COUPONS),
    canUpdateCoupons: hasPermission(PERMISSIONS.UPDATE_COUPONS),
    canDeleteCoupons: hasPermission(PERMISSIONS.DELETE_COUPONS),
    
    // Reports
    canViewReports: hasPermission(PERMISSIONS.VIEW_REPORTS),
    canExportReports: hasPermission(PERMISSIONS.EXPORT_REPORTS),
    
    // Settings
    canManageSettings: hasPermission(PERMISSIONS.MANAGE_SETTINGS),
    canUpdateSettings: hasPermission(PERMISSIONS.UPDATE_SETTINGS),
    
    // Backups
    canManageBackups: hasPermission(PERMISSIONS.MANAGE_BACKUPS),
    canCreateBackups: hasPermission(PERMISSIONS.CREATE_BACKUPS),
    canRestoreBackups: hasPermission(PERMISSIONS.RESTORE_BACKUPS),
    
    // Logs
    canViewLogs: hasPermission(PERMISSIONS.VIEW_LOGS),
    canDeleteLogs: hasPermission(PERMISSIONS.DELETE_LOGS),
    
    // Roles
    canManageRoles: hasPermission(PERMISSIONS.MANAGE_ROLES),
    canCreateRoles: hasPermission(PERMISSIONS.CREATE_ROLES),
    canUpdateRoles: hasPermission(PERMISSIONS.UPDATE_ROLES),
    canDeleteRoles: hasPermission(PERMISSIONS.DELETE_ROLES),
  };
};