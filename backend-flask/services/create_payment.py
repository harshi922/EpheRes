import uuid
from datetime import datetime, timedelta, timezone

class CreatePayment:
  def run(user_handle, recipient_handle, amount, note=''):
    model = {
      'errors': None,
      'data': None
    }

    now = datetime.now(timezone.utc).astimezone()

    if user_handle == None or len(user_handle) < 1:
      model['errors'] = ['user_handle_blank']

    if recipient_handle == None or len(recipient_handle) < 1:
      model['errors'] = ['recipient_handle_blank']

    if amount == None or float(amount) <= 0:
      model['errors'] = ['invalid_amount']

    if model['errors']:
      model['data'] = {
        'payer': user_handle,
        'recipient': recipient_handle,
        'amount': amount,
        'note': note
      }
    else:
      # In a real app, this would create a payment record in the database
      model['data'] = {
        'uuid': str(uuid.uuid4()),
        'payer': user_handle,
        'payer_display_name': user_handle,  # Would fetch from user profile
        'recipient': recipient_handle,
        'recipient_display_name': recipient_handle,  # Would fetch from user profile
        'amount': str(amount),
        'note': note,
        'created_at': now.isoformat()
      }
    return model