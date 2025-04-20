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
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';
import './HomeFeedPage.css';

import DesktopNavigation from '../components/DesktopNavigation';
import ExpenseFeed from '../components/ExpenseFeed';
import ExpenseForm from '../components/ExpenseForm';
import Summary from '../components/Summary';

export default function HomeFeedPage() {
  const [expenses, setExpenses] = useState([]);
  const [popped, setPopped] = useState(false);
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
          id: currentUser.username, // Use username as ID
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

  const loadExpenses = async () => {
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
      
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/expenses/home`, {
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
        setError("Failed to load expenses");
      }
    } catch (err) {
      console.log("Error loading expenses:", err);
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
        await loadExpenses();
      } else {
        // Redirect to sign in if not authenticated
        window.location.href = "/signin";
      }
    };
    
    initialize();
  }, []);
  
  // Handle search results
  const handleSearchResults = (results) => {
    if (results && Array.isArray(results)) {
      setExpenses(results);
    }
  };

  return (
    <article>
      <DesktopNavigation user={user} active={'home'} setPopped={setPopped} />
      <div className='content'>
        <ExpenseForm  
          popped={popped}
          setPopped={setPopped} 
          setExpenses={setExpenses} 
        />
        <div className='expense_sections'>
          <Summary user={user} />
          {error ? (
            <div className="bg-red-100 p-4 rounded-lg text-red-700 mb-4">
              {error}
            </div>
          ) : (
            <ExpenseFeed 
              title="Recent Activity" 
              expenses={expenses}
              currentUser={user}
              isLoading={isLoading}
              onRefresh={handleSearchResults}
            />
          )}
        </div>
      </div>
    </article>
  );
}