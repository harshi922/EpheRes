from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import os
from contextlib import asynccontextmanager

# Import services
from services.home_activities import *
from services.notifications_activities import *
from services.user_activities import *
from services.create_activity import *
from services.create_reply import *
from services.search_activities import *
from services.message_groups import *
from services.messages import *
from services.create_message import *
from services.show_activity import *

# OpenTelemetry imports
from opentelemetry import trace
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry.instrumentation.requests import RequestsInstrumentor
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor, SimpleSpanProcessor
from opentelemetry.sdk.trace.export import ConsoleSpanExporter

# Initialize tracing and an exporter that can send data to Honeycomb
provider = TracerProvider()
processor = BatchSpanProcessor(OTLPSpanExporter())
provider.add_span_processor(processor)

simple_processor = SimpleSpanProcessor(ConsoleSpanExporter())
provider.add_span_processor(simple_processor)

trace.set_tracer_provider(provider)
tracer = trace.get_tracer(__name__)

# Lifespan manager for startup/shutdown events
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup events
    yield
    # Shutdown events

# Initialize FastAPI app
app = FastAPI(
    title="EpheRes Backend API",
    description="Backend API for EpheRes application",
    lifespan=lifespan
)

# Set CORS configuration
frontend_url = os.getenv('FRONTEND_URL')
backend_url = os.getenv('BACKEND_URL')
origins = [frontend_url, backend_url]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS", "HEAD"],
    allow_headers=["Content-Type", "Authorization", "If-Modified-Since"],
    expose_headers=["location", "link"],
)

# Configure OpenTelemetry
FastAPIInstrumentor.instrument_app(app)
RequestsInstrumentor().instrument()

# API Routes
@app.get("/api/message_groups")
async def data_message_groups():
    user_handle = 'andrewbrown'
    model = MessageGroups.run(user_handle=user_handle)
    if model['errors'] is not None:
        return model['errors'], 422
    return model['data']

@app.get("/api/messages/@{handle}")
async def data_messages(handle: str, user_reciever_handle: str = None):
    user_sender_handle = 'andrewbrown'
    model = Messages.run(
        user_sender_handle=user_sender_handle, 
        user_receiver_handle=user_reciever_handle
    )
    if model['errors'] is not None:
        return model['errors'], 422
    return model['data']

@app.post("/api/messages")
async def data_create_message(request: Request):
    user_sender_handle = 'andrewbrown'
    message_data = await request.json()
    message = message_data.get('message', '')
    user_receiver_handle = message_data.get('user_receiver_handle', '')
    
    model = CreateMessage.run(
        message=message,
        user_sender_handle=user_sender_handle,
        user_receiver_handle=user_receiver_handle
    )
    if model['errors'] is not None:
        return model['errors'], 422
    return model['data']

@app.get("/api/activities/home")
async def data_home():
    data = HomeActivities.run()
    return data

@app.get("/api/activities/notifications")
async def data_notifications():
    data = NotificationsActivities.run()
    return data

@app.get("/api/activities/@{handle}")
async def data_handle(handle: str):
    model = UserActivities.run(handle)
    if model['errors'] is not None:
        return model['errors'], 422
    return model['data']

@app.get("/api/activities/search")
async def data_search(term: str = ''):
    model = SearchActivities.run(term)
    if model['errors'] is not None:
        return model['errors'], 422
    return model['data']

@app.post("/api/activities")
async def data_activities(request: Request):
    user_handle = 'andrewbrown'
    activity_data = await request.json()
    message = activity_data.get('message', '')
    ttl = activity_data.get('ttl', '')
    
    model = CreateActivity.run(
        message=message, 
        user_handle=user_handle,
        ttl=ttl
    )
    if model['errors'] is not None:
        return model['errors'], 422
    return model['data']

@app.get("/api/activities/{activity_uuid}")
async def data_show_activity(activity_uuid: str):
    data = ShowActivity.run(activity_uuid=activity_uuid)
    return data

@app.post("/api/activities/{activity_uuid}/reply")
async def data_activities_reply(activity_uuid: str, request: Request):
    user_handle = 'andrewbrown'
    reply_data = await request.json()
    message = reply_data.get('message', '')
    
    model = CreateReply.run(
        message=message, 
        user_handle=user_handle,
        activity_uuid=activity_uuid
    )
    if model['errors'] is not None:
        return model['errors'], 422
    return model['data']

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=4567, reload=True)