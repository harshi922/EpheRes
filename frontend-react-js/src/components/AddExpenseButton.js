import './AddExpenseButton.css';
import React from 'react';

export default function AddExpenseButton(props) {
  const openExpenseForm = (event) => {
    event.preventDefault();
    props.setPopped(true);
  }

  return (
    <button onClick={openExpenseForm} className='add_expense_button'>
      + Add Expense
    </button>
  );
}