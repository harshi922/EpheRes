// 'use client';

// import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';
// import './HomeFeedPage.css';
// import React from "react";
// import { useEffect, useState } from 'react';

// import DesktopNavigation from '../components/DesktopNavigation';
// import DesktopSidebar from '../components/DesktopSidebar';
// // import ActivityFeed from '../components/ActivityFeed';
// // import ActivityForm from '../components/ActivityForm';
// // import ReplyForm from '../components/ReplyForm';
// import ExpenseFeed from '../components/ExpenseFeed';
// import ExpenseForm from '../components/ExpenseForm';
// import Summary from '../components/Summary';
// export default function HomeFeedPage() {
//   const [activities, setActivities] = React.useState([]);
//   const [popped, setPopped] = React.useState(false);
//   // const [poppedReply, setPoppedReply] = React.useState(false);
//   // const [replyActivity, setReplyActivity] = React.useState({});
//     const [expenses, setExpenses] = React.useState([]);
//   const [user, setUser] = React.useState(null);
//   const dataFetchedRef = React.useRef(false);
//   const [currentSession, setSession] = useState(null);

//   const checkAuth = async () => {
//     console.log("Starting checkAuth function");
//     try {
//       console.log("Attempting to fetch auth session");
//       const session = await fetchAuthSession();
//       console.log("Auth session fetched successfully:", session);
//       setSession(session);
            
//       // Change this in your checkAuth function
//       if (session && session.tokens && session.tokens.accessToken) {
//         localStorage.setItem("access_token", session.tokens.accessToken.toString());
//         console.log("ID token stored in localStorage");
//       }
//       console.log("Attempting to get current user");
//       const currentUser = await getCurrentUser();
//       console.log("Current user retrieved:", currentUser);
      
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

//   const loadData = async () => {
//     try {
//       console.log("Loading data from backend");
//       const accessToken = localStorage.getItem("access_token");
      
//       if (!accessToken) {
//         console.log("No access token found in localStorage");
//         return;
//       }
      
//       const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/activities/home`, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           // 'Content-Type': 'application/json'
//         }
//       });
      
//       if (res.status === 200) {
//         const data = await res.json();
//         console.log("Data loaded successfully:", data.length, "activities");
//         setActivities(data);
//       } else {
//         console.log("Error loading data, status:", res.status);
//         if (res.status === 401) {
//           console.log("Unauthorized - token may be invalid");
//           // You might want to redirect to login or refresh the token here
//         }
//       }
//     } catch (err) {
//       console.log("Error in loadData function:", err);
//     }
//   };

//   // Only one useEffect to handle authentication and data loading
//   React.useEffect(() => {
//     console.log("Component mounted - starting auth check and data load");
//     if (dataFetchedRef.current) {
//       console.log("Data already fetched, skipping");
//       return;
//     }
    
//     console.log("Setting dataFetchedRef to true");
//     dataFetchedRef.current = true;
    
//     console.log("Calling checkAuth");
//     checkAuth()
//       .then((session) => {
//         console.log("checkAuth completed, session:", session ? "exists" : "null");
//         if (session && session.tokens) {
//           console.log("Session valid, calling loadData");
//           loadData();
//         } else {
//           console.log("No valid session found, redirecting to signin");
//           // Consider redirecting to sign-in page here
//           // window.location.href = "/signin";
//         }
//       })
//       .catch((err) => {
//         console.log('Error during authentication check:', err);
//       });
//   }, []);

//   return (
//     <article>
//       <DesktopNavigation user={user} active={'home'} setPopped={setPopped} />
//       <div className='content'>
//         {/* <ActivityForm  
//           popped={popped}
//           setPopped={setPopped} 
//           setActivities={setActivities} 
//         />
//         <ReplyForm 
//           activity={replyActivity} 
//           popped={poppedReply} 
//           setPopped={setPoppedReply} 
//           setActivities={setActivities} 
//           activities={activities} 
//         />
//         <ActivityFeed 
//           title="Home" 
//           setReplyActivity={setReplyActivity} 
//           setPopped={setPoppedReply} 
//           activities={activities} 
//         /> */}
//         <ExpenseForm  
//            popped={popped}
//            setPopped={setPopped} 
//            setExpenses={setExpenses} 
//          />
//          <div className='expense_sections'>
//            <Summary user={user} />
//            <ExpenseFeed 
//              title="Recent Activity" 
//              expenses={expenses} 
//            />
//          </div>
//       </div>
//       <DesktopSidebar user={user} />
//     </article>
//   );
// }
// // import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';
// // import './HomeFeedPage.css';
// // import React from "react";
// // import { useEffect, useState } from 'react';

// // import DesktopNavigation from '../components/DesktopNavigation';
// // import ExpenseFeed from '../components/ExpenseFeed';
// // import ExpenseForm from '../components/ExpenseForm';
// // import Summary from '../components/Summary';

