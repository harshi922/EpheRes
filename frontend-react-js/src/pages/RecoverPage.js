import './RecoverPage.css';
import React from "react";
import { ReactComponent as Logo } from '../components/svg/logo.svg';
import { Link } from "react-router-dom";
import { resetPassword, confirmResetPassword } from "aws-amplify/auth";

export default function RecoverPage() {
  // Username is Email
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [passwordAgain, setPasswordAgain] = React.useState('');
  const [code, setCode] = React.useState('');
  const [errors, setErrors] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [formState, setFormState] = React.useState('send_code');

  const onsubmit_send_code = async (event) => {
    event.preventDefault();
    setErrors('');
    setMessage('');
    
    if (!username) {
      setErrors('Email is required');
      return false;
    }
    
    try {
      console.log('Sending recovery code to:', username);
      
      const output = await resetPassword({ username });
      console.log('Reset password response:', output);
      
      // Check the next step
      if (output.nextStep.resetPasswordStep === 'CONFIRM_RESET_PASSWORD_WITH_CODE') {
        setMessage('Recovery code has been sent to your email');
        setFormState('confirm_code');
      }
    } catch (err) {
      console.error('Error sending recovery code:', err);
      setErrors(err.message || 'An error occurred when sending the recovery code');
    }
    
    return false;
  }

  const onsubmit_confirm_code = async (event) => {
    event.preventDefault();
    setErrors('');
    setMessage('');
    
    // Validate inputs
    if (!code) {
      setErrors('Recovery code is required');
      return false;
    }
    
    if (!password) {
      setErrors('New password is required');
      return false;
    }
    
    if (password !== passwordAgain) {
      setErrors('Passwords do not match');
      return false;
    }
    
    try {
      console.log('Confirming password reset for:', username);
      
      const output = await confirmResetPassword({
        username,
        confirmationCode: code,
        newPassword: password
      });
      
      console.log('Confirm reset password response:', output);
      
      // If we get here, the password was reset successfully
      setMessage('Your password has been successfully reset!');
      setFormState('success');
    } catch (err) {
      console.error('Error confirming password reset:', err);
      setErrors(err.message || 'An error occurred when confirming your password reset');
    }
    
    return false;
  }

  const username_onchange = (event) => {
    setUsername(event.target.value);
  }
  
  const password_onchange = (event) => {
    setPassword(event.target.value);
  }
  
  const password_again_onchange = (event) => {
    setPasswordAgain(event.target.value);
  }
  
  const code_onchange = (event) => {
    setCode(event.target.value);
  }

  let el_errors;
  if (errors) {
    el_errors = <div className='errors'>{errors}</div>;
  }
  
  let el_message;
  if (message) {
    el_message = <div className='success'>{message}</div>;
  }

  const send_code = () => {
    return (
      <form 
        className='recover_form'
        onSubmit={onsubmit_send_code}
      >
        <h2>Recover your Password</h2>
        <div className='fields'>
          <div className='field text_field username'>
            <label>Email</label>
            <input
              type="email"
              value={username}
              onChange={username_onchange}
              required
            />
          </div>
        </div>
        {el_errors}
        {el_message}
        <div className='submit'>
          <button type='submit'>Send Recovery Code</button>
        </div>
      </form>
    );
  }

  const confirm_code = () => {
    return (
      <form 
        className='recover_form'
        onSubmit={onsubmit_confirm_code}
      >
        <h2>Reset your Password</h2>
        <div className='fields'>
          <div className='field text_field code'>
            <label>Reset Password Code</label>
            <input
              type="text"
              value={code}
              onChange={code_onchange}
              required
            />
          </div>
          <div className='field text_field password'>
            <label>New Password</label>
            <input
              type="password"
              value={password}
              onChange={password_onchange}
              required
            />
          </div>
          <div className='field text_field password_again'>
            <label>New Password Again</label>
            <input
              type="password"
              value={passwordAgain}
              onChange={password_again_onchange}
              required
            />
          </div>
        </div>
        {el_errors}
        {el_message}
        <div className='submit'>
          <button type='submit'>Reset Password</button>
        </div>
      </form>
    );
  }

  const success = () => {
    return (
      <div className="success-message">
        <h2>Success!</h2>
        <p>Your password has been successfully reset!</p>
        <Link to="/signin" className="proceed">Proceed to Sign In</Link>
      </div>
    );
  }

  let form;
  if (formState === 'send_code') {
    form = send_code();
  }
  else if (formState === 'confirm_code') {
    form = confirm_code();
  }
  else if (formState === 'success') {
    form = success();
  }

  return (
    <article className="recover-article">
      <div className='recover-info'>
        <Logo className='logo' />
      </div>
      <div className='recover-wrapper'>
        {form}
      </div>
    </article>
  );
}