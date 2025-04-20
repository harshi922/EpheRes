import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';
import './FriendsPage.css';
import React, { useState, useEffect } from "react";

import DesktopNavigation from '../components/DesktopNavigation';
import {BalanceCard, HomepageBalanceCard} from '../components/BalanceCard';
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
    <article>
      <DesktopNavigation user={user} active={'friends'} />
      <div className='content'>
        {/* Payment Form Modal */}
        <PaymentForm
          popped={paymentFormPopped}
          setPopped={setPaymentFormPopped}
          recipient={selectedFriend}
          onSubmit={handlePaymentComplete}
        />
        
        {/* Add Friend Form Modal */}
        {addFriendFormVisible && (
          <div className="add_friend_overlay">
            <div className="add_friend_form">
              <h2>Add a Friend</h2>
              <form onSubmit={handleAddFriend}>
                <div className="field">
                  <label>Friend's Email</label>
                  <input
                    type="email"
                    placeholder="friend@example.com"
                    value={newFriendEmail}
                    onChange={(e) => setNewFriendEmail(e.target.value)}
                    required
                  />
                </div>
                
                {addFriendError && <div className="errors">{addFriendError}</div>}
                
                <div className="form_actions">
                  <button type="submit">Send Invitation</button>
                  <button type="button" onClick={() => setAddFriendFormVisible(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {error ? (
          <div className="error_message">
            <p>{error}</p>
            <button onClick={loadFriendData}>Try Again</button>
          </div>
        ) : (
          <div className='friends_content'>
            <div className='friends_list'>
              <div className="friends_header">
                <h2>Friends</h2>
                <div className="search_and_add">
                  <input
                    type="text"
                    placeholder="Search friends"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search_input"
                  />
                  <button 
                    className="add_friend_button"
                    onClick={() => setAddFriendFormVisible(true)}
                  >
                    + Add
                  </button>
                </div>
              </div>
              
              {isLoading && !selectedFriend ? (
                <div className="loading_indicator">
                  <div className="spinner"></div>
                  <p>Loading friends...</p>
                </div>
              ) : filteredFriends.length > 0 ? (
                filteredFriends.map(friend => (
                  <div 
                    key={friend.handle} 
                    className={`friend_item ${selectedFriend?.handle === friend.handle ? 'selected' : ''}`}
                    onClick={() => handleFriendSelect(friend)}
                  >
                    <div className='friend_avatar'></div>
                    <div className='friend_info'>
                      <div className='friend_name'>{friend.display_name}</div>
                      <BalanceCard balance={friend.balance} />
                    </div>
                    <button 
                      className='pay_button' 
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePaymentClick(friend);
                      }}
                    >
                      {parseFloat(friend.balance) < 0 ? 'Pay' : 'Request'}
                    </button>
                  </div>
                ))
              ) : searchTerm ? (
                <div className="no_results">
                  <p>No friends match your search</p>
                </div>
              ) : (
                <div className="no_friends">
                  <p>You haven't added any friends yet</p>
                  <button 
                    className="add_first_friend"
                    onClick={() => setAddFriendFormVisible(true)}
                  >
                    Add your first friend
                  </button>
                </div>
              )}
            </div>
            
            <div className='friend_expenses'>
              {selectedFriend ? (
                <ExpenseFeed 
                  title={`Expenses with ${selectedFriend.display_name}`} 
                  expenses={expenses}
                  currentUser={user}
                  isLoading={isLoading && !!selectedFriend}
                />
              ) : (
                <div className='select_friend_prompt'>
                  <p>Select a friend to view your shared expenses</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}