'use client'
import { Amplify } from 'aws-amplify';
import './App.css';
import HomeFeedPage from './pages/HomeFeedPage';
import UserFeedPage from './pages/UserFeedPage';
import SignupPage from './pages/SignupPage';
import SigninPage from './pages/SigninPage';
import RecoverPage from './pages/RecoverPage';
import MessageGroupsPage from './pages/MessageGroupsPage';
import MessageGroupPage from './pages/MessageGroupPage';
import ConfirmationPage from './pages/ConfirmationPage';
import NotificationsFeedPage from './pages/NotificationsFeedPage'
import React from 'react';
import process from 'process';
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";


// Amplify.configure({
//   "AWS_PROJECT_REGION": process.env.REACT_APP_AWS_PROJECT_REGION,
//   // "aws_cognito_identity_pool_id": process.env.REACT_APP_AWS_COGNITO_IDENTITY_POOL_ID,
//   "aws_cognito_region": process.env.REACT_APP_AWS_COGNITO_REGION,
//   "aws_user_pools_id": process.env.REACT_APP_AWS_USER_POOLS_ID,
//   "aws_user_pools_web_client_id": process.env.REACT_APP_CLIENT_ID,
//   "oauth": {},
//   Auth: {
//     // We are not using an Identity Pool
//     // identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID, // REQUIRED - Amazon Cognito Identity Pool ID
//     region: process.env.REACT_APP_AWS_PROJECT_REGION,           // REQUIRED - Amazon Cognito Region
//     userPoolId: process.env.REACT_APP_AWS_USER_POOLS_ID,         // OPTIONAL - Amazon Cognito User Pool ID
//     userPoolWebClientId: process.env.REACT_APP_AWS_USER_POOLS_WEB_CLIENT_ID,   // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
//   }
// });
Amplify.configure({
  Auth: {
    Cognito: {
      // Amazon Cognito User Pool ID
      userPoolId: process.env.REACT_APP_AWS_USER_POOLS_ID,
      // Amazon Cognito Web Client ID
      userPoolClientId: process.env.REACT_APP_CLIENT_ID,
      // We are not using an Identity Pool as noted in the comment
      // identityPoolId: process.env.REACT_APP_AWS_COGNITO_IDENTITY_POOL_ID,
      region: process.env.REACT_APP_AWS_PROJECT_REGION,
      // No OAuth configuration specified in original
      loginWith: {
        // Empty OAuth object from original
        oauth: {}
      },
      username: true, 
      email: true,
    }
  }
});

const currentConfig = Amplify.getConfig();
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeFeedPage />
  },
  {
    path: "/@:handle",
    element: <UserFeedPage />
  },
  {
    path: "/messages",
    element: <MessageGroupsPage />
  },
  {
    path: "/notifications",
    element: <NotificationsFeedPage />
  },
  {
    path: "/messages/@:handle",
    element: <MessageGroupPage />
  },
  {
    path: "/signup",
    element: <SignupPage />
  },
  {
    path: "/signin",
    element: <SigninPage />
  },
  {
    path: "/confirm",
    element: <ConfirmationPage />
  },
  {
    path: "/forgot",
    element: <RecoverPage />
  }
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;