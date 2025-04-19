import './BalanceCard.css';
import React from 'react';

export default function BalanceCard(props) {
  const balance = parseFloat(props.balance);
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      signDisplay: 'always'
    }).format(amount);
  };
  
  let statusText = '';
  if (balance < 0) {
    statusText = 'you owe';
  } else if (balance > 0) {
    statusText = 'owes you';
  } else {
    statusText = 'settled up';
  }

  return (
    <div className={`balance_card ${balance < 0 ? 'negative' : balance > 0 ? 'positive' : 'neutral'}`}>
      <span className='status'>{statusText}</span>
      <span className='amount'>{formatCurrency(Math.abs(balance))}</span>
    </div>
  );
}