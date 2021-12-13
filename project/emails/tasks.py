from __future__ import absolute_import
from django.core.mail import get_connection, EmailMessage
from celery import shared_task
from celery_progress.backend import ProgressRecorder

from project.settings import (
    EMAIL_HOST_USER, 
    EMAIL_HOST_PASSWORD
)

def set_emails(email, number):

    return [ email for _ in range(number) ]

@shared_task(bind=True)
def send_emails(self, email, number):

    emails = set_emails(email, number)
    l_emails = len(emails)
    progress_recorder = ProgressRecorder(self)
    connection = get_connection( 
        username=EMAIL_HOST_USER, 
        password=EMAIL_HOST_PASSWORD
        )
    
    counter = 1
    for email in emails:
        instance = EmailMessage(
            subject = f'Subject',
            body = f"Body",
            from_email = EMAIL_HOST_USER,
            to = [ email ],
            connection = connection,
			)
        instance.send()

        progress_recorder.set_progress(
            counter, 
            l_emails, 
            description='Description'
            )
        counter += 1