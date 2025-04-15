// import './SignupPage.css';
// import React from "react";
// import {ReactComponent as Logo} from '../components/svg/logo.svg';
// import { Link } from "react-router-dom";

// // [TODO] Authenication
// import Cookies from 'js-cookie'

// export default function SignupPage() {

//   // Username is Eamil
//   const [name, setName] = React.useState('');
//   const [email, setEmail] = React.useState('');
//   const [username, setUsername] = React.useState('');
//   const [password, setPassword] = React.useState('');
//   const [errors, setErrors] = React.useState('');

//   const onsubmit = async (event) => {
//     event.preventDefault();
//     console.log('SignupPage.onsubmit')
//     // [TODO] Authenication
//     Cookies.set('user.name', name)
//     Cookies.set('user.username', username)
//     Cookies.set('user.email', email)
//     Cookies.set('user.password', password)
//     Cookies.set('user.confirmation_code',1234)
//     window.location.href = `/confirm?email=${email}`
//     return false
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
//               <label>Email</label>
//               <input
//                 type="text"
//                 value={email}
//                 onChange={email_onchange} 
//               />
//             </div>

//             <div className='field text_field username'>
//               <label>Username</label>
//               <input
//                 type="text"
//                 value={username}
//                 onChange={username_onchange} 
//               />
//             </div>

//             <div className='field text_field password'>
//               <label>Password</label>
//               <input
//                 type="password"
//                 value={password}
//                 onChange={password_onchange} 
//               />
//             </div>
//           </div>
//           {el_errors}
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

import './SignupPage.css';
import React from "react";
import {ReactComponent as Logo} from '../components/svg/logo.svg';
import { Link } from "react-router-dom";
import { signUp, confirmSignUp, resendSignUpCode } from "aws-amplify/auth";

