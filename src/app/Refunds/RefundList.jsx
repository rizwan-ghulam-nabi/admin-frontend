// src/pages/Refunds/RefundList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { refundService } from '../../services/refundService';

const RefundList = () => {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: '',
    reason: '',
    startDate: '',
    endDate: '',
    search: '',
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
  });

  // ✅ Fetch data directly in useEffect
  useEffect(() => {
    let isMounted = true;

    const fetchRefunds = async () => {
      try {
        setLoading(true);
        setError('');
        
        const response = await refundService.getRefunds(filters);
        
        if (isMounted) {
          setRefunds(response.data.data || response.data);
          setPagination(response.data.pagination || response.pagination);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || 'Failed to load refunds');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchRefunds();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [filters.page, filters.status, filters.reason]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value, page: 1 }));
  };

  const handleSearch = () => {
    // Force re-fetch by updating a filter
    setFilters(prev => ({ ...prev }));
  };

  const handleExportExcel = async () => {
    try {
      const response = await refundService.exportExcel(filters);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `refunds-${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Export failed:', err);
      alert('Failed to export Excel');
    }
  };

  const handleExportPDF = async () => {
    try {
      const response = await refundService.exportPDF(filters);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `refunds-${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Export failed:', err);
      alert('Failed to export PDF');
    }
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getStatusClass = (status) => {
    const classes = {
      pending: 'bg-warning text-dark',
      processing: 'bg-info text-white',
      completed: 'bg-success text-white',
      failed: 'bg-danger text-white',
      cancelled: 'bg-secondary text-white',
    };
    return classes[status] || 'bg-light text-dark';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Refunds Management</h2>
        <div className="d-flex gap-2">
          <Link to="/refunds/create" className="btn btn-primary">
            <i className="fas fa-plus me-1"></i> New Refund
          </Link>
          <Link to="/refunds/reports" className="btn btn-info">
            <i className="fas fa-chart-bar me-1"></i> Reports
          </Link>
          <button onClick={handleExportExcel} className="btn btn-success">
            <i className="fas fa-file-excel me-1"></i> Excel
          </button>
          <button onClick={handleExportPDF} className="btn btn-danger">
            <i className="fas fa-file-pdf me-1"></i> PDF
          </button>
        </div>
      </div>

      {/* Filters Card */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <div className="row g-3 align-items-end">
            <div className="col-md-2">
              <label className="form-label small">Search</label>
              <input
                type="text"
                name="search"
                className="form-control"
                placeholder="Search refunds..."
                value={filters.search}
                onChange={handleFilterChange}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="col-md-2">
              <label className="form-label small">Status</label>
              <select
                name="status"
                className="form-select"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label small">Reason</label>
              <select
                name="reason"
                className="form-select"
                value={filters.reason}
                onChange={handleFilterChange}
              >
                <option value="">All Reasons</option>
                <option value="duplicate">Duplicate</option>
                <option value="fraudulent">Fraudulent</option>
                <option value="requested_by_customer">Customer Request</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label small">Start Date</label>
              <input
                type="date"
                name="startDate"
                className="form-control"
                value={filters.startDate}
                onChange={handleFilterChange}
              />
            </div>
            <div className="col-md-2">
              <label className="form-label small">End Date</label>
              <input
                type="date"
                name="endDate"
                className="form-control"
                value={filters.endDate}
                onChange={handleFilterChange}
              />
            </div>
            <div className="col-md-2">
              <button onClick={handleSearch} className="btn btn-secondary w-100">
                <i className="fas fa-search me-1"></i> Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="fas fa-exclamation-circle me-2"></i>
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      {/* Refunds Table Card */}
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Refund ID</th>
                  <th>Order</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Reason</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-5">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-2 text-muted">Loading refunds...</p>
                    </td>
                  </tr>
                ) : refunds.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-5">
                      <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
                      <p className="text-muted">No refunds found</p>
                    </td>
                  </tr>
                ) : (
                  refunds.map(refund => (
                    <tr key={refund._id}>
                      <td>
                        <small className="text-muted font-monospace">
                          {refund.refundId || refund._id?.slice(-8)}
                        </small>
                      </td>
                      <td>
                        <small className="font-monospace">
                          {refund.order?._id?.slice(-8) || refund.order?.slice(-8) || 'N/A'}
                        </small>
                      </td>
                      <td>
                        <strong>{formatCurrency(refund.amount)}</strong>
                        <small className="text-muted d-block">{refund.currency}</small>
                      </td>
                      <td>
                        <span className={`badge ${getStatusClass(refund.status)}`}>
                          {refund.status.charAt(0).toUpperCase() + refund.status.slice(1)}
                        </span>
                      </td>
                      <td className="text-capitalize">
                        {refund.reason?.replace(/_/g, ' ')}
                      </td>
                      <td>
                        <small>{formatDate(refund.createdAt)}</small>
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <Link 
                            to={`/refunds/${refund._id}`} 
                            className="btn btn-outline-info"
                            title="View Details"
                          >
                            <i className="fas fa-eye"></i>
                          </Link>
                          {refund.status === 'pending' && (
                            <Link
                              to={`/refunds/${refund._id}`}
                              className="btn btn-outline-warning"
                              title="Process Refund"
                            >
                              <i className="fas fa-cog"></i>
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && pagination && pagination.pages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-3">
              <div className="text-muted small">
                Showing {((pagination.page - 1) * (filters.limit || 10)) + 1} - {Math.min(pagination.page * (filters.limit || 10), pagination.total)} of {pagination.total} results
              </div>
              <nav>
                <ul className="pagination pagination-sm mb-0">
                  <li className={`page-item ${pagination.page === 1 ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                    >
                      <i className="fas fa-chevron-left"></i>
                    </button>
                  </li>
                  
                  {[...Array(pagination.pages)].map((_, i) => {
                    const pageNum = i + 1;
                    if (
                      pageNum === 1 ||
                      pageNum === pagination.pages ||
                      (pageNum >= pagination.page - 1 && pageNum <= pagination.page + 1)
                    ) {
                      return (
                        <li 
                          key={i} 
                          className={`page-item ${pagination.page === pageNum ? 'active' : ''}`}
                        >
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(pageNum)}
                          >
                            {pageNum}
                          </button>
                        </li>
                      );
                    } else if (
                      pageNum === pagination.page - 2 ||
                      pageNum === pagination.page + 2
                    ) {
                      return (
                        <li key={i} className="page-item disabled">
                          <span className="page-link">...</span>
                        </li>
                      );
                    }
                    return null;
                  })}
                  
                  <li className={`page-item ${pagination.page === pagination.pages ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.pages}
                    >
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RefundList;