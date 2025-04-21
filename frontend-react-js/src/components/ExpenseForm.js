// // import './ExpenseForm.css';
// // import React, { useState } from "react";
// // import process from 'process';

// // export default function ExpenseForm(props) {
// //   const [description, setDescription] = useState('');
// //   const [amount, setAmount] = useState('');
// //   const [groupId, setGroupId] = useState('');
// //   const [category, setCategory] = useState('');
// //   const [participants, setParticipants] = useState([]);
// //   const [splitType, setSplitType] = useState('equal');
// //   const [errors, setErrors] = useState('');
// //   const [isSubmitting, setIsSubmitting] = useState(false);

// //   const onsubmit = async (event) => {
// //     event.preventDefault();
// //     setErrors('');
// //     setIsSubmitting(true);
    
// //     try {
// //       // Validate inputs
// //       if (!description.trim()) {
// //         setErrors('Description is required');
// //         setIsSubmitting(false);
// //         return;
// //       }
      
// //       if (!amount || parseFloat(amount) <= 0) {
// //         setErrors('Valid amount is required');
// //         setIsSubmitting(false);
// //         return;
// //       }
      
// //       // Get token from localStorage (set during authentication)
// //       const token = localStorage.getItem('access_token');
// //       if (!token) {
// //         setErrors('You must be logged in to create expenses');
// //         setIsSubmitting(false);
// //         return;
// //       }
      
// //       const backend_url = `${process.env.REACT_APP_BACKEND_URL}/api/expenses`;
// //       const res = await fetch(backend_url, {
// //         method: "POST",
// //         headers: {
// //           'Accept': 'application/json',
// //           'Content-Type': 'application/json',
// //           'Authorization': `Bearer ${token}`
// //         },
// //         body: JSON.stringify({
// //           description: description,
// //           amount: amount,
// //           group_id: groupId || null,
// //           category: category || null,
// //           participants: participants,
// //           split_type: splitType
// //         }),
// //       });
      
// //       const data = await res.json();
      
// //       if (res.status === 200) {
// //         // Add expense to the feed
// //         if (props.setExpenses) {
// //           props.setExpenses(current => [data,...current]);
// //         }
        
// //         // Reset form
// //         setDescription('');
// //         setAmount('');
// //         setGroupId('');
// //         setCategory('');
// //         setSplitType('equal');
// //         setParticipants([]);
        
// //         // Close the form
// //         props.setPopped(false);
// //       } else {
// //         // Handle error from backend
// //         setErrors(Array.isArray(data.errors) ? data.errors.join(', ') : 'Failed to create expense');
// //       }
// //     } catch (err) {
// //       console.error("Error creating expense:", err);
// //       setErrors('Failed to connect to the server. Please try again.');
// //     } finally {
// //       setIsSubmitting(false);
// //     }
// //   }

// //   const description_onchange = (event) => {
// //     setDescription(event.target.value);
// //   }

// //   const amount_onchange = (event) => {
// //     setAmount(event.target.value);
// //   }

// //   const group_onchange = (event) => {
// //     setGroupId(event.target.value);
// //   }

// //   const category_onchange = (event) => {
// //     setCategory(event.target.value);
// //   }

// //   const splitType_onchange = (event) => {
// //     setSplitType(event.target.value);
// //   }

// //   if (props.popped === true) {
// //     return (
// //       <form 
// //         className='expense_form'
// //         onSubmit={onsubmit}
// //       >
// //         <div className='field'>
// //           <label>Description</label>
// //           <input
// //             type="text"
// //             placeholder="What was this expense for?"
// //             value={description}
// //             onChange={description_onchange}
// //             required
// //           />
// //         </div>
        
// //         <div className='field'>
// //           <label>Amount</label>
// //           <input
// //             type="number"
// //             step="0.01"
// //             placeholder="0.00"
// //             value={amount}
// //             onChange={amount_onchange}
// //             required
// //           />
// //         </div>
        
