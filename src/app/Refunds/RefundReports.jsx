// src/pages/Refunds/RefundReports.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { refundService } from '../../services/refundService';

const RefundReports = () => {
  const [stats, setStats] = useState(null);
  const [trends, setTrends] = useState([]);
  const [byReason, setByReason] = useState([]);
  const [rate, setRate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    let isMounted = true;

    const fetchReports = async () => {
      try {
        setLoading(true);
        const params = {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        };

        const [statsRes, trendsRes, reasonRes, rateRes] = await Promise.all([
          refundService.getRefundStats(params),
          refundService.getRefundTrends(params),
          refundService.getRefundByReason(params),
          refundService.getRefundRate(params),
        ]);

        if (isMounted) {
          setStats(statsRes.data?.data || statsRes.data);
          setTrends(trendsRes.data?.data || trendsRes.data || []);
          setByReason(reasonRes.data?.data || reasonRes.data || []);
          setRate(rateRes.data?.data || rateRes.data);
        }
      } catch (err) {
        console.error('Failed to fetch reports:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchReports();
    return () => { isMounted = false; };
  }, [dateRange]);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({ ...prev, [name]: value }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  const getReasonColor = (reason) => {
    const colors = {
      duplicate: '#FF6384',
      fraudulent: '#FF9F40',
      requested_by_customer: '#36A2EB',
      other: '#4BC0C0',
    };
    return colors[reason] || '#9966FF';
  };

  const getMaxTrendValue = () => {
    if (!trends.length) return 100;
    return Math.max(...trends.map(t => t.count || 0), 1);
  };

  if (loading) {
    return (
      <div className="container-fluid p-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Refund Reports & Analytics</h2>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to="/refunds">Refunds</Link>
              </li>
              <li className="breadcrumb-item active">Reports</li>
            </ol>
          </nav>
        </div>
        <Link to="/refunds" className="btn btn-secondary">
          <i className="fas fa-list me-2"></i>View Refunds
        </Link>
      </div>

      {/* Date Range Filter */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row align-items-end">
            <div className="col-md-3">
              <label className="form-label small">Start Date</label>
              <input
                type="date"
                name="startDate"
                className="form-control"
                value={dateRange.startDate}
                onChange={handleDateChange}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label small">End Date</label>
              <input
                type="date"
                name="endDate"
                className="form-control"
                value={dateRange.endDate}
                onChange={handleDateChange}
              />
            </div>
            <div className="col-md-6">
              <p className="text-muted small mb-0">
                <i className="fas fa-info-circle me-1"></i>
                Showing data from {new Date(dateRange.startDate).toLocaleDateString()} to {new Date(dateRange.endDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card border-primary shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-1 small">Total Refunds</p>
                  <h3 className="mb-0">{stats?.total || 0}</h3>
                </div>
                <div className="bg-primary bg-opacity-10 rounded p-2">
                  <i className="fas fa-undo-alt fa-lg text-primary"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card border-success shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-1 small">Total Amount</p>
                  <h3 className="mb-0">{formatCurrency(stats?.totalAmount)}</h3>
                </div>
                <div className="bg-success bg-opacity-10 rounded p-2">
                  <i className="fas fa-dollar-sign fa-lg text-success"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card border-warning shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-1 small">Pending</p>
                  <h3 className="mb-0">{stats?.pending || 0}</h3>
                </div>
                <div className="bg-warning bg-opacity-10 rounded p-2">
                  <i className="fas fa-clock fa-lg text-warning"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card border-danger shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-1 small">Refund Rate</p>
                  <h3 className="mb-0">{rate?.refundRate?.toFixed(1) || 0}%</h3>
                </div>
                <div className="bg-danger bg-opacity-10 rounded p-2">
                  <i className="fas fa-percentage fa-lg text-danger"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="row">
        {/* Refunds by Reason */}
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-white">
              <h5 className="mb-0">
                <i className="fas fa-chart-pie me-2 text-primary"></i>
                Refunds by Reason
              </h5>
            </div>
            <div className="card-body">
              {byReason.length === 0 ? (
                <p className="text-center text-muted py-4">No data available</p>
              ) : (
                <div>
                  {byReason.map((item, index) => {
                    const total = byReason.reduce((sum, r) => sum + (r.count || 0), 0);
                    const percentage = total > 0 ? ((item.count || 0) / total * 100).toFixed(1) : 0;
                    
                    return (
                      <div key={index} className="mb-3">
                        <div className="d-flex justify-content-between mb-1">
                          <span className="text-capitalize small">
                            {item.reason?.replace(/_/g, ' ')}
                          </span>
                          <span className="small fw-bold">
                            {item.count || 0} ({percentage}%)
                          </span>
                        </div>
                        <div className="progress" style={{ height: '25px' }}>
                          <div
                            className="progress-bar"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: getReasonColor(item.reason),
                            }}
                          >
                            {percentage > 10 && (
                              <span className="small">{percentage}%</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Refund Trends */}
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-white">
              <h5 className="mb-0">
                <i className="fas fa-chart-line me-2 text-primary"></i>
                Refund Trends
              </h5>
            </div>
            <div className="card-body">
              {trends.length === 0 ? (
                <p className="text-center text-muted py-4">No data available</p>
              ) : (
                <div className="d-flex align-items-end" style={{ height: '250px' }}>
                  {trends.map((item, index) => {
                    const maxValue = getMaxTrendValue();
                    const height = maxValue > 0 ? ((item.count || 0) / maxValue * 100) : 0;
                    
                    return (
                      <div key={index} className="flex-fill px-1" style={{ height: '100%' }}>
                        <div className="d-flex flex-column justify-content-end h-100">
                          <div className="text-center mb-1">
                            <small className="fw-bold">{item.count || 0}</small>
                          </div>
                          <div
                            className="bg-primary bg-opacity-75 rounded-top mx-auto"
                            style={{
                              width: '80%',
                              height: `${height}%`,
                              minHeight: '2px',
                              transition: 'height 0.3s ease',
                            }}
                            title={`${item.date}: ${item.count} refunds`}
                          ></div>
                          <div className="text-center mt-2">
                            <small className="text-muted" style={{ fontSize: '10px' }}>
                              {item.date ? new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
                            </small>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="row">
        {/* Status Breakdown */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-white">
              <h6 className="mb-0">
                <i className="fas fa-chart-bar me-2 text-primary"></i>
                Status Breakdown
              </h6>
            </div>
            <div className="card-body">
              {[
                { label: 'Pending', value: stats?.pending || 0, color: 'warning' },
                { label: 'Processing', value: stats?.processing || 0, color: 'info' },
                { label: 'Completed', value: stats?.completed || 0, color: 'success' },
                { label: 'Failed', value: stats?.failed || 0, color: 'danger' },
                { label: 'Cancelled', value: stats?.cancelled || 0, color: 'secondary' },
              ].map((item, index) => (
                <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                  <span className="small">{item.label}</span>
                  <span className={`badge bg-${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Summary */}
        <div className="col-md-8 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-white">
              <h6 className="mb-0">
                <i className="fas fa-clipboard-list me-2 text-primary"></i>
                Quick Summary
              </h6>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <p className="small text-muted mb-1">Average Refund Amount</p>
                  <h5>{formatCurrency(stats?.averageAmount || 0)}</h5>
                </div>
                <div className="col-md-6">
                  <p className="small text-muted mb-1">Completion Rate</p>
                  <h5>
                    {stats?.total > 0 
                      ? ((stats?.completed || 0) / stats.total * 100).toFixed(1) 
                      : 0}%
                  </h5>
                </div>
              </div>
              <hr />
              <div className="text-center">
                <p className="text-muted small mb-0">
                  Report generated on {new Date().toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundReports;