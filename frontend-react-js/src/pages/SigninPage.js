import './SigninPage.css';
import React from "react";
import {ReactComponent as Logo} from '../components/svg/logo.svg';
import { Link } from "react-router-dom";
import { signIn, fetchAuthSession, confirmSignIn } from 'aws-amplify/auth';

// [TODO] Authenication
import Cookies from 'js-cookie'

export default function SigninPage() {

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [errors, setErrors] = React.useState('');
  const [showNewPasswordField, setShowNewPasswordField] = React.useState(false);

  const onsubmit = async (event) => {
    setErrors('');
    event.preventDefault();
    
    try {
      console.log("Attempting sign in with:", email);
      const { isSignedIn, nextStep } = await signIn({
        username: email,
        password: password, 
        options: {
          authFlowType: 'USER_AUTH',
          preferredChallenge: 'PASSWORD_SRP', // or 'PASSWORD'
        },
      });
      
      console.log("Sign in response:", isSignedIn, nextStep);
      
      if (nextStep.signInStep === "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED") {
        console.log("New password required");
        setShowNewPasswordField(true);
        return;
      }
      
      if (nextStep.signInStep === "DONE") {
        console.log("Successfully signed in, fetching session...");
        const { tokens } = await fetchAuthSession();
        console.log("Got tokens:", tokens ? "Yes" : "No");
        
        if (tokens) {
          const accessToken = tokens.accessToken.toString();
          console.log("Storing access token:", accessToken.substring(0, 10) + "...");
          localStorage.setItem("access_token", accessToken);
          
          // We need to set this to true to make the home page work
          localStorage.setItem("amplify_auth_is_signed_in", "true");
          
          console.log("Redirecting to home page...");
          window.location.href = "/";
        }
      }
    } catch (error) {
      console.error("Sign in error:", error);
      if (error.code === 'UserNotConfirmedException') {
        window.location.href = "/confirm";
      }
      setErrors(error.message || 'An error occurred during sign in');
    }
    
    return false;
  }

  const handleNewPasswordSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log("Submitting new password");
      
      const result = await confirmSignIn({
        challengeResponse: newPassword
      });
      
      console.log("New password set, result:", result);
      
      if (result.nextStep.signInStep === "DONE") {
        console.log("Successfully signed in with new password, fetching session...");
        const { tokens } = await fetchAuthSession();
        
        if (tokens) {
          const accessToken = tokens.accessToken.toString();
          localStorage.setItem("access_token", accessToken);
          localStorage.setItem("amplify_auth_is_signed_in", "true");
          
          console.log("Redirecting to home page...");
          window.location.href = "/";
        }
      }
    } catch (error) {
      console.error("Error setting new password:", error);
      setErrors(error.message || 'An error occurred while setting new password');
    }
  }

  const email_onchange = (event) => {
    setEmail(event.target.value);
  }
  
  const password_onchange = (event) => {
    setPassword(event.target.value);
  }
  
  const newPassword_onchange = (event) => {
    setNewPassword(event.target.value);
  }

  let el_errors;
  if (errors){
    el_errors = <div className='errors'>{errors}</div>;
  }

  return (
    <article className="signin-article">
      <div className='signin-info'>
        <Logo className='logo' />
      </div>
      <div className='signin-wrapper'>
        {!showNewPasswordField ? (
          <form 
            className='signin_form'
            onSubmit={onsubmit}
          >
            <h2>Sign into your Cruddur account</h2>
            <div className='fields'>
              <div className='field text_field username'>
                <label>Email</label>
                <input
                  type="text"
                  value={email}
                  onChange={email_onchange} 
                />
              </div>
              <div className='field text_field password'>
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={password_onchange} 
                />
              </div>
            </div>
            {el_errors}
            <div className='submit'>
              <Link to="/forgot" className="forgot-link">Forgot Password?</Link>
              <button type='submit'>Sign In</button>
            </div>
          </form>
        ) : (
          <form 
            className='signin_form'
            onSubmit={handleNewPasswordSubmit}
          >
            <h2>Set New Password</h2>
            <p>Your account requires a new password</p>
            <div className='fields'>
              <div className='field text_field password'>
                <label>New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={newPassword_onchange} 
                />
              </div>
            </div>
            {el_errors}
            <div className='submit'>
              <button type='submit'>Set New Password</button>
            </div>
          </form>
        )}
        
        {!showNewPasswordField && (
          <div className="dont-have-an-account">
            <span>
              Don't have an account?
            </span>
            <Link to="/signup">Sign up!</Link>
          </div>
        )}
      </div>
    </article>
  );
}