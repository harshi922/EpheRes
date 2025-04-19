import { fetchAuthSession, getCurrentUser, signOut } from 'aws-amplify/auth';
import './AccountPage.css';
import React from "react";

import DesktopNavigation from '../components/DesktopNavigation';
import CategoryGraph from '../components/CategoryGraph';
import Summary from '../components/Summary';

export default function AccountPage() {
  const [user, setUser] = React.useState(null);
  const [userData, setUserData] = React.useState(null);
  const [expenseStats, setExpenseStats] = React.useState(null);
  const dataFetchedRef = React.useRef(false);

  const checkAuth = async () => {
    try {
      const session = await fetchAuthSession();
      
      if (session && session.tokens && session.tokens.accessToken) {
        localStorage.setItem("access_token", session.tokens.accessToken.toString());
      }
      
      const currentUser = await getCurrentUser();
      
      setUser({
        display_name: currentUser.signInDetails?.userAttributes?.name || currentUser.username,
        handle: currentUser.signInDetails?.userAttributes?.preferred_username || currentUser.username,
        email: currentUser.signInDetails?.userAttributes?.email
      });
      
      return session;
    } catch (error) {
      console.log("Error in checkAuth function:", error);
      return null;
    }
  };

  const loadUserData = async () => {
    try {
      // In a real app, this would fetch user profile data
      // and expense statistics from the backend
      
      // Simulate user data
      setUserData({
        name: user.display_name,
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
    }
  };

  // Auth and data loading
  React.useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    
    checkAuth()
      .then((session) => {
        if (session && session.tokens) {
          loadUserData();
        }
      })
      .catch((err) => {
        console.log('Error during authentication check:', err);
      });
  }, []);
  
  React.useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut({ global: true });
      window.location.href = "/signin";
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <article>
      <DesktopNavigation user={user} active={'account'} />
      <div className='content'>
        <div className='account_container'>
          {userData && (
            <>
              <div className='account_header'>
                <div className='user_avatar'></div>
                <div className='user_info'>
                  <h2>{userData.name}</h2>
                  <p>@{userData.handle}</p>
                  <p>{userData.email}</p>
                  <p>Member since: {new Date(userData.joinDate).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className='account_sections'>
                <Summary user={user} />
                
                {expenseStats && (
                  <div className='expense_statistics'>
                    <h3>Your Expense Breakdown</h3>
                    <CategoryGraph expenseData={expenseStats.expensesByCategory} />
                  </div>
                )}
                
                <div className='account_settings'>
                  <h3>Account Settings</h3>
                  <div className='settings_option'>
                    <label>Default Currency</label>
                    <select defaultValue={userData.defaultCurrency}>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="CAD">CAD ($)</option>
                    </select>
                  </div>
                  
                  <button className='sign_out_button' onClick={handleSignOut}>
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </article>
  );
}