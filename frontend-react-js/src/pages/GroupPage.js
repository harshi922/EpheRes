import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';
import './GroupPage.css';
import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';

import DesktopNavigation from '../components/DesktopNavigation';
import ExpenseFeed from '../components/ExpenseFeed';
import ExpenseForm from '../components/ExpenseForm';
import Summary from '../components/Summary';
import NavigationBar from '../components/NavigationBar';

export default function GroupPage() {
  const [expenses, setExpenses] = useState([]);
  const [groupDetails, setGroupDetails] = useState(null);
  const [popped, setPopped] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const dataFetchedRef = React.useRef(false);
  const params = useParams();

  const checkAuth = async () => {
    try {
      const session = await fetchAuthSession();
      
      if (session && session.tokens && session.tokens.accessToken) {
        localStorage.setItem("access_token", session.tokens.accessToken.toString());
      }
      
      try {
        const currentUser = await getCurrentUser();
        
        setUser({
          display_name: currentUser.signInDetails?.userAttributes?.name || currentUser.username,
          handle: currentUser.signInDetails?.userAttributes?.preferred_username || currentUser.username
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

  const loadGroupData = async () => {
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
      
      // In a real app, this would fetch group details from the API
      // For now, we'll use a mock API call
      
      // First, get group details
      const mockGroupData = {
        uuid: params.groupId,
        name: 'Roommates',
        members: [
          { handle: 'andrewbrown', display_name: 'Andrew Brown' },
          { handle: 'worf', display_name: 'Worf' },
          { handle: 'jadzia', display_name: 'Jadzia Dax' }
        ],
        total_expenses: '453.25',
        your_balance: '-42.75'
      };
      
      setGroupDetails(mockGroupData);
      
      // Now fetch the group's expenses
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/groups/@${params.groupId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (response.status === 200) {
        const data = await response.json();
        setExpenses(data);
      } else if (response.status === 401) {
        // Unauthorized - token may be invalid
        setError("Session expired. Please sign in again.");
        localStorage.removeItem('access_token');
        setTimeout(() => {
          window.location.href = "/signin";
        }, 2000);
      } else {
        setError("Failed to load group expenses");
      }
    } catch (err) {
      console.error("Error loading group data:", err);
      setError("Connection error. Please try again later.");
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
        await loadGroupData();
      } else {
        // Redirect to sign in if not authenticated
        window.location.href = "/signin";
      }
    };
    
    initialize();
  }, [params.groupId]);

  return (
    <article>
      <NavigationBar user={user} active={'groups'} setPopped={setPopped} />
      <div className='content'>
        <ExpenseForm  
          popped={popped}
          setPopped={setPopped} 
          setExpenses={setExpenses}
          groupId={params.groupId}
        />
        
        {error ? (
          <div className="bg-red-100 p-4 rounded-lg text-red-700 mb-4">
            {error}
          </div>
        ) : isLoading ? (
          <div className="p-4 text-center">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-purple-500 rounded-full animate-spin mx-auto mb-2"></div>
            <p>Loading group data...</p>
          </div>
        ) : groupDetails && (
          <>
            <div className='group_header'>
              <h1>{groupDetails.name}</h1>
              <div className='group_stats'>
                <div className='stat'>
                  <span className='label'>Members:</span> 
                  <span className='value'>{groupDetails.members.length}</span>
                </div>
                <div className='stat'>
                  <span className='label'>Total:</span> 
                  <span className='value'>${groupDetails.total_expenses}</span>
                </div>
                <div className='stat'>
                  <span className='label'>Your balance:</span> 
                  <span className={`value ${parseFloat(groupDetails.your_balance) < 0 ? 'negative' : 'positive'}`}>
                    ${Math.abs(parseFloat(groupDetails.your_balance)).toFixed(2)}
                  </span>
                </div>
              </div>
              <button className='add_expense_button' onClick={() => setPopped(true)}>
                + Add Expense
              </button>
            </div>
            
            <ExpenseFeed 
              title="Group Expenses" 
              expenses={expenses}
              currentUser={user}
              isLoading={isLoading}
            />
          </>
        )}
      </div>
    </article>
  );
}