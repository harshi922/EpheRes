// 'use client'
// import { Amplify } from 'aws-amplify';
// import './App.css';
// import HomeFeedPage from './pages/HomeFeedPage';
// import UserFeedPage from './pages/UserFeedPage';
// import SignupPage from './pages/SignupPage';
// import SigninPage from './pages/SigninPage';
// import RecoverPage from './pages/RecoverPage';
// import MessageGroupsPage from './pages/MessageGroupsPage';
// import MessageGroupPage from './pages/MessageGroupPage';
// import ConfirmationPage from './pages/ConfirmationPage';
// import NotificationsFeedPage from './pages/NotificationsFeedPage'
// import React from 'react';
// import process from 'process';
// import {
//   createBrowserRouter,
//   RouterProvider
// } from "react-router-dom";


// Amplify.configure({
//   Auth: {
//     Cognito: {
//       // Amazon Cognito User Pool ID
//       userPoolId: process.env.REACT_APP_AWS_USER_POOLS_ID,
//       // Amazon Cognito Web Client ID
//       userPoolClientId: process.env.REACT_APP_CLIENT_ID,
//       // We are not using an Identity Pool as noted in the comment
//       // identityPoolId: process.env.REACT_APP_AWS_COGNITO_IDENTITY_POOL_ID,
//       region: process.env.REACT_APP_AWS_PROJECT_REGION,
//       // No OAuth configuration specified in original
//       loginWith: {
//         // Empty OAuth object from original
//         oauth: {}
//       },
//       username: true, 
//       email: true,
//     }
//   }
// });

// const currentConfig = Amplify.getConfig();
// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <HomeFeedPage />
//   },
//   {
//     path: "/groups",
//     element: <GroupsPage />
//   },
//   {
//     path: "/groups/:groupId",
//     element: <GroupPage />
//   },
//   {
//     path: "/friends",
//     element: <FriendsPage />
//   },
//   {
//     path: "/activity",
//     element: <ActivityPage />
//   },
//   {
//     path: "/account",
//     element: <AccountPage />
//   },
//   {
//     path: "/signup",
//     element: <SignupPage />
//   },
//   {
//     path: "/signin",
//     element: <SigninPage />
//   },
//   {
//     path: "/confirm",
//     element: <ConfirmationPage />
//   },
//   {
//     path: "/forgot",
//     element: <RecoverPage />
//   }
// ]);
// // const router = createBrowserRouter([
// //   {
// //     path: "/",
// //     element: <HomeFeedPage />
// //   },
// //   {
// //     path: "/@:handle",
// //     element: <UserFeedPage />
// //   },
// //   {
// //     path: "/messages",
// //     element: <MessageGroupsPage />
// //   },
// //   {
// //     path: "/notifications",
// //     element: <NotificationsFeedPage />
// //   },
// //   {
// //     path: "/messages/@:handle",
// //     element: <MessageGroupPage />
// //   },
// //   {
// //     path: "/signup",
// //     element: <SignupPage />
// //   },
// //   {
// //     path: "/signin",
// //     element: <SigninPage />
// //   },
// //   {
// //     path: "/confirm",
// //     element: <ConfirmationPage />
// //   },
// //   {
// //     path: "/forgot",
// //     element: <RecoverPage />
// //   }
// // ]);

// function App() {
//   return (
//     <>
//       <RouterProvider router={router} />
//     </>
//   );
// }

// export default App;



// 'use client'
// import { Amplify } from 'aws-amplify';
// import './App.css';
// import HomeFeedPage from './pages/HomeFeedPage';
// import GroupsPage from './pages/GroupsPage';
// import GroupPage from './pages/GroupPage';
// import FriendsPage from './pages/FriendsPage';
// import ActivityPage from './pages/ActivityPage';
// import AccountPage from './pages/AccountPage';
// import SignupPage from './pages/SignupPage';
// import SigninPage from './pages/SigninPage';
// import RecoverPage from './pages/RecoverPage';
// import ConfirmationPage from './pages/ConfirmationPage';
// import React from 'react';
// import process from 'process';
// import {
//   createBrowserRouter,
//   RouterProvider
// } from "react-router-dom";

