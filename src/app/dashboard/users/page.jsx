// // app/dashboard/users/page.jsx
// 'use client';

// import { useState, useEffect, useCallback } from 'react';
// import { userService } from '@/services/userService';

// export default function UsersPage() {
//   // State
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 20,
//     total: 0,
//     pages: 0
//   });
  
//   // Filters
//   const [filters, setFilters] = useState({
//     search: '',
//     role: '',
//     status: '',
//     sort: '-createdAt'
//   });

//   // Stats
//   const [stats, setStats] = useState(null);

//   // Dialog states
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [showEditForm, setShowEditForm] = useState(false);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [showDetail, setShowDetail] = useState(false);
//   const [detailUser, setDetailUser] = useState(null);

//   // Form data
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     password: '',
//     name: '',
//     phone: '',
//     role: 'user'
//   });

//   // Toast
//   const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

//   const showToast = (message, type = 'success') => {
//     setToast({ show: true, message, type });
//     setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
//   };

//   // Fetch users
//   const fetchUsers = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const params = {
//         page: pagination.page,
//         limit: pagination.limit,
//         ...filters
//       };

//       // Remove empty values
//       Object.keys(params).forEach(key => {
//         if (!params[key]) delete params[key];
//       });

//       const response = await userService.getAllUsers(params);
//       console.log('Users response:', response);
      
//       if (response.success) {
//         setUsers(response.data || []);
//         // setPagination(prev => ({
//           ...prev,
//           total: response.pagination?.total || 0,
//           pages: response.pagination?.pages || 0
//         }));
//       } else {
//         throw new Error(response.message || 'Failed to fetch users');
//       }
//     } catch (err) {
//       console.error('Fetch users error:', err);
//       setError(err.message || 'Failed to fetch users');
//       showToast(err.message || 'Failed to fetch users', 'error');
//     } finally {
//       setLoading(false);
//     }
//   }, [pagination.page, pagination.limit, filters]);

//   // Fetch stats
//   const fetchStats = useCallback(async () => {
//     try {
//       const response = await userService.getUserStats();
//       if (response.success) {
//         setStats(response.data);
//       }
//     } catch (err) {
//       console.error('Failed to fetch stats:', err);
//     }
//   }, []);

//   useEffect(() => {
//     fetchUsers();
//     fetchStats();
//   }, [fetchUsers, fetchStats]);

//   // Handlers
//   const handleAddUser = async (e) => {
//     e.preventDefault();
//     try {
//       await userService.createUser(formData);
//       showToast('User created successfully');
//       setShowAddForm(false);
//       setFormData({ username: '', email: '', password: '', name: '', phone: '', role: 'user' });
//       fetchUsers();
//       fetchStats();
//     } catch (err) {
//       showToast(err.message || 'Failed to create user', 'error');
//     }
//   };

//   const handleEditUser = async (e) => {
//     e.preventDefault();
//     try {
//       await userService.updateUser(selectedUser._id, formData);
//       showToast('User updated successfully');
//       setShowEditForm(false);
//       setSelectedUser(null);
//       fetchUsers();
//     } catch (err) {
//       showToast(err.message || 'Failed to update user', 'error');
//     }
//   };

//   const handleDeleteUser = async () => {
//     try {
//       await userService.deleteUser(selectedUser._id);
//       showToast('User deleted successfully');
//       setShowDeleteConfirm(false);
//       setSelectedUser(null);
//       fetchUsers();
//       fetchStats();
//     } catch (err) {
//       showToast(err.message || 'Failed to delete user', 'error');
//     }
//   };

//   const handleStatusChange = async (userId, newStatus) => {
//     try {
//       await userService.updateUserStatus(userId, newStatus);
//       showToast(`User status changed to ${newStatus}`);
//       fetchUsers();
//       fetchStats();
//     } catch (err) {
//       showToast(err.message || 'Failed to update status', 'error');
//     }
//   };

//   const handleExport = async () => {
//     try {
//       await userService.exportUsers('csv', filters);
//       showToast('Users exported successfully');
//     } catch (err) {
//       showToast('Failed to export users', 'error');
//     }
//   };

//   const openEditForm = (user) => {
//     setSelectedUser(user);
//     setFormData({
//       username: user.username || '',
//       email: user.email || '',
//       password: '',
//       name: user.name || '',
//       phone: user.phone || '',
//       role: user.role || 'user'
//     });
//     setShowEditForm(true);
//   };

//   const openDeleteConfirm = (user) => {
//     setSelectedUser(user);
//     setShowDeleteConfirm(true);
//   };

