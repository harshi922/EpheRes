// import './ExpenseForm.css';
// import React from "react";
// import process from 'process';

// export default function ExpenseForm(props) {
//   const [description, setDescription] = React.useState('');
//   const [amount, setAmount] = React.useState('');
//   const [groupId, setGroupId] = React.useState('');
//   const [category, setCategory] = React.useState('');
//   const [participants, setParticipants] = React.useState([]);
//   const [splitType, setSplitType] = React.useState('equal');
//   const [errors, setErrors] = React.useState('');

//   const onsubmit = async (event) => {
//     event.preventDefault();
//     setErrors('');
//     try {
//       const backend_url = `${process.env.REACT_APP_BACKEND_URL}/api/expenses`
//       const res = await fetch(backend_url, {
//         method: "POST",
//         headers: {
//           'Accept': 'application/json',
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           description: description,
//           amount: amount,
//           group_id: groupId,
//           category: category,
//           participants: participants,
//           split_type: splitType
//         }),
//       });
//       let data = await res.json();
//       if (res.status === 200) {
//         // add expense to the feed
//         props.setExpenses(current => [data,...current]);
//         // reset and close the form
//         setDescription('');
//         setAmount('');
//         setGroupId('');
//         setSplitType('equal');
//         props.setPopped(false);
//       } else {
//         setErrors(data.errors ? data.errors.join(', ') : 'An error occurred');
//       }
//     } catch (err) {
//       console.log(err);
//       setErrors('An error occurred');
//     }
//   }

//   const description_onchange = (event) => {
//     setDescription(event.target.value);
//   }

//   const amount_onchange = (event) => {
//     setAmount(event.target.value);
//   }

//   const group_onchange = (event) => {
//     setGroupId(event.target.value);
//   }

//   const category_onchange = (event) => {
//     setCategory(event.target.value);
//   }

//   const splitType_onchange = (event) => {
//     setSplitType(event.target.value);
//   }

//   if (props.popped === true) {
//     return (
//       <form 
//         className='expense_form'
//         onSubmit={onsubmit}
//       >
//         <div className='field'>
//           <label>Description</label>
//           <input
//             type="text"
//             placeholder="What was this expense for?"
//             value={description}
//             onChange={description_onchange}
//             required
//           />
//         </div>
        
//         <div className='field'>
//           <label>Amount</label>
//           <input
//             type="number"
//             step="0.01"
//             placeholder="0.00"
//             value={amount}
//             onChange={amount_onchange}
//             required
//           />
//         </div>
        
//         <div className='field'>
//           <label>Group</label>
//           <select value={groupId} onChange={group_onchange}>
//             <option value="">-- Select a Group --</option>
//             <option value="group1">Roommates</option>
//             <option value="group2">Trip to Vegas</option>
//             <option value="group3">Work Team</option>
//           </select>
//         </div>
        
//         <div className='field'>
//           <label>Category</label>
//           <select value={category} onChange={category_onchange}>
//             <option value="">-- Select a Category --</option>
//             <option value="food">Food & Drink</option>
//             <option value="transportation">Transportation</option>
//             <option value="housing">Housing</option>
//             <option value="entertainment">Entertainment</option>
//             <option value="utilities">Utilities</option>
//             <option value="other">Other</option>
//           </select>
//         </div>
        
//         <div className='field'>
//           <label>Split Type</label>
//           <select value={splitType} onChange={splitType_onchange}>
//             <option value="equal">Split Equally</option>
//             <option value="exact">Split by Exact Amounts</option>
//             <option value="percent">Split by Percentages</option>
//           </select>
//         </div>
        
//         {errors && <div className='errors'>{errors}</div>}
        
//         <div className='submit'>
//           <button type='submit'>Add Expense</button>
//           <button type='button' onClick={() => props.setPopped(false)}>Cancel</button>
//         </div>
//       </form>
//     );
//   }
//   return null;
// }

import React, { useState, useEffect } from 'react';
import { User, ChevronLeft, Check, FileText, DollarSign, Calendar, Camera, Users } from 'lucide-react';

