import './GroupForm.css';
import React from "react";
import process from 'process';

export default function GroupForm(props) {
  const [name, setName] = React.useState('');
  const [members, setMembers] = React.useState('');
  const [errors, setErrors] = React.useState('');

  const onsubmit = async (event) => {
    event.preventDefault();
    setErrors('');
    try {
      const backend_url = `${process.env.REACT_APP_BACKEND_URL}/api/groups`
      const res = await fetch(backend_url, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          group_name: name,
          members: members.split(',').map(m => m.trim())
        }),
      });
      let data = await res.json();
      if (res.status === 200) {
        // add group to the list
        props.setGroups(current => [data,...current]);
        // reset and close the form
        setName('')
        setMembers('')
        props.setPopped(false)
      } else {
        setErrors(data.errors ? data.errors.join(', ') : 'An error occurred')
      }
    } catch (err) {
      console.log(err);
      setErrors('An error occurred');
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
          <button type='submit'>Create Group</button>
          <button type='button' onClick={() => props.setPopped(false)}>Cancel</button>
        </div>
      </form>
    );
  }
}