// // export default function HomeFeedPage() {
//   const [expenses, setExpenses] = React.useState([]);
// //   const [popped, setPopped] = React.useState(false);
// //   const [user, setUser] = React.useState(null);
// //   const dataFetchedRef = React.useRef(false);
// //   const [currentSession, setSession] = useState(null);

// //   const checkAuth = async () => {
// //     try {
// //       const session = await fetchAuthSession();
// //       setSession(session);
            
// //       if (session && session.tokens && session.tokens.accessToken) {
// //         localStorage.setItem("access_token", session.tokens.accessToken.toString());
// //       }
      
// //       const currentUser = await getCurrentUser();
      
// //       setUser({
// //         display_name: currentUser.signInDetails?.userAttributes?.name || currentUser.username,
// //         handle: currentUser.signInDetails?.userAttributes?.preferred_username || currentUser.username
// //       });
      
// //       return session;
// //     } catch (error) {
// //       console.log("Error in checkAuth function:", error);
// //       return null;
// //     }
// //   };

// //   const loadData = async () => {
// //     try {
// //       const accessToken = localStorage.getItem("access_token");
      
// //       if (!accessToken) {
// //         return;
// //       }
      
// //       const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/expenses/home`, {
// //         method: "GET",
// //         headers: {
// //           Authorization: `Bearer ${accessToken}`,
// //         }
// //       });
      
// //       if (res.status === 200) {
// //         const data = await res.json();
// //         setExpenses(data);
// //       }
// //     } catch (err) {
// //       console.log("Error in loadData function:", err);
// //     }
// //   };

// //   // Auth and data loading
// //   React.useEffect(() => {
// //     if (dataFetchedRef.current) return;
// //     dataFetchedRef.current = true;
    
// //     checkAuth()
// //       .then((session) => {
// //         if (session && session.tokens) {
// //           loadData();
// //         }
// //       })
// //       .catch((err) => {
// //         console.log('Error during authentication check:', err);
// //       });
// //   }, []);

// //   return (
// //     <article>
// //       <DesktopNavigation user={user} active={'home'} setPopped={setPopped} />
// //       <div className='content'>
// //         <ExpenseForm  
// //           popped={popped}
// //           setPopped={setPopped} 
// //           setExpenses={setExpenses} 
// //         />
// //         <div className='expense_sections'>
// //           <Summary user={user} />
// //           <ExpenseFeed 
// //             title="Recent Activity" 
// //             expenses={expenses} 
// //           />
// //         </div>
// //       </div>
// //     </article>
// //   );
// // }



// 'use client';
// import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';
// import './HomeFeedPage.css';
// import React from "react";
// import { useEffect, useState } from 'react';
// import DesktopNavigation from '../components/DesktopNavigation';
// import DesktopSidebar from '../components/DesktopSidebar';
// import ExpenseFeed from '../components/ExpenseFeed';
// import ExpenseForm from '../components/ExpenseForm';
// import Summary from '../components/Summary';

// export default function HomeFeedPage() {
//   const [expenses, setExpenses] = React.useState([]);
//   const [popped, setPopped] = React.useState(false);
//   const [user, setUser] = React.useState(null);
//   const dataFetchedRef = React.useRef(false);
//   const [currentSession, setSession] = useState(null);

//   const checkAuth = async () => {
//     console.log("Starting checkAuth function");
//     try {
//       console.log("Attempting to fetch auth session");
//       const session = await fetchAuthSession();
//       console.log("Auth session fetched successfully:", session);
//       setSession(session);
            
//       if (session && session.tokens && session.tokens.accessToken) {
//         localStorage.setItem("access_token", session.tokens.accessToken.toString());
//         console.log("ID token stored in localStorage");
//       }
//       console.log("Attempting to get current user");
//       const currentUser = await getCurrentUser();
//       console.log("Current user retrieved:", currentUser);
      
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

//   const loadData = async () => {
//     try {
//       console.log("Loading data from backend");
//       const accessToken = localStorage.getItem("access_token");
      
//       if (!accessToken) {
//         console.log("No access token found in localStorage");
//         return;
//       }
      
//       // Updated endpoint to fetch expenses instead of activities
//       const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/expenses/home`, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         }
//       });
      
//       if (res.status === 200) {
//         const data = await res.json();
//         console.log("Data loaded successfully:", data.length, "expenses");
//         setExpenses(data);
//       } else {
//         console.log("Error loading data, status:", res.status);
//         if (res.status === 401) {
//           console.log("Unauthorized - token may be invalid");
//           // You might want to redirect to login or refresh the token here
//         }
//       }
//     } catch (err) {
//       console.log("Error in loadData function:", err);
//     }
//   };

//   React.useEffect(() => {
//     console.log("Component mounted - starting auth check and data load");
//     if (dataFetchedRef.current) {
//       console.log("Data already fetched, skipping");
//       return;
//     }
    
