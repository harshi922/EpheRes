# from datetime import datetime, timedelta, timezone
# from opentelemetry import trace

# tracer = trace.get_tracer("home.activities")

# class HomeActivities:
#   def run(cognito_user_id=None):
#     # Start with tracing (commented out but kept for reference)
#     # with tracer.start_as_current_span("home-activities-trace"):
#     #   span = trace.get_current_span()
    
#     now = datetime.now(timezone.utc).astimezone()
    
#     # Log authenticated user if available (useful for debugging)
#     # if cognito_user_id:
#       # You could log this for debugging
#       # print(f"Authenticated user: {cognito_user_id}")
    
#     results = [{
#         'uuid': '68f126b0-1ceb-4a33-88be-d90fa7109eee',
#         'handle':  'Andrew Brown',
#         'message': 'Cloud is fun!',
#         'created_at': (now - timedelta(days=2)).isoformat(),
#         'expires_at': (now + timedelta(days=5)).isoformat(),
#         'likes_count': 5,
#         'replies_count': 1,
#         'reposts_count': 0,
#         'replies': [{
#           'uuid': '26e12864-1c26-5c3a-9658-97a10f8fea67',
#           'reply_to_activity_uuid': '68f126b0-1ceb-4a33-88be-d90fa7109eee',
#           'handle':  'Worf',
#           'message': 'This post has no honor!',
#           'likes_count': 0,
#           'replies_count': 0,
#           'reposts_count': 0,
#           'created_at': (now - timedelta(days=2)).isoformat()
#         }],
#       },
#       {
#         'uuid': '66e12864-8c26-4c3a-9658-95a10f8fea67',
#         'handle':  'Worf',
#         'message': 'I am out of prune juice',
#         'created_at': (now - timedelta(days=7)).isoformat(),
#         'expires_at': (now + timedelta(days=9)).isoformat(),
#         'likes_count': 0,  # Changed from 'likes' to 'likes_count' for consistency
#         'replies_count': 0,  # Added missing field
#         'reposts_count': 0,  # Added missing field
#         'replies': []
#       },
#       {
#         'uuid': '248959df-3079-4947-b847-9e0892d1bab4',
#         'handle':  'Garek',
#         'message': 'My dear doctor, I am just simple tailor',
#         'created_at': (now - timedelta(hours=1)).isoformat(),
#         'expires_at': (now + timedelta(hours=12)).isoformat(),
#         'likes_count': 0,  # Changed from 'likes' to 'likes_count' for consistency
#         'replies_count': 0,  # Added missing field
#         'reposts_count': 0,  # Added missing field
#         'replies': []
#       }
#     ]

#     if cognito_user_id != None:
#        extra = {
#         'uuid': '2sd59df-3079-4947-b847-9e0892d1bab4',
#         'handle':  'Garek',
#         'message': 'Auth wala',
#         'created_at': (now - timedelta(hours=1)).isoformat(),
#         'expires_at': (now + timedelta(hours=12)).isoformat(),
#         'likes_count': 0,  # Changed from 'likes' to 'likes_count' for consistency
#         'replies_count': 0,  # Added missing field
#         'reposts_count': 0,  # Added missing field
#         'replies': []
#       }
#     results.insert(0, extra)
     

    
#     return results


# services/home_activities.py
from datetime import datetime, timedelta, timezone

class HomeActivities:
  def run(cognito_user_id=None):
    now = datetime.now(timezone.utc).astimezone()
    
    # This would normally be fetched from the database
    # In a production environment, we would query expenses from DynamoDB or RDS
    results = [{
      'uuid': '68f126b0-1ceb-4a33-88be-d90fa7109eee',
      'created_by': 'Andrew Brown',
      'display_name': 'Andrew Brown',
      'description': 'Dinner at Olive Garden',
      'amount': '53.45',
      'category': 'Food & Drink',
      'group_name': 'Roommates',
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
      'group_name': 'Roommates',
      'created_at': (now - timedelta(days=7)).isoformat(),
      'split_type': 'equal',
      'participants': [
        {'handle': 'Worf', 'amount': '25.07'},
        {'handle': 'Zach', 'amount': '25.07'},
        {'handle': 'Andrew Brown', 'amount': '25.06'}
      ]
    },
    {
      'uuid': '248959df-3079-4947-b847-9e0892d1bab4',
      'created_by': 'Garek',
      'display_name': 'Garek',
      'description': 'Movie tickets',
      'amount': '24.99',
      'category': 'Entertainment',
      'group_name': 'Trip to Vegas',
      'created_at': (now - timedelta(hours=1)).isoformat(),
      'split_type': 'equal',
      'participants': [
        {'handle': 'Garek', 'amount': '8.33'},
        {'handle': 'Jadzia', 'amount': '8.33'},
        {'handle': 'Andrew Brown', 'amount': '8.33'}
      ]
    }]
    
    # If the user is authenticated, we might want to show an extra expense
    if cognito_user_id != None:
      extra = {
        'uuid': '2sd59df-3079-4947-b847-9e0892d1bab4',
        'created_by': 'Picard',
        'display_name': 'Picard',
        'description': 'Enterprise repair bill',
        'amount': '999.99',
        'category': 'Transportation',
        'group_name': 'Starfleet',
        'created_at': (now - timedelta(hours=1)).isoformat(),
        'split_type': 'percentage',
        'participants': [
          {'handle': 'Picard', 'amount': '499.99'},
          {'handle': 'Riker', 'amount': '300.00'},
          {'handle': 'Andrew Brown', 'amount': '200.00'}
        ]
      }
      results.insert(0, extra)
    
    return results