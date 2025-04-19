from datetime import datetime, timedelta, timezone

class SearchExpenses:
  def run(search_term):
    model = {
      'errors': None,
      'data': None
    }

    now = datetime.now(timezone.utc).astimezone()

    if search_term == None or len(search_term) < 1:
      model['errors'] = ['search_term_blank']
    else:
      # In a real app, this would search the database
      # For now, return sample data that matches the search term
      results = [{
        'uuid': '248959df-3079-4947-b847-9e0892d1bab4',
        'created_by': 'Andrew Brown',
        'display_name': 'Andrew Brown',
        'description': f'Expense matching {search_term}',
        'amount': '42.99',
        'category': 'Food & Drink',
        'group_name': 'Roommates',
        'created_at': now.isoformat(),
        'split_type': 'equal',
        'participants': [
          {'handle': 'Andrew Brown', 'amount': '21.50'},
          {'handle': 'Worf', 'amount': '21.49'}
        ]
      }]
      model['data'] = results
    return model