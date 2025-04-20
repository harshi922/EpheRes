import './PaymentForm.css';
import React, { useState, useEffect } from "react";
import process from 'process';

export default function PaymentForm(props) {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Pre-fill recommended amount if recipient is provided and has a negative balance
    if (props.popped && props.recipient && parseFloat(props.recipient.balance) < 0) {
      setAmount(Math.abs(parseFloat(props.recipient.balance)).toFixed(2));
    } else {
      setAmount('');
    }
    setNote('');
    setErrors('');
  }, [props.popped, props.recipient]);

  const onsubmit = async (event) => {
    event.preventDefault();
    setErrors('');
    setIsSubmitting(true);
    
    try {
      // Validate inputs
      if (!amount || parseFloat(amount) <= 0) {
        setErrors('Valid amount is required');
        setIsSubmitting(false);
        return;
      }
      
      if (!props.recipient) {
        setErrors('Recipient information is missing');
        setIsSubmitting(false);
        return;
      }
      
      // Get token from localStorage
      const token = localStorage.getItem('access_token');
      if (!token) {
        setErrors('You must be logged in to make payments');
        setIsSubmitting(false);
        return;
      }
      
      const backend_url = `${process.env.REACT_APP_BACKEND_URL}/api/payments`;
      const res = await fetch(backend_url, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          recipient_handle: props.recipient.handle,
          amount: amount,
          note: note
        }),
      });
      
      const data = await res.json();
      
      if (res.status === 200) {
        // Reset and close the form
        setAmount('');
        setNote('');
        props.setPopped(false);
        
        // Execute any onSubmit callback
        if (props.onSubmit) {
          props.onSubmit();
        }
      } else {
        // Handle backend errors
        setErrors(Array.isArray(data.errors) ? data.errors.join(', ') : 'Payment failed');
      }
    } catch (err) {
      console.error("Error processing payment:", err);
      setErrors('Failed to connect to the server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const amount_onchange = (event) => {
    setAmount(event.target.value);
  }

  const note_onchange = (event) => {
    setNote(event.target.value);
  }

  if (props.popped === true && props.recipient) {
    const isNegativeBalance = parseFloat(props.recipient.balance) < 0;
    const title = isNegativeBalance ? 
      `Pay ${props.recipient.display_name}` : 
      `Request payment from ${props.recipient.display_name}`;
    
    return (
      <div className="payment_form_overlay">
        <form 
          className='payment_form'
          onSubmit={onsubmit}
        >
          <h2>{title}</h2>
          
          <div className='field'>
            <label>Amount</label>
            <div className="amount_input">
              <span className="currency">$</span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={amount_onchange}
                required
              />
            </div>
          </div>
          
          <div className='field'>
            <label>Note (optional)</label>
            <input
              type="text"
              placeholder="What's this payment for?"
              value={note}
              onChange={note_onchange}
            />
          </div>
          
          {errors && <div className='errors'>{errors}</div>}
          
          <div className='submit'>
            <button type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Processing...' : isNegativeBalance ? 'Pay' : 'Request'}
            </button>
            <button type='button' onClick={() => props.setPopped(false)}>Cancel</button>
          </div>
        </form>
      </div>
    );
  }
  return null;
}