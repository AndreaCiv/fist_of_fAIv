FROM python:3.9-slim-buster
COPY . /backend
WORKDIR /backend
RUN pip install -r requirements.txt
ENTRYPOINT python -u create_model.py &&  export GOOGLE_APPLICATION_CREDENTIALS=$(cat spheric-time-417914-51ad415acfa0.json) && python -u main.py