// //         <div className='field'>
// //           <label>Group</label>
// //           <select value={groupId} onChange={group_onchange}>
// //             <option value="">-- Select a Group --</option>
// //             <option value="group1">Roommates</option>
// //             <option value="group2">Trip to Vegas</option>
// //             <option value="group3">Work Team</option>
// //           </select>
// //         </div>
        
// //         <div className='field'>
// //           <label>Category</label>
// //           <select value={category} onChange={category_onchange}>
// //             <option value="">-- Select a Category --</option>
// //             <option value="food">Food & Drink</option>
// //             <option value="transportation">Transportation</option>
// //             <option value="housing">Housing</option>
// //             <option value="entertainment">Entertainment</option>
// //             <option value="utilities">Utilities</option>
// //             <option value="other">Other</option>
// //           </select>
// //         </div>
        
// //         <div className='field'>
// //           <label>Split Type</label>
// //           <select value={splitType} onChange={splitType_onchange}>
// //             <option value="equal">Split Equally</option>
// //             <option value="exact">Split by Exact Amounts</option>
// //             <option value="percent">Split by Percentages</option>
// //           </select>
// //         </div>
        
// //         {errors && <div className='errors'>{errors}</div>}
        
// //         <div className='submit'>
// //           <button type='submit' disabled={isSubmitting}>
// //             {isSubmitting ? 'Creating...' : 'Add Expense'}
// //           </button>
// //           <button type='button' onClick={() => props.setPopped(false)}>Cancel</button>
// //         </div>
// //       </form>
// //     );
// //   }
// //   return null;
// // }
// import React, { useState, useEffect } from "react";
// import { X } from 'lucide-react';

// const ExpenseForm = ({ onSubmit, onCancel, currentUser, friendsList = [], groupsList = [] }) => {
//   const [description, setDescription] = useState('');
//   const [amount, setAmount] = useState('');
//   const [groupId, setGroupId] = useState('');
//   const [category, setCategory] = useState('');
//   const [splitType, setSplitType] = useState('equal');
//   const [participants, setParticipants] = useState([]);
//   const [errors, setErrors] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [selectedGroup, setSelectedGroup] = useState(null);
//   const [step, setStep] = useState(1); // 1: Basic info, 2: Split details

//   // Categories for expenses
//   const categories = [
//     { id: 'food', name: 'Food & Drink' },
//     { id: 'transportation', name: 'Transportation' },
//     { id: 'housing', name: 'Housing' },
//     { id: 'entertainment', name: 'Entertainment' },
//     { id: 'utilities', name: 'Utilities' },
//     { id: 'shopping', name: 'Shopping' },
//     { id: 'healthcare', name: 'Healthcare' },
//     { id: 'other', name: 'Other' }
//   ];

//   // Update participants when group changes
//   useEffect(() => {
//     if (groupId) {
//       const group = groupsList.find(g => g.id.toString() === groupId);
//       if (group) {
//         setSelectedGroup(group);
//         // Initialize participants from group members, excluding current user
//         const newParticipants = group.members
//           .filter(member => member.id !== currentUser.id)
//           .map(member => ({
//             id: member.id,
//             name: member.name,
//             handle: member.id, // Using ID as handle
//             percentage: 0,
//             amount: 0,
//             selected: true
//           }));
//         setParticipants(newParticipants);
//       }
//     } else {
//       setSelectedGroup(null);
//       setParticipants([]);
//     }
//   }, [groupId, groupsList, currentUser]);

//   // Update participant amounts when split type or total amount changes
//   useEffect(() => {
//     if (splitType === 'equal' && participants.length > 0 && amount) {
//       const totalAmount = parseFloat(amount);
//       const selectedParticipants = participants.filter(p => p.selected);
//       const count = selectedParticipants.length + 1; // +1 for current user
//       const share = (totalAmount / count).toFixed(2);
      