//   const openDetail = async (userId) => {
//     try {
//       const response = await userService.getUserById(userId);
//       if (response.success) {
//         setDetailUser(response.data);
//         setShowDetail(true);
//       }
//     } catch (err) {
//       showToast('Failed to fetch user details', 'error');
//     }
//   };

//   // Status badge
//   const getStatusBadge = (user) => {
//     if (!user.isActive) {
//       return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">Inactive</span>;
//     }
//     if (user.isLocked) {
//       return <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">Locked</span>;
//     }
//     if (!user.isVerified) {
//       return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">Unverified</span>;
//     }
//     if (user.activeTokens > 0) {
//       return <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">🟢 Online</span>;
//     }
//     return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Active</span>;
//   };

//   return (
//     <div className="p-6">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-2xl font-bold">Users Management</h1>
//           <p className="text-gray-500 text-sm mt-1">
//             Total: {pagination.total} users | Online: {stats?.overview?.activeSessionsCount || 0}
//           </p>
//         </div>
//         <div className="flex gap-2">
//           <button onClick={handleExport} className="px-4 py-2 border rounded hover:bg-gray-50">
//             📥 Export
//           </button>
//           <button onClick={() => setShowAddForm(true)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
//             ➕ Add User
//           </button>
//         </div>
//       </div>

//       {/* Stats */}
//       {stats?.overview && (
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//           <div className="bg-white rounded-lg shadow p-4">
//             <p className="text-sm text-gray-500">Total Users</p>
//             <p className="text-2xl font-bold">{stats.overview.totalUsers}</p>
//           </div>
//           <div className="bg-white rounded-lg shadow p-4">
//             <p className="text-sm text-gray-500">Active Users</p>
//             <p className="text-2xl font-bold">{stats.overview.activeUsers}</p>
//           </div>
//           <div className="bg-white rounded-lg shadow p-4">
//             <p className="text-sm text-gray-500">Verified</p>
//             <p className="text-2xl font-bold">{stats.overview.verifiedUsers}</p>
//           </div>
//           <div className="bg-white rounded-lg shadow p-4">
//             <p className="text-sm text-gray-500">Online Now</p>
//             <p className="text-2xl font-bold">{stats.overview.activeSessionsCount}</p>
//           </div>
//         </div>
//       )}

//       {/* Filters */}
//       <div className="bg-white rounded-lg shadow p-4 mb-4">
//         <div className="flex gap-4 flex-wrap">
//           <input
//             type="text"
//             placeholder="🔍 Search users..."
//             value={filters.search}
//             onChange={(e) => { setFilters(prev => ({ ...prev, search: e.target.value })); setPagination(prev => ({ ...prev, page: 1 })); }}
//             className="px-3 py-2 border rounded w-64"
//           />
//           <select
//             value={filters.role}
//             onChange={(e) => { setFilters(prev => ({ ...prev, role: e.target.value })); setPagination(prev => ({ ...prev, page: 1 })); }}
//             className="px-3 py-2 border rounded"
//           >
//             <option value="">All Roles</option>
//             <option value="user">User</option>
//             <option value="moderator">Moderator</option>
//             <option value="admin">Admin</option>
//           </select>
//           <select
//             value={filters.status}
//             onChange={(e) => { setFilters(prev => ({ ...prev, status: e.target.value })); setPagination(prev => ({ ...prev, page: 1 })); }}
//             className="px-3 py-2 border rounded"
//           >
//             <option value="">All Status</option>
//             <option value="active">Active</option>
//             <option value="inactive">Inactive</option>
//             <option value="verified">Verified</option>
//             <option value="unverified">Unverified</option>
//             <option value="locked">Locked</option>
//           </select>
//           <select
//             value={filters.sort}
//             onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value }))}
//             className="px-3 py-2 border rounded"
//           >
//             <option value="-createdAt">Newest First</option>
//             <option value="createdAt">Oldest First</option>
//             <option value="-lastLogin">Last Login</option>
//             <option value="username">Name A-Z</option>
//           </select>
//         </div>
//       </div>

//       {/* Error */}
//       {error && (
//         <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
//           <p className="text-red-600">{error}</p>
//           <button onClick={fetchUsers} className="text-red-700 underline text-sm mt-1">Try Again</button>
//         </div>
//       )}

