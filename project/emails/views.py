from django.views.decorators.http import require_http_methods
from django.http import JsonResponse
from django.shortcuts import render
from celery.result import AsyncResult

from project.settings import (
    EMAIL_TEST,
    DEFAULT_NUMBER_EMAILS
)
from .tasks import send_emails

from json import loads

def HomeView(request):
    context = {
        "default_email": EMAIL_TEST,
        "default_number": DEFAULT_NUMBER_EMAILS
    }
    return render(request, "emails/index.html", context)

@require_http_methods(["POST"])
def SendView(request):
    
    data = loads(request.body)

    email = data.get("email", EMAIL_TEST)
    number = int(data.get("number", DEFAULT_NUMBER_EMAILS))

    try:
        task = send_emails.apply_async(
            (email, number), 
            queue='queue_email'
            )

        response = {
            "status": "ok",
            "task": {
                "id": task.id,
                "status": task.status
            }
        }
    except:
        response = {
            "status": "fail",
            "task": None
        }
        
    return JsonResponse(response)

def ResultView(request):

    id = request.GET.get('task_id', False)

    if id:
        result = AsyncResult(id)
        return JsonResponse({
            "status": "ok",
            "task": {
                "id": result.id,
                "status": result.status
            }
        })
    return JsonResponse({
        "status": "fail",
        "task": None
    })

