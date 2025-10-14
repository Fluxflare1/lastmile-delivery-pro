from django.urls import path, include
from apps.customer import views
from rest_framework.routers import DefaultRouter

# Initialize router
router = DefaultRouter()
router.register(r"addresses", views.CustomerAddressViewSet, basename="customer-address")

urlpatterns = [
    # Customer Profile endpoints
    path('profile/', views.CustomerProfileDetailView.as_view(), name='customer-profile'),
    
    # Include all ViewSet routes (recommended approach)
    path('', include(router.urls)),
    
    # Optional: Keep legacy endpoints for backward compatibility during migration
    # path('legacy/addresses/', views.CustomerAddressListCreateView.as_view(), name='legacy-address-list-create'),
    # path('legacy/addresses/<int:pk>/', views.CustomerAddressDetailView.as_view(), name='legacy-address-detail'),
]
