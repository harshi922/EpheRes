import './ExpenseItem.css';
import { Link } from "react-router-dom";
import { DateTime } from 'luxon';

export default function ExpenseItem(props) {
  const format_time_created_at = (value) => {
    const past = DateTime.fromISO(value)
    const now = DateTime.now()
    const diff_mins = now.diff(past, 'minutes').toObject().minutes;
    const diff_hours = now.diff(past, 'hours').toObject().hours;

    if (diff_hours > 24.0){
      return past.toFormat("LLL L");
    } else if (diff_hours < 24.0 && diff_hours > 1.0) {
      return `${Math.floor(diff_hours)}h ago`;
    } else if (diff_hours < 1.0) {
      return `${Math.round(diff_mins)}m ago`;
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(parseFloat(amount));
  };

  return (
    <div className='expense_item'>
      <div className='expense_avatar'></div>
      <div className='expense_content'>
        <div className='expense_meta'>
          <div className='expense_identity'>
            <div className='display_name'>{props.expense.display_name}</div>
            <div className="handle">paid {formatAmount(props.expense.amount)}</div>
          </div>
          <div className='expense_time'>
            <div className="created_at" title={props.expense.created_at}>
              <span className='ago'>{format_time_created_at(props.expense.created_at)}</span> 
            </div>
          </div>
        </div>
        <div className="description">{props.expense.description}</div>
        {props.expense.group_name && 
          <div className="group">
            <span className="label">Group:</span> {props.expense.group_name}
          </div>
        }
        <div className="splits">
          {props.expense.participants && props.expense.participants.map((participant, index) => (
            <div key={index} className="participant">
              <span className="name">{participant.handle}</span>
              <span className="amount">{formatAmount(participant.amount)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}