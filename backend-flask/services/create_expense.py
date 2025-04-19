# services/create_expense.py
import uuid
from datetime import datetime, timedelta, timezone

class CreateExpense:
  def run(user_handle, amount, description, group_id=None, split_type='equal', participants=[], category=None):
    model = {
      'errors': None,
      'data': None
    }

    if user_handle == None or len(user_handle) < 1:
      model['errors'] = ['user_handle_blank']

    if amount == None or float(amount) <= 0:
      model['errors'] = ['invalid_amount']

    if description == None or len(description) < 1:
      model['errors'] = ['description_blank']

    if model['errors']:
      model['data'] = {
        'handle': user_handle,
        'amount': amount,
        'description': description
      }
    else:
      now = datetime.now(timezone.utc).astimezone()
      
      # In a real implementation, we would calculate share amounts based on split_type and participants
      # For simplicity, we're assuming equal splits here
      model['data'] = {
        'uuid': str(uuid.uuid4()),
        'created_by': user_handle,
        'display_name': 'Andrew Brown',  # This would normally be fetched from the database
        'amount': amount,
        'description': description,
        'group_id': group_id,
        'category': category,
        'split_type': split_type,
        'participants': participants,
        'created_at': now.isoformat()
      }
    return model