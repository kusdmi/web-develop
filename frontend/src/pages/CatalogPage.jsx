import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  selectAllProducts,
  selectCategories,
  selectProductsError,
  selectProductsStatus,
} from '../store/productsSlice'
import { ShopHeader } from '../components/ShopHeader'
import { Footer } from '../components/Footer'
import { Slider } from '../components/Slider'
import { FilterSidebar } from '../components/FilterSidebar'
import { ProductCard } from '../components/ProductCard'
import './CatalogPage.css'

export function CatalogPage() {
  const products = useSelector(selectAllProducts)
  const status = useSelector(selectProductsStatus)
  const error = useSelector(selectProductsError)
  const categories = useSelector(selectCategories)

  const [searchParams, setSearchParams] = useSearchParams()
  const appliedQuery = (searchParams.get('search') ?? '').trim()
  const [searchQuery, setSearchQuery] = useState(appliedQuery)
  const [categoryFilter, setCategoryFilter] = useState('')
  const priceCap = useMemo(() => {
    const cap = products.length ? Math.max(...products.map((p) => Number(p.price) || 0)) : 0
    return Math.max(cap, 10000)
  }, [products])
  const [maxPrice, setMaxPrice] = useState(priceCap)
  const [socketFilter, setSocketFilter] = useState([])
  const [powerFilter, setPowerFilter] = useState([])
  const [brandFilter, setBrandFilter] = useState([])
  const [shapeFilter, setShapeFilter] = useState([])

  const catalogFilterOptions = useMemo(
    () => ({ sockets: [], powers: [], brands: [], shapes: [] }),
    [],
  )

  const runSearch = () => {
    const q = searchQuery.trim()
    if (q) {
      setSearchParams({ search: q })
    } else {
      setSearchParams({})
    }
  }

  const filtered = useMemo(() => {
    const q = appliedQuery.toLowerCase()
    return products.filter((p) => {
      const catOk = !categoryFilter || p.category === categoryFilter
      const priceOk = p.price <= maxPrice
      const textOk =
        !q ||
        p.name.toLowerCase().includes(q) ||
        String(p.description || '').toLowerCase().includes(q)
      return (
        catOk &&
        priceOk &&
        textOk
      )
    })
  }, [
    products,
    appliedQuery,
    categoryFilter,
    maxPrice,
  ])

  return (
    <div className="catalog-page">
      <ShopHeader
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onSearchSubmit={runSearch}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        categories={categories}
      />
      <Slider />
      <div className="catalog-page__main">
        <FilterSidebar
          maxPrice={maxPrice}
          onMaxPriceChange={setMaxPrice}
          priceCap={priceCap}
          socketFilter={socketFilter}
          onSocketFilterChange={setSocketFilter}
          powerFilter={powerFilter}
          onPowerFilterChange={setPowerFilter}
          brandFilter={brandFilter}
          onBrandFilterChange={setBrandFilter}
          shapeFilter={shapeFilter}
          onShapeFilterChange={setShapeFilter}
          filterOptions={catalogFilterOptions}
        />
        <div className="catalog-page__grid-wrap">
          {status === 'loading' ? (
            <p className="catalog-page__empty">Загрузка каталога…</p>
          ) : status === 'failed' ? (
            <p className="catalog-page__empty">{error || 'Не удалось загрузить каталог'}</p>
          ) : null}
          <ul className="catalog-page__grid">
            {filtered.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
          {filtered.length === 0 && (
            <p className="catalog-page__empty">Ничего не найдено</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
