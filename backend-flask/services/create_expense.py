import uuid
from datetime import datetime, timezone

class CreateExpense:
  def run(user_handle, amount, description, group_id=None, split_type='equal', participants=[], category=None):
    model = {
      'errors': None,
      'data': None
    }

    # Validate inputs
    if user_handle == None or len(user_handle) < 1:
      model['errors'] = ['user_handle_blank']
      return model

    if amount == None or float(amount) <= 0:
      model['errors'] = ['invalid_amount']
      return model

    if description == None or len(description) < 1:
      model['errors'] = ['description_blank']
      return model
    
    # Validate split type
    valid_split_types = ['equal', 'exact', 'percentage']
    if split_type not in valid_split_types:
      model['errors'] = ['invalid_split_type']
      return model
    
    # Validate participants data
    if split_type != 'equal' and (not participants or len(participants) == 0):
      model['errors'] = ['participants_required_for_custom_split']
      return model

    total_amount = float(amount)
    processed_participants = []
    
    # Process splits based on type
    if split_type == 'equal':
      # Default equal split handling
      participant_count = len(participants) + 1  # Include the creator
      share = round(total_amount / participant_count, 2)
      
      # Handle rounding issues by adjusting the creator's amount
      total_shared = share * (participant_count - 1)
      creator_share = round(total_amount - total_shared, 2)
      
      # Add all participants with equal shares
      for participant in participants:
        processed_participants.append({
          'handle': participant.get('handle'),
          'amount': share,
          'paid': False
        })
      
      # Add the creator
      processed_participants.append({
        'handle': user_handle,
        'amount': creator_share,
        'paid': True  # Creator always paid
      })
      
    elif split_type == 'percentage':
      # Validate percentage totals to 100%
      total_percentage = 0
      for participant in participants:
        if 'percentage' not in participant:
          model['errors'] = ['percentage_missing_for_participants']
          return model
        total_percentage += float(participant.get('percentage', 0))
      
      # Include creator's percentage
      creator_percentage = 0
      for participant in participants:
        if participant.get('handle') == user_handle:
          creator_percentage = float(participant.get('percentage', 0))
          break
      
      total_percentage += creator_percentage
      
      # Allow small rounding errors
      if abs(total_percentage - 100) > 0.1:
        model['errors'] = ['percentages_must_sum_to_100']
        return model
      
      # Calculate amounts based on percentages
      for participant in participants:
        if participant.get('handle') == user_handle:
          continue  # Skip creator, add them at the end
        
        percentage = float(participant.get('percentage', 0))
        share = round((percentage / 100) * total_amount, 2)
        
        processed_participants.append({
          'handle': participant.get('handle'),
          'amount': share,
          'percentage': percentage,
          'paid': False
        })
      
      # Add creator
      creator_amount = round((creator_percentage / 100) * total_amount, 2)
      processed_participants.append({
        'handle': user_handle,
        'amount': creator_amount,
        'percentage': creator_percentage,
        'paid': True  # Creator always paid
      })
      
    elif split_type == 'exact':
      # Validate exact amounts sum to total
      total_specified = 0
      for participant in participants:
        if 'amount' not in participant:
          model['errors'] = ['amount_missing_for_participants']
          return model
        total_specified += float(participant.get('amount', 0))
      
      # Include creator's amount if specified
      creator_amount = 0
      for participant in participants:
        if participant.get('handle') == user_handle:
          creator_amount = float(participant.get('amount', 0))
          break
      
      total_specified += creator_amount
      
      # Allow small rounding errors
      if abs(total_specified - total_amount) > 0.01:
        model['errors'] = ['amounts_must_sum_to_total']
        return model
      
      # Use the exact specified amounts
      for participant in participants:
        if participant.get('handle') == user_handle:
          continue  # Skip creator, add them at the end
          
        processed_participants.append({
          'handle': participant.get('handle'),
          'amount': float(participant.get('amount', 0)),
          'paid': False
        })
      
      # Add creator
      processed_participants.append({
        'handle': user_handle,
        'amount': creator_amount,
        'paid': True  # Creator always paid
      })

    # Create the expense record
    now = datetime.now(timezone.utc).astimezone()
    expense_uuid = str(uuid.uuid4())
    
    model['data'] = {
      'uuid': expense_uuid,
      'created_by': user_handle,
      'display_name': user_handle,  # This would be fetched from user profile
      'amount': str(total_amount),
      'description': description,
      'group_id': group_id,
      'category': category,
      'split_type': split_type,
      'participants': processed_participants,
      'created_at': now.isoformat()
    }
    
    return model