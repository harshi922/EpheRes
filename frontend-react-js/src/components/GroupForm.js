import React, { useState } from "react";
import { X, Users } from 'lucide-react';

const GroupForm = ({ popped, setPopped, onSubmit }) => {
  const [name, setName] = useState('');
  const [members, setMembers] = useState('');
  const [errors, setErrors] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors('');
    setIsSubmitting(true);
    
    try {
      // Validate inputs
      if (!name.trim()) {
        setErrors('Group name is required');
        setIsSubmitting(false);
        return;
      }
      
      // Get token from localStorage
      const token = localStorage.getItem('access_token');
      if (!token) {
        setErrors('You must be logged in to create groups');
        setIsSubmitting(false);
        return;
      }
      
      // Parse members string into array
      const membersArray = members
        ? members.split(',').map(m => m.trim()).filter(m => m.length > 0)
        : [];
      
      const backend_url = `${process.env.REACT_APP_BACKEND_URL}/api/groups`;
      const res = await fetch(backend_url, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          group_name: name,
          members: membersArray
        }),
      });
      
      const data = await res.json();
      
      if (res.status === 200) {
        // Reset and close the form
        setName('');
        setMembers('');
        setPopped(false);
        
        // Execute any onSubmit callback
        if (onSubmit) {
          onSubmit(data);
        }
      } else {
        // Handle backend errors
        setErrors(Array.isArray(data.errors) ? data.errors.join(', ') : 'Failed to create group');
      }
    } catch (err) {
      console.error("Error creating group:", err);
      setErrors('Failed to connect to the server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!popped) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Create a New Group</h2>
          <button 
            onClick={() => setPopped(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Group Name
            </label>
            <input
              type="text"
              id="name"
              className="focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md py-3"
              placeholder="Enter a group name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="members" className="block text-sm font-medium text-gray-700 mb-1">
              Members (comma separated emails or usernames)
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Users size={16} className="text-gray-400" />
              </div>
              <textarea
                id="members"
                className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3"
                placeholder="friend1, friend2, friend3"
                value={members}
                onChange={(e) => setMembers(e.target.value)}
                rows={3}
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              These people will be invited to join your group
            </p>
          </div>
          
          {errors && (
            <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {errors}
            </div>
          )}
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setPopped(false)}
              className="flex-1 bg-gray-200 py-3 text-gray-800 rounded-md font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 py-3 text-white bg-green-500 hover:bg-green-600 font-medium rounded-md ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Creating...' : 'Create Group'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GroupForm;