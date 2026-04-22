from decimal import Decimal
import os

import httpx
from dotenv import find_dotenv, load_dotenv

load_dotenv(find_dotenv(usecwd=True))

PRODUCTS_SERVICE_URL = os.getenv("PRODUCTS_SERVICE_URL", "http://localhost:8001")


def get_product_price(product_id: int) -> Decimal | None:
    try:
        response = httpx.get(f"{PRODUCTS_SERVICE_URL}/products/{product_id}", timeout=5.0)
    except httpx.RequestError:
        return None

    if response.status_code != 200:
        return None

    payload = response.json()
    price = payload.get("price")
    if price is None:
        return None
    return Decimal(str(price))
