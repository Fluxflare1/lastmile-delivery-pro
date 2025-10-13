# backend/apps/shipments/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.shipments.views import ShipmentViewSet

router = DefaultRouter()
router.register(r'', ShipmentViewSet, basename='shipments')

urlpatterns = [
    path('', include(router.urls)),
]
