from django.urls import path
from app.views.order_views import OrderListCreateView, OrderRetrieveUpdateView
from app.views.pricing_views import PriceEstimateView
from app.views.negotiation_views import NegotiationOfferView, NegotiationResponseView

urlpatterns = [
    path("api/v1/orders/", OrderListCreateView.as_view(), name="order-list-create"),
    path("api/v1/orders/<uuid:id>/", OrderRetrieveUpdateView.as_view(), name="order-detail"),
    path("api/v1/pricing/estimate/", PriceEstimateView.as_view(), name="price-estimate"),
    path("api/v1/orders/price/offer/", NegotiationOfferView.as_view(), name="price-offer"),
    path("api/v1/orders/price/offer/respond/", NegotiationResponseView.as_view(), name="price-offer-response"),
]
