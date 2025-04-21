import React, { useState, useEffect } from 'react';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';

// Import components
import NavigationBar from '../components/NavigationBar';
import ExpenseFeed from '../components/ExpenseFeed';
import { HomepageBalanceCard } from '../components/BalanceCard';
import ExpenseForm from '../components/ExpenseForm';

const HomePage = () => {
  // State variables
  const [expenses, setExpenses] = useState([]);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalOwed, setTotalOwed] = useState(0);
  const [totalOwe, setTotalOwe] = useState(0);
  const dataFetchedRef = React.useRef(false);

  // Check authentication status
  const checkAuth = async () => {
    try {
      const session = await fetchAuthSession();
      
      if (session && session.tokens && session.tokens.accessToken) {
        localStorage.setItem("access_token", session.tokens.accessToken.toString());
      }
      
      try {
        const currentUser = await getCurrentUser();
        
        setUser({
          id: currentUser.username,
          display_name: currentUser.signInDetails?.userAttributes?.name || currentUser.username,
          handle: currentUser.signInDetails?.userAttributes?.preferred_username || currentUser.username
        });
        
        return true;
      } catch (error) {
        console.log("Error getting current user:", error);
        return false;
      }
    } catch (error) {
      console.log("Auth error:", error);
      return false;
    }
  };

  // Load expenses from backend
  const loadExpenses = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get the access token
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError("Authentication required");
        setIsLoading(false);
        return;
      }
      
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/expenses/home`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (response.status === 200) {
        const data = await response.json();
        setExpenses(data);
        
        // Calculate balances from the expense data
        // This is simplified logic - in a real app you would get this from an API endpoint
        let owed = 0;
        let owe = 0;
        
        data.forEach(expense => {
          const isCreator = expense.created_by === user?.handle;
          
          if (isCreator) {
            // If user created the expense, others owe them
            expense.participants?.forEach(participant => {
              if (participant.handle !== user?.handle) {
                owed += parseFloat(participant.amount || 0);
              }
            });
          } else {
            // If user didn't create the expense, they owe the creator
            expense.participants?.forEach(participant => {
              if (participant.handle === user?.handle) {
                owe += parseFloat(participant.amount || 0);
              }
            });
          }
        });
        
        setTotalOwed(owed);
        setTotalOwe(owe);
      } else if (response.status === 401) {
        // Unauthorized - token may be invalid
        setError("Session expired. Please sign in again.");
        localStorage.removeItem('access_token');
        setTimeout(() => {
          window.location.href = "/signin";
        }, 2000);
      } else {
        setError("Failed to load expenses");
      }
    } catch (err) {
      console.log("Error loading expenses:", err);
      setError("Connection error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Auth and data loading
  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    
    const initialize = async () => {
      const isAuthenticated = await checkAuth();
      
      if (isAuthenticated) {
        await loadExpenses();
      } else {
        // Redirect to sign in if not authenticated
        window.location.href = "/signin";
      }
    };
    
    initialize();
  }, []);
  
  // Handle adding a new expense
  const handleAddExpense = (expenseData) => {
    // In a real app, this would make an API call to create the expense
    const newExpense = {
      uuid: `temp-${Date.now()}`,
      created_by: user?.handle,
      display_name: user?.display_name,
      ...expenseData,
      created_at: new Date().toISOString()
    };
    
    setExpenses(prevExpenses => [newExpense, ...prevExpenses]);
    setShowExpenseForm(false);
    
    // Refresh data from server to get updated balances
    loadExpenses();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="max-w-4xl mx-auto px-4 pt-6">
        {error ? (
          <div className="bg-red-100 p-4 rounded-lg text-red-700 mb-4">
            <p>{error}</p>
            <button 
              onClick={loadExpenses}
              className="mt-2 px-4 py-1 bg-red-600 text-white rounded-md"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <HomepageBalanceCard totalOwed={totalOwed} totalOwe={totalOwe} />

            <ExpenseFeed 
              title="Recent Expenses" 
              expenses={expenses}
              currentUser={user}
              isLoading={isLoading}
              onAddExpense={() => setShowExpenseForm(true)}
            />
          </>
        )}
      </div>
      
      {/* Navigation Bar */}
      <NavigationBar activeTab="home" />
      
      {/* Expense Form Modal */}
      {showExpenseForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <ExpenseForm 
            onSubmit={handleAddExpense} 
            onCancel={() => setShowExpenseForm(false)} 
            currentUser={user}
            friendsList={[
              { id: 'Worf', name: 'Worf', balance: '-42.75' },
              { id: 'Jadzia', name: 'Jadzia Dax', balance: '128.50' }
            ]}
            groupsList={[
              { 
                id: 'Roommates', 
                name: 'Roommates',
                members: [
                  { id: user?.handle, name: user?.display_name },
                  { id: 'Worf', name: 'Worf' },
                  { id: 'Jadzia', name: 'Jadzia Dax' }
                ]
              },
              {
                id: 'Trip to Vegas',
                name: 'Trip to Vegas',
                members: [
                  { id: user?.handle, name: user?.display_name },
                  { id: 'Worf', name: 'Worf' },
                  { id: 'Jadzia', name: 'Jadzia Dax' },
                  { id: 'Quark', name: 'Quark' }
                ]
              }
            ]}
          />
        </div>
      )}
    </div>
  );
};

export default HomePage;