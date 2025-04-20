import './GroupsList.css';
import { Link } from 'react-router-dom';
import React from 'react';

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
        {props.isLoading ? (
          <div className="p-4 text-center">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-purple-500 rounded-full animate-spin mx-auto mb-2"></div>
            <p>Loading groups...</p>
          </div>
        ) : props.groups && props.groups.length > 0 ? (
          props.groups.map(group => {
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
          })
        ) : (
          <div className="p-4 text-center text-gray-500">
            <p>You don't have any groups yet</p>
            <p className="mt-2">Create a group to start tracking expenses with friends</p>
          </div>
        )}
      </div>
    </div>
  );
}