export default function SignupPage() {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errors, setErrors] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const [code, setCode] = React.useState('');
  
  React.useEffect(() => {
    // Check if we're returning to confirm with username in URL
    const params = new URLSearchParams(window.location.search);
    const urlUsername = params.get('username');
    
    if (urlUsername) {
      setUsername(urlUsername);
      setShowConfirmation(true);
      
      // Try to get email from localStorage
      const storedEmail = localStorage.getItem('confirmEmail');
      if (storedEmail) {
        setEmail(storedEmail);
      }
    }
  }, []);
  
  const onsubmit = async (event) => {
    event.preventDefault();
    console.log('SignupPage.onsubmit');
    setErrors('');
    setMessage('');
    
    if (!showConfirmation) {
      // This is the SIGNUP form submission
      try {
        // Validate username format (not email)
        if (username.includes('@')) {
          setErrors('Username cannot be in email format');
          return false;
        }
        
        // Email is required for activation
        if (!email) {
          setErrors('Email is required for account activation');
          return false;
        }
        
        // Implement AWS Amplify signUp - use username as the Cognito username
        const { isSignUpComplete, nextStep } = await signUp({
          username: username, // Using the username field, not email
          password: password,
          options: {
            userAttributes: {
              email: email, // Required for activation code
              name: name,
              preferred_username: username
            },
            autoSignIn: {
              authFlowType: 'USER_AUTH'
            }
          }
        });
        
        console.log("Sign up response:", isSignUpComplete, nextStep);
        
        if (nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
          console.log("Confirmation required");
          console.log(
            `Delivery medium: ${nextStep.codeDeliveryDetails.deliveryMedium}`,
            `Destination: ${nextStep.codeDeliveryDetails.destination}`
          );
          
          // Store email in local storage for the confirmation page
          localStorage.setItem('confirmEmail', email);
          localStorage.setItem('confirmUsername', username);
          
          // Show confirmation form instead of redirecting
          setShowConfirmation(true);
          
          // Update URL to include username without reload
          window.history.pushState(
            {}, 
            '', 
            `/confirm?username=${username}&email=${encodeURIComponent(email)}`
          );
        }
        
        if (nextStep.signUpStep === 'DONE') {
          console.log("Sign up complete");
          window.location.href = "/signin";
        }
        
      } catch (error) {
        console.error("Sign up error:", error);
        setErrors(error.message || 'An error occurred during sign up');
      }
    } else {
      // This is the CONFIRMATION form submission
      try {
        if (!code) {
          setErrors('Verification code is required');
          return false;
        }
        
        console.log('Confirming signup for username:', username, 'with code:', code);
        
        const { isSignUpComplete, nextStep } = await confirmSignUp({
          username: username,
          confirmationCode: code
        });
        
        console.log('Confirmation result:', isSignUpComplete, nextStep);
        
        if (nextStep.signUpStep === 'DONE') {
          setMessage('Account confirmed! Redirecting to sign in...');
          
          // Clear localStorage
          localStorage.removeItem('confirmEmail');
          localStorage.removeItem('confirmUsername');
          
          // Redirect to signin page after a short delay
          setTimeout(() => {
            window.location.href = "/signin";
          }, 2000);
        }
      } catch (err) {
        console.error('Error confirming signup:', err);
        setErrors(err.message || 'An error occurred during confirmation');
      }
    }
    
    return false;
  }
  
  const resend_code = async () => {
    setErrors('');
    setMessage('');
    
    // Make sure we have a username
    if (!username) {
      setErrors('Username is required to resend the code');
      return;
    }
    
    try {
      console.log('Resending code for username:', username);
      
      await resendSignUpCode({
        username: username
      });
      
      setMessage('Verification code resent! Please check your email.');
    } catch (err) {
      console.error('Error resending code:', err);
      setErrors(err.message || 'An error occurred while resending the code');
    }
  };
  
  const name_onchange = (event) => {
    setName(event.target.value);
  }
  
  const email_onchange = (event) => {
    setEmail(event.target.value);
  }
  
  const username_onchange = (event) => {
    setUsername(event.target.value);
  }
  
  const password_onchange = (event) => {
    setPassword(event.target.value);
  }
  
  const code_onchange = (event) => {
    setCode(event.target.value);
  }
  
  let el_errors;
  if (errors){
    el_errors = <div className='errors'>{errors}</div>;
  }
  
  let el_message;
  if (message) {
    el_message = <div className='success'>{message}</div>;
  }
  
  // Conditional rendering based on what stage we're at
  if (showConfirmation) {
    // Show the confirmation form
    return (
      <article className='confirm-article'>
        <div className='confirm-info'>
          <Logo className='logo' />
        </div>
        <div className='confirm-wrapper'>
          <form 
            className='confirm_form'
            onSubmit={onsubmit}
          >
            <h2>Confirm your Email</h2>
            <div className='fields'>
              <div className='field text_field email'>
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={email_onchange}
                  readOnly={!!email}
                />
              </div>
              <div className='field text_field code'>
                <label>Confirmation Code</label>
                <input
                  type="text"
                  value={code}
                  onChange={code_onchange}
                  required
                />
              </div>
            </div>
            {el_errors}
            {el_message}
            <div className='submit'>
              <button type='submit'>Confirm Email</button>
            </div>
          </form>
          <div className="resend-code">
            <button 
              onClick={resend_code} 
              className="resend-button"
              type="button"
            >
              Resend Activation Code
            </button>
          </div>
        </div>
      </article>
    );
  } else {
    // Show the signup form (original form)
    return (
      <article className='signup-article'>
        <div className='signup-info'>
          <Logo className='logo' />
        </div>
        <div className='signup-wrapper'>
          <form 
            className='signup_form'
            onSubmit={onsubmit}
          >
            <h2>Sign up to create a Cruddur account</h2>
            <div className='fields'>
              <div className='field text_field name'>
                <label>Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={name_onchange} 
                />
              </div>
              <div className='field text_field email'>
                <label>Email (required for activation)</label>
                <input
                  type="email"
                  value={email}
                  onChange={email_onchange}
                  required 
                />
              </div>
              <div className='field text_field username'>
                <label>Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={username_onchange}
                  required
                  placeholder="Cannot contain @ symbol"
                />
              </div>
              <div className='field text_field password'>
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={password_onchange}
                  required 
                />
              </div>
            </div>
            {el_errors}
            {el_message}
            <div className='submit'>
              <button type='submit'>Sign Up</button>
            </div>
          </form>
          <div className="already-have-an-account">
            <span>
              Already have an account?
            </span>
            <Link to="/signin">Sign in!</Link>
          </div>
        </div>
      </article>
    );
  }
}