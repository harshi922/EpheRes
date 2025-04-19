import './CategoryGraph.css';
import React from 'react';

export default function CategoryGraph(props) {
  const totalAmount = props.expenseData.reduce((sum, item) => sum + item.amount, 0);
  
  // Sort categories by amount (highest first)
  const sortedData = [...props.expenseData].sort((a, b) => b.amount - a.amount);
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  const formatPercentage = (amount) => {
    return ((amount / totalAmount) * 100).toFixed(1) + '%';
  };
  
  // Generate colors for the bars
  const categoryColors = {
    'Food & Drink': '#5cc689',
    'Housing': '#4a8fe7',
    'Transportation': '#e6a542',
    'Entertainment': '#9c42e6',
    'Utilities': '#e64279',
    'Shopping': '#42d7e6',
    'Healthcare': '#e64242',
    'Other': '#42e6a2'
  };
  
  // Use a default color for categories not in the map
  const getColor = (category) => {
    return categoryColors[category] || '#888888';
  };

  return (
    <div className='category_graph'>
      <div className='graph_bars'>
        {sortedData.map((item, index) => (
          <div key={index} className='graph_bar_container'>
            <div className='bar_label'>
              <span className='category_name'>{item.category}</span>
              <span className='category_amount'>{formatCurrency(item.amount)}</span>
            </div>
            <div className='bar_wrapper'>
              <div 
                className='bar' 
                style={{ 
                  width: `${(item.amount / totalAmount) * 100}%`,
                  backgroundColor: getColor(item.category)
                }}
              >
                <span className='percentage'>{formatPercentage(item.amount)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}