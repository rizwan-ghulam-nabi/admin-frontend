// 'use client';

// import { useState, useEffect } from 'react';
// import { useAuthStore } from '@/store/authStore';
// import Layout from '@/components/Layout';
// import toast from 'react-hot-toast';
// import { 
//   ShieldCheckIcon, 
//   KeyIcon, 
//   QrCodeIcon, 
//   CheckCircleIcon,
//   ExclamationTriangleIcon 
// } from '@heroicons/react/24/outline';
// import QRCode from 'qrcode';

// export default function SecurityPage() {
//   const { user, changePassword, enable2FA, verify2FA, disable2FA } = useAuthStore();
  
//   // Password change state
//   const [currentPassword, setCurrentPassword] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [passwordLoading, setPasswordLoading] = useState(false);
//   const [showPasswordForm, setShowPasswordForm] = useState(false);
  
//   // 2FA state
//   const [show2FASetup, setShow2FASetup] = useState(false);
//   const [twoFASecret, setTwoFASecret] = useState('');
//   const [twoFAQrCode, setTwoFAQrCode] = useState('');
//   const [twoFACode, setTwoFACode] = useState('');
//   const [twoFALoading, setTwoFALoading] = useState(false);
//   const [disableCode, setDisableCode] = useState('');
//   const [disableLoading, setDisableLoading] = useState(false);
//   const [showDisableConfirm, setShowDisableConfirm] = useState(false);
//   const [recoveryCodes, setRecoveryCodes] = useState([]);
//   const [showRecoveryCodes, setShowRecoveryCodes] = useState(false);

//   // Handle password change
//   const handlePasswordChange = async (e) => {
//     e.preventDefault();
    
//     if (!currentPassword || !newPassword || !confirmPassword) {
//       toast.error('Please fill in all fields');
//       return;
//     }
    
//     if (newPassword !== confirmPassword) {
//       toast.error('Passwords do not match');
//       return;
//     }
    
//     if (newPassword.length < 8) {
//       toast.error('Password must be at least 8 characters');
//       return;
//     }
    
//     if (currentPassword === newPassword) {
//       toast.error('New password must be different from current password');
//       return;
//     }
    
//     setPasswordLoading(true);
//     try {
//       await changePassword(currentPassword, newPassword);
//       toast.success('Password changed successfully');
//       setCurrentPassword('');
//       setNewPassword('');
//       setConfirmPassword('');
//       setShowPasswordForm(false);
//     } catch (error) {
//       toast.error(error.message || 'Failed to change password');
//     } finally {
//       setPasswordLoading(false);
//     }
//   };

//   // Handle enable 2FA
//   const handleEnable2FA = async () => {
//     setTwoFALoading(true);
//     try {
//       const data = await enable2FA();
//       setTwoFASecret(data.secret);
      
//       // Generate QR code
//       if (data.otpauthUrl || data.qrCode) {
//         const qrData = data.otpauthUrl || data.qrCode;
//         if (qrData.startsWith('otpauth://')) {
//           try {
//             const qrImage = await QRCode.toDataURL(qrData);
//             setTwoFAQrCode(qrImage);
//           } catch (error) {
//             console.error('QR generation error:', error);
//           }
//         } else if (qrData.startsWith('data:image')) {
//           setTwoFAQrCode(qrData);
//         }
//       }
      
//       setShow2FASetup(true);
//       toast.success('Scan the QR code with your authenticator app');
//     } catch (error) {
//       toast.error(error.message || 'Failed to setup 2FA');
//     } finally {
//       setTwoFALoading(false);
//     }
//   };

//   // Handle verify 2FA
//   const handleVerify2FA = async (e) => {
//     e.preventDefault();
    
//     if (!twoFACode || twoFACode.length !== 6) {
//       toast.error('Please enter a valid 6-digit code');
//       return;
//     }
    
//     setTwoFALoading(true);
//     try {
//       const response = await verify2FA(twoFACode);
      
//       // Store recovery codes if provided
//       if (response.data?.backupCodes) {
//         setRecoveryCodes(response.data.backupCodes);
//         setShowRecoveryCodes(true);
//       }
      
