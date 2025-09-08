FROM python:alpine

WORKDIR /app

VOLUME /app
COPY requirements.txt .
RUN python -m pip install -r requirements.txt

EXPOSE 3000/tcp

ENTRYPOINT ["python", "main.py"]