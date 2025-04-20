// import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';
// import './GroupsPage.css';
// import React from "react";

// import DesktopNavigation from '../components/DesktopNavigation';
// import GroupsList from '../components/GroupsList';
// import GroupForm from '../components/GroupForm';

// export default function GroupsPage() {
//   const [groups, setGroups] = React.useState([]);
//   const [groupFormPopped, setGroupFormPopped] = React.useState(false);
//   const [user, setUser] = React.useState(null);
//   const dataFetchedRef = React.useRef(false);

//   const checkAuth = async () => {
//     try {
//       const session = await fetchAuthSession();
      
//       if (session && session.tokens && session.tokens.accessToken) {
//         localStorage.setItem("access_token", session.tokens.accessToken.toString());
//       }
      
//       const currentUser = await getCurrentUser();
      
//       setUser({
//         display_name: currentUser.signInDetails?.userAttributes?.name || currentUser.username,
//         handle: currentUser.signInDetails?.userAttributes?.preferred_username || currentUser.username
//       });
      
//       return session;
//     } catch (error) {
//       console.log("Error in checkAuth function:", error);
//       return null;
//     }
//   };

//   const loadGroups = async () => {
//     try {
//       const accessToken = localStorage.getItem("access_token");
      
//       if (!accessToken) {
//         return;
//       }
      
//       const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/expense_groups`, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         }
//       });
      
//       if (res.status === 200) {
//         const data = await res.json();
//         setGroups(data);
//       }
//     } catch (err) {
//       console.log("Error loading groups:", err);
//     }
//   };

//   // Auth and data loading
//   React.useEffect(() => {
//     if (dataFetchedRef.current) return;
//     dataFetchedRef.current = true;
    
//     checkAuth()
//       .then((session) => {
//         if (session && session.tokens) {
//           loadGroups();
//         }
//       })
//       .catch((err) => {
//         console.log('Error during authentication check:', err);
//       });
//   }, []);

//   return (
//     <article>
//       <DesktopNavigation user={user} active={'groups'} />
//       <div className='content'>
//         <GroupForm
//           popped={groupFormPopped}
//           setPopped={setGroupFormPopped}
//           setGroups={setGroups}
//         />
//         <GroupsList
//           title="Your Groups"
//           groups={groups}
//           setGroupFormPopped={setGroupFormPopped}
//         />
//       </div>
//     </article>
//   );
// }

import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Plus, Users, X } from 'lucide-react';
import DesktopNavigation from '../components/DesktopNavigation';

// Component for displaying a group card
const GroupCard = ({ group, onClick }) => {
  const { name, members, total_expenses, your_balance } = group;
  const isPositive = parseFloat(your_balance) >= 0;
  const isNegative = parseFloat(your_balance) < 0;
  
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
    <div 
      className="p-4 border-b cursor-pointer hover:bg-gray-50" 
      onClick={() => onClick(group)}
    >
      <div className="flex items-start mb-2">
        <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mr-3 text-white">
          <Users className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-800 text-lg">{name}</h3>
          <p className="text-sm text-gray-600">{members.length} members</p>
        </div>
      </div>
      
      <div className="flex justify-between mt-3">
        <div>
          <span className="text-sm text-gray-500">Total expenses:</span>
          <span className="ml-2 font-medium">{formatCurrency(total_expenses)}</span>
        </div>
        <div>
          <span className={`font-medium ${isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-600'}`}>
            {isPositive 
              ? `You're owed ${formatCurrency(your_balance)}` 
              : isNegative 
                ? `You owe ${formatCurrency(Math.abs(your_balance))}`
                : "You're settled up"}
          </span>
        </div>
      </div>
    </div>
  );
};

