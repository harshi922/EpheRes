# from datetime import datetime, timedelta, timezone
# class UserActivities:
#   def run(user_handle):
#     model = {
#       'errors': None,
#       'data': None
#     }

#     now = datetime.now(timezone.utc).astimezone()

#     if user_handle == None or len(user_handle) < 1:
#       model['errors'] = ['blank_user_handle']
#     else:
#       now = datetime.now()
#       results = [{
#         'uuid': '248959df-3079-4947-b847-9e0892d1bab4',
#         'handle':  'Andrew Brown',
#         'message': 'Cloud is fun!',
#         'created_at': (now - timedelta(days=1)).isoformat(),
#         'expires_at': (now + timedelta(days=31)).isoformat()
#       }]
#       model['data'] = results
#     return model

# services/user_activities.py
from datetime import datetime, timedelta, timezone

class UserActivities:
  def run(user_handle):
    model = {
      'errors': None,
      'data': None
    }

    now = datetime.now(timezone.utc).astimezone()

    if user_handle == None or len(user_handle) < 1:
      model['errors'] = ['blank_user_handle']
    else:
      results = [{
        'uuid': '248959df-3079-4947-b847-9e0892d1bab4',
        'created_by': user_handle,
        'display_name': user_handle,
        'description': 'Monthly Rent',
        'amount': '1200.00',
        'category': 'Housing',
        'group_name': 'Apartment',
        'created_at': (now - timedelta(days=1)).isoformat(),
        'split_type': 'equal',
        'participants': [
          {'handle': user_handle, 'amount': '600.00'},
          {'handle': 'Roommate', 'amount': '600.00'}
        ]
      }]
      model['data'] = results
    return model