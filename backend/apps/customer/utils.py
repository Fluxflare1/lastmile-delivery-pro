from geopy.geocoders import Nominatim
from .models import CustomerAddress  # Use your actual model

def geocode_address(address):
    """Fetch latitude and longitude from address text."""
    geolocator = Nominatim(user_agent="lmdsp_geo")
    # Use your actual field names: 'street' not 'street_address'
    location = geolocator.geocode(f"{address.street}, {address.city}, {address.state}")
    if location:
        address.latitude = location.latitude
        address.longitude = location.longitude
        address.save()
    return address
