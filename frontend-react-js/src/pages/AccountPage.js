import React, { useState, useEffect } from "react";
import { fetchAuthSession, getCurrentUser, signOut } from 'aws-amplify/auth';
import { User, DollarSign, Settings, LogOut } from 'lucide-react';

// Import components
import NavigationBar from '../components/NavigationBar';
import CategoryGraph from '../components/CategoryGraph';

const AccountPage = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [expenseStats, setExpenseStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const dataFetchedRef = React.useRef(false);

  const checkAuth = async () => {
    try {
      const session = await fetchAuthSession();
      
      if (session && session.tokens && session.tokens.accessToken) {
        localStorage.setItem("access_token", session.tokens.accessToken.toString());
      }
      
      try {
        const currentUser = await getCurrentUser();
        setUser({
          handle: currentUser.username,
          email: currentUser.signInDetails?.loginId || currentUser.username
        });
        
        return true;
      } catch (error) {
        console.log("Error getting current user:", error);
        return false;
      }
    } catch (error) {
      console.log("Auth error:", error);
      return false;
    }
  };

  const loadUserData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get the access token
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError("Authentication required");
        setIsLoading(false);
        return;
      }
      
      // In a real app, this would fetch user profile data
      // and expense statistics from the backend
      
      // For now, simulate loading data
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simulate user data
      setUserData({
        handle: user.handle,
        email: user.email,
        joinDate: '2023-01-15',
        defaultCurrency: 'USD'
      });
      
      // Simulate expense statistics
      setExpenseStats({
        totalPaid: 1248.75,
        totalOwed: 876.25,
        netBalance: 372.50,
        expensesByCategory: [
          { category: 'Food & Drink', amount: 450.25 },
          { category: 'Housing', amount: 350.00 },
          { category: 'Transportation', amount: 125.75 },
          { category: 'Entertainment', amount: 200.50 },
          { category: 'Utilities', amount: 122.25 }
        ]
      });
    } catch (err) {
      console.log("Error loading user data:", err);
      setError("Failed to load user data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Auth and data loading
  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    
    const initialize = async () => {
      const isAuthenticated = await checkAuth();
      
      if (isAuthenticated) {
        await loadUserData();
      } else {
        // Redirect to sign in if not authenticated
        window.location.href = "/signin";
      }
    };
    
    initialize();
  }, []);
  
  // Load user data when user state changes
  useEffect(() => {
    if (user && !userData) {
      loadUserData();
    }
  }, [user, userData]);

  const handleSignOut = async () => {
    try {
      await signOut({ global: true });
      localStorage.removeItem("access_token");
      localStorage.removeItem("amplify_auth_is_signed_in");
      window.location.href = "/signin";
    } catch (error) {
      console.error('Error signing out:', error);
      setError("Failed to sign out. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="max-w-4xl mx-auto px-4 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Account</h1>
        </div>
        
        {error ? (
          <div className="bg-red-100 p-4 rounded-lg text-red-700 mb-4">
            <p>{error}</p>
            <button 
              onClick={loadUserData}
              className="mt-2 px-4 py-1 bg-red-600 text-white rounded-md"
            >
              Try Again
            </button>
          </div>
        ) : isLoading ? (
          <div className="p-4 text-center">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-green-500 rounded-full animate-spin mx-auto mb-2"></div>
            <p>Loading account data...</p>
          </div>
        ) : userData && (
          <div className="space-y-4">
            {/* User Profile Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex-shrink-0 mr-4 flex items-center justify-center">
                  <User size={32} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">@{userData.handle}</h2>
                  <p className="text-gray-600">{userData.email}</p>
                  <p className="text-gray-500 text-sm">Member since: {new Date(userData.joinDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            
            {/* Balance Summary */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <DollarSign size={20} className="mr-2" />
                Your Balance
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Total paid</p>
                  <p className="text-xl font-semibold text-gray-800">
                    ${expenseStats.totalPaid.toFixed(2)}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Total owed</p>
                  <p className="text-xl font-semibold text-green-600">
                    ${expenseStats.totalOwed.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <p className="text-gray-500">Net balance</p>
                  <p className={`text-xl font-semibold ${
                    expenseStats.netBalance > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ${expenseStats.netBalance.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Expense Breakdown */}
            {expenseStats && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Expense Breakdown</h3>
                <CategoryGraph expenseData={expenseStats.expensesByCategory} />
              </div>
            )}
            
            {/* Account Settings */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Settings size={20} className="mr-2" />
                Account Settings
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Default Currency</label>
                <select 
                  className="w-full p-2 border border-gray-300 rounded-md"
                  defaultValue={userData.defaultCurrency}
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="CAD">CAD ($)</option>
                </select>
              </div>
              
              <button 
                onClick={handleSignOut}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center"
              >
                <LogOut size={18} className="mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Fixed Bottom Navigation */}
      <NavigationBar activeTab="account" />
    </div>
  );
};

export default AccountPage;