import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';
import './ActivityPage.css';
import React from "react";

import DesktopNavigation from '../components/DesktopNavigation';
import ExpenseFilter from '../components/ExpenseFilter';
import ExpenseFeed from '../components/ExpenseFeed';

export default function ActivityPage() {
  const [activities, setActivities] = React.useState([]);
  const [user, setUser] = React.useState(null);
  const [filterCriteria, setFilterCriteria] = React.useState({
    category: '',
    dateRange: 'all',
    searchTerm: ''
  });
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
        handle: currentUser.signInDetails?.userAttributes?.preferred_username || currentUser.username
      });
      
      return session;
    } catch (error) {
      console.log("Error in checkAuth function:", error);
      return null;
    }
  };

  const loadActivities = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");
      
      if (!accessToken) {
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
          Authorization: `Bearer ${accessToken}`,
        }
      });
      
      if (res.status === 200) {
        const data = await res.json();
        
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
      }
    } catch (err) {
      console.log("Error loading activities:", err);
    }
  };

  // Auth and data loading
  React.useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    
    checkAuth()
      .then((session) => {
        if (session && session.tokens) {
          loadActivities();
        }
      })
      .catch((err) => {
        console.log('Error during authentication check:', err);
      });
  }, []);
  
  // Reload activities when filter criteria change
  React.useEffect(() => {
    if (user) {
      loadActivities();
    }
  }, [filterCriteria]);

  const handleFilterChange = (newFilterCriteria) => {
    setFilterCriteria(newFilterCriteria);
  };

  return (
    <article>
      <DesktopNavigation user={user} active={'activity'} />
      <div className='content'>
        <ExpenseFilter 
          criteria={filterCriteria} 
          onFilterChange={handleFilterChange} 
        />
        <ExpenseFeed 
          title="Recent Activity" 
          expenses={activities} 
        />
      </div>
    </article>
  );
}