// import './SignupPage.css';
// import React from "react";
// import { ReactComponent as Logo } from '../components/svg/logo.svg';
// import { Link } from "react-router-dom";
// import { signUp } from "aws-amplify/auth";

// export default function SignupPage() {
//   const [name, setName] = React.useState('');
//   const [email, setEmail] = React.useState('');
//   const [username, setUsername] = React.useState('');
//   const [password, setPassword] = React.useState('');
//   const [errors, setErrors] = React.useState('');
//   const [message, setMessage] = React.useState('');
  
//   const onsubmit = async (event) => {
//     event.preventDefault();
//     console.log('SignupPage.onsubmit');
//     setErrors('');
//     setMessage('');
    
//     try {
//       // Validate username format (not email)
//       if (username.includes('@')) {
//         setErrors('Username cannot be in email format');
//         return false;
//       }
      
//       // Email is required for activation
//       if (!email) {
//         setErrors('Email is required for account activation');
//         return false;
//       }
      
//       // Implement AWS Amplify signUp - use username as the Cognito username
//       const { isSignUpComplete, nextStep } = await signUp({
//         username: username, // Using the username field, not email
//         password: password,
//         options: {
//           userAttributes: {
//             email: email, // Required for activation code
//             name: name,
//             preferred_username: username
//           },
//           autoSignIn: {
//             authFlowType: 'USER_AUTH'
//           }
//         }
//       });
      
//       console.log("Sign up response:", isSignUpComplete, nextStep);
      
//       if (nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
//         console.log("Confirmation required");
//         console.log(
//           `Delivery medium: ${nextStep.codeDeliveryDetails.deliveryMedium}`,
//           `Destination: ${nextStep.codeDeliveryDetails.destination}`
//         );
        
//         // Store email in local storage for the confirmation page
//         localStorage.setItem('confirmEmail', email);
//         localStorage.setItem('confirmUsername', username);
        
//         // Redirect to confirmation page with params
//         window.location.href = `/confirm?username=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}`;
//       }
      
//       if (nextStep.signUpStep === 'DONE') {
//         console.log("Sign up complete");
//         setMessage('Sign up complete! Redirecting to sign in...');
//         setTimeout(() => {
//           window.location.href = "/signin";
//         }, 2000);
//       }
      
//     } catch (error) {
//       console.error("Sign up error:", error);
//       setErrors(error.message || 'An error occurred during sign up');
//     }
    
//     return false;
//   }
  
//   const name_onchange = (event) => {
//     setName(event.target.value);
//   }
  
//   const email_onchange = (event) => {
//     setEmail(event.target.value);
//   }
  
//   const username_onchange = (event) => {
//     setUsername(event.target.value);
//   }
  
//   const password_onchange = (event) => {
//     setPassword(event.target.value);
//   }
  
//   let el_errors;
//   if (errors){
//     el_errors = <div className='errors'>{errors}</div>;
//   }
  
//   let el_message;
//   if (message) {
//     el_message = <div className='success'>{message}</div>;
//   }
  
//   return (
//     <article className='signup-article'>
//       <div className='signup-info'>
//         <Logo className='logo' />
//       </div>
//       <div className='signup-wrapper'>
//         <form 
//           className='signup_form'
//           onSubmit={onsubmit}
//         >
//           <h2>Sign up to create a Cruddur account</h2>
//           <div className='fields'>
//             <div className='field text_field name'>
//               <label>Name</label>
//               <input
//                 type="text"
//                 value={name}
//                 onChange={name_onchange} 
//               />
//             </div>
//             <div className='field text_field email'>
//               <label>Email (required for activation)</label>
//               <input
//                 type="email"
//                 value={email}
//                 onChange={email_onchange}
//                 required 
//               />
//             </div>
//             <div className='field text_field username'>
//               <label>Username</label>
//               <input
//                 type="text"
//                 value={username}
//                 onChange={username_onchange}
//                 required
//                 placeholder="Cannot contain @ symbol"
//               />
//             </div>
//             <div className='field text_field password'>
//               <label>Password</label>
//               <input
//                 type="password"
//                 value={password}
//                 onChange={password_onchange}
//                 required 
//               />
//             </div>
//           </div>
//           {el_errors}
//           {el_message}
//           <div className='submit'>
//             <button type='submit'>Sign Up</button>
//           </div>
//         </form>
//         <div className="already-have-an-account">
//           <span>
//             Already have an account?
//           </span>
//           <Link to="/signin">Sign in!</Link>
//         </div>
//       </div>
//     </article>
//   );
// }
import React, { useState } from "react";
import { ReactComponent as Logo } from '../components/svg/logo.svg';
import { Link } from "react-router-dom";
import { signUp } from "aws-amplify/auth";
import './SignupPage.css';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSignUp = async (event) => {
    event.preventDefault();
    setErrors('');
    setMessage('');
    setLoading(true);
    
    try {
      // Validate username format (not email)
      if (username.includes('@')) {
        setErrors('Username cannot be in email format');
        setLoading(false);
        return;
      }
      
      // Email is required for activation
      if (!email) {
        setErrors('Email is required for account activation');
        setLoading(false);
        return;
      }
      
      const { isSignUpComplete, nextStep } = await signUp({
        username: username, 
        password: password,
        options: {
          userAttributes: {
            email: email,
            name: name,
            preferred_username: username
          },
          autoSignIn: {
            authFlowType: 'USER_AUTH'
          }
        }
      });
      
      if (nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
        // Store email in local storage for the confirmation page
        localStorage.setItem('confirmEmail', email);
        localStorage.setItem('confirmUsername', username);
        
        // Redirect to confirmation page with params
        window.location.href = `/confirm?username=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}`;
      }
      
      if (nextStep.signUpStep === 'DONE') {
        setMessage('Sign up complete! Redirecting to sign in...');
        setTimeout(() => {
          window.location.href = "/signin";
        }, 2000);
      }
      
    } catch (error) {
      setErrors(error.message || 'An error occurred during sign up');
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
          <form onSubmit={handleSignUp} className="p-8">
            <h2 className="text-2xl font-bold text-white text-center mb-6">Create Account</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
                  Email (required for activation)
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
                <label htmlFor="username" className="block text-sm font-medium text-gray-400 mb-1">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Cannot contain @ symbol"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">
                  Password
                </label>
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
            
            {message && (
              <div className="mt-4 bg-green-900/50 text-green-200 px-4 py-3 rounded-lg text-sm">
                {message}
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-6 py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition duration-200 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>
          
          <div className="py-4 px-8 bg-gray-800 text-gray-400 text-center">
            Already have an account?{" "}
            <Link to="/signin" className="text-green-400 hover:text-green-300 font-medium">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}