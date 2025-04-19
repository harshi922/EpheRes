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



'use client'
import { Amplify } from 'aws-amplify';
import './App.css';
import HomeFeedPage from './pages/HomeFeedPage';
import GroupsPage from './pages/GroupsPage';
import GroupPage from './pages/GroupPage';
import FriendsPage from './pages/FriendsPage';
import ActivityPage from './pages/ActivityPage';
import AccountPage from './pages/AccountPage';
import SignupPage from './pages/SignupPage';
import SigninPage from './pages/SigninPage';
import RecoverPage from './pages/RecoverPage';
import ConfirmationPage from './pages/ConfirmationPage';
import React from 'react';
import process from 'process';
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";

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
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeFeedPage />
  },
  {
    path: "/groups",
    element: <GroupsPage />
  },
  {
    path: "/groups/:groupId",
    element: <GroupPage />
  },
  {
    path: "/friends",
    element: <FriendsPage />
  },
  {
    path: "/activity",
    element: <ActivityPage />
  },
  {
    path: "/account",
    element: <AccountPage />
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