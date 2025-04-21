from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import os
import uuid
from datetime import datetime, timezone

# Import all services
from services.home_activities import HomeActivities
from services.user_activities import UserActivities
from services.group_activities import GroupActivities
from services.expense_groups import ExpenseGroups
from services.expenses import Expenses
from services.create_expense import CreateExpense
from services.create_group import CreateGroup
from services.create_payment import CreatePayment
from services.search_expenses import SearchExpenses
from services.show_expense import ShowExpense

# Authentication services
from lib.cognito_verification_token import CognitoTokenService, extract_access_token, TokenVerifyError

# Monitoring and observability imports
from opentelemetry import trace
from opentelemetry.instrumentation.flask import FlaskInstrumentor
from opentelemetry.instrumentation.requests import RequestsInstrumentor
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor, SimpleSpanProcessor
from opentelemetry.sdk.trace.export import ConsoleSpanExporter

app = Flask(__name__)

# Initialize tracing
provider = TracerProvider()
processor = BatchSpanProcessor(OTLPSpanExporter())
provider.add_span_processor(processor)
simple_processor = SimpleSpanProcessor(ConsoleSpanExporter())
provider.add_span_processor(simple_processor)
trace.set_tracer_provider(provider)
tracer = trace.get_tracer(__name__)

# Configure authentication
cognito_verification = CognitoTokenService(
  user_pool_id=os.getenv("AWS_COGNITO_USER_POOL_ID"), 
  user_pool_client_id=os.getenv("AWS_COGNITO_USER_POOL_CLIENT_ID"), 
  region=os.getenv("AWS_DEFAULT_REGION")
)
app.config['AWS_COGNITO_USER_POOL_ID'] = os.getenv("AWS_COGNITO_USER_POOL_ID")
app.config['AWS_COGNITO_APP_CLIENT_ID'] = os.getenv("AWS_COGNITO_USER_POOL_CLIENT_ID")
app.config['AWS_REGION'] = os.getenv("AWS_DEFAULT_REGION")

# Enable tracing
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
    methods=["GET", "HEAD", "POST", "PUT", "DELETE"]
)


# API Routes for Expense Groups
@app.route("/api/expense_groups", methods=['GET'])
@cross_origin()
def data_expense_groups():
    app.logger.debug(request.headers)
    access_token = extract_access_token(request.headers)
    try:
        claims = cognito_verification.verify(access_token)
        app.logger.debug("authenticated")
        app.logger.debug(claims)
        user_handle = claims['username']
        model = ExpenseGroups.run(user_handle=user_handle)
    except TokenVerifyError as e:
        app.logger.debug(e)
        app.logger.debug("unauthenticated")
        return {"error": "Unauthorized"}, 401

    if model['errors'] is not None:
        return model['errors'], 422
    else:
        return model['data'], 200

# # API Route for Expenses between users
# @app.route("/api/expenses/@<string:handle>", methods=['GET'])
# @cross_origin()
# def data_expenses(handle):
#     user_sender_handle = request.user
#     user_receiver_handle = handle
#     model = Expenses.run(user_sender_handle=user_sender_handle, user_receiver_handle=user_receiver_handle)
#     if model['errors'] is not None:
#         return model['errors'], 422
#     else:
#         return model['data'], 200

# # API Route to create a new group
# @app.route("/api/groups", methods=['POST','OPTIONS'])
# @cross_origin()
# def data_create_group():
#     user_handle = request.user
#     group_name = request.json['group_name']
#     members = request.json.get('members', [])
#     model = CreateGroup.run(group_name=group_name, user_handle=user_handle, members=members)
#     if model['errors'] is not None:
#         return model['errors'], 422
#     else:
#         return model['data'], 200

# # API Route for home feed (authenticated or unauthenticated)
# @cross_origin()
# def data_home():
#     app.logger.debug(request.headers)
#     access_token = extract_access_token(request.headers)
#     try:
#         claims = cognito_verification.verify(access_token)
#         app.logger.debug("authenticated")
#         app.logger.debug(claims)
#         data = HomeActivities.run(cognito_user_id=claims['username'])
#     except TokenVerifyError as e:
#         app.logger.debug(e)
#         app.logger.debug("unauthenticated")
#         data = HomeActivities.run()
#     return data, 200

