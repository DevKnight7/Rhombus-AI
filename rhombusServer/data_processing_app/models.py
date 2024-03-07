from django.db import models

class ProcessedData(models.Model):
    column_name = models.CharField(max_length=255)
    data_type = models.CharField(max_length=20)
