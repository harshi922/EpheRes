FROM python:3.10-slim-buster

WORKDIR /backend-fastapi

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY . .

ENV FASTAPI_ENV=development
ENV FASTAPI_DEBUG=1

EXPOSE ${PORT}
CMD ["uvicorn", "app.main:app", "--host=0.0.0.0", "--port=4567", "--reload"]