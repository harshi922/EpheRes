import uuid
from datetime import datetime, timedelta, timezone

class CreateGroup:
  def run(group_name, user_handle, members=[]):
    model = {
      'errors': None,
      'data': None
    }

    now = datetime.now(timezone.utc).astimezone()

    if user_handle == None or len(user_handle) < 1:
      model['errors'] = ['user_handle_blank']

    if group_name == None or len(group_name) < 1:
      model['errors'] = ['group_name_blank']

    if model['errors']:
      model['data'] = {
        'handle': user_handle,
        'group_name': group_name,
        'members': members
      }
    else:
      # In a real app, this would create a group in the database
      # Add the creator to the members list if not already present
      all_members = list(members)
      if user_handle not in all_members:
        all_members.append(user_handle)
      
      model['data'] = {
        'uuid': str(uuid.uuid4()),
        'name': group_name,
        'created_by': user_handle,
        'members': all_members,
        'members_count': len(all_members),
        'total_expenses': '0.00',
        'created_at': now.isoformat()
      }
    return model