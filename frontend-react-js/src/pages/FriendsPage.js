import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';
import './FriendsPage.css';
import React, { useState, useEffect } from "react";

import NavigationBar from '../components/NavigationBar';
import {BalanceCard} from '../components/BalanceCard';
import ExpenseFeed from '../components/ExpenseFeed';
import PaymentForm from '../components/PaymentForm';

export default function FriendsPage() {
  const [expenses, setExpenses] = useState([]);
  const [friends, setFriends] = useState([]);
  const [paymentFormPopped, setPaymentFormPopped] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [addFriendFormVisible, setAddFriendFormVisible] = useState(false);
  const [newFriendEmail, setNewFriendEmail] = useState('');
  const [addFriendError, setAddFriendError] = useState('');
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

  const loadFriendData = async () => {
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
      
      // In a real application, this would be a true API call
      // For now, use mock data until a specific friends API endpoint is created
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const friendsData = [
        { handle: 'Worf', display_name: 'Worf', balance: '-42.75' },
        { handle: 'Riker', display_name: 'Will Riker', balance: '128.50' },
        { handle: 'Jadzia', display_name: 'Jadzia Dax', balance: '-15.33' }
      ];
      
      setFriends(friendsData);
      
      // Load expenses between you and the selected friend if any friend is selected
      if (selectedFriend) {
        await loadFriendExpenses(selectedFriend);
      }
    } catch (err) {
      console.log("Error loading friend data:", err);
      setError("Failed to load friends list. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const loadFriendExpenses = async (friendHandle) => {
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
      
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/expenses/@${friendHandle.handle}`, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`
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
        setError("Failed to load expense data");
      }
    } catch (err) {
      console.log("Error loading friend expenses:", err);
      setError("Connection error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle friend selection
  const handleFriendSelect = (friend) => {
    setSelectedFriend(friend);
    loadFriendExpenses(friend);
  };
  
  // Open payment form for a friend
  const handlePaymentClick = (friend) => {
    setSelectedFriend(friend);
    setPaymentFormPopped(true);
  };
  
  // Handle payment completion
  const handlePaymentComplete = async () => {
    setPaymentFormPopped(false);
    await loadFriendData(); // Reload all data
  };
  
  // Handle adding a new friend
  const handleAddFriend = async (e) => {
    e.preventDefault();
    setAddFriendError('');
    
    if (!newFriendEmail || !newFriendEmail.includes('@')) {
      setAddFriendError('Please enter a valid email address');
      return;
    }
    
    try {
      // Get the access token
      const token = localStorage.getItem('access_token');
      if (!token) {
        setAddFriendError("Authentication required");
        return;
      }
      
      // In a real app, this would call a friend invitation API
      // For mock purposes, we'll just add them to the list
      
      const newFriend = {
        handle: newFriendEmail.split('@')[0],
        display_name: newFriendEmail.split('@')[0],
        balance: '0.00'
      };
      
      setFriends([...friends, newFriend]);
      setNewFriendEmail('');
      setAddFriendFormVisible(false);
    } catch (err) {
      console.error("Error adding friend:", err);
      setAddFriendError("Failed to add friend. Please try again later.");
    }
  };
  
  // Filter friends based on search term
  const filteredFriends = searchTerm
    ? friends.filter(friend => 
        friend.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        friend.handle.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : friends;

  // Auth and data loading
  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    
    const initialize = async () => {
      const isAuthenticated = await checkAuth();
      
      if (isAuthenticated) {
        await loadFriendData();
      } else {
        // Redirect to sign in if not authenticated
        window.location.href = "/signin";
      }
    };
    
    initialize();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Payment Form Modal */}
      <PaymentForm
        popped={paymentFormPopped}
        setPopped={setPaymentFormPopped}
        recipient={selectedFriend}
        onSubmit={handlePaymentComplete}
      />
      
      {/* Add Friend Form Modal */}
      {addFriendFormVisible && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Add a Friend</h2>
              <form onSubmit={handleAddFriend}>
                <div className="mb-4">
                  <label htmlFor="friendEmail" className="block text-sm font-medium text-gray-700 mb-1">
                    Friend's Email
                  </label>
                  <input
                    type="email"
                    id="friendEmail"
                    placeholder="friend@example.com"
                    value={newFriendEmail}
                    onChange={(e) => setNewFriendEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                
                {addFriendError && (
                  <div className="mb-4 text-sm text-red-600">
                    {addFriendError}
                  </div>
                )}
                
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setAddFriendFormVisible(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600"
                  >
                    Send Invitation
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Friends</h1>
        </div>
        
        {error ? (
          <div className="bg-red-100 p-4 rounded-lg text-red-700 mb-4">
            <p>{error}</p>
            <button 
              onClick={loadFriendData} 
              className="mt-2 px-4 py-1 bg-red-600 text-white rounded-md"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='md:col-span-1'>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b">
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="font-medium text-gray-800">Friends</h2>
                    <button 
                      onClick={() => setAddFriendFormVisible(true)}
                      className="text-sm px-2 py-1 bg-green-500 text-white rounded"
                    >
                      + Add
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search friends"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full p-2 border rounded-md pr-8"
                    />
                    <svg className="absolute right-2 top-2.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                
                {isLoading && !selectedFriend ? (
                  <div className="p-4 text-center text-gray-600">
                    <div className="inline-block w-6 h-6 border-2 border-gray-200 border-t-green-500 rounded-full animate-spin mr-2"></div>
                    Loading friends...
                  </div>
                ) : filteredFriends.length > 0 ? (
                  <div className="max-h-[calc(100vh-240px)] overflow-y-auto">
                    {filteredFriends.map(friend => (
                      <div 
                        key={friend.handle} 
                        className={`p-4 border-b cursor-pointer hover:bg-gray-50 flex justify-between items-center ${
                          selectedFriend?.handle === friend.handle ? 'bg-gray-50' : ''
                        }`}
                        onClick={() => handleFriendSelect(friend)}
                      >
                        <div>
                          <div className="font-medium">{friend.display_name}</div>
                          <BalanceCard balance={friend.balance} />
                        </div>
                        <button 
                          className={`px-3 py-1 rounded text-white text-sm ${
                            parseFloat(friend.balance) < 0 ? 'bg-green-500' : 'bg-blue-500'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePaymentClick(friend);
                          }}
                        >
                          {parseFloat(friend.balance) < 0 ? 'Pay' : 'Request'}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : searchTerm ? (
                  <div className="p-6 text-center text-gray-500">
                    No friends match your search
                  </div>
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    <p>You haven't added any friends yet</p>
                    <button 
                      className="mt-3 px-4 py-2 bg-green-500 text-white rounded-md"
                      onClick={() => setAddFriendFormVisible(true)}
                    >
                      Add your first friend
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div className='md:col-span-2'>
              {selectedFriend ? (
                <ExpenseFeed 
                  title={`Expenses with ${selectedFriend.display_name}`} 
                  expenses={expenses}
                  currentUser={user}
                  isLoading={isLoading && !!selectedFriend}
                />
              ) : (
                <div className='bg-white rounded-lg shadow p-8 text-center text-gray-500 h-48 flex items-center justify-center'>
                  <p>Select a friend to view your shared expenses</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <NavigationBar />
    </div>
  );
}