//       {/* Users Table */}
//       <div className="bg-white rounded-lg shadow overflow-x-auto">
//         {loading ? (
//           <div className="p-12 text-center">
//             <div className="animate-spin text-3xl mb-3">⏳</div>
//             <p className="text-gray-500">Loading users...</p>
//           </div>
//         ) : users.length === 0 ? (
//           <div className="p-12 text-center">
//             <p className="text-gray-500 text-lg">No users found</p>
//           </div>
//         ) : (
//           <table className="w-full">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="p-3 text-left text-sm font-medium text-gray-600">User</th>
//                 <th className="p-3 text-left text-sm font-medium text-gray-600">Email</th>
//                 <th className="p-3 text-left text-sm font-medium text-gray-600">Role</th>
//                 <th className="p-3 text-left text-sm font-medium text-gray-600">Status</th>
//                 <th className="p-3 text-left text-sm font-medium text-gray-600">Last Login</th>
//                 <th className="p-3 text-left text-sm font-medium text-gray-600">Sessions</th>
//                 <th className="p-3 text-left text-sm font-medium text-gray-600">Registered</th>
//                 <th className="p-3 text-left text-sm font-medium text-gray-600">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y">
//               {users.map((user) => (
//                 <tr key={user._id} className="hover:bg-gray-50">
//                   <td className="p-3">
//                     <div className="flex items-center gap-2">
//                       <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
//                         <span className="text-blue-600 font-medium text-sm">
//                           {user.username?.charAt(0).toUpperCase()}
//                         </span>
//                       </div>
//                       <div>
//                         <p className="font-medium text-sm">{user.username}</p>
//                         <p className="text-xs text-gray-500">{user.name}</p>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="p-3 text-sm">{user.email}</td>
//                   <td className="p-3">
//                     <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">{user.role}</span>
//                   </td>
//                   <td className="p-3">{getStatusBadge(user)}</td>
//                   <td className="p-3 text-sm">
//                     {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
//                   </td>
//                   <td className="p-3">
//                     <span className={`px-2 py-1 rounded text-xs ${user.activeTokens > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
//                       {user.activeTokens || 0}
//                     </span>
//                   </td>
//                   <td className="p-3 text-sm text-gray-500">
//                     {new Date(user.createdAt).toLocaleDateString()}
//                   </td>
//                   <td className="p-3">
//                     <div className="flex gap-1">
//                       <button onClick={() => openDetail(user._id)} className="p-1 hover:bg-gray-100 rounded text-sm" title="View">👁️</button>
//                       <button onClick={() => openEditForm(user)} className="p-1 hover:bg-gray-100 rounded text-sm" title="Edit">✏️</button>
//                       <button onClick={() => openDeleteConfirm(user)} className="p-1 hover:bg-red-100 rounded text-sm text-red-500" title="Delete">🗑️</button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}

//         {/* Pagination */}
//         {pagination.pages > 1 && (
//           <div className="flex justify-between items-center p-4 border-t">
//             <p className="text-sm text-gray-500">
//               Page {pagination.page} of {pagination.pages}
//             </p>
//             <div className="flex gap-2">
//               <button
//                 onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
//                 disabled={pagination.page === 1}
//                 className="px-3 py-1 border rounded disabled:opacity-50"
//               >
//                 Previous
//               </button>
//               <button
//                 onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
//                 disabled={pagination.page === pagination.pages}
//                 className="px-3 py-1 border rounded disabled:opacity-50"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Add User Modal */}
//       {showAddForm && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-96">
//             <h2 className="text-xl font-bold mb-4">Add User</h2>
//             <form onSubmit={handleAddUser}>
//               <input type="text" placeholder="Username" required value={formData.username} onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))} className="w-full px-3 py-2 border rounded mb-3" />
//               <input type="email" placeholder="Email" required value={formData.email} onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))} className="w-full px-3 py-2 border rounded mb-3" />
//               <input type="password" placeholder="Password" required value={formData.password} onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))} className="w-full px-3 py-2 border rounded mb-3" />
//               <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} className="w-full px-3 py-2 border rounded mb-3" />
//               <input type="text" placeholder="Phone" value={formData.phone} onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))} className="w-full px-3 py-2 border rounded mb-3" />
//               <select value={formData.role} onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))} className="w-full px-3 py-2 border rounded mb-4">
//                 <option value="user">User</option>
//                 <option value="moderator">Moderator</option>
//                 <option value="admin">Admin</option>
//               </select>
//               <div className="flex gap-2">
//                 <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Create</button>
//                 <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 px-4 py-2 border rounded hover:bg-gray-50">Cancel</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Edit User Modal */}
//       {showEditForm && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-96">
//             <h2 className="text-xl font-bold mb-4">Edit User</h2>
//             <form onSubmit={handleEditUser}>
//               <input type="text" placeholder="Username" required value={formData.username} onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))} className="w-full px-3 py-2 border rounded mb-3" />
//               <input type="email" placeholder="Email" required value={formData.email} onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))} className="w-full px-3 py-2 border rounded mb-3" />
//               <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} className="w-full px-3 py-2 border rounded mb-3" />
//               <input type="text" placeholder="Phone" value={formData.phone} onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))} className="w-full px-3 py-2 border rounded mb-3" />
//               <select value={formData.role} onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))} className="w-full px-3 py-2 border rounded mb-4">
//                 <option value="user">User</option>
//                 <option value="moderator">Moderator</option>
//                 <option value="admin">Admin</option>
//               </select>
//               <div className="flex gap-2">
//                 <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Update</button>
//                 <button type="button" onClick={() => setShowEditForm(false)} className="flex-1 px-4 py-2 border rounded hover:bg-gray-50">Cancel</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Delete Confirm */}
//       {showDeleteConfirm && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-96">
//             <h2 className="text-xl font-bold mb-4">Delete User</h2>
//             <p className="mb-4">Are you sure you want to delete <strong>{selectedUser?.username}</strong>?</p>
//             <div className="flex gap-2">
//               <button onClick={handleDeleteUser} className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
//               <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 px-4 py-2 border rounded hover:bg-gray-50">Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Toast */}
//       {toast.show && (
//         <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
//           {toast.message}
//         </div>
//       )}
//     </div>
//   );
// }