//       const updatedParticipants = participants.map(p => ({
//         ...p,
//         amount: p.selected ? share : 0,
//         percentage: p.selected ? ((100 / count).toFixed(1)) : 0
//       }));
      
//       setParticipants(updatedParticipants);
//     }
//   }, [splitType, amount, participants.map(p => p.selected).join(',')]);

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setErrors('');
//     setIsSubmitting(true);
    
//     try {
//       // Validate basic inputs
//       if (!description.trim()) {
//         setErrors('Description is required');
//         setIsSubmitting(false);
//         return;
//       }
      
//       if (!amount || parseFloat(amount) <= 0) {
//         setErrors('Valid amount is required');
//         setIsSubmitting(false);
//         return;
//       }

//       // If on step 1, advance to step 2
//       if (step === 1) {
//         setStep(2);
//         setIsSubmitting(false);
//         return;
//       }
      
//       // Prepare participants data
//       const selectedParticipants = participants.filter(p => p.selected);
      
//       if (selectedParticipants.length === 0) {
//         setErrors('Select at least one participant');
//         setIsSubmitting(false);
//         return;
//       }
      
//       // Validate split type specific requirements
//       if (splitType === 'percentage') {
//         const totalPercentage = selectedParticipants.reduce((sum, p) => sum + parseFloat(p.percentage || 0), 0);
//         // Add current user's percentage
//         const totalWithUser = totalPercentage + parseFloat(participants.find(p => p.id === currentUser.id)?.percentage || 0);
        
//         if (Math.abs(totalWithUser - 100) > 0.1) { // Allow small rounding errors
//           setErrors(`Total percentage must be 100%. Currently: ${totalWithUser.toFixed(1)}%`);
//           setIsSubmitting(false);
//           return;
//         }
//       } else if (splitType === 'exact') {
//         const totalSpecified = selectedParticipants.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
//         // Add current user's amount
//         const totalWithUser = totalSpecified + parseFloat(participants.find(p => p.id === currentUser.id)?.amount || 0);
        
//         if (Math.abs(totalWithUser - parseFloat(amount)) > 0.01) { // Allow small rounding errors
//           setErrors(`Total amount must equal ${amount}. Currently: ${totalWithUser.toFixed(2)}`);
//           setIsSubmitting(false);
//           return;
//         }
//       }
      
//       // Format the data for submission
//       const formattedParticipants = selectedParticipants.map(p => ({
//         handle: p.handle,
//         amount: p.amount,
//         percentage: p.percentage,
//         paid: false
//       }));
      
//       // Add current user as a participant (always paid)
//       formattedParticipants.push({
//         handle: currentUser.handle,
//         amount: splitType === 'equal' ? 
//           (parseFloat(amount) / (selectedParticipants.length + 1)).toFixed(2) :
//           participants.find(p => p.id === currentUser.id)?.amount || '0',
//         percentage: splitType === 'equal' ? 
//           (100 / (selectedParticipants.length + 1)).toFixed(1) :
//           participants.find(p => p.id === currentUser.id)?.percentage || '0',
//         paid: true
//       });

//       // Create expense object
//       const expenseData = {
//         description,
//         amount: parseFloat(amount),
//         group_id: groupId || null,
//         split_type: splitType,
//         participants: formattedParticipants,
//         category
//       };
      
//       // Submit to parent component
//       if (onSubmit) {
//         onSubmit(expenseData);
//       }
      
//     } catch (err) {
//       console.error("Error in expense form:", err);
//       setErrors('An unexpected error occurred');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const toggleParticipant = (id) => {
//     setParticipants(prev => prev.map(p => 
//       p.id === id ? { ...p, selected: !p.selected } : p
//     ));
//   };

//   const updateParticipantAmount = (id, newAmount) => {
//     setParticipants(prev => prev.map(p => 
//       p.id === id ? { ...p, amount: newAmount } : p
//     ));
//   };

