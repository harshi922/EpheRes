# services/expenses.py
from datetime import datetime, timedelta, timezone

class Expenses:
  def run(user_sender_handle, user_receiver_handle=None):
    model = {
      'errors': None,
      'data': None
    }

    now = datetime.now(timezone.utc).astimezone()

 
    
    results = [
      {
        'uuid': '4e81c06a-db0f-4281-b4cc-98208537772a',
        'created_by': user_sender_handle,
        'display_name': user_sender_handle,
        'description': 'Lunch at Chipotle',
        'amount': '24.32',
        'category': 'Food & Drink',
        'created_at': now.isoformat(),
        'split_with': user_receiver_handle,
        'split_amount': '12.16'
      },
      {
        'uuid': '66e12864-8c26-4c3a-9658-95a10f8fea67',
        'created_by': user_receiver_handle if user_receiver_handle else 'Other User',
        'display_name': user_receiver_handle if user_receiver_handle else 'Other User',
        'description': 'Movie tickets',
        'amount': '32.50',
        'category': 'Entertainment',
        'created_at': now.isoformat(),
        'split_with': user_sender_handle,
        'split_amount': '16.25'
    }]
    model['data'] = results
    return model