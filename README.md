# celery-django

Send email with Django and Celery.

## Installation
- Create virtualenvironment and install requirements.txt.
- Set a env.json file inside of the .env folder with the next format.

```
{
    "SECRET_KEY": "secret-key",
    "EMAIL": {
        "USER": "from@example.com",
        "PASSWORD": "password",
        "FOR_TEST": "to@example.com"  
    },
    "REDIS": {
        "PASSWORD": "password_for_redis"
    }
}
```

### Django
- Make sure you have the virtual environment activate, migrate and run the server of Django.
```
    python3 manage.py migrate && python3 manage.py runserver
```

### Redis
- Run redis server.
```
    redis-server
```
- Open redis client in a terminal and set password for redis that you set in env.json.
```
    config set requirepass password_for_redis
```
- Run worker. 
```
    celery -A project.celery worker -l info -Q queue_email
```

### Flower
- Run flower 
```
    celery -A project.celery flower --port=5568 --basic_auth=<user>:<password> --broker-api=redis://:<password_for_redis>04@localhost:6379
```

## Usage
- Open Django in your browser <a href="http://localhost:8000">localhost</a>.
- Set email and number of emails to send.
- Press un <b>Send Emails</b> button.

## Resources
https://docs.celeryproject.org/en/stable/django/first-steps-with-django.html

https://github.com/czue/celery-progress
