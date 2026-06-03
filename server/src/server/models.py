from django.db import models


class Quote(models.Model):
    text = models.CharField(max_length=500)

    def __str__(self):
        return self.text[:50]

    class Meta:
        app_label = "server"