# @app.route("/api/groups", methods=['GET'])
# @cross_origin()
# def data_groups():
#     data = ExpenseGroups.run(user_handle=request.user)
#     if data['errors'] is not None:
#         return data['errors'], 422
#     else:
#         return data['data'], 200

# # API Route for group activities
# @app.route("/api/groups/@<string:handle>", methods=['GET'])
# @cross_origin()
# def data_group_activities(handle):
#     model = GroupActivities.run(handle)
#     if model['errors'] is not None:
#         return model['errors'], 422
#     else:
#         return model['data'], 200

# # API Route for expense search
# @app.route("/api/expenses/search", methods=['GET'])
# @cross_origin()
# def data_search():
#     term = request.args.get('term')
#     model = SearchExpenses.run(term)
#     if model['errors'] is not None:
#         return model['errors'], 422
#     else:
#         return model['data'], 200

# # API Route to create a new expense
# @app.route("/api/expenses", methods=['POST','OPTIONS'])
# @cross_origin()
# def data_create_expense():
#     user_handle = request.user
#     amount = request.json['amount']
#     description = request.json['description']
#     group_id = request.json.get('group_id')
#     split_type = request.json.get('split_type', 'equal')  # Default to equal
#     participants = request.json.get('participants', [])
#     category = request.json.get('category')
    
#     model = CreateExpense.run(
#         user_handle=user_handle, 
#         amount=amount, 
#         description=description, 
#         group_id=group_id,
#         split_type=split_type,
#         participants=participants,
#         category=category
#     )
    
#     if model['errors'] is not None:
#         return model['errors'], 422
#     else:
#         return model['data'], 200

# # API Route to get details for a specific expense
# @app.route("/api/expenses/<string:expense_uuid>", methods=['GET'])
# @cross_origin()
# def data_show_expense(expense_uuid):
#     data = ShowExpense.run(expense_uuid=expense_uuid)
#     return data, 200

# # API Route to create a payment between users
# @app.route("/api/payments", methods=['POST','OPTIONS'])
# @cross_origin()
# def data_create_payment():
#     user_handle = request.username
#     recipient_handle = request.json['recipient_handle']
#     amount = request.json['amount']
#     note = request.json.get('note', '')
    
#     model = CreatePayment.run(
#         user_handle=user_handle, 
#         recipient_handle=recipient_handle,
#         amount=amount,
#         note=note
#     )
    
#     if model['errors'] is not None:
#         return model['errors'], 422
#     else:
#         return model['data'], 200

# # API Route for user profile activities
# @app.route("/api/user/@<string:handle>", methods=['GET'])
# @cross_origin()
# def data_handle(handle):
#     model = UserActivities.run(handle)
#     if model['errors'] is not None:
#         return model['errors'], 422
#     else:
#         return model['data'], 200


# @app.route("/api/expense_groups", methods=['GET'])
# @cross_origin()
# def data_expense_groups():
#     app.logger.debug(request.headers)
#     access_token = extract_access_token(request.headers)
#     try:
#         claims = cognito_verification.verify(access_token)
#         app.logger.debug("authenticated")
#         app.logger.debug(claims)
#         user_handle = claims['username']
#         model = ExpenseGroups.run(user_handle=user_handle)
#     except TokenVerifyError as e:
#         app.logger.debug(e)
#         app.logger.debug("unauthenticated")
#         return {"error": "Unauthorized"}, 401

#     if model['errors'] is not None:
#         return model['errors'], 422
#     else:
#         return model['data'], 200


@app.route("/api/expenses/@<string:handle>", methods=['GET'])
@cross_origin()
def data_expenses(handle):
    access_token = extract_access_token(request.headers)
    try:
        claims = cognito_verification.verify(access_token)
        user_sender_handle = claims['username']
        user_receiver_handle = handle
        model = Expenses.run(user_sender_handle=user_sender_handle, user_receiver_handle=user_receiver_handle)
    except TokenVerifyError as e:
        app.logger.debug(e)
        return {"error": "Unauthorized"}, 401

    if model['errors'] is not None:
        return model['errors'], 422
    else:
        return model['data'], 200


