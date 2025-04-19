# from flask import Flask
# from flask import request, session
# from flask_cors import CORS, cross_origin
# import os

# from services.home_activities import *
# from services.notifications_activities import *
# from services.user_activities import *
# from services.create_activity import *
# from services.create_reply import *
# from services.search_activities import *
# from services.message_groups import *
# from services.messages import *
# from services.create_message import *
# from services.show_activity import *
# from lib.cognito_verification_token import CognitoTokenService, extract_access_token, TokenVerifyError   

# # honeycomb stuff
# from opentelemetry import trace
# from opentelemetry.instrumentation.flask import FlaskInstrumentor
# from opentelemetry.instrumentation.requests import RequestsInstrumentor
# from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
# from opentelemetry.sdk.trace import TracerProvider
# from opentelemetry.sdk.trace.export import BatchSpanProcessor, SimpleSpanProcessor
# from opentelemetry.sdk.trace.export import ConsoleSpanExporter

# from aws_xray_sdk.core import xray_recorder
# from aws_xray_sdk.ext.flask.middleware import XRayMiddleware

# import watchtower
# import logging
# import sys
# from time import strftime

# # # Configuring Logger to Use CloudWatch
# # LOGGER = logging.getLogger(__name__)
# # LOGGER.setLevel(logging.DEBUG)
# # console_handler = logging.StreamHandler()
# # cw_handler = watchtower.CloudWatchLogHandler(log_group='epheres')
# # LOGGER.addHandler(console_handler)
# # LOGGER.addHandler(cw_handler)


# # Initialize tracing and an exporter that can send data to Honeycomb
# provider = TracerProvider()
# processor = BatchSpanProcessor(OTLPSpanExporter())
# provider.add_span_processor(processor)

# simple_processor= SimpleSpanProcessor(ConsoleSpanExporter())
# provider.add_span_processor(simple_processor) 

# trace.set_tracer_provider(provider)
# tracer = trace.get_tracer(__name__)

# app = Flask(__name__)

# cognito_verification = CognitoTokenService(
#   user_pool_id=os.getenv("AWS_COGNITO_USER_POOL_ID"), 
#   user_pool_client_id=os.getenv("AWS_COGNITO_USER_POOL_CLIENT_ID"), 
#   region=os.getenv("AWS_DEFAULT_REGION")
# )


# app.config['AWS_COGNITO_USER_POOL_ID'] = os.getenv("AWS_COGNITO_USER_POOL_ID")
# app.config['AWS_COGNITO_APP_CLIENT_ID'] = os.getenv("AWS_COGNITO_USER_POOL_CLIENT_ID")
# app.config['AWS_REGION'] = os.getenv("AWS_DEFAULT_REGION")

# # honeycomb stuff
# FlaskInstrumentor().instrument_app(app)
# RequestsInstrumentor().instrument()

# # xray_url = os.getenv("AWS_XRAY_URL")
# # xray_recorder.configure(service='EpheRes', dynamic_naming=xray_url)
# # XRayMiddleware(app, xray_recorder)

# frontend = os.getenv('FRONTEND_URL')
# backend = os.getenv('BACKEND_URL')

# origins = [frontend, backend]

# cors = CORS(
#     app, 
#     resources={r"/api/*": {"origins": origins}},
#     supports_credentials=True,
#     expose_headers=["Content-Type", "Authorization", "location", "link"],
#     allow_headers=["Content-Type", "Authorization", "if-modified-since"],
#     methods=["OPTIONS", "GET", "HEAD", "POST", "PUT", "DELETE"]
# )
# # @app.after_request
# # def after_request(response):
# #     timestamp = strftime('[%Y-%b-%d %H:%M]')
# #     LOGGER.error('%s %s %s %s %s %s', timestamp, request.remote_addr, request.method, request.scheme, request.full_path, response.status)
# #     return response

# @app.route("/api/message_groups", methods=['GET'])
# def data_message_groups():
#   user_handle  = 'andrewbrown'
#   model = MessageGroups.run(user_handle=user_handle)
#   if model['errors'] is not None:
#     return model['errors'], 422
#   else:
#     return model['data'], 200

# @app.route("/api/messages/@<string:handle>", methods=['GET'])
# def data_messages(handle):
#   user_sender_handle = 'andrewbrown'
#   user_receiver_handle = request.args.get('user_reciever_handle')

#   model = Messages.run(user_sender_handle=user_sender_handle, user_receiver_handle=user_receiver_handle)
#   if model['errors'] is not None:
#     return model['errors'], 422
#   else:
#     return model['data'], 200
#   return

# @app.route("/api/messages", methods=['POST','OPTIONS'])
# @cross_origin()
# def data_create_message():
#   user_sender_handle = 'andrewbrown'
#   user_receiver_handle = request.json['user_receiver_handle']
#   message = request.json['message']