// Amplify.configure({
//   Auth: {
//     Cognito: {
//       // Amazon Cognito User Pool ID
//       userPoolId: process.env.REACT_APP_AWS_USER_POOLS_ID,
//       // Amazon Cognito Web Client ID
//       userPoolClientId: process.env.REACT_APP_CLIENT_ID,
//       region: process.env.REACT_APP_AWS_PROJECT_REGION,
//       loginWith: {
//         oauth: {}
//       },
//       username: true, 
//       email: true,
//     }
//   }
// });

// const currentConfig = Amplify.getConfig();
// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <HomeFeedPage />
//   },
//   {
//     path: "/groups",
//     element: <GroupsPage />
//   },
//   {
//     path: "/groups/:groupId",
//     element: <GroupPage />
//   },
//   {
//     path: "/friends",
//     element: <FriendsPage />
//   },
//   {
//     path: "/activity",
//     element: <ActivityPage />
//   },
//   {
//     path: "/account",
//     element: <AccountPage />
//   },
//   {
//     path: "/signup",
//     element: <SignupPage />
//   },
//   {
//     path: "/signin",
//     element: <SigninPage />
//   },
//   {
//     path: "/confirm",
//     element: <ConfirmationPage />
//   },
//   {
//     path: "/forgot",
//     element: <RecoverPage />
//   }
// ]);

// function App() {
//   return (
//     <>
//       <RouterProvider router={router} />
//     </>
//   );
// }

// export default App;

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';
import ExpenseFeed from './components/ExpenseFeed';
import NavigationBar from './components/NavigationBar';
import FriendsPage from './pages/FriendsPage';
import GroupsPage from './pages/GroupsPage';
import GroupPage from './pages/GroupPage';
import ActivityPage from './pages/ActivityPage';
import AccountPage from './pages/AccountPage';
import SignupPage from './pages/SignupPage';
import SigninPage from './pages/SigninPage';
import RecoverPage from './pages/RecoverPage';
import ConfirmationPage from './pages/ConfirmationPage';
import ExpenseForm from './components/ExpenseForm';
import { HomepageBalanceCard } from './components/BalanceCard';
import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      // Amazon Cognito User Pool ID
      userPoolId: process.env.REACT_APP_AWS_USER_POOLS_ID,
      // Amazon Cognito Web Client ID
      userPoolClientId: process.env.REACT_APP_CLIENT_ID,
      region: process.env.REACT_APP_AWS_PROJECT_REGION,
      loginWith: {
        oauth: {}
      },
      username: true, 
      email: true,
    }
  }
});

const currentConfig = Amplify.getConfig();

const HomePage = ({ expenses, user, totalOwed, totalOwe, setShowExpenseForm }) => {
  return (
    <div className="pb-16">
      <div className="p-4">
        <HomepageBalanceCard totalOwed={totalOwed} totalOwe={totalOwe} />
      </div>
      <ExpenseFeed 
        expenses={expenses} 
        currentUser={user} 
        onAddExpense={() => setShowExpenseForm(true)} 
      />
    </div>
  );
};

const ActivityPageWrapper = ({ expenses, user }) => {
  return (
    <div className="pb-16">
      <ExpenseFeed 
        title="Recent Activity"
        expenses={expenses} 
        currentUser={user} 
      />
    </div>
  );
};

