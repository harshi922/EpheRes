import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';
import './GroupPage.css';
import React from "react";
import { useParams } from 'react-router-dom';

import DesktopNavigation from '../components/DesktopNavigation';
import ExpenseFeed from '../components/ExpenseFeed';
import ExpenseForm from '../components/ExpenseForm';
import Summary from '../components/Summary';

export default function GroupPage() {
  const [expenses, setExpenses] = React.useState([]);
  const [groupDetails, setGroupDetails] = React.useState(null);
  const [popped, setPopped] = React.useState(false);
  const [user, setUser] = React.useState(null);
  const dataFetchedRef = React.useRef(false);
  const params = useParams();

  const checkAuth = async () => {
    try {
      const session = await fetchAuthSession();
      
      if (session && session.tokens && session.tokens.accessToken) {
        localStorage.setItem("access_token", session.tokens.accessToken.toString());
      }
      
      const currentUser = await getCurrentUser();
      
      setUser({
        display_name: currentUser.signInDetails?.userAttributes?.name || currentUser.username,
        handle: currentUser.signInDetails?.userAttributes?.preferred_username || currentUser.username
      });
      
      return session;
    } catch (error) {
      console.log("Error in checkAuth function:", error);
      return null;
    }
  };

  const loadGroupData = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");
      
      if (!accessToken) {
        return;
      }
      
      // In a real app, this would fetch group details from the backend
      // For now, use mock data
      const mockGroupData = {
        uuid: params.groupId,
        name: 'Roommates',
        members: [
          { handle: 'andrewbrown', display_name: 'Andrew Brown' },
          { handle: 'worf', display_name: 'Worf' },
          { handle: 'jadzia', display_name: 'Jadzia Dax' }
        ],
        total_expenses: '453.25',
        your_balance: '-42.75'
      };
      
      setGroupDetails(mockGroupData);
      
      // This would fetch expense data for this group
      // Mock data for now
      const mockExpenses = [
        {
          uuid: '68f126b0-1ceb-4a33-88be-d90fa7109eee',
          created_by: 'Andrew Brown',
          display_name: 'Andrew Brown',
          description: 'Groceries',
          amount: '84.32',
          category: 'Food & Drink',
          group_name: 'Roommates',
          created_at: new Date(Date.now() - 2*24*60*60*1000).toISOString(),
          split_type: 'equal',
          participants: [
            {handle: 'Andrew Brown', amount: '28.11'},
            {handle: 'Worf', amount: '28.11'},
            {handle: 'Jadzia', amount: '28.10'}
          ]
        },
        {
          uuid: '66e12864-8c26-4c3a-9658-95a10f8fea67',
          created_by: 'Worf',
          display_name: 'Worf',
          description: 'Internet bill',
          amount: '75.00',
          category: 'Utilities',
          group_name: 'Roommates',
          created_at: new Date(Date.now() - 5*24*60*60*1000).toISOString(),
          split_type: 'equal',
          participants: [
            {handle: 'Andrew Brown', amount: '25.00'},
            {handle: 'Worf', amount: '25.00'},
            {handle: 'Jadzia', amount: '25.00'}
          ]
        }
      ];
      
      setExpenses(mockExpenses);
      
    } catch (err) {
      console.log("Error loading group data:", err);
    }
  };

  // Auth and data loading
  React.useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    
    checkAuth()
      .then((session) => {
        if (session && session.tokens) {
          loadGroupData();
        }
      })
      .catch((err) => {
        console.log('Error during authentication check:', err);
      });
  }, []);

  return (
    <article>
      <DesktopNavigation user={user} active={'groups'} setPopped={setPopped} />
      <div className='content'>
        <ExpenseForm  
          popped={popped}
          setPopped={setPopped} 
          setExpenses={setExpenses}
          groupId={params.groupId}
        />
        
        {groupDetails && (
          <div className='group_header'>
            <h1>{groupDetails.name}</h1>
            <div className='group_stats'>
              <div className='stat'>
                <span className='label'>Members:</span> 
                <span className='value'>{groupDetails.members.length}</span>
              </div>
              <div className='stat'>
                <span className='label'>Total:</span> 
                <span className='value'>${groupDetails.total_expenses}</span>
              </div>
              <div className='stat'>
                <span className='label'>Your balance:</span> 
                <span className={`value ${parseFloat(groupDetails.your_balance) < 0 ? 'negative' : 'positive'}`}>
                  ${Math.abs(parseFloat(groupDetails.your_balance)).toFixed(2)}
                </span>
              </div>
            </div>
            <button className='add_expense_button' onClick={() => setPopped(true)}>
              + Add Expense
            </button>
          </div>
        )}
        
        <ExpenseFeed 
          title="Group Expenses" 
          expenses={expenses} 
        />
      </div>
    </article>
  );
}