const ExpenseForm = ({ onSubmit, onCancel, currentUser, friendsList, groupsList }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [paidBy, setPaidBy] = useState(currentUser);
  const [splitType, setSplitType] = useState('equal'); // 'equal', 'unequal', 'shares'
  const [splitView, setSplitView] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  // If a group is selected, automatically select all members
  useEffect(() => {
    if (selectedGroup) {
      setSelectedFriends(selectedGroup.members.filter(member => member.id !== currentUser.id));
    }
  }, [selectedGroup, currentUser]);
  
  const handleSubmit = () => {
    // Calculate shares based on split type
    let shares = [];
    
    if (splitType === 'equal') {
      const totalMembers = selectedFriends.length + 1; // +1 for current user
      const amountPerPerson = parseFloat(amount) / totalMembers;
      
      // Current user share
      shares.push({
        user: currentUser,
        amount: paidBy.id === currentUser.id ? 0 : amountPerPerson // If they paid, they don't owe themselves
      });
      
      // Friends shares
      selectedFriends.forEach(friend => {
        shares.push({
          user: friend,
          amount: paidBy.id === friend.id ? 0 : amountPerPerson // If they paid, they don't owe themselves
        });
      });
    }
    
    // Create the expense object
    const expense = {
      description,
      amount: parseFloat(amount),
      paidBy,
      splitType,
      shares,
      group: selectedGroup,
      participants: [currentUser, ...selectedFriends],
      date
    };
    
    onSubmit(expense);
  };
  
  // Toggle friend selection
  const toggleFriend = (friend) => {
    if (selectedFriends.some(f => f.id === friend.id)) {
      setSelectedFriends(selectedFriends.filter(f => f.id !== friend.id));
    } else {
      setSelectedFriends([...selectedFriends, friend]);
    }
  };
  
  // Determine if the form is valid and can be submitted
  const isFormValid = description && amount > 0 && (selectedFriends.length > 0 || selectedGroup);

  // Render the main expense form
  if (!splitView) {
    return (
      <div className="flex flex-col h-full bg-white">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center">
            <button onClick={onCancel} className="mr-4">
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">Add expense</h1>
          </div>
          <button 
            onClick={handleSubmit} 
            disabled={!isFormValid} 
            className={`${isFormValid ? 'text-green-500' : 'text-gray-400'}`}
          >
            <Check className="w-6 h-6" />
          </button>
        </div>
        
        {/* Participants Section */}
        <div className="p-4 border-b">
          <div className="flex items-center">
            <span className="text-gray-700 font-medium">With you and:</span>
            <div className="ml-2 flex items-center bg-gray-100 rounded-full px-3 py-1">
              <div className="w-6 h-6 bg-red-400 rounded-full mr-2"></div>
              <span>{selectedFriends.length > 0 ? selectedFriends[0].name : 'Select friends'}</span>
            </div>
          </div>
        </div>
        
        {/* Description & Amount Section */}
        <div className="p-4">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-lg mr-4">
              <FileText className="w-6 h-6 text-gray-600" />
            </div>
            <input
              type="text"
              placeholder="Enter a description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="flex-1 text-gray-800 text-lg border-b focus:outline-none focus:border-gray-400"
            />
          </div>
          
          <div className="flex items-center">
            <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-lg mr-4">
              <DollarSign className="w-6 h-6 text-gray-600" />
            </div>
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 text-gray-800 text-3xl border-b focus:outline-none focus:border-gray-400"
            />
          </div>
        </div>
        
        {/* Split Option Section */}
        <div className="p-4 mt-4">
          <button 
            onClick={() => setSplitView(true)} 
            className="w-full py-3 px-4 bg-gray-100 rounded-lg text-left text-gray-800 font-medium"
          >
            {`Paid by ${paidBy.name === currentUser.name ? 'you' : paidBy.name} and split ${splitType === 'equal' ? 'equally' : 'unequally'}.`}
          </button>
        </div>
        
        {/* Action Buttons */}
        <div className="mt-auto p-4 flex justify-around border-t">
          <button className="flex flex-col items-center text-gray-600">
            <Users className="w-6 h-6 mb-1" />
            <span className="text-xs">Choose group</span>
          </button>
          <button className="flex flex-col items-center text-gray-600">
            <Calendar className="w-6 h-6 mb-1" />
            <span className="text-xs">Date</span>
          </button>
          <button className="flex flex-col items-center text-gray-600">
            <Camera className="w-6 h-6 mb-1" />
            <span className="text-xs">Photo</span>
          </button>
        </div>
      </div>
    );
  }
  
  // Render the split view
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <button onClick={() => setSplitView(false)} className="mr-4">
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">Adjust split</h1>
        </div>
        <button onClick={() => setSplitView(false)} className="text-green-500">
          <Check className="w-6 h-6" />
        </button>
      </div>
      
      {/* Paid By Section */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-700 rounded-full mr-4"></div>
            <div>
              <span className="text-gray-600">Paid by</span>
              <h3 className="text-xl font-semibold text-gray-800">{paidBy.name}</h3>
            </div>
          </div>
          <button className="text-gray-600">
            <span className="w-6 h-6">✏️</span>
          </button>
        </div>
      </div>
      
      {/* Split Type Tabs */}
      <div className="flex border-b">
        <button 
          onClick={() => setSplitType('equal')} 
          className={`flex-1 py-4 text-center font-medium ${splitType === 'equal' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-600'}`}
        >
          Equally
        </button>
        <button 
          onClick={() => setSplitType('unequal')} 
          className={`flex-1 py-4 text-center font-medium ${splitType === 'unequal' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-600'}`}
        >
          Unequally
        </button>
      </div>
      
      {/* Split Icons */}
      <div className="flex justify-around p-4 border-b">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 mb-2">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <rect x="10" y="20" width="80" height="60" fill="#a5e8e1" stroke="#000" strokeWidth="2" />
              <rect x="25" y="40" width="50" height="30" fill="#a5e8e1" stroke="#000" strokeWidth="2" />
              <rect x="40" y="60" width="20" height="15" fill="#a5e8e1" stroke="#000" strokeWidth="2" />
            </svg>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 mb-2">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <path d="M50,10 L90,50 L70,90 L30,90 L10,50 Z" fill="#3b82f6" stroke="#000" strokeWidth="2" />
              <circle cx="40" cy="45" r="8" fill="#fff" stroke="#000" strokeWidth="1" />
              <circle cx="60" cy="45" r="8" fill="#fff" stroke="#000" strokeWidth="1" />
              <path d="M30,60 Q50,75 70,60" fill="none" stroke="#000" strokeWidth="2" />
            </svg>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 mb-2">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <path d="M50,10 L90,50 L70,90 L30,90 L10,50 Z" fill="#e11d48" stroke="#000" strokeWidth="2" />
              <circle cx="40" cy="45" r="8" fill="#fff" stroke="#000" strokeWidth="1" />
              <circle cx="60" cy="45" r="8" fill="#fff" stroke="#000" strokeWidth="1" />
              <path d="M30,60 Q50,75 70,60" fill="none" stroke="#000" strokeWidth="2" />
            </svg>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 mb-2">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <path d="M50,10 L90,50 L70,90 L30,90 L10,50 Z" fill="#a855f7" stroke="#000" strokeWidth="2" />
              <circle cx="40" cy="45" r="8" fill="#fff" stroke="#000" strokeWidth="1" />
              <circle cx="60" cy="45" r="8" fill="#fff" stroke="#000" strokeWidth="1" />
              <path d="M30,60 Q50,75 70,60" fill="none" stroke="#000" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Split Title */}
      <div className="text-center p-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Split equally</h2>
        <p className="text-gray-600">Select which people owe an equal share.</p>
      </div>
      
      {/* Participants List */}
      <div className="flex-1 overflow-auto p-4">
        {[currentUser, ...selectedFriends].map(person => (
          <div key={person.id} className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-700 rounded-full mr-4"></div>
              <span className="text-lg text-gray-800">{person.name}</span>
            </div>
            <div className={`w-6 h-6 rounded-md border flex items-center justify-center ${person.id === currentUser.id ? 'bg-green-500 text-white border-green-500' : 'border-green-500'}`}>
              {person.id === currentUser.id && <Check className="w-4 h-4" />}
            </div>
          </div>
        ))}
        
        <div className="mt-8 flex items-center justify-between">
          <span className="text-gray-800 text-lg">${(amount / (selectedFriends.length + 1)).toFixed(2)}/person</span>
          <span className="text-gray-600">({selectedFriends.length + 1} people)</span>
        </div>
      </div>
      
      {/* Footer */}
      <div className="p-4 border-t">
        <button className="w-full py-2 bg-green-500 text-white rounded-md font-medium">
          All
        </button>
      </div>
    </div>
  );
};

export default ExpenseForm;