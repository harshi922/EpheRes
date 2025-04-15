import './ConfirmationPage.css';
import React from "react";
import { useParams, useLocation } from 'react-router-dom';
import { ReactComponent as Logo } from '../components/svg/logo.svg';
import { confirmSignUp, resendSignUpCode } from "aws-amplify/auth";

export default function ConfirmationPage() {
  const [email, setEmail] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [code, setCode] = React.useState('');
  const [errors, setErrors] = React.useState('');
  const [message, setMessage] = React.useState('');
  const params = useParams();
  const location = useLocation();

  React.useEffect(() => {
    // Get username and email from URL params or localStorage
    const queryParams = new URLSearchParams(location.search);
    const urlUsername = queryParams.get('username');
    const urlEmail = queryParams.get('email');
    
    if (urlUsername) {
      setUsername(urlUsername);
    } else {
      // Try to get username from localStorage as fallback
      const storedUsername = localStorage.getItem('confirmUsername');
      if (storedUsername) {
        setUsername(storedUsername);
      }
    }
    
    if (urlEmail) {
      setEmail(urlEmail);
    } else {
      // Try to get email from localStorage as fallback
      const storedEmail = localStorage.getItem('confirmEmail');
      if (storedEmail) {
        setEmail(storedEmail);
      }
    }
  }, [location]);

  const code_onchange = (event) => {
    setCode(event.target.value);
  }
  
  const email_onchange = (event) => {
    setEmail(event.target.value);
  }

  const username_onchange = (event) => {
    setUsername(event.target.value);
  }
  
  const resend_code = async () => {
    setErrors('');
    setMessage('');
    
    if (!username) {
      setErrors('Username is required to resend the code');
      return;
    }
    
    try {
      console.log('Resending code for username:', username);
      
      await resendSignUpCode({
        username: username
      });
      
      setMessage('Verification code has been sent to your email');
    } catch (err) {
      console.error('Error resending code:', err);
      setErrors(err.message || 'An error occurred while resending the code');
    }
  }
  
  const onsubmit = async (event) => {
    event.preventDefault();
    console.log('ConfirmationPage.onsubmit');
    setErrors('');
    setMessage('');
    
    try {
      if (!username) {
        setErrors('Username is required');
        return false;
      }
      
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
      
      if (nextStep.signUpStep === 'COMPLETE_AUTO_SIGN_IN' || isSignUpComplete) {
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
    
    return false;
  }

  let el_errors;
  if (errors) {
    el_errors = <div className='errors'>{errors}</div>;
  }
  
  let el_message;
  if (message) {
    el_message = <div className='success'>{message}</div>;
  }

  return (
    <article className="confirm-article">
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
            <div className='field text_field username'>
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={username_onchange}
                readOnly={!!username}
              />
            </div>
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
      </div>
      <div className="resend-code">
        <button 
          onClick={resend_code} 
          className="resend-button"
          type="button"
        >
          Resend Activation Code
        </button>
      </div>
    </article>
  );
}