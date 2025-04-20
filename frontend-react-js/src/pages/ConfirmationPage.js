import React, { useState, useEffect } from "react";
import { useParams, useLocation } from 'react-router-dom';
import { ReactComponent as Logo } from '../components/svg/logo.svg';
import { confirmSignUp, resendSignUpCode } from "aws-amplify/auth";
import './ConfirmationPage.css';

export default function ConfirmationPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [code, setCode] = useState('');
  const [errors, setErrors] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const params = useParams();
  const location = useLocation();

  useEffect(() => {
    // Get username and email from URL params or localStorage
    const queryParams = new URLSearchParams(location.search);
    const urlUsername = queryParams.get('username');
    const urlEmail = queryParams.get('email');
    
    if (urlUsername) {
      setUsername(urlUsername);
    } else {
      // Try to get username from localStorage as fallback
      const storedUsername = localStorage.getItem('confirmUsername');
      if (storedUsername) {
        setUsername(storedUsername);
      }
    }
    
    if (urlEmail) {
      setEmail(urlEmail);
    } else {
      // Try to get email from localStorage as fallback
      const storedEmail = localStorage.getItem('confirmEmail');
      if (storedEmail) {
        setEmail(storedEmail);
      }
    }
  }, [location]);

  const handleConfirm = async (event) => {
    event.preventDefault();
    setErrors('');
    setMessage('');
    setLoading(true);
    
    try {
      if (!username) {
        setErrors('Username is required');
        setLoading(false);
        return;
      }
      
      if (!code) {
        setErrors('Verification code is required');
        setLoading(false);
        return;
      }
      
      const { isSignUpComplete, nextStep } = await confirmSignUp({
        username: username,
        confirmationCode: code
      });
      
      if (nextStep.signUpStep === 'DONE' || isSignUpComplete) {
        setMessage('Account confirmed! Redirecting to sign in...');
        
        // Clear localStorage
        localStorage.removeItem('confirmEmail');
        localStorage.removeItem('confirmUsername');
        
        // Redirect to signin page after a short delay
        setTimeout(() => {
          window.location.href = "/signin";
        }, 2000);
      }
    } catch (err) {
      setErrors(err.message || 'An error occurred during confirmation');
    } finally {
      setLoading(false);
    }
  }
  
  const handleResendCode = async () => {
    setErrors('');
    setMessage('');
    setResending(true);
    
    if (!username) {
      setErrors('Username is required to resend the code');
      setResending(false);
      return;
    }
    
    try {
      await resendSignUpCode({
        username: username
      });
      
      setMessage('Verification code has been sent to your email');
    } catch (err) {
      setErrors(err.message || 'An error occurred while resending the code');
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-800 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Logo className="w-20 h-20 text-white opacity-80" />
        </div>
        
        <div className="bg-gray-900 rounded-lg shadow-xl overflow-hidden">
          <form onSubmit={handleConfirm} className="p-8">
            <h2 className="text-2xl font-bold text-white text-center mb-6">Confirm Your Account</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-400 mb-1">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  readOnly={!!username}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  readOnly={!!email}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-400 mb-1">
                  Verification Code
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
              {loading ? 'Confirming...' : 'Confirm Account'}
            </button>
          </form>
          
          <div className="py-4 px-8 bg-gray-800 text-gray-400 text-center">
            <button
              type="button"
              onClick={handleResendCode}
              disabled={resending}
              className="text-green-400 hover:text-green-300 font-medium focus:outline-none"
            >
              {resending ? 'Sending...' : 'Resend verification code'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}