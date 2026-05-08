'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

// ✅ Use ADMIN BACKEND (port 5001)
// const ADMIN_API = 'http://localhost:5001/api/v1/support';
const ADMIN_API = 'http://localhost:5001/api/v1/admin/support';

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0
  });

  useEffect(() => {
    fetchTickets();
    fetchStats();
  }, []);

  // Helper to get cookie by name
  const getCookie = (name) => {
    if (typeof document === 'undefined') return null;
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [cookieName, cookieValue] = cookie.trim().split('=');
      if (cookieName === name) {
        return decodeURIComponent(cookieValue);
      }
    }
    return null;
  };

  // Get token from cookies (admin token on port 5001)
  const getAccessToken = () => {
    const tokenNames = ['accessToken', 'token', 'adminToken', 'authToken'];
    
    for (const name of tokenNames) {
      const token = getCookie(name);
      if (token) {
        console.log(`✅ Found token in cookie: ${name}`);
        return token;
      }
    }
    
    if (typeof window !== 'undefined') {
      const localToken = localStorage.getItem('accessToken') || localStorage.getItem('token');
      if (localToken) {
        console.log('✅ Found token in localStorage');
        return localToken;
      }
    }
    
    console.error('❌ No token found');
    return null;
  };

  const fetchStats = async () => {
    try {
      const token = getAccessToken();
      if (!token) return;
      
      const res = await fetch(`${ADMIN_API}/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setStats({
            total: data.data.total || 0,
            pending: data.data.pending || 0,
            inProgress: data.data['in-progress'] || 0,
            resolved: data.data.resolved || 0,
            closed: data.data.closed || 0
          });
        }
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getAccessToken();
      
      if (!token) {
        setError('No authentication token found. Please log in again.');
        toast.error('Authentication required');
        setLoading(false);
        return;
      }
      
      console.log('📤 Fetching tickets from:', `${ADMIN_API}/tickets`);
      
      const res = await fetch(`${ADMIN_API}/tickets`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('📥 Response status:', res.status);
      
      if (res.status === 401) {
        setError('Session expired. Please log in again.');
        toast.error('Authentication failed');
        setLoading(false);
        return;
      }
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Server error: ${res.status}`);
      }
      
      const data = await res.json();
      console.log('📦 Response data:', data);
      
      const ticketsData = data.data || [];
      setTickets(ticketsData);
    } catch (err) {
      console.error('❌ Error:', err);
      setError(err.message);
      toast.error(err.message || 'Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (ticketId, status) => {
    try {
      const token = getAccessToken();
      
      if (!token) {
        toast.error('Authentication required');
        return;
      }
      
      const res = await fetch(`${ADMIN_API}/tickets/${ticketId}/status`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      
      if (res.ok) {
        toast.success(`Ticket marked as ${status}`);
        fetchTickets();
        fetchStats();
      } else {
        const error = await res.json().catch(() => ({}));
        toast.error(error.message || 'Failed to update status');
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const sendReply = async (ticketId) => {
    if (!replyMessage.trim()) {
      toast.error('Please enter a reply');
      return;
    }

    try {
      const token = getAccessToken();
      
      if (!token) {
        toast.error('Authentication required');
        return;
      }
      
      const res = await fetch(`${ADMIN_API}/tickets/${ticketId}/reply`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reply: replyMessage })
      });
      
      if (res.ok) {
        toast.success('Reply sent!');
        setShowReplyModal(false);
        setReplyMessage('');
        fetchTickets();
      } else {
        const error = await res.json().catch(() => ({}));
        toast.error(error.message || 'Failed to send reply');
      }
    } catch (err) {
      toast.error('Failed to send reply');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      'pending': 'bg-yellow-500/20 text-yellow-400',
      'in-progress': 'bg-blue-500/20 text-blue-400',
      'resolved': 'bg-green-500/20 text-green-400',
      'closed': 'bg-gray-500/20 text-gray-400'
    };
    return badges[status] || badges.pending;
  };

  const filteredTickets = tickets.filter(t => filter === 'all' ? true : t.status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-500/20 border border-red-500 rounded-xl p-6 text-center">
          <svg className="w-12 h-12 text-red-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-3V9m0 0V6m0 3H9m3 0h3M12 3a9 9 0 110 18 9 9 0 010-18z" />
          </svg>
          <h2 className="text-xl font-semibold text-white mb-2">Error Loading Tickets</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <div className="flex gap-3 justify-center">
            <button onClick={fetchTickets} className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition">
              Try Again
            </button>
            <Link href="/dashboard" className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm transition">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">🎫 Support Tickets</h1>
          <p className="text-gray-400 text-sm">Manage customer support inquiries</p>
        </div>
        <button onClick={fetchTickets} className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition text-sm">
          🔄 Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <p className="text-gray-400 text-xs">Total</p>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-yellow-500/20">
          <p className="text-gray-400 text-xs">Pending</p>
          <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-blue-500/20">
          <p className="text-gray-400 text-xs">In Progress</p>
          <p className="text-2xl font-bold text-blue-400">{stats.inProgress}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-green-500/20">
          <p className="text-gray-400 text-xs">Resolved</p>
          <p className="text-2xl font-bold text-green-400">{stats.resolved}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-500/20">
          <p className="text-gray-400 text-xs">Closed</p>
          <p className="text-2xl font-bold text-gray-400">{stats.closed}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['all', 'pending', 'in-progress', 'resolved', 'closed'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-lg text-sm capitalize transition ${filter === s ? 'bg-purple-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
          >
            {s === 'all' ? 'All' : s.replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Tickets Table */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        {filteredTickets.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-gray-400 text-lg mb-2">No Support Tickets Found</p>
            <p className="text-gray-500 text-sm">When customers submit support requests, they will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-4 text-gray-300 text-sm">Ticket #</th>
                  <th className="text-left p-4 text-gray-300 text-sm">Customer</th>
                  <th className="text-left p-4 text-gray-300 text-sm">Subject</th>
                  <th className="text-left p-4 text-gray-300 text-sm">Status</th>
                  <th className="text-left p-4 text-gray-300 text-sm">Date</th>
                  <th className="text-right p-4 text-gray-300 text-sm">Actions</th>
                 </tr>
              </thead>
              <tbody>
                {filteredTickets.map(ticket => (
                  <tr key={ticket._id} className="border-b border-gray-700 hover:bg-gray-750 transition">
                    <td className="p-4">
                      <span className="text-white text-sm font-mono">{ticket.ticketNumber}</span>
                    </td>
                    <td className="p-4">
                      <p className="text-white text-sm">{ticket.name}</p>
                      <p className="text-gray-400 text-xs">{ticket.email}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-white text-sm">{ticket.subject}</p>
                      <p className="text-gray-500 text-xs truncate max-w-[200px]">{ticket.message}</p>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="text-gray-400 text-sm">{new Date(ticket.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedTicket(ticket);
                          setShowReplyModal(true);
                        }}
                        className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded text-sm hover:bg-blue-500/30 mr-2 transition"
                      >
                        Reply
                      </button>
                      <select
                        value={ticket.status}
                        onChange={(e) => updateStatus(ticket._id, e.target.value)}
                        className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-sm cursor-pointer"
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reply Modal */}
      {showReplyModal && selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80" onClick={() => setShowReplyModal(false)} />
          <div className="relative bg-gray-800 rounded-2xl w-full max-w-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Reply to {selectedTicket.name}</h2>
            
            <div className="bg-gray-700/50 rounded-lg p-4 mb-4">
              <p className="text-gray-400 text-xs mb-1">Customer Message:</p>
              <p className="text-gray-300 text-sm">{selectedTicket.message}</p>
              {selectedTicket.orderNumber && (
                <p className="text-gray-500 text-xs mt-2">Order: {selectedTicket.orderNumber}</p>
              )}
            </div>
            
            <textarea
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              rows="4"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white mb-4 focus:outline-none focus:border-purple-500 transition"
              placeholder="Type your reply..."
            />
            
            <div className="flex gap-3">
              <button onClick={() => setShowReplyModal(false)} className="flex-1 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">
                Cancel
              </button>
              <button onClick={() => sendReply(selectedTicket._id)} className="flex-1 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition">
                Send Reply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}