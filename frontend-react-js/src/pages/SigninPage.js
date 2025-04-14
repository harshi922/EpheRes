import './SigninPage.css';
import React from "react";
import {ReactComponent as Logo} from '../components/svg/logo.svg';
import { Link } from "react-router-dom";
import { signIn,fetchAuthSession  } from 'aws-amplify/auth';

// [TODO] Authenication
import Cookies from 'js-cookie'

export default function SigninPage() {

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errors, setErrors] = React.useState('');

  const onsubmit = async (event) => {
    setErrors('');
    event.preventDefault();
    
    try {
      // Updated signIn format for Amplify v6
      const { isSignedIn, nextStep } = await signIn({
        username: email,
        password: password
      });
      
      // if (isSignedIn) {
      //   // Get the user session to access tokens
      //   const { tokens } = await fetchAuthSession();
      //   console.log(tokens)
      //   const accessToken = tokens.accessToken.toString();
      //   console.log("Token received:", accessToken.substring(0, 10) + "..."); // Log first few characters
      //   localStorage.setItem("access_token", accessToken);
      //   console.log("Token stored, now redirecting...");
      //   window.location.href = "/";
      //   console.log("Redirect attempted"); // This might not execute if redirect works
      //         localStorage.setItem("access_token", tokens.accessToken.toString());
      //   // window.location.href = "/";
      //   window.location.replace("/")
      //   console.log(window.location.href)
      // }
      if (isSignedIn) {
        const { tokens } = await fetchAuthSession();
        localStorage.setItem("access_token", tokens.accessToken.toString());
        
        try {
          window.location.href = "/";
        } catch (error) {
          console.error("Navigation error:", error);
          setErrors("Failed to load home page. Please check console for details.");
        }
      }
    } catch (error) {
      if (error.code === 'UserNotConfirmedException') {
        window.location.href = "/confirm";
      }
      setErrors(error.message || 'An error occurred during sign in');
    }
    
    return false;
  }
  

  const email_onchange = (event) => {
    setEmail(event.target.value);
  }
  const password_onchange = (event) => {
    setPassword(event.target.value);
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
        <div className="dont-have-an-account">
          <span>
            Don't have an account?
          </span>
          <Link to="/signup">Sign up!</Link>
        </div>
      </div>

    </article>
  );
}