from django.urls import path

from .views import HomeView, SendView, ResultView

app_name = "emails"
urlpatterns = [
    path('', HomeView, name="home"),
    path('send', SendView, name="send"),
    path('result', ResultView, name="result"),
]
