# services/show_expense.py
from datetime import datetime, timedelta, timezone

class ShowExpense:
  def run(expense_uuid):
    now = datetime.now(timezone.utc).astimezone()
    
    # In a real app, this would fetch the expense from the database
    # Sample expense data for now
    expense = {
      'uuid': expense_uuid,
      'created_by': 'Andrew Brown',
      'display_name': 'Andrew Brown',
      'description': 'Dinner at Fancy Restaurant',
      'amount': '120.75',
      'category': 'Food & Drink',
      'group_name': 'Friends',
      'created_at': (now - timedelta(days=2)).isoformat(),
      'split_type': 'equal',
      'participants': [
        {'handle': 'Worf', 'amount': '40.25', 'paid': False},
        {'handle': 'Jadzia', 'amount': '40.25', 'paid': True},
        {'handle': 'Andrew Brown', 'amount': '40.25', 'paid': True}
      ],
      'notes': 'Birthday celebration dinner',
      'receipt_url': None,  # In a real app, this would be a URL to the receipt image
      'payment_status': 'partial',  # paid, unpaid, partial
      'comments': [
        {
          'uuid': '26e12864-1c26-5c3a-9658-97a10f8fea67',
          'expense_uuid': expense_uuid,
          'handle': 'Worf',
          'message': 'I will pay you next week',
          'created_at': (now - timedelta(days=1)).isoformat()
        }
      ]
    }
    
    return expense