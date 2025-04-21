import React from 'react';
import { Users, Plus } from 'lucide-react';

const GroupsList = ({ groups = [], setGroupFormPopped, isLoading, title = "Groups" }) => {
  const formatAmount = (amount) => {
    if (!amount) return '$0.00';
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      signDisplay: 'never'
    }).format(Math.abs(parseFloat(amount)));
  };
  
  const formatBalance = (balance) => {
    if (!balance) return '$0.00';
    const balanceNum = parseFloat(balance);
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      signDisplay: 'always'
    }).format(balanceNum);
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-5 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">{title}</h2>
        <button
          onClick={() => setGroupFormPopped(true)}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <Plus size={16} className="mr-1" />
          New Group
        </button>
      </div>
      
      {isLoading ? (
        <div className="p-4 text-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-green-500 rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-500">Loading groups...</p>
        </div>
      ) : groups.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {groups.map(group => (
            <li key={group.uuid || group.id}>
              <a 
                href={`/groups/${group.uuid || group.id}`} 
                className="block hover:bg-gray-50"
              >
                <div className="px-4 py-4 flex items-center">
                  <div className="min-w-0 flex-1 flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                        <Users className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1 px-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {group.name}
                        </p>
                        <p className="mt-1 flex items-center text-sm text-gray-500">
                          <span className="truncate">{group.members_count || 0} members</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="text-sm text-gray-900">
                      {formatAmount(group.total_expenses)}
                    </p>
                    <p className={`mt-1 text-sm font-medium ${
                      parseFloat(group.your_balance) < 0 ? 'text-red-600' : 
                      parseFloat(group.your_balance) > 0 ? 'text-green-600' : 
                      'text-gray-500'
                    }`}>
                      {formatBalance(group.your_balance)}
                    </p>
                  </div>
                </div>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <div className="py-12 px-4">
          <div className="text-center">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No groups</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new group.
            </p>
            <div className="mt-6">
              <button
                onClick={() => setGroupFormPopped(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Plus size={16} className="-ml-1 mr-2" />
                New Group
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupsList;