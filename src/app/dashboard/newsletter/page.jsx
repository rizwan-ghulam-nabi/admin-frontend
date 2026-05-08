// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import Layout from '@/components/Layout';
// import toast from 'react-hot-toast';

// const API_BASE = 'http://localhost:5000/api/v1/newsletter';

// export default function NewsletterPage() {
//   const [subscribers, setSubscribers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState({
//     totalActive: 0,
//     totalUnsubscribed: 0,
//     newThisMonth: 0
//   });
//   const [showSendModal, setShowSendModal] = useState(false);
//   const [emailData, setEmailData] = useState({
//     subject: '',
//     message: '',
//     type: 'newsletter'
//   });
//   const [sending, setSending] = useState(false);

//   useEffect(() => {
//     fetchSubscribers();
//     fetchStats();
//   }, []);

//   const getToken = () => {
//     // Get token from cookies
//     const cookies = document.cookie.split(';');
//     for (let cookie of cookies) {
//       const [name, value] = cookie.trim().split('=');
//       if (name === 'accessToken') {
//         return decodeURIComponent(value);
//       }
//     }
//     return localStorage.getItem('accessToken');
//   };

//   const fetchSubscribers = async () => {
//     try {
//       const token = getToken();
//       const res = await fetch(`${API_BASE}/subscribers`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         credentials: 'include'
//       });
      
//       if (res.ok) {
//         const data = await res.json();
//         setSubscribers(data.data || []);
//       } else {
//         console.error('Failed to fetch subscribers:', res.status);
//       }
//     } catch (error) {
//       console.error('Error fetching subscribers:', error);
//       toast.error('Failed to load subscribers');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchStats = async () => {
//     try {
//       const token = getToken();
//       const res = await fetch(`${API_BASE}/stats`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         credentials: 'include'
//       });
      
//       if (res.ok) {
//         const data = await res.json();
//         if (data.success) {
//           setStats(data.data);
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching stats:', error);
//     }
//   };

//   const handleSendNewsletter = async (e) => {
//     e.preventDefault();
    
//     if (!emailData.subject || !emailData.message) {
//       toast.error('Please fill in subject and message');
//       return;
//     }
    
//     setSending(true);
    
//     try {
//       const token = getToken();
//       const res = await fetch(`${API_BASE}/send`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         credentials: 'include',
//         body: JSON.stringify(emailData)
//       });
      
//       const data = await res.json();
      
//       if (res.ok) {
//         toast.success(data.message || 'Newsletter sent successfully!');
//         setShowSendModal(false);
//         setEmailData({ subject: '', message: '', type: 'newsletter' });
//       } else {
//         toast.error(data.message || 'Failed to send newsletter');
//       }
//     } catch (error) {
//       console.error('Error sending newsletter:', error);
//       toast.error('Failed to send newsletter');
//     } finally {
//       setSending(false);
//     }
//   };

//   const exportSubscribers = () => {
//     const csvContent = [
//       ['Email', 'Subscribed Date', 'Source', 'Status'],
//       ...subscribers.map(s => [
//         s.email, 
//         new Date(s.subscribedAt).toLocaleDateString(), 
//         s.source || 'website_footer',
//         'Active'
//       ])
//     ].map(row => row.join(',')).join('\n');
    
//     const blob = new Blob([csvContent], { type: 'text/csv' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `subscribers_${new Date().toISOString().split('T')[0]}.csv`;
//     a.click();
//     URL.revokeObjectURL(url);
//     toast.success('Export started!');
//   };

//   const copyEmails = () => {
//     const emails = subscribers.map(s => s.email).join(', ');
//     navigator.clipboard.writeText(emails);
//     toast.success(`${subscribers.length} email addresses copied!`);
//   };

//   if (loading) {
//     return (
//       <Layout>
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500" />
//         </div>
//       </Layout>
//     );
//   }

