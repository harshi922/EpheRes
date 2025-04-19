import './ExpenseFeed.css';
import ExpenseItem from './ExpenseItem';

export default function ExpenseFeed(props) {
  return (
    <div className='expense_feed'>
      <div className='expense_feed_heading'>
        <div className='title'>{props.title}</div>
      </div>
      <div className='expense_feed_collection'>
        {props.expenses.map(expense => {
          return <ExpenseItem key={expense.uuid} expense={expense} />
        })}
      </div>
    </div>
  );
}