//   const updateParticipantPercentage = (id, newPercentage) => {
//     setParticipants(prev => prev.map(p => 
//       p.id === id ? { ...p, percentage: newPercentage } : p
//     ));
//   };

//   // Reset the form to step 1
//   const resetForm = () => {
//     setStep(1);
//     setErrors('');
//   };

//   // Handle back button in step 2
//   const handleBack = () => {
//     setStep(1);
//     setErrors('');
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-lg overflow-y-auto max-h-screen">
//       <div className="p-6">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-semibold text-gray-800">
//             {step === 1 ? "Add an Expense" : "Split Details"}
//           </h2>
//           <button
//             type="button"
//             onClick={onCancel}
//             className="text-gray-500 hover:text-gray-700"
//           >
//             <X size={24} />
//           </button>
//         </div>

//         {/* Form Steps */}
//         <form onSubmit={handleSubmit}>
//           {step === 1 ? (
//             /* Step 1: Basic Expense Info */
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Description
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="What was this expense for?"
//                   value={description}
//                   onChange={(e) => setDescription(e.target.value)}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
//                   required
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Amount
//                 </label>
//                 <div className="relative">
//                   <span className="absolute left-3 top-2 text-gray-500">$</span>
//                   <input
//                     type="number"
//                     step="0.01"
//                     min="0.01"
//                     placeholder="0.00"
//                     value={amount}
//                     onChange={(e) => setAmount(e.target.value)}
//                     className="w-full pl-8 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
//                     required
//                   />
//                 </div>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Group (optional)
//                 </label>
//                 <select 
//                   value={groupId} 
//                   onChange={(e) => setGroupId(e.target.value)}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
//                 >
//                   <option value="">-- Select a Group --</option>
//                   {groupsList.map(group => (
//                     <option key={group.id} value={group.id}>
//                       {group.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Category (optional)
//                 </label>
//                 <select 
//                   value={category} 
//                   onChange={(e) => setCategory(e.target.value)}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
//                 >
//                   <option value="">-- Select a Category --</option>
//                   {categories.map(cat => (
//                     <option key={cat.id} value={cat.id}>
//                       {cat.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           ) : (
//             /* Step 2: Split Details */
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Split Type
//                 </label>
//                 <select 
//                   value={splitType} 
//                   onChange={(e) => setSplitType(e.target.value)}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
//                 >
//                   <option value="equal">Split Equally</option>
//                   <option value="percentage">Split by Percentages</option>
//                   <option value="exact">Split by Exact Amounts</option>
//                 </select>
//               </div>
              
//               {/* Participants selection */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Select Participants
//                 </label>
//                 <div className="border border-gray-200 rounded-md max-h-60 overflow-y-auto p-2">
//                   {participants.length > 0 ? (
//                     participants.map(participant => (
//                       <div key={participant.id} className="flex items-center p-2 border-b last:border-0">
//                         <input
//                           type="checkbox"
//                           id={`participant-${participant.id}`}
//                           checked={participant.selected}
//                           onChange={() => toggleParticipant(participant.id)}
//                           className="mr-3 h-4 w-4 text-green-500"
//                         />
//                         <label htmlFor={`participant-${participant.id}`} className="flex-grow">
//                           {participant.name}
//                         </label>
                        
//                         {participant.selected && splitType === 'percentage' && (
//                           <div className="w-20">
//                             <input 
//                               type="number"
//                               min="0"
//                               max="100"
//                               step="0.1"
//                               value={participant.percentage}
//                               onChange={(e) => updateParticipantPercentage(participant.id, e.target.value)}
//                               className="w-full p-1 text-right border border-gray-300 rounded-md"
//                             />
//                           </div>
//                         )}
                        
//                         {participant.selected && splitType === 'exact' && (
//                           <div className="w-20">
//                             <input 
//                               type="number"
//                               min="0"
//                               step="0.01"
//                               value={participant.amount}
//                               onChange={(e) => updateParticipantAmount(participant.id, e.target.value)}
//                               className="w-full p-1 text-right border border-gray-300 rounded-md"
//                             />
//                           </div>
//                         )}
                        
