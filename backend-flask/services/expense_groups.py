# services/expense_groups.py
from datetime import datetime, timedelta, timezone

class ExpenseGroups:
  def run(user_handle):
    model = {
      'errors': None,
      'data': None
    }

    now = datetime.now(timezone.utc).astimezone()

    if user_handle == None or len(user_handle) < 1:
      model['errors'] = ['user_handle_blank']
      return model

    # In a real app, this would fetch groups from the database
    # Sample data for now
    results = [
      {
        'uuid': '24b95582-9e7b-4e0a-9ad1-639773ab7552',
        'name': 'Roommates',
        'members_count': 3,
        'display_name': 'Roommates',
        'total_expenses': '128.65',
        'your_balance': '-42.88', # Negative = you owe, Positive = owed to you
        'created_at': now.isoformat()
      },
      {
        'uuid': '417c360e-c4e6-4fce-873b-d2d71469b4ac',
        'name': 'Trip to Vegas',
        'members_count': 4,
        'display_name': 'Trip to Vegas',
        'total_expenses': '524.38',
        'your_balance': '128.12',
        'created_at': now.isoformat()
    }]
    model['data'] = results
    return model