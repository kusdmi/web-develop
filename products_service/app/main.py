from fastapi import Depends, FastAPI, File, HTTPException, UploadFile, status
from fastapi.staticfiles import StaticFiles
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from . import crud, schemas
from .auth_admin import create_access_token, get_current_admin, verify_admin_credentials
from .database import Base, engine, get_db
from .uploads import get_upload_dir, save_uploaded_image

app = FastAPI(title="Products Service", version="1.0.0")


@app.on_event("startup")
def on_startup() -> None:
    Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return {"service": "products", "status": "ok"}


@app.get("/products", response_model=list[schemas.ProductOut])
def list_products(db: Session = Depends(get_db)):
    return crud.get_products(db)


@app.post("/products/admin/login", response_model=schemas.AdminToken)
def admin_login(payload: schemas.AdminLogin):
    if not verify_admin_credentials(payload.username, payload.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )
    return schemas.AdminToken(access_token=create_access_token(payload.username))


@app.post("/products/admin/upload-image", response_model=schemas.ImageUploadOut)
async def admin_upload_image(
    file: UploadFile = File(...),
    _: str = Depends(get_current_admin),
):
    path = await save_uploaded_image(file)
    return schemas.ImageUploadOut(path=path)


@app.get("/products/{product_id}", response_model=schemas.ProductOut)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = crud.get_product(db, product_id)
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return product


@app.post("/products", response_model=schemas.ProductOut, status_code=status.HTTP_201_CREATED)
def create_product(
    payload: schemas.ProductCreate,
    db: Session = Depends(get_db),
    _: str = Depends(get_current_admin),
):
    try:
        return crud.create_product(db, payload)
    except IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Product with this SKU already exists",
        )


@app.put("/products/{product_id}", response_model=schemas.ProductOut)
def update_product(
    product_id: int,
    payload: schemas.ProductUpdate,
    db: Session = Depends(get_db),
    _: str = Depends(get_current_admin),
):
    product = crud.get_product(db, product_id)
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    try:
        return crud.update_product(db, product, payload)
    except IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Cannot update product due to SKU conflict",
        )


@app.delete("/products/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    _: str = Depends(get_current_admin),
):
    product = crud.get_product(db, product_id)
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    crud.delete_product(db, product)
    return None


upload_dir = get_upload_dir()
app.mount("/static", StaticFiles(directory=str(upload_dir)), name="static")
