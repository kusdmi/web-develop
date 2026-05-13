from decimal import Decimal

from fastapi import Depends, FastAPI, HTTPException, status
from sqlalchemy.orm import Session, selectinload

from . import crud, models, schemas
from .auth_admin import get_current_admin
from .database import Base, engine, get_db
from .products_client import get_product_price

app = FastAPI(title="Orders Service", version="1.0.0")


@app.on_event("startup")
def on_startup() -> None:
    Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return {"service": "orders", "status": "ok"}


@app.post("/orders", response_model=schemas.OrderOut, status_code=status.HTTP_201_CREATED)
def create_order(payload: schemas.OrderCreate, db: Session = Depends(get_db)):
    item_prices: dict[int, Decimal] = {}
    for item in payload.items:
        if item.product_id in item_prices:
            continue
        price = get_product_price(item.product_id)
        if price is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Cannot resolve product price for product_id={item.product_id}",
            )
        item_prices[item.product_id] = price
    return crud.create_order(db, payload, item_prices)


@app.get("/orders", response_model=list[schemas.OrderOut])
def list_orders(
    db: Session = Depends(get_db),
    _: str = Depends(get_current_admin),
):
    return (
        db.query(models.Order)
        .options(selectinload(models.Order.items))
        .order_by(models.Order.id.asc())
        .all()
    )


@app.get("/orders/{order_id}", response_model=schemas.OrderOut)
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    _: str = Depends(get_current_admin),
):
    order = (
        db.query(models.Order)
        .options(selectinload(models.Order.items))
        .filter(models.Order.id == order_id)
        .first()
    )
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    return order


@app.put("/orders/{order_id}/status", response_model=schemas.OrderOut)
def update_status(
    order_id: int,
    payload: schemas.OrderStatusUpdate,
    db: Session = Depends(get_db),
    _: str = Depends(get_current_admin),
):
    order = (
        db.query(models.Order)
        .options(selectinload(models.Order.items))
        .filter(models.Order.id == order_id)
        .first()
    )
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    return crud.update_order_status(db, order, payload.status)
