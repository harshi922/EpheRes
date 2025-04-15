import './SignupPage.css';
import React from "react";
import { ReactComponent as Logo } from '../components/svg/logo.svg';
import { Link } from "react-router-dom";
import { signUp } from "aws-amplify/auth";

export default function SignupPage() {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errors, setErrors] = React.useState('');
  const [message, setMessage] = React.useState('');
  
  const onsubmit = async (event) => {
    event.preventDefault();
    console.log('SignupPage.onsubmit');
    setErrors('');
    setMessage('');
    
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
        
        // Redirect to confirmation page with params
        window.location.href = `/confirm?username=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}`;
      }
      
      if (nextStep.signUpStep === 'DONE') {
        console.log("Sign up complete");
        setMessage('Sign up complete! Redirecting to sign in...');
        setTimeout(() => {
          window.location.href = "/signin";
        }, 2000);
      }
      
    } catch (error) {
      console.error("Sign up error:", error);
      setErrors(error.message || 'An error occurred during sign up');
    }
    
    return false;
  }
  
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
  
  let el_errors;
  if (errors){
    el_errors = <div className='errors'>{errors}</div>;
  }
  
  let el_message;
  if (message) {
    el_message = <div className='success'>{message}</div>;
  }
  
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