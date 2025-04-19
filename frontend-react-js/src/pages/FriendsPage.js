import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';
import './FriendsPage.css';
import React from "react";

import DesktopNavigation from '../components/DesktopNavigation';
import BalanceCard from '../components/BalanceCard';
import ExpenseFeed from '../components/ExpenseFeed';
import PaymentForm from '../components/PaymentForm';

export default function FriendsPage() {
  const [expenses, setExpenses] = React.useState([]);
  const [friends, setFriends] = React.useState([]);
  const [paymentFormPopped, setPaymentFormPopped] = React.useState(false);
  const [selectedFriend, setSelectedFriend] = React.useState(null);
  const [user, setUser] = React.useState(null);
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

  const loadFriendData = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");
      
      if (!accessToken) {
        return;
      }
      
      // This would normally fetch from backend service user_activities
      // Simulating for now
      const friendsData = [
        { handle: 'Worf', display_name: 'Worf', balance: '-42.75' },
        { handle: 'Riker', display_name: 'Will Riker', balance: '128.50' },
        { handle: 'Jadzia', display_name: 'Jadzia Dax', balance: '-15.33' }
      ];
      
      setFriends(friendsData);
      
      // Load expenses between you and the selected friend if any friend is selected
      if (selectedFriend) {
        loadFriendExpenses(selectedFriend);
      }
    } catch (err) {
      console.log("Error loading friend data:", err);
    }
  };
  
  const loadFriendExpenses = async (friendHandle) => {
    try {
      const accessToken = localStorage.getItem("access_token");
      
      if (!accessToken) {
        return;
      }
      
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/expenses/@${friendHandle}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      });
      
      if (res.status === 200) {
        const data = await res.json();
        setExpenses(data);
      }
    } catch (err) {
      console.log("Error loading friend expenses:", err);
    }
  };

  // Handle friend selection
  const handleFriendSelect = (friend) => {
    setSelectedFriend(friend);
    loadFriendExpenses(friend.handle);
  };
  
  // Open payment form for a friend
  const handlePaymentClick = (friend) => {
    setSelectedFriend(friend);
    setPaymentFormPopped(true);
  };

  // Auth and data loading
  React.useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    
    checkAuth()
      .then((session) => {
        if (session && session.tokens) {
          loadFriendData();
        }
      })
      .catch((err) => {
        console.log('Error during authentication check:', err);
      });
  }, []);

  return (
    <article>
      <DesktopNavigation user={user} active={'friends'} />
      <div className='content'>
        <PaymentForm
          popped={paymentFormPopped}
          setPopped={setPaymentFormPopped}
          recipient={selectedFriend}
          onSubmit={() => { 
            setPaymentFormPopped(false);
            loadFriendData();
          }}
        />
        
        <div className='friends_content'>
          <div className='friends_list'>
            <h2>Friends</h2>
            {friends.map(friend => (
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
            ))}
          </div>
          
          <div className='friend_expenses'>
            {selectedFriend ? (
              <ExpenseFeed 
                title={`Expenses with ${selectedFriend.display_name}`} 
                expenses={expenses} 
              />
            ) : (
              <div className='select_friend_prompt'>
                Select a friend to view your shared expenses
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}