//                         {participant.selected && splitType === 'equal' && (
//                           <div className="text-gray-600">
//                             ${amount ? (parseFloat(amount) / (participants.filter(p => p.selected).length + 1)).toFixed(2) : '0.00'}
//                           </div>
//                         )}
//                       </div>
//                     ))
//                   ) : (
//                     groupId ? (
//                       <p className="text-gray-500 p-2">No participants available in this group</p>
//                     ) : (
//                       <p className="text-gray-500 p-2">Select a group to see participants</p>
//                     )
//                   )}
//                 </div>
//               </div>
              
//               {/* Your Share Section */}
//               <div className="p-4 bg-gray-100 rounded-md">
//                 <h3 className="text-md font-medium text-gray-700 mb-2">Your Share</h3>
//                 <div className="flex justify-between items-center">
//                   <span>{currentUser.display_name || 'You'}</span>
                  
//                   {splitType === 'equal' && (
//                     <span className="font-medium">
//                       ${amount && participants.some(p => p.selected) ? 
//                         (parseFloat(amount) / (participants.filter(p => p.selected).length + 1)).toFixed(2) : 
//                         parseFloat(amount).toFixed(2)}
//                     </span>
//                   )}
                  
//                   {splitType === 'percentage' && (
//                     <div className="w-20">
//                       <input 
//                         type="number"
//                         min="0"
//                         max="100"
//                         step="0.1"
//                         placeholder="%"
//                         className="w-full p-1 text-right border border-gray-300 rounded-md"
//                         onChange={(e) => {
//                           const newParticipants = [...participants];
//                           const userParticipant = newParticipants.find(p => p.id === currentUser.id);
//                           if (userParticipant) {
//                             userParticipant.percentage = e.target.value;
//                             setParticipants(newParticipants);
//                           }
//                         }}
//                       />
//                     </div>
//                   )}
                  
//                   {splitType === 'exact' && (
//                     <div className="w-20">
//                       <input 
//                         type="number"
//                         min="0"
//                         step="0.01"
//                         placeholder="$"
//                         className="w-full p-1 text-right border border-gray-300 rounded-md"
//                         onChange={(e) => {
//                           const newParticipants = [...participants];
//                           const userParticipant = newParticipants.find(p => p.id === currentUser.id);
//                           if (userParticipant) {
//                             userParticipant.amount = e.target.value;
//                             setParticipants(newParticipants);
//                           }
//                         }}
//                       />
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}
          
//           {/* Errors Message */}
//           {errors && (
//             <div className="my-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
//               {errors}
//             </div>
//           )}
          
//           {/* Form Actions */}
//           <div className="mt-6 flex justify-between">
//             {step === 1 ? (
//               <>
//                 <button
//                   type="button"
//                   onClick={onCancel}
//                   className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={isSubmitting || !description || !amount}
//                   className={`px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600 ${
//                     (isSubmitting || !description || !amount) ? 'opacity-70 cursor-not-allowed' : ''
//                   }`}
//                 >
//                   Next
//                 </button>
//               </>
//             ) : (
//               <>
//                 <button
//                   type="button"
//                   onClick={handleBack}
//                   className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
//                 >
//                   Back
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className={`px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600 ${
//                     isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
//                   }`}
//                 >
//                   {isSubmitting ? 'Adding...' : 'Add Expense'}
//                 </button>
//               </>
//             )}
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ExpenseForm;
import React, { useState, useEffect } from 'react';
import { X, Users, DollarSign } from 'lucide-react';