// Component for group details and expenses
const GroupDetails = ({ group, onBack, onAddExpense }) => {
  const [expenses, setExpenses] = useState(group.expenses || []);
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(amount));
  };
  
  // Format date
  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center mb-3">
          <button onClick={onBack} className="mr-3">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">{group.name}</h1>
        </div>
        
        <div className="flex justify-between mb-4">
          <div className="text-sm text-gray-600">
            <span>{group.members.length} members</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-600">Total expenses: </span>
            <span className="font-medium">{formatCurrency(group.total_expenses)}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <span className="text-gray-600 text-sm">Your balance: </span>
            <span className={`font-medium ${parseFloat(group.your_balance) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(group.your_balance)}
            </span>
          </div>
          <button 
            onClick={onAddExpense}
            className="bg-green-500 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            + Add Expense
          </button>
        </div>
      </div>
      
      {/* Expenses List */}
      <div className="flex-1 overflow-auto">
        {expenses.length > 0 ? (
          <div>
            {expenses.map(expense => (
              <div key={expense.id} className="p-4 border-b">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium text-gray-800">{expense.description}</h3>
                    <p className="text-sm text-gray-500">
                      {expense.paidBy === 'You' ? 'You paid' : `${expense.paidBy} paid`}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(expense.date || expense.created_at)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">{formatCurrency(expense.amount)}</p>
                    <p className="text-sm text-gray-500">
                      Split equally ({formatCurrency(expense.amount / group.members.length)} each)
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-4 text-gray-500">
            <p>No expenses in this group yet</p>
            <p className="mt-2">Add an expense to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Component for creating a new group
const GroupForm = ({ popped, setPopped, setGroups }) => {
  const [groupName, setGroupName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  
  // Sample friends data - in a real app, this would come from an API
  const friends = [
    { id: 1, name: 'Naveen Vanapalli' },
    { id: 2, name: 'Harshitaa Yarramsetti' },
    { id: 3, name: 'Jadzia Dax' },
    { id: 4, name: 'Worf' }
  ];
  
  // Filter friends based on search term
  const filteredFriends = searchTerm
    ? friends.filter(friend => 
        friend.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !selectedMembers.some(member => member.id === friend.id)
      )
    : friends.filter(friend => !selectedMembers.some(member => member.id === friend.id));
  
  // Handle selecting a friend
  const handleSelectFriend = (friend) => {
    setSelectedMembers([...selectedMembers, friend]);
    setSearchTerm('');
  };
  
  // Handle removing a selected friend
  const handleRemoveFriend = (friendId) => {
    setSelectedMembers(selectedMembers.filter(member => member.id !== friendId));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (groupName && selectedMembers.length > 0) {
      try {
        // Here you would normally send a request to your API
        // For now, we'll simulate it with a new group object
        const newGroup = {
          uuid: crypto.randomUUID(),
          name: groupName,
          members: [{ id: 0, name: 'You' }, ...selectedMembers],
          members_count: selectedMembers.length + 1,
          total_expenses: 0,
          your_balance: 0
        };
        
        // Update the groups state
        setGroups(prevGroups => [...prevGroups, newGroup]);
        
        // Reset and close form
        setGroupName('');
        setSelectedMembers([]);
        setPopped(false);
      } catch (err) {
        console.log("Error creating group:", err);
      }
    }
  };

  if (!popped) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Create a new group</h2>
          <button onClick={() => setPopped(false)} className="text-gray-500">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Group name</label>
            <input
              type="text"
              placeholder="Enter a group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Add friends to group</label>
            <input
              type="text"
              placeholder="Search for friends"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
            />
            
            {/* Search results */}
            {searchTerm && filteredFriends.length > 0 && (
              <div className="mt-2 border rounded-md overflow-hidden max-h-36 overflow-y-auto">
                {filteredFriends.map(friend => (
                  <div 
                    key={friend.id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSelectFriend(friend)}
                  >
                    {friend.name}
                  </div>
                ))}
              </div>
            )}
            
            {/* Selected members */}
            {selectedMembers.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Selected friends:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedMembers.map(member => (
                    <div key={member.id} className="bg-gray-100 rounded-full px-3 py-1 flex items-center">
                      <span className="text-sm">{member.name}</span>
                      <button 
                        type="button"
                        onClick={() => handleRemoveFriend(member.id)}
                        className="ml-2 text-gray-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-between gap-4">
            <button
              type="submit"
              disabled={!groupName || selectedMembers.length === 0}
              className={`flex-1 py-2 px-4 rounded-md font-medium ${
                !groupName || selectedMembers.length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-500 text-white'
              }`}
            >
              Create Group
            </button>
            <button
              type="button"
              onClick={() => setPopped(false)}
              className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// GroupsList component
const GroupsList = ({ title, groups, setGroupFormPopped }) => {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showAddExpenseForm, setShowAddExpenseForm] = useState(false);
  
  // Handle group selection
  const handleGroupClick = (group) => {
    setSelectedGroup(group);
  };
  
  // Handle adding an expense to a group
  const handleAddExpense = () => {
    setShowAddExpenseForm(true);
  };
  
  // Render selected group if any
  if (selectedGroup) {
    return (
      <GroupDetails 
        group={selectedGroup} 
        onBack={() => setSelectedGroup(null)} 
        onAddExpense={handleAddExpense}
      />
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white p-4 sticky top-0 z-10 shadow-sm flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
      </div>
      
      {/* Groups List */}
      <div className="flex-1 overflow-auto">
        <div className="bg-white mb-4">
          {groups.map(group => (
            <GroupCard key={group.uuid} group={group} onClick={handleGroupClick} />
          ))}
        </div>
        
        {/* Add Group Button */}
        <div className="p-4">
          <button 
            onClick={() => setGroupFormPopped(true)}
            className="flex items-center justify-center w-full p-3 bg-white rounded-lg border border-gray-200 text-gray-700 font-medium"
          >
            <Plus className="w-5 h-5 mr-2 text-green-500" />
            Create a new group
          </button>
        </div>
      </div>
      
      {/* Add Expense Form Modal - This would typically be imported from another component */}
      {showAddExpenseForm && selectedGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Add an expense</h2>
              <button onClick={() => setShowAddExpenseForm(false)} className="text-gray-500">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-center text-gray-600">
                This would be the expense form component.
                <br />
                For this demo, we're just showing a placeholder.
              </p>
              
              <button
                onClick={() => setShowAddExpenseForm(false)}
                className="w-full mt-6 bg-green-500 text-white py-2 px-4 rounded-md font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main component for the Groups page
export default function GroupsPage() {
  const [groups, setGroups] = useState([]);
  const [groupFormPopped, setGroupFormPopped] = useState(false);
  const [user, setUser] = useState(null);
  const dataFetchedRef = useRef(false);
  
  const checkAuth = async () => {
    try {
      const session = await fetchAuthSession();
      
      if (session && session.tokens && session.tokens.accessToken) {
        localStorage.setItem("access_token", session.tokens.accessToken.toString());
      }
      
      const currentUser = await getCurrentUser();
      
      setUser({
        display_name: currentUser.signInDetails?.userAttributes?.name || currentUser.username,
        handle: currentUser.signInDetails?.userAttributes?.preferred_username || currentUser.username
      });
      
      return session;
    } catch (error) {
      console.log("Error in checkAuth function:", error);
      return null;
    }
  };
  
  const loadGroups = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");
      
      if (!accessToken) {
        return;
      }
      
      // Here you would normally fetch from your API
      // For this example, I'll use sample data if API call fails
      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/expense_groups`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          }
        });
        
        if (res.status === 200) {
          const data = await res.json();
          setGroups(data);
        } else {
          // Fallback to sample data
          setSampleGroups();
        }
      } catch (err) {
        console.log("Error loading groups from API, using sample data:", err);
        setSampleGroups();
      }
    } catch (err) {
      console.log("Error in loadGroups function:", err);
    }
  };
  
  // Helper function to set sample groups data
  const setSampleGroups = () => {
    setGroups([
      {
        uuid: "24b95582-9e7b-4e0a-9ad1-639773ab7552",
        name: "Roommates",
        members_count: 3,
        display_name: "Roommates",
        total_expenses: 128.65,
        your_balance: -42.88,
        created_at: new Date().toISOString(),
        members: [
          { id: 0, name: 'You' },
          { id: 1, name: 'Naveen Vanapalli' },
          { id: 2, name: 'Harshitaa Yarramsetti' }
        ],
        expenses: [
          {
            id: 101,
            description: 'Groceries',
            amount: 84.32,
            paidBy: 'You',
            date: '2025-04-15'
          },
          {
            id: 102,
            description: 'Internet bill',
            amount: 75.00,
            paidBy: 'Naveen Vanapalli',
            date: '2025-04-10'
          }
        ]
      },
      {
        uuid: "417c360e-c4e6-4fce-873b-d2d71469b4ac",
        name: "Trip to Vegas",
        members_count: 4,
        display_name: "Trip to Vegas",
        total_expenses: 524.38,
        your_balance: 128.12,
        created_at: new Date().toISOString(),
        members: [
          { id: 0, name: 'You' },
          { id: 1, name: 'Naveen Vanapalli' },
          { id: 3, name: 'Jadzia Dax' },
          { id: 4, name: 'Worf' }
        ],
        expenses: [
          {
            id: 201,
            description: 'Hotel',
            amount: 320.85,
            paidBy: 'You',
            date: '2025-03-22'
          },
          {
            id: 202,
            description: 'Dinner',
            amount: 203.53,
            paidBy: 'Jadzia Dax',
            date: '2025-03-23'
          }
        ]
      }
    ]);
  };
  
  // Auth and data loading
  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    
    checkAuth()
      .then((session) => {
        if (session && session.tokens) {
          loadGroups();
        }
      })
      .catch((err) => {
        console.log('Error during authentication check:', err);
      });
  }, []);
  
  return (
    <article>
      <DesktopNavigation user={user} active={'groups'} />
      <div className='content'>
        <GroupForm
          popped={groupFormPopped}
          setPopped={setGroupFormPopped}
          setGroups={setGroups}
        />
        <GroupsList
          title="Your Groups"
          groups={groups}
          setGroupFormPopped={setGroupFormPopped}
        />
      </div>
    </article>
  );
}