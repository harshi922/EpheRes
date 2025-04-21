# backend-flask/services/payment_service.py
import uuid
from datetime import datetime, timezone
import logging

logger = logging.getLogger(__name__)

class PaymentService:
  @staticmethod
  def process_payment(payer_handle, recipient_handle, amount, note='', is_request=False):
    """
    Process a payment or payment request between users
    
    Parameters:
    - payer_handle: User making the payment
    - recipient_handle: User receiving the payment
    - amount: Payment amount (float)
    - note: Optional payment note
    - is_request: If True, this is a payment request rather than an actual payment
    
    Returns:
    - model: Dictionary with result data or errors
    """
    model = {
      'errors': None,
      'data': None
    }
    
    # Validate input parameters
    if not payer_handle or len(payer_handle.strip()) < 1:
      model['errors'] = ['payer_handle_required']
      return model
    
    if not recipient_handle or len(recipient_handle.strip()) < 1:
      model['errors'] = ['recipient_handle_required']
      return model
    
    if not amount or float(amount) <= 0:
      model['errors'] = ['invalid_amount']
      return model
    
    # Check if payer and recipient are the same
    if payer_handle == recipient_handle:
      model['errors'] = ['cannot_pay_yourself']
      return model
    
    # In a real application, we would:
    # 1. Verify both users exist
    # 2. Check if payer has sufficient balance for a payment
    # 3. Update user balances in the database
    # 4. Record the transaction in a payment history table
    # 5. Create notifications for both users
    
    # For now, we'll simulate the payment creation
    now = datetime.now(timezone.utc).astimezone()
    payment_uuid = str(uuid.uuid4())
    
    payment_data = {
      'uuid': payment_uuid,
      'payer_handle': payer_handle,
      'payer_display_name': payer_handle,  # Would normally fetch from user profile
      'recipient_handle': recipient_handle,
      'recipient_display_name': recipient_handle,  # Would normally fetch from user profile
      'amount': str(float(amount)),  # Ensure consistent number format
      'note': note,
      'is_request': is_request,
      'status': 'pending' if is_request else 'completed',
      'created_at': now.isoformat()
    }
    
    # Log the payment for debugging
    logger.info(f"Payment {'request' if is_request else 'processed'}: {payment_uuid}")
    logger.debug(f"Payment details: {payment_data}")
    
    model['data'] = payment_data
    return model
  
  @staticmethod
  def get_user_balance(user_handle):
    """
    Get a user's current balance
    
    In a real implementation, this would:
    1. Query the database for all transactions involving the user
    2. Calculate the net balance from payments sent and received
    
    Returns:
    - Dictionary with total_owed (others owe user) and total_owe (user owes others)
    """
    if not user_handle:
      return None
      
    # For demonstration, we'll return mock data
    # In a real app, this would be calculated from the database
    return {
      'total_owed': 456.78,  # Others owe the user
      'total_owe': 123.45,   # User owes others
      'net_balance': 333.33  # Net balance (positive means overall others owe the user)
    }
  
  @staticmethod
  def get_payment_history(user_handle, limit=10):
    """
    Get a user's payment history
    
    Parameters:
    - user_handle: User to get history for
    - limit: Maximum number of records to return
    
    Returns:
    - List of payment records
    """
    if not user_handle:
      return []
      
    # For demonstration, we'll return mock data
    # In a real app, this would be retrieved from the database
    now = datetime.now(timezone.utc).astimezone()
    
    # Example payment history
    payments = [
      {
        'uuid': str(uuid.uuid4()),
        'payer_handle': user_handle,
        'payer_display_name': user_handle,
        'recipient_handle': 'worf',
        'recipient_display_name': 'Worf',
        'amount': '75.20',
        'note': 'Rent for April',
        'is_request': False,
        'status': 'completed',
        'created_at': now.isoformat()
      },
      {
        'uuid': str(uuid.uuid4()),
        'payer_handle': 'jadzia',
        'payer_display_name': 'Jadzia Dax',
        'recipient_handle': user_handle,
        'recipient_display_name': user_handle,
        'amount': '42.50',
        'note': 'Dinner last week',
        'is_request': False,
        'status': 'completed',
        'created_at': now.isoformat()
      }
    ]
    
    return payments[:limit]
  
  @staticmethod
  def respond_to_payment_request(payment_uuid, user_handle, action):
    """
    Respond to a payment request (accept or decline)
    
    Parameters:
    - payment_uuid: UUID of the payment request
    - user_handle: User responding to the request
    - action: 'accept' or 'decline'
    
    Returns:
    - Updated payment record or error
    """
    model = {
      'errors': None,
      'data': None
    }
    
    if not payment_uuid:
      model['errors'] = ['payment_uuid_required']
      return model
      
    if not user_handle:
      model['errors'] = ['user_handle_required']
      return model
      
    if action not in ['accept', 'decline']:
      model['errors'] = ['invalid_action']
      return model
    
    # For demonstration, we'll return mock data
    # In a real app, this would update the payment status in the database
    now = datetime.now(timezone.utc).astimezone()
    
    payment_data = {
      'uuid': payment_uuid,
      'payer_handle': user_handle,
      'payer_display_name': user_handle,
      'recipient_handle': 'jadzia',  # Example recipient
      'recipient_display_name': 'Jadzia Dax',
      'amount': '42.75',
      'note': 'Groceries',
      'is_request': True,
      'status': 'completed' if action == 'accept' else 'declined',
      'responded_at': now.isoformat(),
      'created_at': now.isoformat()
    }
    
    logger.info(f"Payment request {action}ed: {payment_uuid}")
    
    model['data'] = payment_data
    return model