// import React, { useState } from 'react';
// import { Search, Filter } from 'lucide-react';
// import ExpenseItem from './ExpenseItem';
// import ExpenseForm from './ExpenseForm';
// const ExpenseFeed = ({ expenses = [], currentUser, title = "Expenses", onAddExpense, isLoading, onRefresh }) => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterVisible, setFilterVisible] = useState(false);
//   const [error, setError] = useState(null);
//   const [popped, setPopped] = useState(false);
//   const [localExpenses, setLocalExpenses] = useState(expenses);

//   const safeExpenses = Array.isArray(localExpenses) ? localExpenses : [];
  
//   // Handle expense search
//   const handleSearch = async (e) => {
//     e.preventDefault();
//     if (!searchTerm.trim()) return;
    
//     try {
//       setError(null);
      
//       // Get token from localStorage
//       const token = localStorage.getItem('access_token');
//       if (!token) {
//         setError('Authentication required');
//         return;
//       }
      
//       const backend_url = `${process.env.REACT_APP_BACKEND_URL}/api/expenses/search?term=${encodeURIComponent(searchTerm)}`;
//       const res = await fetch(backend_url, {
//         method: "GET",
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
      
//       const data = await res.json();
      
//       if (res.status === 200 && data) {
//         // Update expenses list with search results
//         if (onRefresh) {
//           onRefresh(data);
//         }
//       } else {
//         setError('Search failed. Please try again.');
//       }
//     } catch (err) {
//       console.error("Search error:", err);
//       setError('Failed to connect to the server');
//     }
//   };

//   // Filter expenses if search term is present (client-side filtering)
//   const filteredExpenses = searchTerm && !onRefresh
//     ? safeExpenses.filter(exp => {
//         const description = exp.description || exp.message || '';
//         const paidBy = exp.created_by || exp.display_name || '';
        
//         return (
//           description.toLowerCase().includes(searchTerm.toLowerCase()) || 
//           paidBy.toLowerCase().includes(searchTerm.toLowerCase())
//         );
//       })
//     : safeExpenses;

//   return (
//     <div className="flex flex-col bg-gray-50 h-full">
      
//       {onAddExpense && (
//         <div className="p-4 bg-white border-t">
//           <button
//             onClick={() => setPopped(true)}
//             className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
//           >
//             + Add Expense
//           </button>
//         </div>
//       )}

//       {/* Expense Form Modal */}
//       {popped && (
//         <ExpenseForm
//           popped={popped}
//           setPopped={setPopped}
//           setExpenses={setLocalExpenses}
//         />
//       )}


//       {/* Conditionally render expenses */}
//       {filteredExpenses.length > 0 ? (
//         <div>
//           {filteredExpenses.map(expense => (
//             <ExpenseItem key={expense.id} expense={expense} />
//           ))}
//         </div>
//       ) : (
//         <div>No activities to show</div>
//       )}

//     </div>
//   );
// };

// // const ExpenseFeed = ({ expenses = [], currentUser, title = "Expenses", onAddExpense, isLoading, onRefresh }) => {
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [filterVisible, setFilterVisible] = useState(false);
// //   const [error, setError] = useState(null);

// //   // 🆕 Add these states
// //   const [popped, setPopped] = useState(false);
// //   const [localExpenses, setLocalExpenses] = useState(expenses);

// //   const safeExpenses = Array.isArray(localExpenses) ? localExpenses : [];
  
// //   // Handle expense search
// //   const handleSearch = async (e) => {
// //     e.preventDefault();
// //     if (!searchTerm.trim()) return;
    
// //     try {
// //       setError(null);
      
// //       // Get token from localStorage
// //       const token = localStorage.getItem('access_token');
// //       if (!token) {
// //         setError('Authentication required');
// //         return;
// //       }
      
// //       const backend_url = `${process.env.REACT_APP_BACKEND_URL}/api/expenses/search?term=${encodeURIComponent(searchTerm)}`;
// //       const res = await fetch(backend_url, {
// //         method: "GET",
// //         headers: {
// //           'Authorization': `Bearer ${token}`
// //         }
// //       });
      
// //       const data = await res.json();
      
