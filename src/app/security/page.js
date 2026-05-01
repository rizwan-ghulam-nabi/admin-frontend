'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import Layout from '@/components/Layout';
import toast from 'react-hot-toast';
import QRCode from 'qrcode';

export default function SecurityPage() {
  const { user, changePassword, enable2FA, verify2FA, disable2FA } = useAuthStore();
  
  // Password state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  
  // 2FA state
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [twoFASecret, setTwoFASecret] = useState('');
  const [twoFAQrCode, setTwoFAQrCode] = useState('');
  const [twoFACode, setTwoFACode] = useState('');
  const [twoFALoading, setTwoFALoading] = useState(false);
  const [showDisable2FA, setShowDisable2FA] = useState(false);
  const [disableCode, setDisableCode] = useState('');
  const [disableLoading, setDisableLoading] = useState(false);
  const [recoveryCodes, setRecoveryCodes] = useState([]);
  const [showRecoveryCodes, setShowRecoveryCodes] = useState(false);

  // Password handlers
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    
    if (currentPassword === newPassword) {
      toast.error('New password must be different from current password');
      return;
    }
    
    setPasswordLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      toast.success('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordForm(false);
    } catch (error) {
      toast.error(error.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  // 2FA handlers
  const handleEnable2FA = async () => {
    setTwoFALoading(true);
    try {
      const data = await enable2FA();
      setTwoFASecret(data.secret);
      
      if (data.otpauthUrl) {
        const qrImage = await QRCode.toDataURL(data.otpauthUrl);
        setTwoFAQrCode(qrImage);
      }
      
      setShow2FASetup(true);
      toast.success('Scan the QR code with your authenticator app');
    } catch (error) {
      toast.error(error.message || 'Failed to setup 2FA');
    } finally {
      setTwoFALoading(false);
    }
  };

  const handleVerify2FA = async (e) => {
    e.preventDefault();
    if (!twoFACode || twoFACode.length !== 6) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }
    
    setTwoFALoading(true);
    try {
      const response = await verify2FA(twoFACode);
      if (response.data?.backupCodes) {
        setRecoveryCodes(response.data.backupCodes);
        setShowRecoveryCodes(true);
        setShow2FASetup(false);
      }
      toast.success('2FA enabled successfully!');
    } catch (error) {
      toast.error(error.message || 'Invalid verification code');
    } finally {
      setTwoFALoading(false);
    }
  };

  const handleDisable2FA = async (e) => {
    e.preventDefault();
    if (!disableCode || disableCode.length !== 6) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }
    
    setDisableLoading(true);
    try {
      await disable2FA(disableCode);
      toast.success('2FA disabled successfully');
      setShowDisable2FA(false);
      setDisableCode('');
      window.location.reload();
    } catch (error) {
      toast.error(error.message || 'Failed to disable 2FA');
    } finally {
      setDisableLoading(false);
    }
  };

  const copyRecoveryCodes = () => {
    navigator.clipboard.writeText(recoveryCodes.join('\n'));
    toast.success('Recovery codes copied!');
  };

  const downloadRecoveryCodes = () => {
    const content = `Recovery Codes - ${user?.email}\nDate: ${new Date().toLocaleDateString()}\n\n${recoveryCodes.join('\n')}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recovery-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Security Settings</h1>
          <p className="text-gray-500 mt-1">Manage your password and authentication settings</p>
        </div>

        {/* Password Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Password</h3>
                  <p className="text-sm text-gray-500">Last changed: Never</p>
                </div>
              </div>
              {!showPasswordForm && (
                <button
                  onClick={() => setShowPasswordForm(true)}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Change Password
                </button>
              )}
            </div>

            {showPasswordForm && (
              <form onSubmit={handlePasswordChange} className="mt-6 space-y-4 border-t pt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    placeholder="Enter current password"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    placeholder="Enter new password"
                    minLength={8}
                  />
                  <p className="text-xs text-gray-400 mt-1">Minimum 8 characters</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    placeholder="Confirm new password"
                  />
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {passwordLoading ? 'Updating...' : 'Update Password'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordForm(false);
                      setCurrentPassword('');
                      setNewPassword('');
                      setConfirmPassword('');
                    }}
                    className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* 2FA Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-500">Add an extra layer of security</p>
                </div>
              </div>
              {user?.twoFactorEnabled ? (
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">Enabled</span>
              ) : (
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">Disabled</span>
              )}
            </div>

            <div className="mt-4">
              {user?.twoFactorEnabled ? (
                <div>
                  {!showDisable2FA ? (
                    <button
                      onClick={() => setShowDisable2FA(true)}
                      className="px-4 py-2 border border-red-300 text-red-700 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Disable 2FA
                    </button>
                  ) : (
                    <form onSubmit={handleDisable2FA} className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                      <p className="text-sm text-red-700 mb-3">⚠️ Enter your 2FA code to disable</p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          maxLength={6}
                          value={disableCode}
                          onChange={(e) => setDisableCode(e.target.value.replace(/[^0-9]/g, ''))}
                          className="w-32 px-3 py-2 border border-red-300 rounded-lg text-center text-lg tracking-widest"
                          placeholder="000000"
                        />
                        <button type="submit" disabled={disableLoading} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm">
                          {disableLoading ? '...' : 'Disable'}
                        </button>
                        <button type="button" onClick={() => { setShowDisable2FA(false); setDisableCode(''); }} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              ) : showRecoveryCodes ? (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-2">✅ 2FA Enabled!</h4>
                  <p className="text-sm text-green-700 mb-3">Save these recovery codes:</p>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {recoveryCodes.map((code, i) => (
                      <code key={i} className="text-xs bg-white px-2 py-1 rounded border font-mono">{code}</code>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={copyRecoveryCodes} className="px-3 py-1.5 bg-white border rounded text-sm hover:bg-gray-50">Copy</button>
                    <button onClick={downloadRecoveryCodes} className="px-3 py-1.5 bg-white border rounded text-sm hover:bg-gray-50">Download</button>
                    <button onClick={() => { setShowRecoveryCodes(false); setRecoveryCodes([]); window.location.reload(); }} className="px-3 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700">Done</button>
                  </div>
                </div>
              ) : show2FASetup ? (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                  {twoFAQrCode && (
                    <img src={twoFAQrCode} alt="QR Code" className="mx-auto w-48 h-48 rounded-lg bg-white p-2 border mb-4" />
                  )}
                  <p className="text-xs text-gray-500 text-center mb-2">Manual code: <code className="font-mono">{twoFASecret}</code></p>
                  <form onSubmit={handleVerify2FA} className="flex gap-2 justify-center">
                    <input
                      type="text"
                      maxLength={6}
                      value={twoFACode}
                      onChange={(e) => setTwoFACode(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-32 px-3 py-2 border rounded-lg text-center text-lg tracking-widest"
                      placeholder="000000"
                    />
                    <button type="submit" disabled={twoFALoading} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 text-sm">
                      Verify
                    </button>
                    <button type="button" onClick={() => { setShow2FASetup(false); setTwoFACode(''); }} className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm">
                      Cancel
                    </button>
                  </form>
                </div>
              ) : (
                <button
                  onClick={handleEnable2FA}
                  disabled={twoFALoading}
                  className="mt-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
                >
                  {twoFALoading ? 'Setting up...' : 'Enable 2FA'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Session Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Session Information</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Last Login</span>
                <span className="text-gray-900 font-medium">{user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'N/A'}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Account Status</span>
                <span className={`font-medium ${user?.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                  {user?.status || 'Active'}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500">Role</span>
                <span className="text-gray-900 font-medium">{user?.role?.name || 'Admin'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}