#   model = CreateMessage.run(message=message,user_sender_handle=user_sender_handle,user_receiver_handle=user_receiver_handle)
#   if model['errors'] is not None:
#     return model['errors'], 422
#   else:
#     return model['data'], 200
#   return

# @app.route("/api/activities/home", methods=['GET'])
# def data_home():
#   app.logger.debug(request.headers)
#   access_token = extract_access_token(request.headers)
#   try:
#       claims = cognito_verification.verify(access_token)
#       app.logger.debug("authenticated")
#       app.logger.debug(claims)
#       data = HomeActivities.run(cognito_user_id=claims['username'])

#   except TokenVerifyError as e:
#       app.logger.debug(e)
#       app.logger.debug("unauthenticated")
#       data = HomeActivities.run()

#       # _ = request.data
#       # abort(make_response(jsonify(message=str(e)), 401))


#   return data, 200



# @app.route("/api/activities/@<string:handle>", methods=['GET'])
# def data_handle(handle):
#   model = UserActivities.run(handle)
#   if model['errors'] is not None:
#     return model['errors'], 422
#   else:
#     return model['data'], 200

# @app.route("/api/activities/search", methods=['GET'])
# def data_search():
#   term = request.args.get('term')
#   model = SearchActivities.run(term)
#   if model['errors'] is not None:
#     return model['errors'], 422
#   else:
#     return model['data'], 200
#   return

# @app.route("/api/activities", methods=['POST','OPTIONS'])
# @cross_origin()
# def data_activities():
#   user_handle  = 'andrewbrown'
#   message = request.json['message']
#   ttl = request.json['ttl']
#   model = CreateActivity.run(message, user_handle, ttl)
#   if model['errors'] is not None:
#     return model['errors'], 422
#   else:
#     return model['data'], 200
#   return

# @app.route("/api/activities/<string:activity_uuid>", methods=['GET'])
# def data_show_activity(activity_uuid):
#   data = ShowActivity.run(activity_uuid=activity_uuid)
#   return data, 200

# @app.route("/api/activities/<string:activity_uuid>/reply", methods=['POST','OPTIONS'])
# @cross_origin()
# def data_activities_reply(activity_uuid):
#   user_handle  = 'andrewbrown'
#   message = request.json['message']
#   model = CreateReply.run(message, user_handle, activity_uuid)
#   if model['errors'] is not None:
#     return model['errors'], 422
#   else:
#     return model['data'], 200
#   return

# if __name__ == "__main__":
#   app.run(debug=True)



# Modified app.py for Splitwise functionality
from flask import Flask
from flask import request, session
from flask_cors import CORS, cross_origin
import os

# Import modified services for Splitwise functionality
from services.home_activities import *
from services.group_activities import *  # Changed from notifications_activities
from services.user_activities import *
from services.create_expense import *    # Changed from create_activity
from services.create_payment import *    # Changed from create_reply
from services.search_expenses import *   # Changed from search_activities
from services.expense_groups import *    # Changed from message_groups
from services.expenses import *          # Changed from messages
from services.create_group import *      # Changed from create_message
from services.show_expense import *      # Changed from show_activity

# Keep auth and monitoring code the same
from lib.cognito_verification_token import CognitoTokenService, extract_access_token, TokenVerifyError   

# Monitoring stuff remains unchanged
from opentelemetry import trace
from opentelemetry.instrumentation.flask import FlaskInstrumentor
from opentelemetry.instrumentation.requests import RequestsInstrumentor
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor, SimpleSpanProcessor
from opentelemetry.sdk.trace.export import ConsoleSpanExporter

from aws_xray_sdk.core import xray_recorder
from aws_xray_sdk.ext.flask.middleware import XRayMiddleware

import watchtower
import logging
import sys
from time import strftime

# Setup tracing and logging (unchanged)
provider = TracerProvider()
processor = BatchSpanProcessor(OTLPSpanExporter())
provider.add_span_processor(processor)

simple_processor = SimpleSpanProcessor(ConsoleSpanExporter())
provider.add_span_processor(simple_processor) 

trace.set_tracer_provider(provider)
tracer = trace.get_tracer(__name__)

app = Flask(__name__)

# Auth code remains the same
cognito_verification = CognitoTokenService(
  user_pool_id=os.getenv("AWS_COGNITO_USER_POOL_ID"), 
  user_pool_client_id=os.getenv("AWS_COGNITO_USER_POOL_CLIENT_ID"), 
  region=os.getenv("AWS_DEFAULT_REGION")
)

app.config['AWS_COGNITO_USER_POOL_ID'] = os.getenv("AWS_COGNITO_USER_POOL_ID")
app.config['AWS_COGNITO_APP_CLIENT_ID'] = os.getenv("AWS_COGNITO_USER_POOL_CLIENT_ID")
app.config['AWS_REGION'] = os.getenv("AWS_DEFAULT_REGION")