//     console.log("Setting dataFetchedRef to true");
//     dataFetchedRef.current = true;
    
//     console.log("Calling checkAuth");
//     checkAuth()
//       .then((session) => {
//         console.log("checkAuth completed, session:", session ? "exists" : "null");
//         if (session && session.tokens) {
//           console.log("Session valid, calling loadData");
//           loadData();
//         } else {
//           console.log("No valid session found, redirecting to signin");
//           // Consider redirecting to sign-in page here
//           window.location.href = "/signin";
//         }
//       })
//       .catch((err) => {
//         console.log('Error during authentication check:', err);
//       });
//   }, []);

//   return (
//     <article>
//       <DesktopNavigation user={user} active={'home'} setPopped={setPopped} />
//       <div className='content'>
//         <ExpenseForm  
//           popped={popped}
//           setPopped={setPopped} 
//           setExpenses={setExpenses} 
//         />
//         <div className='expense_sections'>
//           <Summary user={user} />
//           <ExpenseFeed 
//             title="Recent Activity" 
//             expenses={expenses} 
//           />
//         </div>
//       </div>
//       {/* <DesktopSidebar user={user} /> */}
//     </article>
//   );
// }

import React, { useState, useEffect } from 'react';
import { Search, Bell, UserCircle, Filter } from 'lucide-react';
import { HomepageBalanceCard } from './BalanceCard';
import ExpenseForm from './ExpenseForm';

const HomePage = ({ currentUser, expenses, onAddExpense }) => {
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [totalOwed, setTotalOwed] = useState(0);
  const [totalOwe, setTotalOwe] = useState(0);
  
  // Calculate balances and filter recent expenses on load
  useEffect(() => {
    // Get 5 most recent expenses
    setRecentExpenses(expenses.slice(0, 5));
    
    // Calculate total owed/owe from all expenses
    let owed = 0;
    let owe = 0;
    
    expenses.forEach(expense => {
      if (expense.paidBy.id === currentUser.id) {
        // You paid, so others owe you
        const yourShare = expense.participants.find(p => p.id === currentUser.id)?.amount || 0;
        owed += (expense.amount - yourShare);
      } else {
        // Someone else paid, you might owe them
        const yourShare = expense.participants.find(p => p.id === currentUser.id)?.amount || 0;
        owe += yourShare;
      }
    });
    
    setTotalOwed(owed);
    setTotalOwe(owe);
  }, [expenses, currentUser.id]);
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(amount));
  };
  
  // Format date
  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center">
          <UserCircle className="w-8 h-8 text-gray-700 mr-2" />
          <h1 className="text-xl font-semibold text-gray-800">Splitwise</h1>
        </div>
        <div className="flex">
          <button className="p-2 text-gray-600">
            <Search className="w-6 h-6" />
          </button>
          <button className="p-2 text-gray-600">
            <Bell className="w-6 h-6" />
          </button>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="p-4">
        {/* Balance Card */}
        <HomepageBalanceCard totalOwed={totalOwed} totalOwe={totalOwe} />
        
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
            <button className="text-gray-600">
              <Filter className="w-5 h-5" />
            </button>
          </div>
          
          {recentExpenses.length > 0 ? (
            <div>
              {recentExpenses.map(expense => {
                const isPayer = expense.paidBy.id === currentUser.id;
                const userShare = expense.participants.find(p => p.id === currentUser.id)?.amount || 0;
                const balance = isPayer ? (expense.amount - userShare) : -userShare;
                
                return (
                  <div key={expense.id} className="p-4 border-b flex items-start">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0 mr-3"></div>
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium text-gray-800">{expense.description}</h3>
                          <p className="text-sm text-gray-500">
                            {isPayer ? 'You paid' : `${expense.paidBy.name} paid`}
                            {expense.group && ` • ${expense.group.name}`}
                          </p>
                          <p className="text-xs text-gray-500">{formatDate(expense.date)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-800">{formatCurrency(expense.amount)}</p>
                          {balance !== 0 && (
                            <p className={`text-sm ${balance > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {balance > 0 
                                ? `you get back ${formatCurrency(balance)}` 
                                : `you owe ${formatCurrency(-balance)}`}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              <div className="p-3 text-center">
                <button className="text-green-600 font-medium">
                  View All
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <p>No expenses yet</p>
              <p className="mt-2">Add your first expense to get started</p>
            </div>
          )}
        </div>
      </main>
      
      {/* Expense Form Modal */}
      {showExpenseForm && (
        <div className="fixed inset-0 z-50">
          <ExpenseForm 
            onSubmit={data => {
              onAddExpense(data);
              setShowExpenseForm(false);
            }}
            onCancel={() => setShowExpenseForm(false)}
            currentUser={currentUser}
          />
        </div>
      )}
    </div>
  );
};

export default HomePage;