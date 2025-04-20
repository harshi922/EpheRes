import React, { useState } from "react";
import { ReactComponent as Logo } from '../components/svg/logo.svg';
import { Link } from "react-router-dom";
import { resetPassword, confirmResetPassword } from "aws-amplify/auth";
import './RecoverPage.css';

export default function RecoverPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordAgain, setPasswordAgain] = useState('');
  const [code, setCode] = useState('');
  const [errors, setErrors] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState('send_code');

  const handleSendCode = async (event) => {
    event.preventDefault();
    setErrors('');
    setMessage('');
    setLoading(true);
    
    if (!username) {
      setErrors('Email is required');
      setLoading(false);
      return;
    }
    
    try {
      const output = await resetPassword({ username });
      
      // Check the next step
      if (output.nextStep.resetPasswordStep === 'CONFIRM_RESET_PASSWORD_WITH_CODE') {
        setMessage('Recovery code has been sent to your email');
        setFormState('confirm_code');
      }
    } catch (err) {
      setErrors(err.message || 'An error occurred when sending the recovery code');
    } finally {
      setLoading(false);
    }
  }

  const handleConfirmReset = async (event) => {
    event.preventDefault();
    setErrors('');
    setMessage('');
    setLoading(true);
    
    // Validate inputs
    if (!code) {
      setErrors('Recovery code is required');
      setLoading(false);
      return;
    }
    
    if (!password) {
      setErrors('New password is required');
      setLoading(false);
      return;
    }
    
    if (password !== passwordAgain) {
      setErrors('Passwords do not match');
      setLoading(false);
      return;
    }
    
    try {
      await confirmResetPassword({
        username,
        confirmationCode: code,
        newPassword: password
      });
      
      // If we get here, the password was reset successfully
      setMessage('Your password has been successfully reset!');
      setFormState('success');
    } catch (err) {
      setErrors(err.message || 'An error occurred when confirming your password reset');
    } finally {
      setLoading(false);
    }
  }

  const renderSendCodeForm = () => (
    <form onSubmit={handleSendCode} className="p-8">
      <h2 className="text-2xl font-bold text-white text-center mb-6">Reset Your Password</h2>
      
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-400 mb-1">
          Email
        </label>
        <input
          id="username"
          type="email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
      </div>
      
      {errors && (
        <div className="mt-4 bg-red-900/50 text-red-200 px-4 py-3 rounded-lg text-sm">
          {errors}
        </div>
      )}
      
      {message && (
        <div className="mt-4 bg-green-900/50 text-green-200 px-4 py-3 rounded-lg text-sm">
          {message}
        </div>
      )}
      
      <button
        type="submit"
        disabled={loading}
        className={`w-full mt-6 py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition duration-200 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {loading ? 'Sending Code...' : 'Send Recovery Code'}
      </button>
    </form>
  );

  const renderConfirmCodeForm = () => (
    <form onSubmit={handleConfirmReset} className="p-8">
      <h2 className="text-2xl font-bold text-white text-center mb-6">Reset Your Password</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-400 mb-1">
            Reset Code
          </label>
          <input
            id="code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Check your email for the code"
            required
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">
            New Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        
        <div>
          <label htmlFor="passwordAgain" className="block text-sm font-medium text-gray-400 mb-1">
            Confirm New Password
          </label>
          <input
            id="passwordAgain"
            type="password"
            value={passwordAgain}
            onChange={(e) => setPasswordAgain(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
      </div>
      
      {errors && (
        <div className="mt-4 bg-red-900/50 text-red-200 px-4 py-3 rounded-lg text-sm">
          {errors}
        </div>
      )}
      
      {message && (
        <div className="mt-4 bg-green-900/50 text-green-200 px-4 py-3 rounded-lg text-sm">
          {message}
        </div>
      )}
      
      <button
        type="submit"
        disabled={loading}
        className={`w-full mt-6 py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition duration-200 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {loading ? 'Resetting Password...' : 'Reset Password'}
      </button>
    </form>
  );

  const renderSuccessMessage = () => (
    <div className="p-8 text-center">
      <h2 className="text-2xl font-bold text-white text-center mb-6">Password Reset Successful</h2>
      
      <div className="mt-4 bg-green-900/50 text-green-200 px-4 py-3 rounded-lg text-sm mb-6">
        Your password has been successfully reset!
      </div>
      
      <Link
        to="/signin"
        className="inline-block w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition duration-200 text-center"
      >
        Return to Sign In
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-800 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Logo className="w-20 h-20 text-white opacity-80" />
        </div>
        
        <div className="bg-gray-900 rounded-lg shadow-xl overflow-hidden">
          {formState === 'send_code' && renderSendCodeForm()}
          {formState === 'confirm_code' && renderConfirmCodeForm()}
          {formState === 'success' && renderSuccessMessage()}
          
          {formState !== 'success' && (
            <div className="py-4 px-8 bg-gray-800 text-gray-400 text-center">
              <Link to="/signin" className="text-green-400 hover:text-green-300 font-medium">
                Back to Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}