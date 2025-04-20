// import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';
// import './FriendsPage.css';
// import React from "react";

// import DesktopNavigation from '../components/DesktopNavigation';
// import BalanceCard from '../components/BalanceCard';
// import ExpenseFeed from '../components/ExpenseFeed';
// import PaymentForm from '../components/PaymentForm';

// export default function FriendsPage() {
//   const [expenses, setExpenses] = React.useState([]);
//   const [friends, setFriends] = React.useState([]);
//   const [paymentFormPopped, setPaymentFormPopped] = React.useState(false);
//   const [selectedFriend, setSelectedFriend] = React.useState(null);
//   const [user, setUser] = React.useState(null);
//   const dataFetchedRef = React.useRef(false);

//   const checkAuth = async () => {
//     try {
//       const session = await fetchAuthSession();
      
//       if (session && session.tokens && session.tokens.accessToken) {
//         localStorage.setItem("access_token", session.tokens.accessToken.toString());
//       }
      
//       const currentUser = await getCurrentUser();
      
//       setUser({
//         display_name: currentUser.signInDetails?.userAttributes?.name || currentUser.username,
//         handle: currentUser.signInDetails?.userAttributes?.preferred_username || currentUser.username
//       });
      
//       return session;
//     } catch (error) {
//       console.log("Error in checkAuth function:", error);
//       return null;
//     }
//   };

//   const loadFriendData = async () => {
//     try {
//       const accessToken = localStorage.getItem("access_token");
      
//       if (!accessToken) {
//         return;
//       }
      
//       // This would normally fetch from backend service user_activities
//       // Simulating for now
//       const friendsData = [
//         { handle: 'Worf', display_name: 'Worf', balance: '-42.75' },
//         { handle: 'Riker', display_name: 'Will Riker', balance: '128.50' },
//         { handle: 'Jadzia', display_name: 'Jadzia Dax', balance: '-15.33' }
//       ];
      
//       setFriends(friendsData);
      
//       // Load expenses between you and the selected friend if any friend is selected
//       if (selectedFriend) {
//         loadFriendExpenses(selectedFriend);
//       }
//     } catch (err) {
//       console.log("Error loading friend data:", err);
//     }
//   };
  
//   const loadFriendExpenses = async (friendHandle) => {
//     try {
//       const accessToken = localStorage.getItem("access_token");
      
//       if (!accessToken) {
//         return;
//       }
      
//       const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/expenses/@${friendHandle}`, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         }
//       });
      
//       if (res.status === 200) {
//         const data = await res.json();
//         setExpenses(data);
//       }
//     } catch (err) {
//       console.log("Error loading friend expenses:", err);
//     }
//   };

//   // Handle friend selection
//   const handleFriendSelect = (friend) => {
//     setSelectedFriend(friend);
//     loadFriendExpenses(friend.handle);
//   };
  
//   // Open payment form for a friend
//   const handlePaymentClick = (friend) => {
//     setSelectedFriend(friend);
//     setPaymentFormPopped(true);
//   };

//   // Auth and data loading
//   React.useEffect(() => {
//     if (dataFetchedRef.current) return;
//     dataFetchedRef.current = true;
    
//     checkAuth()
//       .then((session) => {
//         if (session && session.tokens) {
//           loadFriendData();
//         }
//       })
//       .catch((err) => {
//         console.log('Error during authentication check:', err);
//       });
//   }, []);

//   return (
//     <article>
//       <DesktopNavigation user={user} active={'friends'} />
//       <div className='content'>
//         <PaymentForm
//           popped={paymentFormPopped}
//           setPopped={setPaymentFormPopped}
//           recipient={selectedFriend}
//           onSubmit={() => { 
//             setPaymentFormPopped(false);
//             loadFriendData();
//           }}
//         />
        