@app.route("/api/groups", methods=['POST','OPTIONS'])
@cross_origin()
def data_create_group():
    access_token = extract_access_token(request.headers)
    try:
        claims = cognito_verification.verify(access_token)
        user_handle = claims['username']
        group_name = request.json['group_name']
        members = request.json.get('members', [])
        model = CreateGroup.run(group_name=group_name, user_handle=user_handle, members=members)
    except TokenVerifyError as e:
        app.logger.debug(e)
        return {"error": "Unauthorized"}, 401

    if model['errors'] is not None:
        return model['errors'], 422
    else:
        return model['data'], 200


@app.route("/api/groups", methods=['GET'])
@cross_origin()
def data_groups():
    access_token = extract_access_token(request.headers)
    try:
        claims = cognito_verification.verify(access_token)
        user_handle = claims['username']
        model = ExpenseGroups.run(user_handle=user_handle)
    except TokenVerifyError as e:
        app.logger.debug(e)
        return {"error": "Unauthorized"}, 401

    if model['errors'] is not None:
        return model['errors'], 422
    else:
        return model['data'], 200


@app.route("/api/groups/@<string:handle>", methods=['GET'])
@cross_origin()
def data_group_activities(handle):
    access_token = extract_access_token(request.headers)
    try:
        cognito_verification.verify(access_token)
        model = GroupActivities.run(handle)
    except TokenVerifyError as e:
        app.logger.debug(e)
        return {"error": "Unauthorized"}, 401

    if model['errors'] is not None:
        return model['errors'], 422
    else:
        return model['data'], 200


@app.route("/api/expenses/search", methods=['GET'])
@cross_origin()
def data_search():
    access_token = extract_access_token(request.headers)
    try:
        cognito_verification.verify(access_token)
        term = request.args.get('term')
        model = SearchExpenses.run(term)
    except TokenVerifyError as e:
        app.logger.debug(e)
        return {"error": "Unauthorized"}, 401

    if model['errors'] is not None:
        return model['errors'], 422
    else:
        return model['data'], 200


@app.route("/api/expenses", methods=['POST','OPTIONS'])
@cross_origin()
def data_create_expense():
    access_token = extract_access_token(request.headers)
    try:
        claims = cognito_verification.verify(access_token)
        user_handle = claims['username']
        amount = request.json['amount']
        description = request.json['description']
        group_id = request.json.get('group_id')
        split_type = request.json.get('split_type', 'equal')
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
    except TokenVerifyError as e:
        app.logger.debug(e)
        return {"error": "Unauthorized"}, 401

    if model['errors'] is not None:
        return model['errors'], 422
    else:
        return model['data'], 200


@app.route("/api/expenses/<string:expense_uuid>", methods=['GET'])
@cross_origin()
def data_show_expense(expense_uuid):
    access_token = extract_access_token(request.headers)
    try:
        cognito_verification.verify(access_token)
        data = ShowExpense.run(expense_uuid=expense_uuid)
    except TokenVerifyError as e:
        app.logger.debug(e)
        return {"error": "Unauthorized"}, 401

    return data, 200


@app.route("/api/payments", methods=['POST','OPTIONS'])
@cross_origin()
def data_create_payment():
    access_token = extract_access_token(request.headers)
    try:
        claims = cognito_verification.verify(access_token)
        user_handle = claims['username']
        recipient_handle = request.json['recipient_handle']
        amount = request.json['amount']
        note = request.json.get('note', '')

        model = CreatePayment.run(
            user_handle=user_handle, 
            recipient_handle=recipient_handle,
            amount=amount,
            note=note
        )
    except TokenVerifyError as e:
        app.logger.debug(e)
        return {"error": "Unauthorized"}, 401

    if model['errors'] is not None:
        return model['errors'], 422
    else:
        return model['data'], 200


@app.route("/api/user/@<string:handle>", methods=['GET'])
@cross_origin()
def data_handle(handle):
    access_token = extract_access_token(request.headers)
    try:
        cognito_verification.verify(access_token)
        model = UserActivities.run(handle)
    except TokenVerifyError as e:
        app.logger.debug(e)
        return {"error": "Unauthorized"}, 401

    if model['errors'] is not None:
        return model['errors'], 422
    else:
        return model['data'], 200

if __name__ == "__main__":
    app.run(debug=True)