//   return (
//     <Layout>
//       <div className="p-6">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
//           <div>
//             <h1 className="text-2xl font-bold text-white">📧 Newsletter Management</h1>
//             <p className="text-gray-400 text-sm mt-1">Manage subscribers and send newsletters</p>
//           </div>
//           <div className="flex gap-3 flex-wrap">
//             <button
//               onClick={exportSubscribers}
//               className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition text-sm"
//             >
//               📥 Export CSV
//             </button>
//             <button
//               onClick={copyEmails}
//               className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition text-sm"
//             >
//               📋 Copy Emails
//             </button>
//             <button
//               onClick={() => setShowSendModal(true)}
//               className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition text-sm"
//             >
//               ✉️ Send Newsletter
//             </button>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
//           <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl p-4 border border-green-500/30">
//             <p className="text-gray-400 text-sm">Total Subscribers</p>
//             <p className="text-3xl font-bold text-green-400">{stats.totalActive}</p>
//           </div>
//           <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl p-4 border border-blue-500/30">
//             <p className="text-gray-400 text-sm">New This Month</p>
//             <p className="text-3xl font-bold text-blue-400">+{stats.newThisMonth}</p>
//           </div>
//           <div className="bg-gradient-to-br from-gray-500/20 to-gray-600/20 rounded-xl p-4 border border-gray-500/30">
//             <p className="text-gray-400 text-sm">Unsubscribed</p>
//             <p className="text-3xl font-bold text-gray-400">{stats.totalUnsubscribed}</p>
//           </div>
//         </div>

//         {/* Subscribers Table */}
//         <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
//           <div className="px-6 py-4 border-b border-gray-700">
//             <h2 className="text-lg font-semibold text-white">Subscribers List</h2>
//             <p className="text-gray-400 text-sm">Total: {subscribers.length} active subscribers</p>
//           </div>
          
//           <div className="overflow-x-auto">
//             {subscribers.length === 0 ? (
//               <div className="p-12 text-center">
//                 <p className="text-gray-400 text-lg mb-2">No Subscribers Yet</p>
//                 <p className="text-gray-500 text-sm">When customers subscribe to the newsletter, they will appear here.</p>
//               </div>
//             ) : (
//               <table className="w-full">
//                 <thead>
//                   <tr className="border-b border-gray-700 bg-gray-900/50">
//                     <th className="text-left p-4 text-gray-300 text-sm font-medium">Email</th>
//                     <th className="text-left p-4 text-gray-300 text-sm font-medium">Subscribed Date</th>
//                     <th className="text-left p-4 text-gray-300 text-sm font-medium">Source</th>
//                     <th className="text-left p-4 text-gray-300 text-sm font-medium">Status</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {subscribers.map((subscriber, index) => (
//                     <tr key={subscriber._id || index} className="border-b border-gray-700 hover:bg-gray-700/50 transition">
//                       <td className="p-4">
//                         <p className="text-white text-sm">{subscriber.email}</p>
//                       </td>
//                       <td className="p-4">
//                         <p className="text-gray-400 text-sm">{new Date(subscriber.subscribedAt).toLocaleDateString()}</p>
//                       </td>
//                       <td className="p-4">
//                         <span className="px-2 py-1 bg-gray-700 rounded-full text-xs text-gray-300">
//                           {subscriber.source || 'Website'}
//                         </span>
//                       </td>
//                       <td className="p-4">
//                         <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
//                           Active
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Send Newsletter Modal */}
//       {showSendModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//           <div className="absolute inset-0 bg-black/80" onClick={() => setShowSendModal(false)} />
//           <div className="relative bg-gray-800 rounded-2xl w-full max-w-2xl p-6">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-white">Send Newsletter</h2>
//               <button onClick={() => setShowSendModal(false)} className="text-gray-400 hover:text-white">
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>
            
//             <form onSubmit={handleSendNewsletter}>
//               <div className="mb-4">
//                 <label className="block text-gray-300 text-sm mb-2">Newsletter Type</label>
//                 <select
//                   value={emailData.type}
//                   onChange={(e) => setEmailData({...emailData, type: e.target.value})}
//                   className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
//                 >
//                   <option value="newsletter">📧 Regular Newsletter</option>
//                   <option value="offer">🎉 Special Offer / Deal</option>
//                 </select>
//               </div>
              
//               <div className="mb-4">
//                 <label className="block text-gray-300 text-sm mb-2">Subject</label>
//                 <input
//                   type="text"
//                   value={emailData.subject}
//                   onChange={(e) => setEmailData({...emailData, subject: e.target.value})}
//                   placeholder="Enter email subject"
//                   className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
//                   required
//                 />
//               </div>
              
//               <div className="mb-4">
//                 <label className="block text-gray-300 text-sm mb-2">Message</label>
//                 <textarea
//                   value={emailData.message}
//                   onChange={(e) => setEmailData({...emailData, message: e.target.value})}
//                   placeholder="Write your newsletter content here..."
//                   rows="8"
//                   className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
//                   required
//                 />
//               </div>
              
