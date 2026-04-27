// src/pages/Refunds/CreateRefund.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { refundService } from '../../services/refundService';

const CreateRefund = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    orderId: '',
    paymentId: '',
    amount: '',
    reason: '',
    reasonDetails: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.orderId.trim()) {
      newErrors.orderId = 'Order ID is required';
    }
    
    if (!formData.paymentId.trim()) {
      newErrors.paymentId = 'Payment ID is required';
    }
    
    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    
    if (!formData.reason) {
      newErrors.reason = 'Please select a reason';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      await refundService.createRefund(formData);
      navigate('/refunds', { 
        state: { message: 'Refund created successfully!', type: 'success' } 
      });
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create refund';
      const validationErrors = err.response?.data?.errors;
      
      if (validationErrors) {
        const fieldErrors = {};
        validationErrors.forEach(error => {
          fieldErrors[error.field] = error.message;
        });
        setErrors(fieldErrors);
      } else {
        setSubmitError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Create New Refund</h2>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to="/refunds">Refunds</Link>
              </li>
              <li className="breadcrumb-item active">Create Refund</li>
            </ol>
          </nav>
        </div>
        <Link to="/refunds" className="btn btn-secondary">
          <i className="fas fa-arrow-left me-2"></i>Back to List
        </Link>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-header bg-white">
              <h5 className="mb-0">
                <i className="fas fa-undo-alt me-2 text-primary"></i>
                Refund Information
              </h5>
            </div>
            <div className="card-body">
              {/* Submit Error */}
              {submitError && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {submitError}
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setSubmitError('')}
                  ></button>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="row">
                  {/* Order ID */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Order ID <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fas fa-shopping-cart"></i>
                      </span>
                      <input
                        type="text"
                        name="orderId"
                        className={`form-control ${errors.orderId ? 'is-invalid' : ''}`}
                        value={formData.orderId}
                        onChange={handleChange}
                        placeholder="Enter order ID"
                      />
                      {errors.orderId && (
                        <div className="invalid-feedback">{errors.orderId}</div>
                      )}
                    </div>
                  </div>

                  {/* Payment ID */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Payment ID <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fas fa-credit-card"></i>
                      </span>
                      <input
                        type="text"
                        name="paymentId"
                        className={`form-control ${errors.paymentId ? 'is-invalid' : ''}`}
                        value={formData.paymentId}
                        onChange={handleChange}
                        placeholder="Enter payment ID"
                      />
                      {errors.paymentId && (
                        <div className="invalid-feedback">{errors.paymentId}</div>
                      )}
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Refund Amount ($) <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">$</span>
                      <input
                        type="number"
                        name="amount"
                        className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
                        value={formData.amount}
                        onChange={handleChange}
                        step="0.01"
                        min="0.01"
                        placeholder="0.00"
                      />
                      {errors.amount && (
                        <div className="invalid-feedback">{errors.amount}</div>
                      )}
                    </div>
                  </div>

                  {/* Reason */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Reason <span className="text-danger">*</span>
                    </label>
                    <select
                      name="reason"
                      className={`form-select ${errors.reason ? 'is-invalid' : ''}`}
                      value={formData.reason}
                      onChange={handleChange}
                    >
                      <option value="">Select reason</option>
                      <option value="duplicate">Duplicate Payment</option>
                      <option value="fraudulent">Fraudulent Transaction</option>
                      <option value="requested_by_customer">Requested by Customer</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.reason && (
                      <div className="invalid-feedback">{errors.reason}</div>
                    )}
                  </div>

                  {/* Reason Details */}
                  <div className="col-12 mb-3">
                    <label className="form-label">
                      Reason Details
                      <small className="text-muted ms-2">(Optional)</small>
                    </label>
                    <textarea
                      name="reasonDetails"
                      className="form-control"
                      value={formData.reasonDetails}
                      onChange={handleChange}
                      rows="4"
                      maxLength="500"
                      placeholder="Provide additional details about why this refund is being created..."
                    />
                    <small className="text-muted">
                      {formData.reasonDetails.length}/500 characters
                    </small>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => navigate('/refunds')}
                  >
                    <i className="fas fa-times me-2"></i>Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary px-4"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Creating...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-check me-2"></i>Create Refund
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Info Card */}
          <div className="card mt-4 border-info">
            <div className="card-body">
              <h6 className="text-info">
                <i className="fas fa-info-circle me-2"></i>
                Important Information
              </h6>
              <ul className="mb-0 small">
                <li>Make sure the Order ID and Payment ID are valid before submitting.</li>
                <li>The refund amount should not exceed the original payment amount.</li>
                <li>All refund requests will be reviewed before processing.</li>
                <li>You can track the refund status from the refunds list.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRefund;