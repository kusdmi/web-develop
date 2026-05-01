import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  MOCK_PRODUCTS,
  CATEGORIES,
  getCatalogFilterOptions,
} from '../data/mockProducts'
import { ShopHeader } from '../components/ShopHeader'
import { Footer } from '../components/Footer'
import { Slider } from '../components/Slider'
import { FilterSidebar } from '../components/FilterSidebar'
import { ProductCard } from '../components/ProductCard'
import './CatalogPage.css'

const priceCap = Math.max(...MOCK_PRODUCTS.map((p) => p.price), 10000)
const catalogFilterOptions = getCatalogFilterOptions()

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const appliedQuery = (searchParams.get('search') ?? '').trim()
  const [searchQuery, setSearchQuery] = useState(appliedQuery)
  const [categoryFilter, setCategoryFilter] = useState('')
  const [maxPrice, setMaxPrice] = useState(priceCap)
  const [socketFilter, setSocketFilter] = useState([])
  const [powerFilter, setPowerFilter] = useState([])
  const [brandFilter, setBrandFilter] = useState([])
  const [shapeFilter, setShapeFilter] = useState([])

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
    return MOCK_PRODUCTS.filter((p) => {
      const catOk = !categoryFilter || p.category === categoryFilter
      const priceOk = p.price <= maxPrice
      const socketOk = socketFilter.length === 0 || socketFilter.includes(p.socket)
      const powerOk = powerFilter.length === 0 || powerFilter.includes(p.powerW)
      const brandOk = brandFilter.length === 0 || brandFilter.includes(p.brand)
      const shapeOk = shapeFilter.length === 0 || shapeFilter.includes(p.shape)
      const textOk =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      return (
        catOk &&
        priceOk &&
        socketOk &&
        powerOk &&
        brandOk &&
        shapeOk &&
        textOk
      )
    })
  }, [
    appliedQuery,
    categoryFilter,
    maxPrice,
    socketFilter,
    powerFilter,
    brandFilter,
    shapeFilter,
  ])

  return (
    <div className="catalog-page">
      <ShopHeader
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onSearchSubmit={runSearch}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        categories={CATEGORIES}
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
