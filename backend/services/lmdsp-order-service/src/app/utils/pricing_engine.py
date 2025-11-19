from decimal import Decimal

def calculate_price(order, rule, mode, customer_offer=None):
    """
    Calculate total price for an order based on the pricing mode.
    Supports DYNAMIC, FIXED, NEGOTIATED, and HYBRID.
    """

    if mode == "DYNAMIC":
        distance = Decimal(order.distance_km or 0)
        weight = Decimal(order.weight or 0)
        price = (
            rule.base_rate +
            (distance * rule.per_km_rate) +
            (weight * rule.per_kg_rate)
        )

        # SLA modifiers and promos
        if hasattr(order, "sla_modifier") and order.sla_modifier:
            price *= Decimal(order.sla_modifier)
        if hasattr(order, "promo_discount") and order.promo_discount:
            price -= Decimal(order.promo_discount)

        return round(price, 2)

    elif mode == "FIXED":
        return Decimal(rule.fixed_price or 0)

    elif mode == "NEGOTIATED":
        if not customer_offer:
            raise ValueError("Negotiation price not provided")

        offer = Decimal(customer_offer)
        if rule.negotiation_min_price <= offer <= rule.negotiation_max_price:
            return round(offer, 2)
        raise ValueError("Offer outside acceptable range")

    elif mode == "HYBRID":
        if order.service_type == "On-Demand":
            return calculate_price(order, rule, "DYNAMIC")
        elif order.service_type == "Outstation":
            return calculate_price(order, rule, "FIXED")
        else:
            return calculate_price(order, rule, "NEGOTIATED")

    else:
        raise ValueError("Invalid pricing mode")
