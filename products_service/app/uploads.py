"""Сохранение загруженных изображений товаров."""
import os
import uuid
from pathlib import Path

from fastapi import File, HTTPException, UploadFile, status

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
MAX_FILE_BYTES = 5 * 1024 * 1024


def get_upload_dir() -> Path:
    raw = os.getenv("PRODUCTS_UPLOAD_DIR", "uploads")
    d = Path(raw).resolve()
    d.mkdir(parents=True, exist_ok=True)
    return d


async def save_uploaded_image(file: UploadFile) -> str:
    if not file.filename:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Empty filename")
    ext = Path(file.filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Allowed file types: {', '.join(sorted(ALLOWED_EXTENSIONS))}",
        )
    body = await file.read()
    if len(body) > MAX_FILE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File too large (max 5 MB)",
        )
    if len(body) == 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Empty file")

    name = f"{uuid.uuid4().hex}{ext}"
    dest = get_upload_dir() / name
    dest.write_bytes(body)
    return f"/static/{name}"