// app/dashboard/users/page.jsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { userService } from '@/services/userService';

export default function UsersPage() {
  // State
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });
  
  // Filters
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    status: '',
    sort: '-createdAt'
  });

  // Stats
  const [stats, setStats] = useState(null);

  // Dialog states
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    name: '',
    phone: '',
    role: 'user'
  });

  // Toast
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  // Fetch users
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      };

      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key];
      });

      const response = await userService.getAllUsers(params);
      
      if (response.success) {
        setUsers(response.data || []);
        setPagination(prev => ({
          ...prev,
          total: response.pagination?.total || 0,
          pages: response.pagination?.pages || 0
        }));
      } else {
        throw new Error(response.message || 'Failed to fetch users');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch users');
      showToast(err.message || 'Failed to fetch users', 'error');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const response = await userService.getUserStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, [fetchUsers, fetchStats]);

  // Handlers
  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      await userService.updateUser(selectedUser._id, formData);
      showToast('User updated successfully');
      setShowEditForm(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (err) {
      showToast(err.message || 'Failed to update user', 'error');
    }
  };

  const handleDeleteUser = async () => {
    try {
      await userService.deleteUser(selectedUser._id);
      showToast('User deleted successfully');
      setShowDeleteConfirm(false);
      setSelectedUser(null);
      fetchUsers();
      fetchStats();
    } catch (err) {
      showToast(err.message || 'Failed to delete user', 'error');
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await userService.updateUserStatus(userId, newStatus);
      showToast(`User status changed to ${newStatus}`);
      fetchUsers();
      fetchStats();
    } catch (err) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  const handleExport = async () => {
    try {
      await userService.exportUsers('csv', filters);
      showToast('Users exported successfully');
    } catch (err) {
      showToast('Failed to export users', 'error');
    }
  };

  const openEditForm = (user) => {
    setSelectedUser(user);
    setFormData({
      username: user.username || '',
      email: user.email || '',
      password: '',
      name: user.name || '',
      phone: user.phone || '',
      role: user.role || 'user'
    });
    setShowEditForm(true);
  };

  const openDeleteConfirm = (user) => {
    setSelectedUser(user);
    setShowDeleteConfirm(true);
  };

  const getStatusBadge = (user) => {
    if (!user.isActive) {
      return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">Inactive</span>;
    }
    if (user.isLocked) {
      return <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">Locked</span>;
    }
    if (!user.isVerified) {
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">Unverified</span>;
    }
    if (user.activeTokens > 0) {
      return <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">🟢 Online</span>;
    }
    return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Active</span>;
  };

  return (
    <div className="p-6">
      {/* ✅ Back to Dashboard + Header */}
      <div className="flex items-center gap-3 mb-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-sm">Back to Dashboard</span>
        </Link>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Users Management</h1>
          <p className="text-gray-500 text-sm mt-1">
            Total: {pagination.total} users | Online: {stats?.overview?.activeSessionsCount || 0}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExport} className="px-4 py-2 border rounded hover:bg-gray-50">
            📥 Export
          </button>
        </div>
      </div>

      {/* Stats */}
      {stats?.overview && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-500">Total Users</p>
            <p className="text-2xl font-bold">{stats.overview.totalUsers}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-500">Active Users</p>
            <p className="text-2xl font-bold">{stats.overview.activeUsers}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-500">Verified</p>
            <p className="text-2xl font-bold">{stats.overview.verifiedUsers}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-500">Online Now</p>
            <p className="text-2xl font-bold">{stats.overview.activeSessionsCount}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <div className="flex gap-4 flex-wrap">
          <input
            type="text"
            placeholder="🔍 Search users..."
            value={filters.search}
            onChange={(e) => { setFilters(prev => ({ ...prev, search: e.target.value })); setPagination(prev => ({ ...prev, page: 1 })); }}
            className="px-3 py-2 border rounded w-64"
          />
          <select
            value={filters.role}
            onChange={(e) => { setFilters(prev => ({ ...prev, role: e.target.value })); setPagination(prev => ({ ...prev, page: 1 })); }}
            className="px-3 py-2 border rounded"
          >
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="moderator">Moderator</option>
            <option value="admin">Admin</option>
          </select>
          <select
            value={filters.status}
            onChange={(e) => { setFilters(prev => ({ ...prev, status: e.target.value })); setPagination(prev => ({ ...prev, page: 1 })); }}
            className="px-3 py-2 border rounded"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
            <option value="locked">Locked</option>
          </select>
          <select
            value={filters.sort}
            onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value }))}
            className="px-3 py-2 border rounded"
          >
            <option value="-createdAt">Newest First</option>
            <option value="createdAt">Oldest First</option>
            <option value="-lastLogin">Last Login</option>
            <option value="username">Name A-Z</option>
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-600">{error}</p>
          <button onClick={fetchUsers} className="text-red-700 underline text-sm mt-1">Try Again</button>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin text-3xl mb-3">⏳</div>
            <p className="text-gray-500">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500 text-lg">No users found</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left text-sm font-medium text-gray-600">User</th>
                <th className="p-3 text-left text-sm font-medium text-gray-600">Email</th>
                <th className="p-3 text-left text-sm font-medium text-gray-600">Role</th>
                <th className="p-3 text-left text-sm font-medium text-gray-600">Status</th>
                <th className="p-3 text-left text-sm font-medium text-gray-600">Last Login</th>
                <th className="p-3 text-left text-sm font-medium text-gray-600">Sessions</th>
                <th className="p-3 text-left text-sm font-medium text-gray-600">Registered</th>
                <th className="p-3 text-left text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium text-sm">
                          {user.username?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{user.username}</p>
                        <p className="text-xs text-gray-500">{user.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-sm">{user.email}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">{user.role}</span>
                  </td>
                  <td className="p-3">{getStatusBadge(user)}</td>
                  <td className="p-3 text-sm">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs ${user.activeTokens > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {user.activeTokens || 0}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      <button onClick={() => openEditForm(user)} className="p-1 hover:bg-gray-100 rounded text-sm" title="Edit">✏️</button>
                      <button onClick={() => openDeleteConfirm(user)} className="p-1 hover:bg-red-100 rounded text-sm text-red-500" title="Delete">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-between items-center p-4 border-t">
            <p className="text-sm text-gray-500">
              Page {pagination.page} of {pagination.pages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.pages}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>
            <form onSubmit={handleEditUser}>
              <input type="text" placeholder="Username" required value={formData.username} onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))} className="w-full px-3 py-2 border rounded mb-3" />
              <input type="email" placeholder="Email" required value={formData.email} onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))} className="w-full px-3 py-2 border rounded mb-3" />
              <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} className="w-full px-3 py-2 border rounded mb-3" />
              <input type="text" placeholder="Phone" value={formData.phone} onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))} className="w-full px-3 py-2 border rounded mb-3" />
              <select value={formData.role} onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))} className="w-full px-3 py-2 border rounded mb-4">
                <option value="user">User</option>
                <option value="moderator">Moderator</option>
                <option value="admin">Admin</option>
              </select>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Update</button>
                <button type="button" onClick={() => setShowEditForm(false)} className="flex-1 px-4 py-2 border rounded hover:bg-gray-50">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Delete User</h2>
            <p className="mb-4">Are you sure you want to delete <strong>{selectedUser?.username}</strong>?</p>
            <div className="flex gap-2">
              <button onClick={handleDeleteUser} className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 px-4 py-2 border rounded hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast.show && (
        <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}