//               <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-4">
//                 <p className="text-yellow-400 text-sm flex items-center gap-2">
//                   <span>⚠️</span> This will send to <strong>{subscribers.length}</strong> active subscribers
//                 </p>
//               </div>
              
//               <div className="flex gap-3">
//                 <button
//                   type="button"
//                   onClick={() => setShowSendModal(false)}
//                   className="flex-1 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={sending}
//                   className="flex-1 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition disabled:opacity-50"
//                 >
//                   {sending ? 'Sending...' : 'Send Newsletter'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </Layout>
//   );
// }






































'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import toast from 'react-hot-toast';

const API_BASE = 'http://localhost:5000/api/v1/newsletter';

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalActive: 0,
    totalUnsubscribed: 0,
    newThisMonth: 0
  });
  const [showSendModal, setShowSendModal] = useState(false);
  const [emailData, setEmailData] = useState({
    subject: '',
    message: '',
    type: 'newsletter'
  });
  const [sending, setSending] = useState(false);
  const [subscriberToRemove, setSubscriberToRemove] = useState(null);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

  useEffect(() => {
    fetchSubscribers();
    fetchStats();
  }, []);

  const getToken = () => {
    // Get token from cookies
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'accessToken') {
        return decodeURIComponent(value);
      }
    }
    return localStorage.getItem('accessToken');
  };

  const fetchSubscribers = async () => {
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/subscribers`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      
      if (res.ok) {
        const data = await res.json();
        setSubscribers(data.data || []);
      } else {
        console.error('Failed to fetch subscribers:', res.status);
      }
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      toast.error('Failed to load subscribers');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setStats(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // ✅ Remove subscriber function
  const handleRemoveSubscriber = async (subscriber) => {
    setSubscriberToRemove(subscriber);
    setShowRemoveConfirm(true);
  };

  const confirmRemoveSubscriber = async () => {
    if (!subscriberToRemove) return;
    
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/unsubscribe`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ email: subscriberToRemove.email })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        toast.success(`${subscriberToRemove.email} has been unsubscribed`);
        // Refresh the list
        fetchSubscribers();
        fetchStats();
      } else {
        toast.error(data.message || 'Failed to remove subscriber');
      }
    } catch (error) {
      console.error('Error removing subscriber:', error);
      toast.error('Failed to remove subscriber');
    } finally {
      setShowRemoveConfirm(false);
      setSubscriberToRemove(null);
    }
  };

  const cancelRemoveSubscriber = () => {
    setShowRemoveConfirm(false);
    setSubscriberToRemove(null);
  };

  const handleSendNewsletter = async (e) => {
    e.preventDefault();
    
    if (!emailData.subject || !emailData.message) {
      toast.error('Please fill in subject and message');
      return;
    }
    
    setSending(true);
    
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/send`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(emailData)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        toast.success(data.message || 'Newsletter sent successfully!');
        setShowSendModal(false);
        setEmailData({ subject: '', message: '', type: 'newsletter' });
      } else {
        toast.error(data.message || 'Failed to send newsletter');
      }
    } catch (error) {
      console.error('Error sending newsletter:', error);
      toast.error('Failed to send newsletter');
    } finally {
      setSending(false);
    }
  };

  const exportSubscribers = () => {
    const csvContent = [
      ['Email', 'Subscribed Date', 'Source', 'Status'],
      ...subscribers.map(s => [
        s.email, 
        new Date(s.subscribedAt).toLocaleDateString(), 
        s.source || 'website_footer',
        'Active'
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscribers_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Export started!');
  };

  const copyEmails = () => {
    const emails = subscribers.map(s => s.email).join(', ');
    navigator.clipboard.writeText(emails);
    toast.success(`${subscribers.length} email addresses copied!`);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">📧 Newsletter Management</h1>
            <p className="text-gray-400 text-sm mt-1">Manage subscribers and send newsletters</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={exportSubscribers}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition text-sm"
            >
              📥 Export CSV
            </button>
            <button
              onClick={copyEmails}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition text-sm"
            >
              📋 Copy Emails
            </button>
            <button
              onClick={() => setShowSendModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition text-sm"
            >
              ✉️ Send Newsletter
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl p-4 border border-green-500/30">
            <p className="text-gray-400 text-sm">Total Subscribers</p>
            <p className="text-3xl font-bold text-green-400">{stats.totalActive}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl p-4 border border-blue-500/30">
            <p className="text-gray-400 text-sm">New This Month</p>
            <p className="text-3xl font-bold text-blue-400">+{stats.newThisMonth}</p>
          </div>
          <div className="bg-gradient-to-br from-gray-500/20 to-gray-600/20 rounded-xl p-4 border border-gray-500/30">
            <p className="text-gray-400 text-sm">Unsubscribed</p>
            <p className="text-3xl font-bold text-gray-400">{stats.totalUnsubscribed}</p>
          </div>
        </div>

        {/* Subscribers Table */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">Subscribers List</h2>
            <p className="text-gray-400 text-sm">Total: {subscribers.length} active subscribers</p>
          </div>
          
          <div className="overflow-x-auto">
            {subscribers.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-400 text-lg mb-2">No Subscribers Yet</p>
                <p className="text-gray-500 text-sm">When customers subscribe to the newsletter, they will appear here.</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700 bg-gray-900/50">
                    <th className="text-left p-4 text-gray-300 text-sm font-medium">Email</th>
                    <th className="text-left p-4 text-gray-300 text-sm font-medium">Subscribed Date</th>
                    <th className="text-left p-4 text-gray-300 text-sm font-medium">Source</th>
                    <th className="text-left p-4 text-gray-300 text-sm font-medium">Status</th>
                    <th className="text-right p-4 text-gray-300 text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((subscriber, index) => (
                    <tr key={subscriber._id || index} className="border-b border-gray-700 hover:bg-gray-700/50 transition">
                      <td className="p-4">
                        <p className="text-white text-sm">{subscriber.email}</p>
                      </td>
                      <td className="p-4">
                        <p className="text-gray-400 text-sm">{new Date(subscriber.subscribedAt).toLocaleDateString()}</p>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-gray-700 rounded-full text-xs text-gray-300">
                          {subscriber.source || 'Website'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                          Active
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleRemoveSubscriber(subscriber)}
                          className="px-3 py-1 bg-red-500/20 text-red-400 rounded text-sm hover:bg-red-500/30 transition"
                        >
                          🗑️ Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Remove Subscriber Confirmation Modal */}
      {showRemoveConfirm && subscriberToRemove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80" onClick={cancelRemoveSubscriber} />
          <div className="relative bg-gray-800 rounded-2xl w-full max-w-md p-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Remove Subscriber</h2>
              <p className="text-gray-400 mb-4">
                Are you sure you want to remove <strong className="text-white">{subscriberToRemove.email}</strong> from the newsletter list?
              </p>
              <p className="text-yellow-400 text-sm mb-6">
                ⚠️ This will mark them as unsubscribed. They won't receive future newsletters.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={cancelRemoveSubscriber}
                  className="flex-1 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRemoveSubscriber}
                  className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Send Newsletter Modal */}
      {showSendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80" onClick={() => setShowSendModal(false)} />
          <div className="relative bg-gray-800 rounded-2xl w-full max-w-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Send Newsletter</h2>
              <button onClick={() => setShowSendModal(false)} className="text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSendNewsletter}>
              <div className="mb-4">
                <label className="block text-gray-300 text-sm mb-2">Newsletter Type</label>
                <select
                  value={emailData.type}
                  onChange={(e) => setEmailData({...emailData, type: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="newsletter">📧 Regular Newsletter</option>
                  <option value="offer">🎉 Special Offer / Deal</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-300 text-sm mb-2">Subject</label>
                <input
                  type="text"
                  value={emailData.subject}
                  onChange={(e) => setEmailData({...emailData, subject: e.target.value})}
                  placeholder="Enter email subject"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-300 text-sm mb-2">Message</label>
                <textarea
                  value={emailData.message}
                  onChange={(e) => setEmailData({...emailData, message: e.target.value})}
                  placeholder="Write your newsletter content here..."
                  rows="8"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
              
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-4">
                <p className="text-yellow-400 text-sm flex items-center gap-2">
                  <span>⚠️</span> This will send to <strong>{subscribers.length}</strong> active subscribers
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowSendModal(false)}
                  className="flex-1 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sending}
                  className="flex-1 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition disabled:opacity-50"
                >
                  {sending ? 'Sending...' : 'Send Newsletter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}