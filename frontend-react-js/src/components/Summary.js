import './Summary.css';
import React from 'react';

export default function Summary(props) {
  const [summary, setSummary] = React.useState({
    totalOwed: 0,
    totalOwe: 0,
    netBalance: 0
  });

  React.useEffect(() => {
    // In a real app, this would fetch balance data from the backend
    // For now, use mock data
    if (props.user) {
      setSummary({
        totalOwed: 456.78,  // Others owe you
        totalOwe: 123.45,   // You owe others
        netBalance: 333.33  // Your net balance
      });
    }
  }, [props.user]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      signDisplay: amount < 0 ? 'always' : 'exceptZero'
    }).format(amount);
  };

  return (
    <div className='summary_card'>
      <h2>Your Balance</h2>
      
      <div className='balance_overview'>
        <div className='balance_item'>
          <span className='label'>Total owed to you</span>
          <span className='amount positive'>{formatCurrency(summary.totalOwed)}</span>
        </div>
        
        <div className='balance_item'>
          <span className='label'>Total you owe</span>
          <span className='amount negative'>{formatCurrency(-summary.totalOwe)}</span>
        </div>
        
        <div className='net_balance'>
          <span className='label'>Net balance</span>
          <span className={`amount ${summary.netBalance >= 0 ? 'positive' : 'negative'}`}>
            {formatCurrency(summary.netBalance)}
          </span>
        </div>
      </div>
    </div>
  );
}