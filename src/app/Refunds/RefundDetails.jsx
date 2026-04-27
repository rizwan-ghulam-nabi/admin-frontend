// src/pages/Refunds/RefundDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { refundService } from '../../services/refundService';

const RefundDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [refund, setRefund] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchRefund = async () => {
      try {
        const response = await refundService.getRefundById(id);
        if (isMounted) {
          setRefund(response.data.data || response.data);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to load refund details');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchRefund();
    return () => { isMounted = false; };
  }, [id]);

  const handleStatusUpdate = async (newStatus) => {
    const confirmMessages = {
      processing: 'Are you sure you want to start processing this refund?',
      completed: 'Are you sure you want to mark this refund as completed? This will process the refund to the customer.',
      failed: 'Are you sure you want to mark this refund as failed?',
      cancelled: 'Are you sure you want to cancel this refund?',
    };

    if (!window.confirm(confirmMessages[newStatus])) {
      return;
    }

    try {
      setUpdating(true);
      setError('');
      setSuccessMessage('');

      await refundService.updateRefundStatus(id, { 
        status: newStatus,
        notes: `Status manually changed to ${newStatus} by admin`
      });

      // Reload refund data
      const response = await refundService.getRefundById(id);
      setRefund(response.data.data || response.data);
      setSuccessMessage(`Refund status updated to ${newStatus} successfully!`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update refund status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { class: 'bg-warning text-dark', icon: 'fa-clock' },
      processing: { class: 'bg-info text-white', icon: 'fa-spinner' },
      completed: { class: 'bg-success text-white', icon: 'fa-check-circle' },
      failed: { class: 'bg-danger text-white', icon: 'fa-times-circle' },
      cancelled: { class: 'bg-secondary text-white', icon: 'fa-ban' },
    };
    return badges[status] || { class: 'bg-light text-dark', icon: 'fa-question-circle' };
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <div className="container-fluid p-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading refund details...</p>
        </div>
      </div>
    );
  }

  if (error && !refund) {
    return (
      <div className="container-fluid p-4">
        <div className="alert alert-danger">
          <i className="fas fa-exclamation-circle me-2"></i>
          {error}
        </div>
        <button onClick={() => navigate('/refunds')} className="btn btn-secondary">
          Back to List
        </button>
      </div>
    );
  }

  if (!refund) {
    return (
      <div className="container-fluid p-4">
        <div className="text-center py-5">
          <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
          <p className="text-muted">Refund not found</p>
          <Link to="/refunds" className="btn btn-primary">Back to List</Link>
        </div>
      </div>
    );
  }

  const statusBadge = getStatusBadge(refund.status);

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Refund Details</h2>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to="/refunds">Refunds</Link>
              </li>
              <li className="breadcrumb-item active">
                {refund.refundId || refund._id}
              </li>
            </ol>
          </nav>
        </div>
        <Link to="/refunds" className="btn btn-secondary">
          <i className="fas fa-arrow-left me-2"></i>Back to List
        </Link>
      </div>

      {/* Messages */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      {successMessage && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <i className="fas fa-check-circle me-2"></i>
          {successMessage}
          <button type="button" className="btn-close" onClick={() => setSuccessMessage('')}></button>
        </div>
      )}

      <div className="row">
        {/* Main Content */}
        <div className="col-lg-8">
          {/* Refund Info Card */}
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <i className="fas fa-info-circle me-2 text-primary"></i>
                Refund Information
              </h5>
              <span className={`badge ${statusBadge.class} fs-6`}>
                <i className={`fas ${statusBadge.icon} me-1`}></i>
                {refund.status.charAt(0).toUpperCase() + refund.status.slice(1)}
              </span>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="text-muted small">Refund ID</label>
                  <p className="font-monospace mb-0">{refund.refundId || refund._id}</p>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="text-muted small">Transaction ID</label>
                  <p className="font-monospace mb-0">{refund.transactionId || 'N/A'}</p>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="text-muted small">Amount</label>
                  <p className="fs-5 fw-bold text-primary mb-0">
                    {formatCurrency(refund.amount, refund.currency)}
                  </p>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="text-muted small">Reason</label>
                  <p className="text-capitalize mb-0">
                    {refund.reason?.replace(/_/g, ' ')}
                  </p>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="text-muted small">Created Date</label>
                  <p className="mb-0">{formatDate(refund.createdAt)}</p>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="text-muted small">Processed Date</label>
                  <p className="mb-0">{formatDate(refund.processedAt)}</p>
                </div>
              </div>

              {refund.reasonDetails && (
                <div className="mt-3 p-3 bg-light rounded">
                  <label className="text-muted small">Reason Details</label>
                  <p className="mb-0">{refund.reasonDetails}</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          {refund.status === 'pending' && (
            <div className="card shadow-sm mb-4 border-warning">
              <div className="card-header bg-warning bg-opacity-10">
                <h5 className="mb-0">
                  <i className="fas fa-cogs me-2 text-warning"></i>
                  Process Refund
                </h5>
              </div>
              <div className="card-body">
                <div className="d-flex flex-wrap gap-2">
                  <button
                    onClick={() => handleStatusUpdate('processing')}
                    className="btn btn-info"
                    disabled={updating}
                  >
                    <i className="fas fa-spinner me-2"></i>
                    Start Processing
                  </button>
                  <button
                    onClick={() => handleStatusUpdate('completed')}
                    className="btn btn-success"
                    disabled={updating}
                  >
                    <i className="fas fa-check me-2"></i>
                    Mark as Completed
                  </button>
                  <button
                    onClick={() => handleStatusUpdate('failed')}
                    className="btn btn-danger"
                    disabled={updating}
                  >
                    <i className="fas fa-times me-2"></i>
                    Mark as Failed
                  </button>
                  <button
                    onClick={() => handleStatusUpdate('cancelled')}
                    className="btn btn-secondary"
                    disabled={updating}
                  >
                    <i className="fas fa-ban me-2"></i>
                    Cancel Refund
                  </button>
                </div>
                {updating && (
                  <div className="mt-3">
                    <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                    Updating status...
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="col-lg-4">
          {/* Order Info */}
          <div className="card shadow-sm mb-3">
            <div className="card-header bg-white">
              <h6 className="mb-0">
                <i className="fas fa-shopping-cart me-2 text-primary"></i>
                Order Information
              </h6>
            </div>
            <div className="card-body">
              <div className="mb-2">
                <label className="text-muted small">Order ID</label>
                <p className="font-monospace mb-0">
                  {refund.order?._id || refund.order || 'N/A'}
                </p>
              </div>
              <div className="mb-2">
                <label className="text-muted small">Payment ID</label>
                <p className="font-monospace mb-0">
                  {refund.payment?._id || refund.payment || 'N/A'}
                </p>
              </div>
              <div>
                <label className="text-muted small">Customer ID</label>
                <p className="font-monospace mb-0">
                  {refund.user?._id || refund.user || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Processed By */}
          <div className="card shadow-sm mb-3">
            <div className="card-header bg-white">
              <h6 className="mb-0">
                <i className="fas fa-user me-2 text-primary"></i>
                Processed By
              </h6>
            </div>
            <div className="card-body">
              {refund.processedBy ? (
                <div>
                  <p className="mb-1 fw-bold">{refund.processedBy.name || 'Admin'}</p>
                  <small className="text-muted">{refund.processedBy.email || ''}</small>
                </div>
              ) : (
                <p className="text-muted mb-0">Not yet processed</p>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="card shadow-sm">
            <div className="card-header bg-white">
              <h6 className="mb-0">
                <i className="fas fa-history me-2 text-primary"></i>
                Timeline
              </h6>
            </div>
            <div className="card-body">
              <ul className="list-unstyled mb-0">
                <li className="mb-3 d-flex">
                  <div className="me-3">
                    <div className="bg-primary rounded-circle p-2" style={{ width: '32px', height: '32px' }}>
                      <i className="fas fa-plus text-white small"></i>
                    </div>
                  </div>
                  <div>
                    <p className="mb-0 fw-bold">Refund Created</p>
                    <small className="text-muted">{formatDate(refund.createdAt)}</small>
                  </div>
                </li>
                {refund.processedAt && (
                  <li className="d-flex">
                    <div className="me-3">
                      <div className="bg-success rounded-circle p-2" style={{ width: '32px', height: '32px' }}>
                        <i className="fas fa-check text-white small"></i>
                      </div>
                    </div>
                    <div>
                      <p className="mb-0 fw-bold">Processed</p>
                      <small className="text-muted">{formatDate(refund.processedAt)}</small>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundDetails;