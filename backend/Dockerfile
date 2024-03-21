FROM python:3.9-slim-buster
COPY . /cpu
WORKDIR /cpu
RUN pip install -r requirements.txt
ENTRYPOINT python -u main.py