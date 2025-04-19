import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';
import './GroupsPage.css';
import React from "react";

import DesktopNavigation from '../components/DesktopNavigation';
import GroupsList from '../components/GroupsList';
import GroupForm from '../components/GroupForm';

export default function GroupsPage() {
  const [groups, setGroups] = React.useState([]);
  const [groupFormPopped, setGroupFormPopped] = React.useState(false);
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

  const loadGroups = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");
      
      if (!accessToken) {
        return;
      }
      
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/expense_groups`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      });
      
      if (res.status === 200) {
        const data = await res.json();
        setGroups(data);
      }
    } catch (err) {
      console.log("Error loading groups:", err);
    }
  };

  // Auth and data loading
  React.useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    
    checkAuth()
      .then((session) => {
        if (session && session.tokens) {
          loadGroups();
        }
      })
      .catch((err) => {
        console.log('Error during authentication check:', err);
      });
  }, []);

  return (
    <article>
      <DesktopNavigation user={user} active={'groups'} />
      <div className='content'>
        <GroupForm
          popped={groupFormPopped}
          setPopped={setGroupFormPopped}
          setGroups={setGroups}
        />
        <GroupsList
          title="Your Groups"
          groups={groups}
          setGroupFormPopped={setGroupFormPopped}
        />
      </div>
    </article>
  );
}