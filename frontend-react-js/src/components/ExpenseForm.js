import './ExpenseForm.css';
import React from "react";
import process from 'process';

export default function ExpenseForm(props) {
  const [description, setDescription] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [groupId, setGroupId] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [participants, setParticipants] = React.useState([]);
  const [splitType, setSplitType] = React.useState('equal');
  const [errors, setErrors] = React.useState('');

  const onsubmit = async (event) => {
    event.preventDefault();
    setErrors('');
    try {
      const backend_url = `${process.env.REACT_APP_BACKEND_URL}/api/expenses`
      const res = await fetch(backend_url, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          description: description,
          amount: amount,
          group_id: groupId,
          category: category,
          participants: participants,
          split_type: splitType
        }),
      });
      let data = await res.json();
      if (res.status === 200) {
        // add expense to the feed
        props.setExpenses(current => [data,...current]);
        // reset and close the form
        setDescription('')
        setAmount('')
        setGroupId('')
        setSplitType('equal')
        props.setPopped(false)
      } else {
        setErrors(data.errors.join(', '))
      }
    } catch (err) {
      console.log(err);
      setErrors('An error occurred');
    }
  }

  const description_onchange = (event) => {
    setDescription(event.target.value);
  }

  const amount_onchange = (event) => {
    setAmount(event.target.value);
  }

  const group_onchange = (event) => {
    setGroupId(event.target.value);
  }

  const category_onchange = (event) => {
    setCategory(event.target.value);
  }

  const splitType_onchange = (event) => {
    setSplitType(event.target.value);
  }

  if (props.popped === true) {
    return (
      <form 
        className='expense_form'
        onSubmit={onsubmit}
      >
        <div className='field'>
          <label>Description</label>
          <input
            type="text"
            placeholder="What was this expense for?"
            value={description}
            onChange={description_onchange}
            required
          />
        </div>
        
        <div className='field'>
          <label>Amount</label>
          <input
            type="number"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={amount_onchange}
            required
          />
        </div>
        
        <div className='field'>
          <label>Group</label>
          <select value={groupId} onChange={group_onchange}>
            <option value="">-- Select a Group --</option>
            <option value="group1">Roommates</option>
            <option value="group2">Trip to Vegas</option>
            <option value="group3">Work Team</option>
          </select>
        </div>
        
        <div className='field'>
          <label>Category</label>
          <select value={category} onChange={category_onchange}>
            <option value="">-- Select a Category --</option>
            <option value="food">Food & Drink</option>
            <option value="transportation">Transportation</option>
            <option value="housing">Housing</option>
            <option value="entertainment">Entertainment</option>
            <option value="utilities">Utilities</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div className='field'>
          <label>Split Type</label>
          <select value={splitType} onChange={splitType_onchange}>
            <option value="equal">Split Equally</option>
            <option value="exact">Split by Exact Amounts</option>
            <option value="percent">Split by Percentages</option>
          </select>
        </div>
        
        {errors && <div className='errors'>{errors}</div>}
        
        <div className='submit'>
          <button type='submit'>Add Expense</button>
          <button type='button' onClick={() => props.setPopped(false)}>Cancel</button>
        </div>
      </form>
    );
  }
}