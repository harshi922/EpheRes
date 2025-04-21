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

// Regular BalanceCard for friend items
const BalanceCard = ({ balance = "0" }) => {
  // Convert balance to number and determine status
  const balanceNum = parseFloat(balance);
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(Math.abs(amount));
  };
  
  let statusText = '';
  if (balanceNum < 0) {
    statusText = 'you owe';
  } else if (balanceNum > 0) {
    statusText = 'owes you';
  } else {
    statusText = 'settled up';
  }

  return (
    <div className={`inline-flex items-center ${balanceNum < 0 ? 'text-red-600' : balanceNum > 0 ? 'text-green-600' : 'text-gray-500'}`}>
      <span className='text-xs mr-1'>{statusText}</span>
      <span className='font-semibold text-sm'>{formatCurrency(balanceNum)}</span>
    </div>
  );
};

// Homepage summary balance card with more details
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
            <div className={`text-lg font-bold flex items-center ${
              isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-600'
            }`}>
              {isPositive && <ArrowUp className="w-4 h-4 mr-1" />}
              {isNegative && <ArrowDown className="w-4 h-4 mr-1" />}
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

// Also provide a SettleUpCard component for friends page
const SettleUpCard = ({ friend, onSettleUp }) => {
  // Convert balance to number
  const balanceNum = parseFloat(friend.balance);
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(Math.abs(amount));
  };
  
  // Only show settle up if there's a balance to settle
  if (balanceNum === 0) {
    return (
      <div className="bg-gray-100 text-gray-700 rounded-md py-2 px-4 text-center">
        All settled up
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <div>
            <span className="font-semibold">{friend.display_name}</span>
            <div className={`text-sm ${balanceNum < 0 ? 'text-red-600' : 'text-green-600'}`}>
              {balanceNum < 0 ? 'You owe' : 'Owes you'} {formatCurrency(balanceNum)}
            </div>
          </div>
          <button
            onClick={() => onSettleUp(friend)}
            className={`px-4 py-2 rounded-md text-white font-medium ${
              balanceNum < 0 ? 'bg-red-500' : 'bg-green-500'
            }`}
          >
            {balanceNum < 0 ? 'Pay' : 'Request'}
          </button>
        </div>
      </div>
    </div>
  );
};

export { BalanceCard, HomepageBalanceCard, SettleUpCard };