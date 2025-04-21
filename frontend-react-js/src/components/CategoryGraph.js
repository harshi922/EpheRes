import React from 'react';

const CategoryGraph = ({ expenseData }) => {
  // Check if expense data exists and has items
  if (!expenseData || !Array.isArray(expenseData) || expenseData.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No category data available
      </div>
    );
  }
  
  // Calculate total amount for percentages
  const totalAmount = expenseData.reduce((sum, item) => sum + item.amount, 0);
  
  // Sort categories by amount (highest first)
  const sortedData = [...expenseData].sort((a, b) => b.amount - a.amount);
  
  // Format functions
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
    <div className="space-y-4">
      {sortedData.map((item, index) => (
        <div key={index} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-gray-700">{item.category}</span>
            <span className="text-gray-700">{formatCurrency(item.amount)}</span>
          </div>
          <div className="h-6 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full flex items-center rounded-full transition-all duration-500"
              style={{ 
                width: `${(item.amount / totalAmount) * 100}%`,
                backgroundColor: getColor(item.category)
              }}
            >
              <span className="px-2 text-white text-xs font-medium">
                {formatPercentage(item.amount)}
              </span>
            </div>
          </div>
        </div>
      ))}
      
      <div className="pt-4 border-t mt-4">
        <div className="flex justify-between">
          <span className="font-medium text-gray-700">Total</span>
          <span className="font-medium text-gray-700">{formatCurrency(totalAmount)}</span>
        </div>
      </div>
    </div>
  );
};

export default CategoryGraph;