// //       if (res.status === 200 && data) {
// //         // Update expenses list with search results
// //         if (onRefresh) {
// //           // If there's a refresh handler, let the parent component handle it
// //           onRefresh(data);
// //         }
// //       } else {
// //         setError('Search failed. Please try again.');
// //       }
// //     } catch (err) {
// //       console.error("Search error:", err);
// //       setError('Failed to connect to the server');
// //     }
// //   };
  
// //   // Filter expenses if search term is present (client-side filtering)
// //   const filteredExpenses = searchTerm && !onRefresh
// //     ? safeExpenses.filter(exp => {
// //         // Guard against undefined properties
// //         const description = exp.description || exp.message || '';
// //         const paidBy = exp.created_by || exp.display_name || '';
        
// //         return (
// //           description.toLowerCase().includes(searchTerm.toLowerCase()) || 
// //           paidBy.toLowerCase().includes(searchTerm.toLowerCase())
// //         );
// //       })
// //     : safeExpenses;
  
// //   return (
// //     <div className="flex flex-col bg-gray-50 h-full">

// //       {onAddExpense && (
// //         <div className="p-4 bg-white border-t">
// //           <button
// //             onClick={() => setPopped(true)}
// //             className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
// //           >
// //             + Add Expense
// //           </button>
// //         </div>
// //       )}

// //       {/* Expense Form Modal */}
// //       {popped && (
// //         <ExpenseForm
// //           popped={popped}
// //           setPopped={setPopped}
// //           setExpenses={setLocalExpenses}
// //         />
// //       )}
// //     </div>
// //   );
// // };

// export default ExpenseFeed;
import React, { useState, onRefresh } from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import ExpenseItem from './ExpenseItem';

const ExpenseFeed = ({ expenses = [], currentUser, title = "Expenses", onAddExpense, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [error, setError] = useState(null);
  
  // Make sure expenses is an array
  const safeExpenses = Array.isArray(expenses) ? expenses : [];
  
  // Handle expense search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    
    try {
      setError(null);
      
      // Get token from localStorage
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('Authentication required');
        return;
      }
      
      const backend_url = `${process.env.REACT_APP_BACKEND_URL}/api/expenses/search?term=${encodeURIComponent(searchTerm)}`;
      const res = await fetch(backend_url, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await res.json();
      
      if (res.status === 200) {
        // Update expenses list with search results
        if (onRefresh) {
          onRefresh(data);
        }
      } else {
        setError('Search failed. Please try again.');
      }
    } catch (err) {
      console.error("Search error:", err);
      setError('Failed to connect to the server');
    }
  };
  
  // Filter expenses client-side if no search endpoint is available
  const filteredExpenses = searchTerm
    ? safeExpenses.filter(exp => {
        const description = exp.description || '';
        const createdBy = exp.created_by || exp.paidBy?.name || '';
        
        return (
          description.toLowerCase().includes(searchTerm.toLowerCase()) || 
          createdBy.toLowerCase().includes(searchTerm.toLowerCase())
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
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search expenses"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500"
                />
                <button type="submit" className="hidden">Search</button>
              </div>
            </form>
            {error && <div className="text-red-500 mt-2 text-sm">{error}</div>}
          </div>
        )}
      </div>
      
      {/* Expense List */}
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-48 text-gray-500 bg-white p-8">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-green-500 rounded-full animate-spin mr-2"></div>
            <p>Loading expenses...</p>
          </div>
        ) : filteredExpenses.length > 0 ? (
          <div className="bg-white">
            {filteredExpenses.map(expense => (
              <ExpenseItem 
                key={expense.uuid || expense.id || Math.random().toString(36).substr(2, 9)} 
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
      
      {/* Add Expense Button */}
      {onAddExpense && (
        <div className="p-4 sticky bottom-0">
          <button 
            onClick={onAddExpense}
            className="w-full py-3 bg-green-500 text-white rounded-lg font-medium shadow-md flex items-center justify-center"
          >
            <Plus className="mr-2" size={20} />
            Add Expense
          </button>
        </div>
      )}
    </div>
  );
};

export default ExpenseFeed;