//         <div className='friends_content'>
//           <div className='friends_list'>
//             <h2>Friends</h2>
//             {friends.map(friend => (
//               <div 
//                 key={friend.handle} 
//                 className={`friend_item ${selectedFriend?.handle === friend.handle ? 'selected' : ''}`}
//                 onClick={() => handleFriendSelect(friend)}
//               >
//                 <div className='friend_avatar'></div>
//                 <div className='friend_info'>
//                   <div className='friend_name'>{friend.display_name}</div>
//                   <BalanceCard balance={friend.balance} />
//                 </div>
//                 <button 
//                   className='pay_button' 
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     handlePaymentClick(friend);
//                   }}
//                 >
//                   {parseFloat(friend.balance) < 0 ? 'Pay' : 'Request'}
//                 </button>
//               </div>
//             ))}
//           </div>
          
//           <div className='friend_expenses'>
//             {selectedFriend ? (
//               <ExpenseFeed 
//                 title={`Expenses with ${selectedFriend.display_name}`} 
//                 expenses={expenses} 
//               />
//             ) : (
//               <div className='select_friend_prompt'>
//                 Select a friend to view your shared expenses
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </article>
//   );
// }

import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';
import './FriendsPage.css';
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Plus, User, X } from 'lucide-react';
import DesktopNavigation from '../components/DesktopNavigation';

// Component for displaying a friend's balance
const FriendBalanceCard = ({ friend, onPayClick }) => {
  const { display_name, balance } = friend;
  const isPositive = parseFloat(balance) >= 0;
  const isNegative = parseFloat(balance) < 0;
  const isZero = parseFloat(balance) === 0;
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(amount));
  };

  return (
    <div className="flex items-center justify-between p-4 border-b">
      {/* Friend Avatar & Info */}
      <div className="flex items-center">
        <div className="w-10 h-10 bg-orange-400 rounded-full mr-3"></div>
        <div>
          <h3 className="font-medium text-gray-800">{display_name}</h3>
          <div className="text-sm">
            {isPositive && <span className="text-green-600">owes you {formatCurrency(balance)}</span>}
            {isNegative && <span className="text-red-600">you owe {formatCurrency(balance)}</span>}
            {isZero && <span className="text-gray-500">settled up</span>}
          </div>
        </div>
      </div>
      
      {/* Pay Button (only visible if there's a non-zero balance) */}
      {!isZero && (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onPayClick(friend);
          }}
          className="py-1 px-3 text-white bg-green-500 rounded-md text-sm font-medium"
        >
          {isPositive ? 'Request' : 'Pay'}
        </button>
      )}
    </div>
  );
};

