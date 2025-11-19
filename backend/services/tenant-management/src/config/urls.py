from django.urls import path
from app.views.tenant_views import TenantListCreateView, TenantDetailView, TenantUserLinkView
from app.views.subscription_views import SubscriptionView

urlpatterns = [
    path("tenants/", TenantListCreateView.as_view(), name="tenant-list-create"),
    path("tenants/<uuid:pk>/", TenantDetailView.as_view(), name="tenant-detail"),
    path("tenants/link-user/", TenantUserLinkView.as_view(), name="tenant-user-link"),
    path("subscriptions/<int:pk>/", SubscriptionView.as_view(), name="subscription-detail"),
]
