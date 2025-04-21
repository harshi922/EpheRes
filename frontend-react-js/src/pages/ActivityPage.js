import React, { useState, useEffect } from "react";
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';

// Import components
import NavigationBar from '../components/NavigationBar';
import ExpenseFeed from '../components/ExpenseFeed';
import ExpenseFilter from '../components/ExpenseFilter';

const ActivityPage = () => {
  const [activities, setActivities] = useState([]);
  const [user, setUser] = useState(null);
  const [filterCriteria, setFilterCriteria] = useState({
    category: '',
    dateRange: 'all',
    searchTerm: ''
  });
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

  const loadActivities = async () => {
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
      
      let url = `${process.env.REACT_APP_BACKEND_URL}/api/expenses/home`;
      
      // If there's a search term, use the search endpoint
      if (filterCriteria.searchTerm) {
        url = `${process.env.REACT_APP_BACKEND_URL}/api/expenses/search?term=${encodeURIComponent(filterCriteria.searchTerm)}`;
      }
      
      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      
      if (res.status === 200) {
        const data = await res.json();
        console.log(data)
        
        // Apply filters in the frontend
        let filteredData = [...data];
        
        // Filter by category if selected
        if (filterCriteria.category) {
          filteredData = filteredData.filter(item => 
            item.category && item.category.toLowerCase() === filterCriteria.category.toLowerCase()
          );
        }
        
        // Filter by date range
        if (filterCriteria.dateRange !== 'all') {
          const now = new Date();
          const cutoffDate = new Date();
          
          if (filterCriteria.dateRange === 'week') {
            cutoffDate.setDate(now.getDate() - 7);
          } else if (filterCriteria.dateRange === 'month') {
            cutoffDate.setMonth(now.getMonth() - 1);
          } else if (filterCriteria.dateRange === 'year') {
            cutoffDate.setFullYear(now.getFullYear() - 1);
          }
          
          filteredData = filteredData.filter(item => {
            const itemDate = new Date(item.created_at);
            return itemDate >= cutoffDate;
          });
        }
        
        setActivities(filteredData);
      } else if (res.status === 401) {
        // Unauthorized - token may be invalid
        setError("Session expired. Please sign in again.");
        localStorage.removeItem('access_token');
        setTimeout(() => {
          window.location.href = "/signin";
        }, 2000);
      } else {
        setError("Failed to load activity data");
      }
    } catch (err) {
      console.log("Error loading activities:", err);
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
        await loadActivities();
      } else {
        // Redirect to sign in if not authenticated
        window.location.href = "/signin";
      }
    };
    
    initialize();
  }, []);
  
  // Reload activities when filter criteria change
  useEffect(() => {
    if (user) {
      loadActivities();
    }
  }, [filterCriteria]);

  const handleFilterChange = (newFilterCriteria) => {
    setFilterCriteria(newFilterCriteria);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="max-w-4xl mx-auto px-4 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Activity</h1>
        </div>
        
        {error ? (
          <div className="bg-red-100 p-4 rounded-lg text-red-700 mb-4">
            <p>{error}</p>
            <button 
              onClick={() => loadActivities()}
              className="mt-2 px-4 py-1 bg-red-600 text-white rounded-md"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <ExpenseFilter 
              criteria={filterCriteria} 
              onFilterChange={handleFilterChange} 
            />
            
            <ExpenseFeed 
              title="Recent Activity" 
              expenses={activities}
              currentUser={user}
              isLoading={isLoading}
            />
          </>
        )}
      </div>
      
      {/* Fixed Bottom Navigation */}
      <NavigationBar activeTab="activity" />
    </div>
  );
};

export default ActivityPage;