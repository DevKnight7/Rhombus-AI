# data_processing_app/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('process/', views.process_data, name='process_data'),
    # Add more URLs as needed
]
