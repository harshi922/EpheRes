// import './SigninPage.css';
// import React from "react";
// import {ReactComponent as Logo} from '../components/svg/logo.svg';
// import { Link } from "react-router-dom";
// import { signIn, fetchAuthSession, confirmSignIn } from 'aws-amplify/auth';

// // [TODO] Authenication
// import Cookies from 'js-cookie'

// export default function SigninPage() {

//   const [email, setEmail] = React.useState('');
//   const [password, setPassword] = React.useState('');
//   const [newPassword, setNewPassword] = React.useState('');
//   const [errors, setErrors] = React.useState('');
//   const [showNewPasswordField, setShowNewPasswordField] = React.useState(false);

//   const onsubmit = async (event) => {
//     setErrors('');
//     event.preventDefault();
    
//     try {
//       console.log("Attempting sign in with:", email);
//       const { isSignedIn, nextStep } = await signIn({
//         username: email,
//         password: password, 
//         options: {
//           authFlowType: 'USER_AUTH',
//           preferredChallenge: 'PASSWORD_SRP', // or 'PASSWORD'
//         },
//       });
      
//       console.log("Sign in response:", isSignedIn, nextStep);
      
//       if (nextStep.signInStep === "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED") {
//         console.log("New password required");
//         setShowNewPasswordField(true);
//         return;
//       }
      
//       if (nextStep.signInStep === "DONE") {
//         console.log("Successfully signed in, fetching session...");
//         const { tokens } = await fetchAuthSession();
//         console.log("Got tokens:", tokens ? "Yes" : "No");
        
//         if (tokens) {
//           const accessToken = tokens.accessToken.toString();
//           console.log("Storing access token:", accessToken.substring(0, 10) + "...");
//           localStorage.setItem("access_token", accessToken);
          
//           // We need to set this to true to make the home page work
//           localStorage.setItem("amplify_auth_is_signed_in", "true");
          
//           console.log("Redirecting to home page...");
//           window.location.href = "/";
//         }
//       }
//     } catch (error) {
//       console.error("Sign in error:", error);
//       if (error.code === 'UserNotConfirmedException') {
//         window.location.href = "/confirm";
//       }
//       setErrors(error.message || 'An error occurred during sign in');
//     }
    
//     return false;
//   }

//   const handleNewPasswordSubmit = async (event) => {
//     event.preventDefault();
//     try {
//       console.log("Submitting new password");
      
//       const result = await confirmSignIn({
//         challengeResponse: newPassword
//       });
      
//       console.log("New password set, result:", result);
      
//       if (result.nextStep.signInStep === "DONE") {
//         console.log("Successfully signed in with new password, fetching session...");
//         const { tokens } = await fetchAuthSession();
        
//         if (tokens) {
//           const accessToken = tokens.accessToken.toString();
//           localStorage.setItem("access_token", accessToken);
//           localStorage.setItem("amplify_auth_is_signed_in", "true");
          
//           console.log("Redirecting to home page...");
//           window.location.href = "/";
//         }
//       }
//     } catch (error) {
//       console.error("Error setting new password:", error);
//       setErrors(error.message || 'An error occurred while setting new password');
//     }
//   }

//   const email_onchange = (event) => {
//     setEmail(event.target.value);
//   }
  
//   const password_onchange = (event) => {
//     setPassword(event.target.value);
//   }
  
//   const newPassword_onchange = (event) => {
//     setNewPassword(event.target.value);
//   }

//   let el_errors;
//   if (errors){
//     el_errors = <div className='errors'>{errors}</div>;
//   }

//   return (
//     <article className="signin-article">
//       <div className='signin-info'>
//         <Logo className='logo' />
//       </div>
//       <div className='signin-wrapper'>
//         {!showNewPasswordField ? (
//           <form 
//             className='signin_form'
//             onSubmit={onsubmit}
//           >
//             <h2>Sign into your Cruddur account</h2>
//             <div className='fields'>
//               <div className='field text_field username'>
//                 <label>Email</label>
//                 <input
//                   type="text"
//                   value={email}
//                   onChange={email_onchange} 
//                 />
//               </div>
//               <div className='field text_field password'>
//                 <label>Password</label>
//                 <input
//                   type="password"
//                   value={password}
//                   onChange={password_onchange} 
//                 />
//               </div>
//             </div>
//             {el_errors}
//             <div className='submit'>
//               <Link to="/forgot" className="forgot-link">Forgot Password?</Link>
//               <button type='submit'>Sign In</button>
//             </div>
//           </form>
//         ) : (
//           <form 
//             className='signin_form'
//             onSubmit={handleNewPasswordSubmit}
//           >
//             <h2>Set New Password</h2>
//             <p>Your account requires a new password</p>
//             <div className='fields'>
//               <div className='field text_field password'>
//                 <label>New Password</label>
//                 <input
//                   type="password"
//                   value={newPassword}
//                   onChange={newPassword_onchange} 
//                 />
//               </div>
//             </div>
//             {el_errors}
//             <div className='submit'>
//               <button type='submit'>Set New Password</button>
//             </div>
//           </form>
//         )}
        
