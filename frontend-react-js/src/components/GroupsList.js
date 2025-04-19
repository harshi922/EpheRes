import './GroupsList.css';
import { Link } from 'react-router-dom';

export default function GroupsList(props) {
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      signDisplay: 'always'
    }).format(parseFloat(amount));
  };

  return (
    <div className='groups_list'>
      <div className='groups_list_heading'>
        <div className='title'>{props.title}</div>
        <button className='add_group_btn' onClick={() => props.setGroupFormPopped(true)}>
          + Create Group
        </button>
      </div>
      <div className='groups_list_items'>
        {props.groups.map(group => {
          return (
            <Link to={`/groups/${group.uuid}`} key={group.uuid} className='group_item'>
              <div className='group_avatar'></div>
              <div className='group_content'>
                <div className='group_name'>{group.name}</div>
                <div className='group_info'>
                  <span className='members'>{group.members_count} members</span>
                  <span className='expense_count'>Total: {formatAmount(group.total_expenses)}</span>
                </div>
                <div className='balance' style={{ color: parseFloat(group.your_balance) < 0 ? '#e0695e' : '#5cc689' }}>
                  Your balance: {formatAmount(group.your_balance)}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  );
}