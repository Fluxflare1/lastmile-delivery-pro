from django.contrib import admin
from django.urls import path, include
from django_prometheus import exports

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("app.urls")),
    path("metrics/", exports.ExportToDjangoView.as_view()),
]
