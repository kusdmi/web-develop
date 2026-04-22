from decimal import Decimal

from sqlalchemy.orm import Session

from . import models, schemas


def get_orders(db: Session) -> list[models.Order]:
    return db.query(models.Order).order_by(models.Order.id.asc()).all()


def get_order(db: Session, order_id: int) -> models.Order | None:
    return db.query(models.Order).filter(models.Order.id == order_id).first()


def create_order(db: Session, payload: schemas.OrderCreate, item_prices: dict[int, Decimal]) -> models.Order:
    total_price = sum(item_prices[item.product_id] * item.quantity for item in payload.items)

    order = models.Order(
        customer_name=payload.customer_name,
        phone=payload.phone,
        email=payload.email,
        address=payload.address,
        total_price=total_price,
        status="new",
    )

    for item in payload.items:
        order.items.append(
            models.OrderItem(
                product_id=item.product_id,
                quantity=item.quantity,
                price=item_prices[item.product_id],
            )
        )

    db.add(order)
    db.commit()
    db.refresh(order)
    return order


def update_order_status(db: Session, order: models.Order, status: str) -> models.Order:
    order.status = status
    db.commit()
    db.refresh(order)
    return order
