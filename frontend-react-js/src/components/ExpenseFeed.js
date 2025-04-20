import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import ExpenseItem from './ExpenseItem';

const ExpenseFeed = ({ expenses = [], currentUser, title = "Expenses", onAddExpense }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  
  // Make sure expenses is an array
  const safeExpenses = Array.isArray(expenses) ? expenses : [];
  
  // Filter expenses if search term is present
  const filteredExpenses = searchTerm
    ? safeExpenses.filter(exp => {
        // Guard against undefined properties
        const description = exp.description || exp.message || '';
        const paidByName = exp.paidBy?.name || exp.paidBy?.display_name || '';
        
        return (
          description.toLowerCase().includes(searchTerm.toLowerCase()) || 
          paidByName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
    : safeExpenses;
  
  return (
    <div className="flex flex-col bg-gray-50 h-full">
      {/* Header */}
      <div className="bg-white p-4 sticky top-0 z-10 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
          <button 
            onClick={() => setFilterVisible(!filterVisible)}
            className="flex items-center text-gray-600"
          >
            <span>Filters</span>
            <Filter className="ml-1 w-4 h-4" />
          </button>
        </div>
        
        {filterVisible && (
          <div className="bg-white p-3 rounded-lg shadow-md mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search expenses"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Expense List */}
      <div className="flex-1 overflow-auto">
        {filteredExpenses.length > 0 ? (
          <div className="bg-white">
            {filteredExpenses.map(expense => (
              <ExpenseItem 
                key={expense.id || expense.uuid || expense._id || Math.random().toString(36).substr(2, 9)} 
                expense={expense} 
                currentUser={currentUser} 
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-gray-500 bg-white p-8">
            <p>No expenses found</p>
            {searchTerm && <p className="mt-2">Try a different search term</p>}
            {!searchTerm && <p className="mt-2">Add an expense to get started</p>}
          </div>
        )}
      </div>
      
      {/* Add Expense Button - only shown if onAddExpense prop is provided */}
      {onAddExpense && (
        <div className="p-4 sticky bottom-0">
          <button 
            onClick={onAddExpense}
            className="w-full py-3 bg-green-500 text-white rounded-lg font-medium shadow-md"
          >
            + Add Expense
          </button>
        </div>
      )}
    </div>
  );
};

export default ExpenseFeed;