//         {!showNewPasswordField && (
//           <div className="dont-have-an-account">
//             <span>
//               Don't have an account?
//             </span>
//             <Link to="/signup">Sign up!</Link>
//           </div>
//         )}
//       </div>
//     </article>
//   );
// }



import './SigninPage.css';
import React, { useState } from "react";
import { ReactComponent as Logo } from '../components/svg/logo.svg';
import { Link } from "react-router-dom";
import { signIn, fetchAuthSession, confirmSignIn } from 'aws-amplify/auth';

export default function SigninPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errors, setErrors] = useState('');
  const [loading, setLoading] = useState(false);
  const [showNewPasswordField, setShowNewPasswordField] = useState(false);

  const handleSignIn = async (event) => {
    event.preventDefault();
    setErrors('');
    setLoading(true);
    
    try {
      const { isSignedIn, nextStep } = await signIn({
        username: email,
        password: password, 
        options: {
          authFlowType: 'USER_AUTH',
          preferredChallenge: 'PASSWORD_SRP',
        },
      });
      
      if (nextStep.signInStep === "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED") {
        setShowNewPasswordField(true);
        setLoading(false);
        return;
      }
      
      if (nextStep.signInStep === "DONE") {
        const { tokens } = await fetchAuthSession();
        
        if (tokens) {
          const accessToken = tokens.accessToken.toString();
          localStorage.setItem("access_token", accessToken);
          localStorage.setItem("amplify_auth_is_signed_in", "true");
          window.location.href = "/";
        }
      }
    } catch (error) {
      if (error.code === 'UserNotConfirmedException') {
        window.location.href = "/confirm";
      }
      setErrors(error.message || 'An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  }

  const handleNewPasswordSubmit = async (event) => {
    event.preventDefault();
    setErrors('');
    setLoading(true);
    
    try {
      const result = await confirmSignIn({
        challengeResponse: newPassword
      });
      
      if (result.nextStep.signInStep === "DONE") {
        const { tokens } = await fetchAuthSession();
        
        if (tokens) {
          const accessToken = tokens.accessToken.toString();
          localStorage.setItem("access_token", accessToken);
          localStorage.setItem("amplify_auth_is_signed_in", "true");
          window.location.href = "/";
        }
      }
    } catch (error) {
      setErrors(error.message || 'An error occurred while setting new password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-800 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Logo className="w-20 h-20 text-white opacity-80" />
        </div>
        
        <div className="bg-gray-900 rounded-lg shadow-xl overflow-hidden">
          {!showNewPasswordField ? (
            <form onSubmit={handleSignIn} className="p-8">
              <h2 className="text-2xl font-bold text-white text-center mb-6">Sign In</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                
                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">
                      Password
                    </label>
                    <Link to="/forgot" className="text-sm text-green-400 hover:text-green-300">
                      Forgot password?
                    </Link>
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              </div>
              
              {errors && (
                <div className="mt-4 bg-red-900/50 text-red-200 px-4 py-3 rounded-lg text-sm">
                  {errors}
                </div>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className={`w-full mt-6 py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition duration-200 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleNewPasswordSubmit} className="p-8">
              <h2 className="text-2xl font-bold text-white text-center mb-6">Set New Password</h2>
              <p className="text-gray-400 text-center mb-6">Your account requires a new password</p>
              
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-400 mb-1">
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              
              {errors && (
                <div className="mt-4 bg-red-900/50 text-red-200 px-4 py-3 rounded-lg text-sm">
                  {errors}
                </div>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className={`w-full mt-6 py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition duration-200 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Submitting...' : 'Set New Password'}
              </button>
            </form>
          )}
          
          {!showNewPasswordField && (
            <div className="py-4 px-8 bg-gray-800 text-gray-400 text-center">
              Don't have an account?{" "}
              <Link to="/signup" className="text-green-400 hover:text-green-300 font-medium">
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}