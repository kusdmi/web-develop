import { useCallback, useEffect, useState } from 'react'
import { fetchJson } from '../api/fetchJson'
import { fetchAdminJson, publicProductImageUrl, uploadAdminProductImage } from './adminApi'
import './AdminPages.css'

const emptyForm = () => ({
  sku: '',
  name: '',
  description: '',
  category: '',
  price: '',
  stock: '',
  image_url: '',
})

function productToForm(p) {
  return {
    sku: p.sku ?? '',
    name: p.name ?? '',
    description: p.description ?? '',
    category: p.category ?? '',
    price: String(p.price ?? ''),
    stock: String(p.stock ?? ''),
    image_url: p.image_url ?? '',
  }
}

export function AdminProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [uploadBusy, setUploadBusy] = useState(false)
  const [fileInputKey, setFileInputKey] = useState(0)
  /** { id, name, sku } | null */
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [deleteBusy, setDeleteBusy] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const list = await fetchJson('/api/products')
      setProducts(Array.isArray(list) ? list : [])
    } catch (e) {
      setError(e?.message || 'Не удалось загрузить товары')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    queueMicrotask(() => {
      void load()
    })
  }, [load])

  const openCreate = () => {
    setForm(emptyForm())
    setModal({ mode: 'create' })
  }

  const openEdit = (p) => {
    setForm(productToForm(p))
    setModal({ mode: 'edit', id: p.id })
  }

  const closeModal = () => {
    setModal(null)
    setForm(emptyForm())
    setFileInputKey((k) => k + 1)
  }

  const onImageFile = async (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    setUploadBusy(true)
    setError('')
    try {
      const path = await uploadAdminProductImage(f)
      setForm((prev) => ({ ...prev, image_url: path }))
    } catch (err) {
      setError(err?.message || 'Не удалось загрузить файл')
    } finally {
      setUploadBusy(false)
      e.target.value = ''
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    const payload = {
      sku: form.sku.trim(),
      name: form.name.trim(),
      description: form.description.trim() || null,
      category: form.category.trim(),
      price: Number(form.price),
      stock: parseInt(form.stock, 10),
      image_url: form.image_url.trim() || null,
    }
    if (!payload.sku || !payload.name || !payload.category) {
      setError('Заполните SKU, название и категорию')
      setSaving(false)
      return
    }
    if (!Number.isFinite(payload.price) || payload.price < 0) {
      setError('Некорректная цена')
      setSaving(false)
      return
    }
    if (!Number.isFinite(payload.stock) || payload.stock < 0) {
      setError('Некорректный остаток')
      setSaving(false)
      return
    }
    try {
      if (modal.mode === 'create') {
        await fetchAdminJson('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } else {
        await fetchAdminJson(`/api/products/${modal.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sku: payload.sku,
            name: payload.name,
            description: payload.description,
            category: payload.category,
            price: payload.price,
            stock: payload.stock,
            image_url: payload.image_url,
          }),
        })
      }
      closeModal()
      await load()
    } catch (err) {
      setError(err?.message || 'Ошибка сохранения')
    } finally {
      setSaving(false)
    }
  }

  const closeDeleteConfirm = () => {
    if (deleteBusy) return
    setDeleteConfirm(null)
  }

  const executeDelete = async () => {
    if (!deleteConfirm) return
    setDeleteBusy(true)
    setError('')
    try {
      await fetchAdminJson(`/api/products/${deleteConfirm.id}`, { method: 'DELETE' })
      setDeleteConfirm(null)
      await load()
    } catch (err) {
      setError(err?.message || 'Ошибка удаления')
    } finally {
      setDeleteBusy(false)
    }
  }

  if (loading && products.length === 0) {
    return <p className="admin-msg">Загрузка…</p>
  }

  return (
    <div>
      <h1 className="admin-page__title">Товары</h1>
      <div className="admin-toolbar">
        <button type="button" className="admin-btn" onClick={openCreate}>
          Добавить товар
        </button>
      </div>
      {error ? (
        <p className="admin-msg admin-msg--error" role="alert">
          {error}
        </p>
      ) : null}

      <div className="admin-table-wrap admin-table-wrap--products">
        <table className="admin-table admin-table--products">
          <thead>
            <tr>
              <th>ID</th>
              <th>SKU</th>
              <th>Название</th>
              <th>Категория</th>
              <th>Цена</th>
              <th>Остаток</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.sku}</td>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>{Number(p.price).toLocaleString('ru-RU')} ₽</td>
                <td>{p.stock}</td>
                <td>
                  <div className="admin-table__actions">
                    <button type="button" className="admin-btn admin-btn--ghost" onClick={() => openEdit(p)}>
                      Изменить
                    </button>
                    <button
                      type="button"
                      className="admin-btn admin-btn--danger"
                      onClick={() =>
                        setDeleteConfirm({ id: p.id, name: p.name, sku: p.sku })
                      }
                    >
                      Удалить
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal ? (
        <div className="admin-modal-overlay" role="presentation" onClick={closeModal}>
          <div
            className="admin-modal"
            role="dialog"
            aria-labelledby="admin-product-modal-title"
            onClick={(ev) => ev.stopPropagation()}
          >
            <h2 id="admin-product-modal-title" className="admin-modal__title">
              {modal.mode === 'create' ? 'Новый товар' : `Редактирование #${modal.id}`}
            </h2>
            <form className="admin-form" onSubmit={handleSave}>
              <label>
                SKU
                <input value={form.sku} onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))} required />
              </label>
              <label>
                Название
                <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
              </label>
              <label>
                Описание
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
              </label>
              <label>
                Категория
                <input
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  required
                />
              </label>
              <div className="admin-form__row">
                <label>
                  Цена
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                    required
                  />
                </label>
                <label>
                  Остаток
                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={form.stock}
                    onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                    required
                  />
                </label>
              </div>
              <label>
                Загрузить изображение
                <input
                  key={fileInputKey}
                  className="admin-form__file"
                  type="file"
                  accept=".jpg,.jpeg,.png,.gif,.webp,image/jpeg,image/png,image/gif,image/webp"
                  disabled={uploadBusy || saving}
                  onChange={onImageFile}
                />
              </label>
              {uploadBusy ? <p className="admin-form__note">Загрузка файла…</p> : null}
              {form.image_url.trim() ? (
                <div className="admin-form__preview-wrap">
                  {publicProductImageUrl(form.image_url) ? (
                    <img
                      src={publicProductImageUrl(form.image_url)}
                      alt="Предпросмотр"
                      className="admin-form__preview"
                    />
                  ) : null}
                  <button
                    type="button"
                    className="admin-btn admin-btn--ghost"
                    disabled={uploadBusy || saving}
                    onClick={() => {
                      setForm((f) => ({ ...f, image_url: '' }))
                      setFileInputKey((k) => k + 1)
                    }}
                  >
                    Удалить изображение
                  </button>
                </div>
              ) : null}
              <div className="admin-modal__actions">
                <button type="button" className="admin-btn admin-btn--ghost" onClick={closeModal}>
                  Отмена
                </button>
                <button type="submit" className="admin-btn" disabled={saving}>
                  {saving ? 'Сохранение…' : 'Сохранить'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {deleteConfirm ? (
        <div
          className="admin-modal-overlay"
          role="presentation"
          onClick={closeDeleteConfirm}
        >
          <div
            className="admin-modal admin-modal--confirm"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="admin-delete-title"
            aria-describedby="admin-delete-desc"
            onClick={(ev) => ev.stopPropagation()}
          >
            <h2 id="admin-delete-title" className="admin-modal__title">
              Удалить товар?
            </h2>
            <p id="admin-delete-desc" className="admin-confirm__text">
              Товар будет удалён из каталога без возможности восстановления.
              <span className="admin-confirm__sku">SKU: {deleteConfirm.sku}</span>
            </p>
            <p className="admin-confirm__name">{deleteConfirm.name}</p>
            <div className="admin-modal__actions">
              <button
                type="button"
                className="admin-btn admin-btn--ghost"
                onClick={closeDeleteConfirm}
                disabled={deleteBusy}
              >
                Отмена
              </button>
              <button
                type="button"
                className="admin-btn admin-btn--danger"
                onClick={() => void executeDelete()}
                disabled={deleteBusy}
              >
                {deleteBusy ? 'Удаление…' : 'Удалить'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
