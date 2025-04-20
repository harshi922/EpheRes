// import './BalanceCard.css';
// import React from 'react';

// export default function BalanceCard(props) {
//   const balance = parseFloat(props.balance);
  
//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD',
//       signDisplay: 'always'
//     }).format(amount);
//   };
  
//   let statusText = '';
//   if (balance < 0) {
//     statusText = 'you owe';
//   } else if (balance > 0) {
//     statusText = 'owes you';
//   } else {
//     statusText = 'settled up';
//   }

//   return (
//     <div className={`balance_card ${balance < 0 ? 'negative' : balance > 0 ? 'positive' : 'neutral'}`}>
//       <span className='status'>{statusText}</span>
//       <span className='amount'>{formatCurrency(Math.abs(balance))}</span>
//     </div>
//   );
// }

import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

const BalanceCard = ({ totalOwed, totalOwe }) => {
  // Calculate net balance
  const netBalance = totalOwed - totalOwe;
  const isPositive = netBalance > 0;
  const isNegative = netBalance < 0;
  const isZero = netBalance === 0;
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(amount));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <div className="flex justify-between mb-4">
        <div className="text-green-600">
          <h3 className="text-sm font-medium">total owed to you</h3>
          <p className="text-lg font-semibold">{formatCurrency(totalOwed)}</p>
        </div>
        <div className="text-red-600">
          <h3 className="text-sm font-medium text-right">total you owe</h3>
          <p className="text-lg font-semibold">{formatCurrency(totalOwe)}</p>
        </div>
      </div>
      
      <div className="border-t pt-3">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-gray-600">TOTAL BALANCE</h3>
          <div className={`flex items-center ${
            isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-600'
          }`}>
            {isPositive && <ArrowUp className="w-4 h-4 mr-1" />}
            {isNegative && <ArrowDown className="w-4 h-4 mr-1" />}
            <span className="text-lg font-bold">
              {isZero ? 'Settled up' : formatCurrency(netBalance)}
            </span>
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex">
        <button className="flex-1 bg-green-500 text-white py-2 rounded-l-md font-medium text-sm">
          Settle Up
        </button>
        <button className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-r-md font-medium text-sm">
          Remind
        </button>
      </div>
    </div>
  );
};

// Component to display in the homepage
const HomepageBalanceCard = ({ totalOwed, totalOwe }) => {
  // Calculate net balance
  const netBalance = totalOwed - totalOwe;
  const isPositive = netBalance > 0;
  const isNegative = netBalance < 0;
  const isZero = netBalance === 0;
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(amount));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Your Balance</h2>
        
        <div className="flex items-center mb-1">
          <div className={`flex-1 ${isPositive || isZero ? 'text-green-600' : 'text-gray-600'}`}>
            <div className="text-sm">you are owed</div>
            <div className="text-xl font-semibold">{formatCurrency(totalOwed)}</div>
          </div>
          <div className={`flex-1 ${isNegative || isZero ? 'text-red-600' : 'text-gray-600'}`}>
            <div className="text-sm text-right">you owe</div>
            <div className="text-xl font-semibold text-right">{formatCurrency(totalOwe)}</div>
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">total balance</div>
            <div className={`text-lg font-bold ${
              isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-600'
            }`}>
              {isZero ? 'Settled up' : formatCurrency(netBalance)}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex border-t">
        <button className="flex-1 py-3 text-center font-medium bg-white hover:bg-gray-50 text-gray-800">
          View Balance Details
        </button>
      </div>
    </div>
  );
};

export { BalanceCard, HomepageBalanceCard };