// AdminPanel/frontend/admin-frontend/src/app/newsletter/page.jsx
'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import {
  EnvelopeIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  UserPlusIcon,
  UserMinusIcon,
  UsersIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const BASE_URL = 'http://localhost:5000/api/v1';
const API_KEY = 'admin_panel_secret_key_2024';

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    totalActive: 0,
    totalUnsubscribed: 0,
    newThisMonth: 0,
  });
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchSubscribers();
    fetchStats();
  }, []);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch(`${BASE_URL}/newsletter/subscribers`, {
        headers: { 'x-api-key': API_KEY }
      });
      
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      const data = await res.json();
      
      if (data.success) {
        setSubscribers(data.data || []);
      } else {
        throw new Error(data.message || 'Failed to fetch');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${BASE_URL}/newsletter/stats`, {
        headers: { 'x-api-key': API_KEY }
      });
      
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setStats(data.data);
        }
      }
    } catch (err) {
      console.error('Stats error:', err);
    }
  };

  const handleDelete = async (email) => {
    try {
      const res = await fetch(`${BASE_URL}/newsletter/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
        },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setSubscribers(prev => prev.filter(s => s.email !== email));
        setSuccessMessage('Subscriber deleted successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchStats();
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
    setDeleteConfirm(null);
  };

  const handleBulkDelete = async () => {
    if (selectedEmails.length === 0) return;
    
    const confirmed = window.confirm(`Delete ${selectedEmails.length} subscribers?`);
    if (!confirmed) return;

    try {
      const res = await fetch(`${BASE_URL}/newsletter/bulk-delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
        },
        body: JSON.stringify({ emails: selectedEmails }),
      });

      if (res.ok) {
        setSubscribers(prev => prev.filter(s => !selectedEmails.includes(s.email)));
        setSelectedEmails([]);
        setSuccessMessage(`${selectedEmails.length} subscribers deleted`);
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchStats();
      }
    } catch (err) {
      console.error('Bulk delete error:', err);
    }
  };

  const handleExportCSV = () => {
    const csvContent = [
      ['Email', 'Subscribed Date', 'Status', 'Source'],
      ...subscribers.map(s => [
        s.email,
        new Date(s.subscribedAt).toLocaleDateString(),
        s.isActive !== false ? 'Active' : 'Inactive',
        s.source || 'website',
      ]),
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const toggleSelectAll = () => {
    if (selectedEmails.length === filteredSubscribers.length) {
      setSelectedEmails([]);
    } else {
      setSelectedEmails(filteredSubscribers.map(s => s.email));
    }
  };

  const toggleSelect = (email) => {
    setSelectedEmails(prev =>
      prev.includes(email) ? prev.filter(e => e !== email) : [...prev, email]
    );
  };

  const filteredSubscribers = subscribers.filter(s =>
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6 pb-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Link href="/dashboard" className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">📧 Newsletter Subscribers</h1>
            </div>
            <p className="text-sm text-gray-500">Manage your email subscribers</p>
          </div>

          <button
            onClick={handleExportCSV}
            disabled={subscribers.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all text-sm font-medium shadow-sm disabled:opacity-50"
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
            Export CSV
          </button>
        </div>

        {/* Success Message */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2"
            >
              <CheckCircleIcon className="h-5 w-5" />
              {successMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { 
              title: 'Active Subscribers', 
              value: stats.totalActive, 
              icon: UsersIcon, 
              color: 'from-emerald-500 to-teal-500',
              bgLight: 'bg-emerald-50',
              textColor: 'text-emerald-700',
            },
            { 
              title: 'Unsubscribed', 
              value: stats.totalUnsubscribed, 
              icon: UserMinusIcon, 
              color: 'from-rose-500 to-pink-500',
              bgLight: 'bg-rose-50',
              textColor: 'text-rose-700',
            },
            { 
              title: 'New This Month', 
              value: stats.newThisMonth, 
              icon: UserPlusIcon, 
              color: 'from-blue-500 to-cyan-500',
              bgLight: 'bg-blue-50',
              textColor: 'text-blue-700',
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Search & Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by email..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm"
            />
          </div>
          
          {selectedEmails.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-2 px-4 py-2.5 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl hover:bg-rose-100 transition-all text-sm font-medium"
            >
              <TrashIcon className="h-4 w-4" />
              Delete ({selectedEmails.length})
            </button>
          )}
        </div>

        {/* Subscribers Table */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm border p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading subscribers...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl shadow-sm border p-12 text-center">
            <XCircleIcon className="h-12 w-12 text-rose-400 mx-auto mb-3" />
            <p className="text-gray-900 font-medium mb-2">Failed to load subscribers</p>
            <p className="text-gray-500 text-sm mb-4">{error}</p>
            <button onClick={fetchSubscribers} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
              Try Again
            </button>
          </div>
        ) : filteredSubscribers.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border p-12 text-center">
            <EnvelopeIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-900 font-medium mb-1">
              {searchTerm ? 'No matching subscribers' : 'No subscribers yet'}
            </p>
            <p className="text-gray-500 text-sm">
              {searchTerm ? 'Try a different search term' : 'Subscribers from your website will appear here'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="p-4 text-left">
                      <input
                        type="checkbox"
                        checked={selectedEmails.length === filteredSubscribers.length && filteredSubscribers.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </th>
                    <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Subscribed Date</th>
                    <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Status</th>
                    <th className="p-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredSubscribers.map((subscriber, index) => (
                    <tr key={subscriber._id || index} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedEmails.includes(subscriber.email)}
                          onChange={() => toggleSelect(subscriber.email)}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-blue-600">
                              {subscriber.email.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{subscriber.email}</span>
                        </div>
                      </td>
                      <td className="p-4 hidden sm:table-cell">
                        <span className="text-sm text-gray-500">
                          {new Date(subscriber.subscribedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                          subscriber.isActive !== false
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            subscriber.isActive !== false ? 'bg-emerald-500' : 'bg-rose-500'
                          }`} />
                          {subscriber.isActive !== false ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setDeleteConfirm(subscriber.email)}
                          className="text-gray-400 hover:text-rose-600 transition-colors p-2 hover:bg-rose-50 rounded-lg"
                          title="Delete subscriber"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/30 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing {filteredSubscribers.length} of {subscribers.length} subscribers
              </p>
              <button
                onClick={fetchSubscribers}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Refresh
              </button>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {deleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
              >
                <div className="text-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-3">
                    <TrashIcon className="h-6 w-6 text-rose-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Subscriber?</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Are you sure you want to delete <strong>{deleteConfirm}</strong>? This action cannot be undone.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(deleteConfirm)}
                    className="flex-1 px-4 py-2.5 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-all text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}