# Instrumentation (unchanged)
FlaskInstrumentor().instrument_app(app)
RequestsInstrumentor().instrument()

frontend = os.getenv('FRONTEND_URL')
backend = os.getenv('BACKEND_URL')
origins = [frontend, backend]

cors = CORS(
    app, 
    resources={r"/api/*": {"origins": origins}},
    supports_credentials=True,
    expose_headers=["Content-Type", "Authorization", "location", "link"],
    allow_headers=["Content-Type", "Authorization", "if-modified-since"],
    methods=["OPTIONS", "GET", "HEAD", "POST", "PUT", "DELETE"]
)

# Modified API Routes for Splitwise clone
@app.route("/api/expense_groups", methods=['GET'])
def data_expense_groups():
  user_handle = 'andrewbrown'  # This would be retrieved from auth
  model = ExpenseGroups.run(user_handle=user_handle)
  if model['errors'] is not None:
    return model['errors'], 422
  else:
    return model['data'], 200

@app.route("/api/expenses/@<string:handle>", methods=['GET'])
def data_expenses(handle):
  user_sender_handle = 'andrewbrown'  # This would be retrieved from auth
  user_receiver_handle = request.args.get('user_receiver_handle')

  model = Expenses.run(user_sender_handle=user_sender_handle, user_receiver_handle=user_receiver_handle)
  if model['errors'] is not None:
    return model['errors'], 422
  else:
    return model['data'], 200
  return

@app.route("/api/groups", methods=['POST','OPTIONS'])
@cross_origin()
def data_create_group():
  user_handle = 'andrewbrown'  # This would be retrieved from auth
  group_name = request.json['group_name']
  members = request.json['members']

  model = CreateGroup.run(group_name=group_name, user_handle=user_handle, members=members)
  if model['errors'] is not None:
    return model['errors'], 422
  else:
    return model['data'], 200
  return

@app.route("/api/expenses/home", methods=['GET'])
def data_home():
  app.logger.debug(request.headers)
  access_token = extract_access_token(request.headers)
  try:
      claims = cognito_verification.verify(access_token)
      app.logger.debug("authenticated")
      app.logger.debug(claims)
      data = HomeActivities.run(cognito_user_id=claims['username'])
  except TokenVerifyError as e:
      app.logger.debug(e)
      app.logger.debug("unauthenticated")
      data = HomeActivities.run()
  return data, 200

@app.route("/api/groups/@<string:handle>", methods=['GET'])
def data_group_activities(handle):
  model = GroupActivities.run(handle)
  if model['errors'] is not None:
    return model['errors'], 422
  else:
    return model['data'], 200

@app.route("/api/expenses/search", methods=['GET'])
def data_search():
  term = request.args.get('term')
  model = SearchExpenses.run(term)
  if model['errors'] is not None:
    return model['errors'], 422
  else:
    return model['data'], 200
  return

@app.route("/api/expenses", methods=['POST','OPTIONS'])
@cross_origin()
def data_create_expense():
  user_handle = 'andrewbrown'  # This would be retrieved from auth
  amount = request.json['amount']
  description = request.json['description']
  group_id = request.json.get('group_id')
  split_type = request.json.get('split_type', 'equal')  # Default to equal
  participants = request.json.get('participants', [])
  category = request.json.get('category')
  
  model = CreateExpense.run(
    user_handle=user_handle, 
    amount=amount, 
    description=description, 
    group_id=group_id,
    split_type=split_type,
    participants=participants,
    category=category
  )
  
  if model['errors'] is not None:
    return model['errors'], 422
  else:
    return model['data'], 200
  return

@app.route("/api/expenses/<string:expense_uuid>", methods=['GET'])
def data_show_expense(expense_uuid):
  data = ShowExpense.run(expense_uuid=expense_uuid)
  return data, 200

@app.route("/api/payments", methods=['POST','OPTIONS'])
@cross_origin()
def data_create_payment():
  user_handle = 'andrewbrown'  # This would be retrieved from auth
  recipient_handle = request.json['recipient_handle']
  amount = request.json['amount']
  note = request.json.get('note', '')
  
  model = CreatePayment.run(
    user_handle=user_handle, 
    recipient_handle=recipient_handle,
    amount=amount,
    note=note
  )
  
  if model['errors'] is not None:
    return model['errors'], 422
  else:
    return model['data'], 200
  return

@app.route("/api/user/@<string:handle>", methods=['GET'])
def data_handle(handle):
  model = UserActivities.run(handle)
  if model['errors'] is not None:
    return model['errors'], 422
  else:
    return model['data'], 200

if __name__ == "__main__":
  app.run(debug=True)