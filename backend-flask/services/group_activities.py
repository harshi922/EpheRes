# services/group_activities.py
from datetime import datetime, timedelta, timezone

class GroupActivities:
  def run(group_handle):
    model = {
      'errors': None,
      'data': None
    }

    now = datetime.now(timezone.utc).astimezone()

    if group_handle == None or len(group_handle) < 1:
      model['errors'] = ['blank_group_handle']
    else:
      # In a real app, this would query the database for the specific group
      results = [{
        'uuid': '68f126b0-1ceb-4a33-88be-d90fa7109eee',
        'created_by': 'Andrew Brown',
        'display_name': 'Andrew Brown',
        'description': 'Dinner at Olive Garden',
        'amount': '53.45',
        'category': 'Food & Drink',
        'group_name': group_handle,
        'created_at': (now - timedelta(days=2)).isoformat(),
        'split_type': 'equal',
        'participants': [
          {'handle': 'Worf', 'amount': '17.82'},
          {'handle': 'Zach', 'amount': '17.82'},
          {'handle': 'Andrew Brown', 'amount': '17.81'}
        ]
      },
      {
        'uuid': '66e12864-8c26-4c3a-9658-95a10f8fea67',
        'created_by': 'Worf',
        'display_name': 'Worf',
        'description': 'Groceries',
        'amount': '75.20',
        'category': 'Groceries',
        'group_name': group_handle,
        'created_at': (now - timedelta(days=7)).isoformat(),
        'split_type': 'equal',
        'participants': [
          {'handle': 'Worf', 'amount': '25.07'},
          {'handle': 'Zach', 'amount': '25.07'},
          {'handle': 'Andrew Brown', 'amount': '25.06'}
        ]
      }]
      model['data'] = results
    return model