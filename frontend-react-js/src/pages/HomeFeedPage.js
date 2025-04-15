'use client';

import { fetchAuthSession, getCurrentUser
} from 'aws-amplify/auth';

import './HomeFeedPage.css';
import React from "react";
import { useEffect, useState } from 'react';

import DesktopNavigation  from '../components/DesktopNavigation';
import DesktopSidebar     from '../components/DesktopSidebar';
import ActivityFeed from '../components/ActivityFeed';
import ActivityForm from '../components/ActivityForm';
import ReplyForm from '../components/ReplyForm';

// [TODO] Authenication
import Cookies from 'js-cookie'



export default function HomeFeedPage() {
  const [activities, setActivities] = React.useState([]);
  const [popped, setPopped] = React.useState(false);
  const [poppedReply, setPoppedReply] = React.useState(false);
  const [replyActivity, setReplyActivity] = React.useState({});
  const [user, setUser] = React.useState(null);
  const dataFetchedRef = React.useRef(false);
  const [currentSession, setSession] = useState();


  // const loadData = async () => {
  //   try {
  //     const backend_url = `${process.env.REACT_APP_BACKEND_URL}/api/activities/home`
  //     const res = await fetch(backend_url, {
  //       method: "GET"
  //     });
  //     let resJson = await res.json();
  //     if (res.status === 200) {
  //       setActivities(resJson)
  //     } else {
  //       console.log(res)
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

// // check if we are authenticated
// const checkAuth = async () => {
//   try {
//     const currentSession = await fetchAuthSession();
//     setSession(currentSession);
//   } catch (error) {
//     console.log(error);
//   }
// };


  // React.useEffect(()=>{
  //   //prevents double call
  //   if (dataFetchedRef.current) return;
  //   dataFetchedRef.current = true;

  //   loadData();
  //   checkAuth();
  // }, [])
  // React.useEffect(() => {
  //   // Check if we're authenticated first
  //   checkAuth().then(() => {
  //     if (session) {
  //       loadData();
  //     } else {
  //       // If not authenticated, redirect to sign-in
  //       window.location.href = "/signin";
  //     }
  //   });
  // }, [session]);
// Update checkAuth function to get both session and user info
// const checkAuth = async () => {
//   try {
//     // Get the session (contains tokens)
//     const currentSession = await fetchAuthSession();
//     setSession(currentSession);
    
//     // Get the user info (similar to what you had before)
//     const currentUser = await getCurrentUser();
//     console.log('user', currentUser);
    
//     // Set the user info like you did before
//     setUser({
//       display_name: currentUser.signInDetails?.userAttributes?.name,
//       handle: currentUser.signInDetails?.userAttributes?.preferred_username
//     });
    
//     return currentSession; // Return session so we can use it in useEffect
//   } catch (error) {
//     console.log('Not authenticated', error);
//     window.location.href = "/signin";
//     return null;
//   }
// };

const checkAuth = async () => {
  console.log("Starting checkAuth function");
  try {
    console.log("Attempting to fetch auth session");
    const currentSession = await fetchAuthSession();
    console.log("Auth session fetched successfully:", currentSession);
    setSession(currentSession);
    
    console.log("Attempting to get current user");
    const currentUser = await getCurrentUser();
    console.log("Current user retrieved:", currentUser);
    
    setUser({
      display_name: currentUser.signInDetails?.userAttributes?.name || currentUser.username,
      handle: currentUser.signInDetails?.userAttributes?.preferred_username || currentUser.username
    });
    
    return currentSession;
  } catch (error) {
    console.log("Error in checkAuth function:", error);
    // Don't redirect yet - let's see what's failing
    return null;
  }
};

// Update your useEffect to have more logging
React.useEffect(() => {
  console.log("Component mounted - starting auth check and data load");
  if (dataFetchedRef.current) {
    console.log("Data already fetched, skipping");
    return;
  }
  
  console.log("Setting dataFetchedRef to true");
  dataFetchedRef.current = true;
  
  console.log("Calling checkAuth");
  checkAuth()
    .then((session) => {
      console.log("checkAuth completed, session:", session ? "exists" : "null");
      if (session && session.tokens) {
        console.log("Session valid, calling loadData");
        loadData();
      } else {
        console.log("No valid session found");
      }
    })
    .catch((err) => {
      console.log('Error during authentication check:', err);
    });
}, []);

// Update your loadData function to use the access token
const loadData = async () => {
  try {
    const backend_url = `${process.env.REACT_APP_BACKEND_URL}/api/activities/home`;
    
    // Get the access token from localStorage or session
    const access_token = localStorage.getItem("access_token");
    
    const res = await fetch(backend_url, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      }
    });
    
    let resJson = await res.json();
    if (res.status === 200) {
      setActivities(resJson);
    } else {
      console.log(res);
    }
  } catch (err) {
    console.log(err);
  }
};

// Update your useEffect to check auth first, then load data
React.useEffect(() => {
  if (dataFetchedRef.current) return;
  dataFetchedRef.current = true;
  
  checkAuth()
    .then((session) => {
      if (session && session.tokens) {
        loadData();
      }
    })
    .catch((err) => {
      console.log('Error during authentication check:', err);
    });
}, []);

  return (
    <article>
      <DesktopNavigation user={user} active={'home'} setPopped={setPopped} />
      <div className='content'>
        <ActivityForm  
          popped={popped}
          setPopped={setPopped} 
          setActivities={setActivities} 
        />
        <ReplyForm 
          activity={replyActivity} 
          popped={poppedReply} 
          setPopped={setPoppedReply} 
          setActivities={setActivities} 
          activities={activities} 
        />
        <ActivityFeed 
          title="Home" 
          setReplyActivity={setReplyActivity} 
          setPopped={setPoppedReply} 
          activities={activities} 
        />
      </div>
      <DesktopSidebar user={user} />
    </article>
  );
}