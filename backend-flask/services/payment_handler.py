# services/payment_handler.py
import uuid
from datetime import datetime, timezone

class PaymentHandler:
  def run(payer_handle, recipient_handle, amount, note=''):
    model = {
      'errors': None,
      'data': None
    }

    # Validate inputs
    if payer_handle == None or len(payer_handle) < 1:
      model['errors'] = ['payer_handle_blank']
      return model

    if recipient_handle == None or len(recipient_handle) < 1:
      model['errors'] = ['recipient_handle_blank']
      return model

    if amount == None or float(amount) <= 0:
      model['errors'] = ['invalid_amount']
      return model
    
    # Create a new payment record
    now = datetime.now(timezone.utc).astimezone()
    payment_uuid = str(uuid.uuid4())

    model['data'] = {
      'uuid': payment_uuid,
      'payer': payer_handle,
      'payer_display_name': payer_handle,  # Would fetch from user profile
      'recipient': recipient_handle,
      'recipient_display_name': recipient_handle,  # Would fetch from user profile
      'amount': str(amount),
      'note': note,
      'status': 'completed',
      'created_at': now.isoformat()
    }
    
    return model