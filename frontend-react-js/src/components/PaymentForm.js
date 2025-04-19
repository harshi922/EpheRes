import './PaymentForm.css';
import React from "react";
import process from 'process';

export default function PaymentForm(props) {
  const [amount, setAmount] = React.useState('');
  const [note, setNote] = React.useState('');
  const [errors, setErrors] = React.useState('');

  React.useEffect(() => {
    // Pre-fill recommended amount if recipient is provided and has a negative balance
    if (props.popped && props.recipient && parseFloat(props.recipient.balance) < 0) {
      setAmount(Math.abs(parseFloat(props.recipient.balance)).toFixed(2));
    } else {
      setAmount('');
    }
    setNote('');
  }, [props.popped, props.recipient]);

  const onsubmit = async (event) => {
    event.preventDefault();
    setErrors('');
    try {
      const backend_url = `${process.env.REACT_APP_BACKEND_URL}/api/payments`
      const res = await fetch(backend_url, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recipient_handle: props.recipient.handle,
          amount: amount,
          note: note
        }),
      });
      let data = await res.json();
      if (res.status === 200) {
        // reset and close the form
        setAmount('')
        setNote('')
        props.setPopped(false)
        
        // Execute any onSubmit callback
        if (props.onSubmit) {
          props.onSubmit();
        }
      } else {
        setErrors(data.errors ? data.errors.join(', ') : 'An error occurred')
      }
    } catch (err) {
      console.log(err);
      setErrors('An error occurred');
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
            <button type='submit'>{isNegativeBalance ? 'Pay' : 'Request'}</button>
            <button type='button' onClick={() => props.setPopped(false)}>Cancel</button>
          </div>
        </form>
      </div>
    );
  }
  return null;
}