const ExpenseForm = ({ 
  onSubmit, 
  onCancel, 
  currentUser, 
  friendsList = [], 
  groupsList = [] 
}) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState(1); // 1: Basic Info, 2: Split Details
  const [groupId, setGroupId] = useState('');
  const [category, setCategory] = useState('');
  const [splitType, setSplitType] = useState('equal');
  const [participants, setParticipants] = useState([]);
  const [errors, setErrors] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Set participants when group changes
  useEffect(() => {
    if (groupId) {
      const selectedGroup = groupsList.find(g => g.id.toString() === groupId.toString());
      if (selectedGroup && selectedGroup.members) {
        setParticipants(selectedGroup.members.map(member => ({
          id: member.id,
          name: member.name,
          amount: 0 // Will be calculated when submitting
        })));
      }
    } else {
      // Reset participants if no group is selected
      setParticipants([]);
    }
  }, [groupId, groupsList]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors('');
    setIsSubmitting(true);
    
    // Basic validation
    if (!description.trim()) {
      setErrors('Description is required');
      setIsSubmitting(false);
      return;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      setErrors('Valid amount is required');
      setIsSubmitting(false);
      return;
    }
    
    // Calculate share amounts based on split type
    let calculatedParticipants = [...participants];
    const totalAmount = parseFloat(amount);
    
    if (splitType === 'equal' && calculatedParticipants.length > 0) {
      const shareAmount = totalAmount / calculatedParticipants.length;
      calculatedParticipants = calculatedParticipants.map(p => ({
        ...p,
        amount: parseFloat(shareAmount.toFixed(2))
      }));
      
      // Adjust for rounding errors
      const totalDistributed = calculatedParticipants.reduce((sum, p) => sum + p.amount, 0);
      if (totalDistributed !== totalAmount) {
        const diff = totalAmount - totalDistributed;
        calculatedParticipants[0].amount = parseFloat((calculatedParticipants[0].amount + diff).toFixed(2));
      }
    }
    
    // If no participants are selected, include at least the current user
    if (calculatedParticipants.length === 0 && currentUser) {
      calculatedParticipants = [{
        id: currentUser.id,
        name: currentUser.display_name,
        amount: totalAmount
      }];
    }
    
    try {
      // Get token from localStorage
      const token = localStorage.getItem('access_token');
      if (!token) {
        setErrors('You must be logged in to create expenses');
        setIsSubmitting(false);
        return;
      }
      
      const expenseData = {
        description,
        amount: totalAmount,
        group_id: groupId || null,
        category,
        participants: calculatedParticipants,
        split_type: splitType
      };
      
      const backend_url = `${process.env.REACT_APP_BACKEND_URL}/api/expenses`;
      const res = await fetch(backend_url, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(expenseData),
      });
      
      if (res.status === 200) {
        const data = await res.json();
        
        // Call the onSubmit callback with the new expense
        if (onSubmit) {
          onSubmit(data);
        }
        
        // Reset the form
        resetForm();
      } else {
        const errorData = await res.json();
        setErrors(Array.isArray(errorData.errors) 
          ? errorData.errors.join(', ') 
          : 'Failed to create expense'
        );
      }
    } catch (err) {
      console.error("Error creating expense:", err);
      setErrors('Failed to connect to the server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const resetForm = () => {
    setDescription('');
    setAmount('');
    setGroupId('');
    setCategory('');
    setSplitType('equal');
    setParticipants([]);
    setStep(1);
    setErrors('');
  };
  
  const handleAmountChange = (e) => {
    // Only allow numbers and decimal point
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setAmount(value);
  };
  
  const handleAddFriend = (friend) => {
    // Check if friend is already in participants
    if (!participants.some(p => p.id === friend.id)) {
      setParticipants([...participants, {
        id: friend.id,
        name: friend.name,
        amount: 0
      }]);
    }
  };
  
  const handleRemoveParticipant = (participantId) => {
    setParticipants(participants.filter(p => p.id !== participantId));
  };
  
  // Format currency
  const formatCurrency = (value) => {
    if (!value) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-auto overflow-hidden">
      <div className="bg-green-500 text-white p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {step === 1 ? 'Add an expense' : 'Split details'}
          </h2>
          <button 
            onClick={onCancel}
            className="text-white hover:bg-green-600 rounded-full p-1"
          >
            <X size={20} />
          </button>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="p-4">
        {step === 1 ? (
          // Step 1: Basic Expense Info
          <div className="space-y-4">
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                id="description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="What was this expense for?"
                required
              />
            </div>
            
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  id="amount"
                  type="text"
                  value={amount}
                  onChange={handleAmountChange}
                  className="w-full p-2 pl-8 border border-gray-300 rounded-md"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="group" className="block text-sm font-medium text-gray-700 mb-1">
                Group (optional)
              </label>
              <select 
                id="group"
                value={groupId} 
                onChange={(e) => setGroupId(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">-- Select a Group --</option>
                {groupsList.map(group => (
                  <option key={group.id} value={group.id}>{group.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category (optional)
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">-- Select a Category --</option>
                <option value="Food & Drink">Food & Drink</option>
                <option value="Transportation">Transportation</option>
                <option value="Housing">Housing</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Utilities">Utilities</option>
                <option value="Shopping">Shopping</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            {errors && (
              <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
                {errors}
              </div>
            )}
            
            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 bg-green-500 text-white rounded-md"
                disabled={!description || !amount}
              >
                Next: Split Details
              </button>
            </div>
          </div>
        ) : (
          // Step 2: Split Details
          <div className="space-y-4">
            <div className="p-3 bg-gray-100 rounded-md">
              <h3 className="font-medium">{description}</h3>
              <p className="text-xl font-bold text-green-600">{formatCurrency(amount)}</p>
            </div>
            
            <div>
              <label htmlFor="splitType" className="block text-sm font-medium text-gray-700 mb-1">
                Split Type
              </label>
              <select
                id="splitType"
                value={splitType}
                onChange={(e) => setSplitType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="equal">Split Equally</option>
                <option value="exact">Split by Exact Amounts</option>
                <option value="percent">Split by Percentages</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Participants
              </label>
              {participants.length > 0 ? (
                <div className="border rounded-md overflow-hidden">
                  {participants.map(participant => (
                    <div key={participant.id} className="flex items-center justify-between p-3 border-b last:border-b-0">
                      <div>{participant.name}</div>
                      {splitType === 'equal' ? (
                        <div className="text-gray-500">Equal split</div>
                      ) : (
                        <input
                          type="text"
                          value={participant.amount || ''}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9.]/g, '');
                            const newParticipants = participants.map(p =>
                              p.id === participant.id ? { ...p, amount: value } : p
                            );
                            setParticipants(newParticipants);
                          }}
                          className="w-24 p-1 border border-gray-300 rounded-md"
                          placeholder="0.00"
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveParticipant(participant.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 bg-gray-100 text-center rounded-md">
                  <p className="text-gray-500">No participants selected</p>
                  <p className="text-sm text-gray-500">Add friends or select a group</p>
                </div>
              )}
              
              {/* Friend selector */}
              {!groupId && (
                <div className="mt-3">
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value=""
                    onChange={(e) => {
                      if (e.target.value) {
                        const friendId = e.target.value;
                        const friend = friendsList.find(f => f.id.toString() === friendId);
                        if (friend) {
                          handleAddFriend({
                            id: friend.id,
                            name: friend.name
                          });
                        }
                        e.target.value = ''; // Reset select after adding
                      }
                    }}
                  >
                    <option value="">-- Add a friend --</option>
                    {friendsList.map(friend => (
                      <option key={friend.id} value={friend.id}>{friend.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            
            {errors && (
              <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
                {errors}
              </div>
            )}
            
            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting || participants.length === 0}
                className="px-4 py-2 bg-green-500 text-white rounded-md disabled:bg-gray-400"
              >
                {isSubmitting ? 'Creating...' : 'Save Expense'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default ExpenseForm;