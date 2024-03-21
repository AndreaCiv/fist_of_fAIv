FROM python:3.9-slim-buster
COPY . /backend
WORKDIR /backend
RUN pip install -r requirements.txt
ENTRYPOINT python -u create_model.py && python -u main.py