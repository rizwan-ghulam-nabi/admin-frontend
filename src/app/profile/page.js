// 'use client';

// import { useState, useEffect } from 'react';
// import { useAuthStore } from '@/store/authStore';
// import Layout from '@/components/Layout';
// import toast from 'react-hot-toast';
// import { UserCircleIcon } from '@heroicons/react/24/outline';

// export default function ProfilePage() {
//   const { user, updateProfile } = useAuthStore();
//   const [name, setName] = useState('');
//   const [avatar, setAvatar] = useState('');
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (user) {
//       setName(user.name || '');
//       setAvatar(user.avatar || '');
//     }
//   }, [user]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await updateProfile({ name, avatar });
//       toast.success('Profile updated successfully');
//     } catch (error) {
//       toast.error(error.message || 'Update failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Layout>
//       <div className="max-w-3xl">
//         <h1 className="text-2xl font-semibold text-gray-900">Profile Settings</h1>
        
//         <div className="mt-6">
//           <div className="bg-white shadow rounded-lg">
//             <div className="px-4 py-5 sm:p-6">
//               <div className="flex items-center mb-6">
//                 {user?.avatar ? (
//                   <img src={user.avatar} alt={user.name} className="h-16 w-16 rounded-full" />
//                 ) : (
//                   <UserCircleIcon className="h-16 w-16 text-gray-400" />
//                 )}
//                 <div className="ml-4">
//                   <h3 className="text-lg font-medium text-gray-900">{user?.name || 'Admin'}</h3>
//                   <p className="text-sm text-gray-500">{user?.email}</p>
//                 </div>
//               </div>

//               <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Full Name</label>
//                   <input
//                     type="text"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
//                     placeholder="Enter your name"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Avatar URL</label>
//                   <input
//                     type="text"
//                     value={avatar}
//                     onChange={(e) => setAvatar(e.target.value)}
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
//                     placeholder="https://example.com/avatar.jpg"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Email Address</label>
//                   <input
//                     type="email"
//                     value={user?.email || ''}
//                     disabled
//                     className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm sm:text-sm"
//                   />
//                   <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Role</label>
//                   <input
//                     type="text"
//                     value={user?.role?.name || 'Admin'}
//                     disabled
//                     className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm sm:text-sm"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Account Status</label>
//                   <span className={`mt-1 inline-flex px-2 py-1 text-xs font-medium rounded-full ${
//                     user?.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                   }`}>
//                     {user?.status || 'active'}
//                   </span>
//                 </div>

//                 <div className="pt-4">
//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
//                   >
//                     {loading ? 'Saving...' : 'Save Changes'}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// }















'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useAuthStore } from '@/store/authStore';
import { UserCircleIcon, EnvelopeIcon, ShieldCheckIcon, CalendarIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, updateProfile } = useAuthStore();
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setAvatar(user.avatar || '');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile({ name, avatar });
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Profile Settings</h1>
        
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center mb-6">
            {user?.avatar ? <img src={user.avatar} alt={user.name} className="h-20 w-20 rounded-full" /> : <UserCircleIcon className="h-20 w-20 text-gray-400" />}
            <div className="ml-4"><h3 className="text-lg font-medium">{user?.name || 'Admin'}</h3><p className="text-gray-500">{user?.email}</p></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div><label className="block text-sm font-medium text-gray-700">Full Name</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700">Avatar URL</label><input type="text" value={avatar} onChange={(e) => setAvatar(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" placeholder="https://example.com/avatar.jpg" /></div>
            <div><label className="block text-sm font-medium text-gray-700">Email</label><input type="email" value={user?.email || ''} disabled className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm" /></div>
            <div><label className="block text-sm font-medium text-gray-700">Role</label><input type="text" value={user?.role?.name || 'Admin'} disabled className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm" /></div>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">{loading ? 'Saving...' : 'Save Changes'}</button>
          </form>
        </div>

        <div className="mt-6 bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
          <div className="space-y-3">
            <div className="flex items-center"><EnvelopeIcon className="h-5 w-5 text-gray-400 mr-3" /><span className="text-gray-600">{user?.email}</span></div>
            <div className="flex items-center"><ShieldCheckIcon className="h-5 w-5 text-gray-400 mr-3" /><span className="text-gray-600">Role: {user?.role?.name || 'Admin'}</span></div>
            <div className="flex items-center"><CalendarIcon className="h-5 w-5 text-gray-400 mr-3" /><span className="text-gray-600">Member since: {new Date(user?.createdAt).toLocaleDateString()}</span></div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
