import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const ExpenseItem = ({ expense, currentUser }) => {
  // Make sure expense and currentUser exist
  if (!expense) {
    return null; // Don't render anything if expense is undefined
  }

  // Safely access properties
  const expenseAmount = expense.amount ? parseFloat(expense.amount) : 0;
  const paidBy = expense.paidBy || {}; // Default to empty object if undefined
  const paidByName = paidBy.name || paidBy.display_name || 'Unknown';
  const paidById = paidBy.id || paidBy.handle || null;
  const createdAt = expense.created_at || expense.date || new Date().toISOString();
  const group = expense.group || null;
  const description = expense.description || expense.message || 'Unnamed expense';
  
  // Determine if current user paid
  const isPayer = currentUser && paidById === (currentUser.id || currentUser.handle);
  
  // Calculate balance - safely handle different data structures
  let userShare = 0;
  let owedToUser = 0;
  let owedByUser = 0;

  // Safe access to participant data
  if (expense.userShare !== undefined) {
    // If expense has direct share data
    userShare = parseFloat(expense.userShare);
    owedToUser = isPayer ? expenseAmount - userShare : 0;
    owedByUser = !isPayer ? userShare : 0;
  } 
  else if (expense.participants && Array.isArray(expense.participants)) {
    // If expense has participants array, find current user's share
    const currentUserParticipant = expense.participants.find(p => 
      p.id === (currentUser?.id) || p.handle === (currentUser?.handle)
    );
    
    userShare = currentUserParticipant ? parseFloat(currentUserParticipant.amount) : 0;
    owedToUser = isPayer ? expenseAmount - userShare : 0;
    owedByUser = !isPayer ? userShare : 0;
  }
  else {
    // Default calculation if no share info is available
    userShare = expenseAmount / 2; // Assume equal split between 2 people
    owedToUser = isPayer ? userShare : 0;
    owedByUser = !isPayer ? userShare : 0;
  }

  // Format date
  const formatDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return 'recently';
    }
  };

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="flex items-start p-4 border-b">
      {/* Avatar */}
      <div className="w-10 h-10 bg-red-400 rounded-full flex-shrink-0 mr-3"></div>
      
      {/* Content */}
      <div className="flex-grow">
        <div className="flex justify-between">
          <div>
            <h3 className="font-medium text-gray-800">{description}</h3>
            <p className="text-sm text-gray-500">
              {isPayer ? 'You paid' : `${paidByName} paid`} 
              {group && ` • ${typeof group === 'string' ? group : group.name}`}
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-gray-800">{formatCurrency(expenseAmount)}</p>
            <p className={`text-sm ${owedToUser > 0 ? 'text-green-600' : owedByUser > 0 ? 'text-red-600' : 'text-gray-500'}`}>
              {owedToUser > 0 
                ? `you get back ${formatCurrency(owedToUser)}` 
                : owedByUser > 0 
                  ? `you owe ${formatCurrency(owedByUser)}`
                  : 'settled up'}
            </p>
          </div>
        </div>
        
        <p className="text-xs text-gray-500 mt-1">{formatDate(createdAt)}</p>
      </div>
    </div>
  );
};

export default ExpenseItem;