// Payment form modal
const PaymentForm = ({ recipient, onClose, onSubmit }) => {
  const [amount, setAmount] = useState(
    recipient ? Math.abs(parseFloat(recipient.balance)).toFixed(2) : "0.00"
  );
  const [note, setNote] = useState('');
  const isNegative = recipient ? parseFloat(recipient.balance) < 0 : false;
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      friendId: recipient.handle,
      amount: parseFloat(amount),
      note,
      type: isNegative ? 'payment' : 'request'
    });
  };

  if (!recipient) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold text-center text-gray-800">
            {isNegative ? `Pay ${recipient.display_name}` : `Request payment from ${recipient.display_name}`}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Amount</label>
            <div className="flex items-center">
              <div className="bg-gray-100 py-2 px-3 rounded-l-md border border-r-0 border-gray-300">
                $
              </div>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="flex-1 p-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Note (optional)</label>
            <input
              type="text"
              placeholder="What's this payment for?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>
          
          <div className="flex justify-between gap-4">
            <button
              type="submit"
              className="flex-1 bg-green-500 text-white py-2 px-4 rounded-md font-medium"
            >
              {isNegative ? 'Pay' : 'Request'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Friend expenses view
const FriendExpenses = ({ friend, expenses, onBack }) => {
  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center p-4 border-b">
        <button onClick={onBack} className="mr-3">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <div>
          <h1 className="text-xl font-semibold text-gray-800">{friend.display_name}</h1>
          <p className={`text-sm ${parseFloat(friend.balance) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {parseFloat(friend.balance) >= 0 
              ? `owes you ${formatCurrency(parseFloat(friend.balance))}` 
              : `you owe ${formatCurrency(Math.abs(parseFloat(friend.balance)))}`}
          </p>
        </div>
      </div>
      
      {/* Expenses List */}
      <div className="flex-1 overflow-auto">
        {expenses.length > 0 ? (
          <div>
            {expenses.map(expense => (
              <div key={expense.id || expense.uuid} className="p-4 border-b">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium text-gray-800">{expense.description || expense.message}</h3>
                    <p className="text-sm text-gray-500">
                      {expense.paidBy?.handle === friend.handle ? `${friend.display_name} paid` : 'You paid'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(expense.date || expense.created_at)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">{formatCurrency(expense.amount)}</p>
                    <p className="text-sm text-gray-500">
                      {expense.paidBy?.handle === friend.handle 
                        ? `you owe ${formatCurrency(expense.userShare)}` 
                        : `${friend.display_name} owes ${formatCurrency(expense.friendShare)}`}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-4 text-gray-500">
            <p>No expenses with {friend.display_name} yet</p>
            <p className="mt-2">Add an expense to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Main FriendsPage component
export default function FriendsPage() {
  const [expenses, setExpenses] = useState([]);
  const [friends, setFriends] = useState([]);
  const [paymentFormPopped, setPaymentFormPopped] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [showAddFriendForm, setShowAddFriendForm] = useState(false);
  const [newFriendEmail, setNewFriendEmail] = useState('');
  const [user, setUser] = useState(null);
  const dataFetchedRef = useRef(false);

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
      
      // Try to fetch from API, fallback to sample data if it fails
      try {
        // Attempt to fetch from API
        // ...

        // For now, use sample data
        setSampleFriendData();
      } catch (err) {
        console.log("Error fetching from API, using sample data");
        setSampleFriendData();
      }
      
      // Load expenses if a friend is selected
      if (selectedFriend) {
        loadFriendExpenses(selectedFriend);
      }
    } catch (err) {
      console.log("Error loading friend data:", err);
    }
  };

  // Helper to set sample friend data
  const setSampleFriendData = () => {
    const friendsData = [
      { handle: 'worf', display_name: 'Worf', balance: '-42.75' },
      { handle: 'riker', display_name: 'Will Riker', balance: '128.50' },
      { handle: 'jadzia', display_name: 'Jadzia Dax', balance: '-15.33' }
    ];
    
    setFriends(friendsData);
  };
  
  const loadFriendExpenses = async (friend) => {
    try {
      const accessToken = localStorage.getItem("access_token");
      
      if (!accessToken) {
        return;
      }
      
      // Try to fetch expenses from API
      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/expenses/@${friend.handle}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          }
        });
        
        if (res.status === 200) {
          const data = await res.json();
          setExpenses(data);
        } else {
          // Fallback to sample data
          setSampleExpenses(friend);
        }
      } catch (err) {
        console.log("Error fetching expenses from API, using sample data");
        setSampleExpenses(friend);
      }
    } catch (err) {
      console.log("Error loading friend expenses:", err);
    }
  };

  // Helper to set sample expenses data
  const setSampleExpenses = (friend) => {
    setExpenses([
      {
        id: 101,
        description: 'Dinner at Olive Garden',
        amount: 53.45,
        paidBy: { handle: 'you', display_name: 'You' },
        userShare: 26.73,
        friendShare: 26.72,
        date: '2025-04-15'
      },
      {
        id: 102,
        description: 'Movie tickets',
        amount: 32.50,
        paidBy: { handle: friend.handle, display_name: friend.display_name },
        userShare: 16.25,
        friendShare: 16.25,
        date: '2025-04-10'
      }
    ]);
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

  // Handle payment submission
  const handlePaymentSubmit = (paymentData) => {
    // This would normally call your API
    console.log('Payment data:', paymentData);
    
    // Update local state to reflect payment
    const updatedFriends = friends.map(f => {
      if (f.handle === paymentData.friendId) {
        const currentBalance = parseFloat(f.balance);
        let newBalance;
        
        if (paymentData.type === 'payment') {
          // You're paying them, so your debt decreases
          newBalance = currentBalance + paymentData.amount;
        } else {
          // You're requesting money, which would increase what they owe you
          newBalance = currentBalance - paymentData.amount;
        }
        
        return {
          ...f,
          balance: newBalance.toFixed(2)
        };
      }
      return f;
    });
    
    setFriends(updatedFriends);
    setPaymentFormPopped(false);
    // In a real app you would reload the data from the server
  };

  // Handle adding a new friend
  const handleAddFriend = (e) => {
    e.preventDefault();
    
    if (newFriendEmail) {
      // In a real app, this would send an invitation to the email address
      const newFriend = {
        handle: newFriendEmail.split('@')[0].toLowerCase(),
        display_name: newFriendEmail.split('@')[0],
        balance: '0.00'
      };
      
      setFriends([...friends, newFriend]);
      setNewFriendEmail('');
      setShowAddFriendForm(false);
    }
  };

  // Auth and data loading
  useEffect(() => {
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

  // If a friend is selected and we're viewing their expenses
  if (selectedFriend && !paymentFormPopped) {
    return (
      <article>
        <DesktopNavigation user={user} active={'friends'} />
        <div className='content'>
          <FriendExpenses 
            friend={selectedFriend} 
            expenses={expenses} 
            onBack={() => setSelectedFriend(null)} 
          />
        </div>
      </article>
    );
  }

  return (
    <article>
      <DesktopNavigation user={user} active={'friends'} />
      <div className='content'>
        {/* Payment Form Modal */}
        {paymentFormPopped && selectedFriend && (
          <PaymentForm
            recipient={selectedFriend}
            onClose={() => setPaymentFormPopped(false)}
            onSubmit={handlePaymentSubmit}
          />
        )}
        
        {/* Add Friend Form Modal */}
        {showAddFriendForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-md overflow-hidden">
              <div className="p-4 border-b">
                <h2 className="text-xl font-semibold text-center text-gray-800">Add a friend</h2>
              </div>
              
              <form onSubmit={handleAddFriend} className="p-6">
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">Email</label>
                  <input
                    type="email"
                    placeholder="friend@example.com"
                    value={newFriendEmail}
                    onChange={(e) => setNewFriendEmail(e.target.value)}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>
                
                <div className="flex justify-between gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-green-500 text-white py-2 px-4 rounded-md font-medium"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddFriendForm(false)}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        <div className='flex flex-col'>
          {/* Header */}
          <div className="bg-white p-4 sticky top-0 z-10 shadow-sm">
            <h1 className="text-xl font-semibold text-gray-800">Friends</h1>
          </div>
          
          {/* Friends List */}
          <div className="flex-1 overflow-auto">
            <div className="bg-white mb-4">
              {friends.map(friend => (
                <div 
                  key={friend.handle} 
                  className={`friend_item ${selectedFriend?.handle === friend.handle ? 'selected' : ''}`}
                  onClick={() => handleFriendSelect(friend)}
                >
                  <FriendBalanceCard friend={friend} onPayClick={handlePaymentClick} />
                </div>
              ))}
            </div>
            
            {/* Add Friend Button */}
            <div className="p-4">
              <button 
                onClick={() => setShowAddFriendForm(true)}
                className="flex items-center justify-center w-full p-3 bg-white rounded-lg border border-gray-200 text-gray-700 font-medium"
              >
                <Plus className="w-5 h-5 mr-2 text-green-500" />
                Add a friend
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}