const App = () => {
  // State for modals
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  
  // Sample expenses data
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      description: 'Dinner at Olive Garden',
      amount: 53.45,
      paidBy: { id: 'you', name: 'You' },
      participants: [
        { id: 'you', name: 'You', amount: 17.82 },
        { id: 'naveen', name: 'Naveen Vanapalli', amount: 17.82 },
        { id: 'harshitaa', name: 'Harshitaa Yarramsetti', amount: 17.81 }
      ],
      group: { id: 1, name: 'Roommates' },
      created_at: '2025-04-15T12:00:00Z',
      category: 'Food & Drink'
    },
    {
      id: 2,
      description: 'Groceries',
      amount: 75.20,
      paidBy: { id: 'naveen', name: 'Naveen Vanapalli' },
      participants: [
        { id: 'you', name: 'You', amount: 25.07 },
        { id: 'naveen', name: 'Naveen Vanapalli', amount: 25.07 },
        { id: 'harshitaa', name: 'Harshitaa Yarramsetti', amount: 25.06 }
      ],
      group: { id: 1, name: 'Roommates' },
      created_at: '2025-04-12T12:00:00Z',
      category: 'Groceries'
    }
  ]);
  
  // Balance information
  const [totalOwed, setTotalOwed] = useState(128.50);
  const [totalOwe, setTotalOwe] = useState(42.75);
  
  // Check authentication on load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await fetchAuthSession();
        
        if (session && session.tokens && session.tokens.accessToken) {
          localStorage.setItem("access_token", session.tokens.accessToken.toString());
          
          try {
            const currentUser = await getCurrentUser();
            
            setUser({
              id: 'you',
              display_name: currentUser.signInDetails?.userAttributes?.name || currentUser.username,
              handle: currentUser.signInDetails?.userAttributes?.preferred_username || currentUser.username
            });
            
            setIsAuthenticated(true);
          } catch (error) {
            console.log("Error getting current user:", error);
            setupGuestUser();
          }
        } else {
          setupGuestUser();
        }
      } catch (error) {
        console.log("Auth error:", error);
        setupGuestUser();
      } finally {
        setIsAuthChecked(true);
      }
    };
    
    const setupGuestUser = () => {
      setUser({
        id: 'you',
        display_name: 'You',
        handle: 'you'
      });
      setIsAuthenticated(false);
    };
    
    checkAuth();
  }, []);
  
  // Handle adding a new expense
  const handleAddExpense = (expenseData) => {
    const newExpense = {
      id: expenses.length + 1,
      ...expenseData,
      created_at: new Date().toISOString()
    };
    
    setExpenses([newExpense, ...expenses]);
    setShowExpenseForm(false);
  };
  
  // Loading screen
  if (!isAuthChecked) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4 animate-spin"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route 
            path="/" 
            element={<HomePage 
              expenses={expenses} 
              user={user} 
              totalOwed={totalOwed} 
              totalOwe={totalOwe}
              setShowExpenseForm={setShowExpenseForm} 
            />} 
          />
          <Route path="/friends" element={<FriendsPage user={user} />} />
          <Route path="/groups" element={<GroupsPage />} />
          <Route path="/groups/:groupId" element={<GroupPage />} />
          <Route path="/activity" element={<ActivityPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signin" element={<SigninPage />} />
          <Route path="/confirm" element={<ConfirmationPage />} />
          <Route path="/forgot" element={<RecoverPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        
        {/* Navigation Bar */}
        <NavigationBar onAddExpenseClick={() => setShowExpenseForm(true)} />
        
        {/* Expense Form Modal */}
        {showExpenseForm && (
          <div className="fixed inset-0 z-50">
            <ExpenseForm 
              onSubmit={handleAddExpense} 
              onCancel={() => setShowExpenseForm(false)} 
              currentUser={user}
              friendsList={[
                { id: 'naveen', name: 'Naveen Vanapalli', balance: '-42.75' },
                { id: 'harshitaa', name: 'Harshitaa Yarramsetti', balance: '128.50' }
              ]}
              groupsList={[
                { 
                  id: 1, 
                  name: 'Roommates',
                  members: [
                    { id: 'you', name: 'You' },
                    { id: 'naveen', name: 'Naveen Vanapalli' },
                    { id: 'harshitaa', name: 'Harshitaa Yarramsetti' }
                  ]
                },
                {
                  id: 2,
                  name: 'Trip to Vegas',
                  members: [
                    { id: 'you', name: 'You' },
                    { id: 'naveen', name: 'Naveen Vanapalli' },
                    { id: 'jadzia', name: 'Jadzia Dax' },
                    { id: 'worf', name: 'Worf' }
                  ]
                }
              ]}
            />
          </div>
        )}
      </div>
    </Router>
  );
};

export default App;