//       toast.success('2FA enabled successfully!');
      
//       // Reset state
//       setShow2FASetup(false);
//       setTwoFACode('');
//       setTwoFASecret('');
//       setTwoFAQrCode('');
      
//       // Refresh user data
//       setTimeout(() => {
//         window.location.reload();
//       }, 2000);
//     } catch (error) {
//       toast.error(error.message || 'Invalid verification code');
//     } finally {
//       setTwoFALoading(false);
//     }
//   };

//   // Handle disable 2FA
//   const handleDisable2FA = async (e) => {
//     e.preventDefault();
    
//     if (!disableCode || disableCode.length !== 6) {
//       toast.error('Please enter a valid 6-digit code');
//       return;
//     }
    
//     setDisableLoading(true);
//     try {
//       await disable2FA(disableCode);
//       toast.success('2FA disabled successfully');
//       setShowDisableConfirm(false);
//       setDisableCode('');
      
//       // Refresh user data
//       setTimeout(() => {
//         window.location.reload();
//       }, 1500);
//     } catch (error) {
//       toast.error(error.message || 'Failed to disable 2FA');
//     } finally {
//       setDisableLoading(false);
//     }
//   };

//   // Copy recovery codes
//   const copyRecoveryCodes = () => {
//     navigator.clipboard.writeText(recoveryCodes.join('\n'));
//     toast.success('Recovery codes copied to clipboard');
//   };

