import React, { useState, useEffect } from "react";
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';

// Import components
import NavigationBar from '../components/NavigationBar';
import GroupsList from '../components/GroupsList';
import GroupForm from '../components/GroupForm';

const GroupsPage = () => {
  const [groups, setGroups] = useState([]);
  const [groupFormPopped, setGroupFormPopped] = useState(false);
  const [user, setUser] = useState(null);
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

  const loadGroups = async () => {
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
      
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/expense_groups`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (response.status === 200) {
        const data = await response.json();
        setGroups(data);
      } else if (response.status === 401) {
        // Unauthorized - token may be invalid
        setError("Session expired. Please sign in again.");
        localStorage.removeItem('access_token');
        setTimeout(() => {
          window.location.href = "/signin";
        }, 2000);
      } else {
        setError("Failed to load groups");
      }
    } catch (err) {
      console.log("Error loading groups:", err);
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
        await loadGroups();
      } else {
        // Redirect to sign in if not authenticated
        window.location.href = "/signin";
      }
    };
    
    initialize();
  }, []);

  // Handle new group creation
  const handleGroupCreated = (newGroup) => {
    setGroups(currentGroups => [newGroup, ...currentGroups]);
    loadGroups(); // Reload all groups to ensure we have the latest data
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Group Form Modal */}
      <GroupForm
        popped={groupFormPopped}
        setPopped={setGroupFormPopped}
        onSubmit={handleGroupCreated}
      />
      
      <div className="max-w-4xl mx-auto px-4 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Groups</h1>
        </div>
        
        {error ? (
          <div className="bg-red-100 p-4 rounded-lg text-red-700 mb-4">
            <p>{error}</p>
            <button 
              onClick={loadGroups}
              className="mt-2 px-4 py-1 bg-red-600 text-white rounded-md"
            >
              Try Again
            </button>
          </div>
        ) : (
          <GroupsList
            title="Your Groups"
            groups={groups}
            setGroupFormPopped={setGroupFormPopped}
            isLoading={isLoading}
          />
        )}
      </div>
      
      {/* Fixed Bottom Navigation */}
      <NavigationBar activeTab="groups" />
    </div>
  );
};

export default GroupsPage;