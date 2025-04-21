import React, { useState, useEffect } from "react";
import { X } from 'lucide-react';

const PaymentForm = ({ popped, setPopped, recipient, onSubmit }) => {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Pre-fill recommended amount if recipient is provided and has a negative balance
    if (popped && recipient && parseFloat(recipient.balance) < 0) {
      setAmount(Math.abs(parseFloat(recipient.balance)).toFixed(2));
    } else {
      setAmount('');
    }
    setNote('');
    setErrors('');
  }, [popped, recipient]);

  const handleSubmit = async (event) => {
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
      
      if (!recipient) {
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
          recipient_handle: recipient.handle,
          amount: amount,
          note: note
        }),
      });
      
      const data = await res.json();
      
      if (res.status === 200) {
        // Reset and close the form
        setAmount('');
        setNote('');
        setPopped(false);
        
        // Execute any onSubmit callback
        if (onSubmit) {
          onSubmit(data);
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
  };

  if (!popped || !recipient) {
    return null;
  }

  const isNegativeBalance = parseFloat(recipient.balance) < 0;
  const title = isNegativeBalance ? 
    `Pay ${recipient.display_name}` : 
    `Request payment from ${recipient.display_name}`;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <button 
            onClick={() => setPopped(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                step="0.01"
                min="0.01"
                id="amount"
                className="focus:ring-green-500 focus:border-green-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md py-3"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
              Note (optional)
            </label>
            <input
              type="text"
              id="note"
              className="focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md py-3"
              placeholder="What's this payment for?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          
          {errors && (
            <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {errors}
            </div>
          )}
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setPopped(false)}
              className="flex-1 bg-gray-200 py-3 text-gray-800 rounded-md font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 py-3 text-white font-medium rounded-md ${
                isNegativeBalance ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'
              } ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Processing...' : isNegativeBalance ? 'Pay' : 'Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;