//   // Download recovery codes
//   const downloadRecoveryCodes = () => {
//     const content = `Recovery Codes for ${user?.email}\nGenerated: ${new Date().toLocaleDateString()}\n\n${recoveryCodes.join('\n')}`;
//     const blob = new Blob([content], { type: 'text/plain' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'recovery-codes.txt';
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   return (
//     <Layout>
//       <div className="max-w-3xl mx-auto">
//         <h1 className="text-2xl font-semibold text-gray-900">Security Settings</h1>
//         <p className="mt-1 text-sm text-gray-500">
//           Manage your password and two-factor authentication settings
//         </p>
        
//         {/* Two-Factor Authentication Section */}
//         <div className="mt-6 bg-white shadow rounded-lg overflow-hidden">
//           <div className="px-4 py-5 sm:p-6">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center">
//                 <ShieldCheckIcon className="h-6 w-6 text-gray-400" />
//                 <div className="ml-3">
//                   <h3 className="text-lg font-medium text-gray-900">
//                     Two-Factor Authentication (2FA)
//                   </h3>
//                   <p className="text-sm text-gray-500">
//                     Add an extra layer of security to your account
//                   </p>
//                 </div>
//               </div>
//               {user?.twoFactorEnabled ? (
//                 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                   <CheckCircleIcon className="h-4 w-4 mr-1" />
//                   Enabled
//                 </span>
//               ) : (
//                 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
//                   Disabled
//                 </span>
//               )}
//             </div>
            
//             <div className="mt-4">
//               {user?.twoFactorEnabled ? (
//                 <div>
//                   {!showDisableConfirm ? (
//                     <button
//                       type="button"
//                       onClick={() => setShowDisableConfirm(true)}
//                       className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
//                     >
//                       Disable 2FA
//                     </button>
//                   ) : (
//                     <form onSubmit={handleDisable2FA} className="space-y-4 p-4 bg-gray-50 rounded-lg">
//                       <div className="flex items-center text-yellow-800">
//                         <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
//                         <p className="text-sm font-medium">
//                           Warning: Disabling 2FA will make your account less secure
//                         </p>
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700">
//                           Enter 2FA code to confirm
//                         </label>
//                         <input
//                           type="text"
//                           inputMode="numeric"
//                           pattern="[0-9]*"
//                           maxLength="6"
//                           required
//                           value={disableCode}
//                           onChange={(e) => setDisableCode(e.target.value.replace(/[^0-9]/g, ''))}
//                           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm text-center text-lg tracking-widest"
//                           placeholder="000000"
//                         />
//                       </div>
//                       <div className="flex space-x-3">
//                         <button
//                           type="submit"
//                           disabled={disableLoading || disableCode.length !== 6}
//                           className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
//                         >
//                           {disableLoading ? 'Disabling...' : 'Confirm Disable'}
//                         </button>
//                         <button
//                           type="button"
//                           onClick={() => {
//                             setShowDisableConfirm(false);
//                             setDisableCode('');
//                           }}
//                           className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
//                         >
//                           Cancel
//                         </button>
//                       </div>
//                     </form>
//                   )}
//                 </div>
//               ) : (
//                 <div>
//                   {!show2FASetup ? (
//                     <button
//                       type="button"
//                       onClick={handleEnable2FA}
//                       disabled={twoFALoading}
//                       className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
//                     >
//                       <QrCodeIcon className="h-5 w-5 mr-2" />
//                       {twoFALoading ? 'Setting up...' : 'Enable 2FA'}
//                     </button>
//                   ) : showRecoveryCodes ? (
//                     /* Recovery Codes Display */
//                     <div className="p-4 bg-green-50 rounded-lg">
//                       <h4 className="text-lg font-medium text-green-900 mb-2">
//                         🎉 2FA Successfully Enabled!
//                       </h4>
//                       <p className="text-sm text-green-700 mb-4">
//                         Save these recovery codes in a secure place. You can use them to access your account if you lose your authenticator device.
//                       </p>
//                       <div className="bg-white p-4 rounded border border-green-200 mb-4">
//                         <div className="grid grid-cols-2 gap-2">
//                           {recoveryCodes.map((code, index) => (
//                             <code key={index} className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
//                               {code}
//                             </code>
//                           ))}
//                         </div>
//                       </div>
//                       <div className="flex space-x-3">
//                         <button
//                           onClick={copyRecoveryCodes}
//                           className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
//                         >
//                           Copy All
//                         </button>
//                         <button
//                           onClick={downloadRecoveryCodes}
//                           className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
//                         >
//                           Download
//                         </button>
//                         <button
//                           onClick={() => {
//                             setShowRecoveryCodes(false);
//                             setRecoveryCodes([]);
//                           }}
//                           className="px-3 py-1.5 text-sm bg-primary-600 text-white rounded hover:bg-primary-700"
//                         >
//                           Done
//                         </button>
//                       </div>
//                     </div>
//                   ) : (
//                     /* 2FA Setup Form */
//                     <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
//                       <div className="text-center">
//                         <p className="text-sm text-gray-700 mb-3">
//                           Scan this QR code with Google Authenticator, Authy, or any TOTP-compatible app
//                         </p>
//                         {twoFAQrCode ? (
//                           <img 
//                             src={twoFAQrCode} 
//                             alt="2FA QR Code" 
//                             className="mx-auto w-48 h-48 border rounded-lg bg-white p-2"
//                           />
//                         ) : (
//                           <div className="mx-auto w-48 h-48 border rounded-lg bg-gray-100 flex items-center justify-center">
//                             <QrCodeIcon className="h-12 w-12 text-gray-400" />
//                           </div>
//                         )}
                        
//                         <div className="mt-4 p-3 bg-white rounded border">
//                           <p className="text-xs text-gray-500 mb-1">Manual setup code:</p>
//                           <code className="text-sm font-mono break-all select-all">
//                             {twoFASecret}
//                           </code>
//                         </div>
//                       </div>
                      
//                       <form onSubmit={handleVerify2FA}>
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Enter the 6-digit code from your app
//                           </label>
//                           <input
//                             type="text"
//                             inputMode="numeric"
//                             pattern="[0-9]*"
//                             maxLength="6"
//                             required
//                             value={twoFACode}
//                             onChange={(e) => setTwoFACode(e.target.value.replace(/[^0-9]/g, ''))}
//                             className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-center text-2xl tracking-widest"
//                             placeholder="000000"
//                             autoFocus
//                           />
//                         </div>
                        
//                         <div className="flex space-x-3 mt-4">
//                           <button
//                             type="submit"
//                             disabled={twoFALoading || twoFACode.length !== 6}
//                             className="flex-1 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
//                           >
//                             {twoFALoading ? (
//                               <>
//                                 <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
//                                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
//                                 </svg>
//                                 Verifying...
//                               </>
//                             ) : (
//                               'Verify & Enable'
//                             )}
//                           </button>
//                           <button
//                             type="button"
//                             onClick={() => {
//                               setShow2FASetup(false);
//                               setTwoFACode('');
//                               setTwoFASecret('');
//                               setTwoFAQrCode('');
//                             }}
//                             className="flex-1 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
//                           >
//                             Cancel
//                           </button>
//                         </div>
//                       </form>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Change Password Section */}
//         <div className="mt-6 bg-white shadow rounded-lg overflow-hidden">
//           <div className="px-4 py-5 sm:p-6">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center">
//                 <KeyIcon className="h-6 w-6 text-gray-400" />
//                 <div className="ml-3">
//                   <h3 className="text-lg font-medium text-gray-900">Password</h3>
//                   <p className="text-sm text-gray-500">
//                     Change your account password
//                   </p>
//                 </div>
//               </div>
//               {!showPasswordForm && (
//                 <button
//                   type="button"
//                   onClick={() => setShowPasswordForm(true)}
//                   className="text-sm text-primary-600 hover:text-primary-500"
//                 >
//                   Change
//                 </button>
//               )}
//             </div>
            
//             {showPasswordForm && (
//               <form onSubmit={handlePasswordChange} className="mt-4 space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">
//                     Current Password
//                   </label>
//                   <input
//                     type="password"
//                     required
//                     value={currentPassword}
//                     onChange={(e) => setCurrentPassword(e.target.value)}
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">
//                     New Password
//                   </label>
//                   <input
//                     type="password"
//                     required
//                     value={newPassword}
//                     onChange={(e) => setNewPassword(e.target.value)}
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
//                     minLength={8}
//                   />
//                   <p className="mt-1 text-xs text-gray-500">
//                     Minimum 8 characters
//                   </p>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">
//                     Confirm New Password
//                   </label>
//                   <input
//                     type="password"
//                     required
//                     value={confirmPassword}
//                     onChange={(e) => setConfirmPassword(e.target.value)}
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
//                   />
//                 </div>
                
//                 <div className="flex space-x-3 pt-2">
//                   <button
//                     type="submit"
//                     disabled={passwordLoading}
//                     className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
//                   >
//                     {passwordLoading ? (
//                       <>
//                         <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
//                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
//                         </svg>
//                         Changing...
//                       </>
//                     ) : (
//                       'Change Password'
//                     )}
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setShowPasswordForm(false);
//                       setCurrentPassword('');
//                       setNewPassword('');
//                       setConfirmPassword('');
//                     }}
//                     className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </form>
//             )}
//           </div>
//         </div>

//         {/* Session Info */}
//         <div className="mt-6 bg-white shadow rounded-lg overflow-hidden">
//           <div className="px-4 py-5 sm:p-6">
//             <h3 className="text-lg font-medium text-gray-900 mb-3">Session Information</h3>
//             <div className="space-y-2 text-sm">
//               <p className="text-gray-600">
//                 <span className="font-medium">Last Login:</span>{' '}
//                 {user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'N/A'}
//               </p>
//               <p className="text-gray-600">
//                 <span className="font-medium">Account Status:</span>{' '}
//                 <span className={user?.status === 'active' ? 'text-green-600' : 'text-red-600'}>
//                   {user?.status || 'active'}
//                 </span>
//               </p>
//               <p className="text-gray-600">
//                 <span className="font-medium">Role:</span>{' '}
//                 {user?.role?.name || 'Admin'}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// }








'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import { useAuthStore } from '@/store/authStore';
import { ShieldCheckIcon, KeyIcon, QrCodeIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import QRCode from 'qrcode';
import toast from 'react-hot-toast';

export default function SecurityPage() {
  const { user, changePassword, enable2FA, verify2FA, disable2FA } = useAuthStore();
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [twoFASecret, setTwoFASecret] = useState('');
  const [twoFAQr, setTwoFAQr] = useState('');
  const [twoFACode, setTwoFACode] = useState('');
  const [twoFALoading, setTwoFALoading] = useState(false);
  const [disableCode, setDisableCode] = useState('');
  const [disableLoading, setDisableLoading] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return toast.error('Passwords do not match');
    if (newPassword.length < 8) return toast.error('Password must be at least 8 characters');
    
    setPasswordLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      toast.success('Password changed successfully');
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
    } catch (error) {
      toast.error(error.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleEnable2FA = async () => {
    setTwoFALoading(true);
    try {
      const data = await enable2FA();
      setTwoFASecret(data.secret);
      const qr = await QRCode.toDataURL(data.otpauthUrl || data.qrCode);
      setTwoFAQr(qr);
      setShow2FASetup(true);
    } catch (error) {
      toast.error(error.message || 'Failed to setup 2FA');
    } finally {
      setTwoFALoading(false);
    }
  };

  const handleVerify2FA = async (e) => {
    e.preventDefault();
    setTwoFALoading(true);
    try {
      await verify2FA(twoFACode);
      toast.success('2FA enabled successfully');
      setShow2FASetup(false);
      window.location.reload();
    } catch (error) {
      toast.error(error.message || 'Invalid code');
    } finally {
      setTwoFALoading(false);
    }
  };

  const handleDisable2FA = async (e) => {
    e.preventDefault();
    setDisableLoading(true);
    try {
      await disable2FA(disableCode);
      toast.success('2FA disabled successfully');
      setDisableCode('');
      window.location.reload();
    } catch (error) {
      toast.error(error.message || 'Invalid code');
    } finally {
      setDisableLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">Security Settings</h1>
        
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center mb-4"><KeyIcon className="h-6 w-6 text-gray-400 mr-2" /><h3 className="text-lg font-medium">Change Password</h3></div>
          <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
            <div><label className="block text-sm font-medium text-gray-700">Current Password</label><input type="password" required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700">New Password</label><input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700">Confirm New Password</label><input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" /></div>
            <button type="submit" disabled={passwordLoading} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">{passwordLoading ? 'Changing...' : 'Change Password'}</button>
          </form>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center mb-4"><ShieldCheckIcon className="h-6 w-6 text-gray-400 mr-2" /><h3 className="text-lg font-medium">Two-Factor Authentication</h3></div>
          
          {user?.twoFactorEnabled ? (
            <div>
              <p className="text-green-600 mb-4 flex items-center"><CheckCircleIcon className="h-5 w-5 mr-1" /> 2FA is enabled</p>
              <form onSubmit={handleDisable2FA} className="space-y-4 max-w-md">
                <div><label className="block text-sm font-medium text-gray-700">Enter 2FA Code to Disable</label><input type="text" required value={disableCode} onChange={(e) => setDisableCode(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" placeholder="6-digit code" maxLength={6} /></div>
                <button type="submit" disabled={disableLoading} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50">{disableLoading ? 'Disabling...' : 'Disable 2FA'}</button>
              </form>
            </div>
          ) : (
            <div>
              {!show2FASetup ? (
                <button onClick={handleEnable2FA} disabled={twoFALoading} className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"><QrCodeIcon className="h-5 w-5 mr-2" />{twoFALoading ? 'Setting up...' : 'Enable 2FA'}</button>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm mb-3">Scan this QR code with Google Authenticator:</p>
                    {twoFAQr && <img src={twoFAQr} alt="QR Code" className="w-48 h-48 border rounded" />}
                    <p className="text-sm mt-3">Or enter manually: <code className="bg-gray-100 px-2 py-1 rounded">{twoFASecret}</code></p>
                  </div>
                  <form onSubmit={handleVerify2FA} className="space-y-4">
                    <div><label className="block text-sm font-medium text-gray-700">Enter 6-digit code</label><input type="text" required value={twoFACode} onChange={(e) => setTwoFACode(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" placeholder="123456" maxLength={6} /></div>
                    <div className="flex space-x-3">
                      <button type="submit" disabled={twoFALoading} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">{twoFALoading ? 'Verifying...' : 'Verify & Enable'}</button>
                      <button type="button" onClick={() => setShow2FASetup(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}