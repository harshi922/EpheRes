import './GroupForm.css';
import React, { useState } from "react";
import process from 'process';

export default function GroupForm(props) {
  const [name, setName] = useState('');
  const [members, setMembers] = useState('');
  const [errors, setErrors] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onsubmit = async (event) => {
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
          members: members ? members.split(',').map(m => m.trim()) : []
        }),
      });
      
      const data = await res.json();
      
      if (res.status === 200) {
        // Add group to the list
        props.setGroups(current => [data,...current]);
        
        // Reset and close the form
        setName('');
        setMembers('');
        props.setPopped(false);
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
  }

  const name_onchange = (event) => {
    setName(event.target.value);
  }

  const members_onchange = (event) => {
    setMembers(event.target.value);
  }

  if (props.popped === true) {
    return (
      <form 
        className='group_form'
        onSubmit={onsubmit}
      >
        <div className='field'>
          <label>Group Name</label>
          <input
            type="text"
            placeholder="Enter a group name"
            value={name}
            onChange={name_onchange}
            required
          />
        </div>
        
        <div className='field'>
          <label>Members (comma separated emails or usernames)</label>
          <textarea
            placeholder="friend1, friend2, friend3"
            value={members}
            onChange={members_onchange}
          />
        </div>
        
        {errors && <div className='errors'>{errors}</div>}
        
        <div className='submit'>
          <button type='submit' disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Group'}
          </button>
          <button type='button' onClick={() => props.setPopped(false)}>Cancel</button>
        </div>
      </form>
    );
  }
  return null;
}