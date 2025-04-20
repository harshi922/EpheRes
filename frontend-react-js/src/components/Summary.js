import './Summary.css';
import React, { useState, useEffect } from 'react';

export default function Summary(props) {
  const [summary, setSummary] = useState({
    totalOwed: 0,
    totalOwe: 0,
    netBalance: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSummaryData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real app, this would fetch balance data from the backend
        // For now, we'll use mock data since there's no specific summary endpoint
        
        // Get token from localStorage
        const token = localStorage.getItem('access_token');
        if (!token || !props.user) {
          setIsLoading(false);
          return;
        }
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Use mock data for now
        setSummary({
          totalOwed: 456.78,  // Others owe you
          totalOwe: 123.45,   // You owe others
          netBalance: 333.33  // Your net balance
        });
        
      } catch (err) {
        console.error("Error loading summary data:", err);
        setError("Failed to load balance data");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (props.user) {
      loadSummaryData();
    }
  }, [props.user]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      signDisplay: amount < 0 ? 'always' : 'exceptZero'
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className='summary_card'>
        <div className="p-3 text-center">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-purple-500 rounded-full animate-spin mx-auto mb-2"></div>
          <p>Loading balance data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='summary_card'>
        <div className="p-3 text-red-500">
          <p>{error}</p>
        </div>
      </div>
    );
  }

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