from django.urls import path
from apps.customer import views

urlpatterns = [
    path('profile/', views.CustomerProfileDetailView.as_view(), name='customer-profile'),
    path('addresses/', views.CustomerAddressListCreateView.as_view(), name='customer-address-list-create'),
    path('addresses/<int:pk>/', views.CustomerAddressDetailView.as_view(), name='customer-address-detail'),
]
