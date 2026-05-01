import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { CartProvider } from './context/CartProvider'
import { CatalogPage } from './pages/CatalogPage'
import { ProductPage } from './pages/ProductPage'
import { CartPage } from './pages/CartPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { ConfirmationPage } from './pages/ConfirmationPage'
import './App.css'

function CatalogRoute() {
  const { search } = useLocation()
  return <CatalogPage key={search} />
}

export default function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/catalog" replace />} />
        <Route path="/catalog" element={<CatalogRoute />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/confirmation" element={<ConfirmationPage />} />
        <Route path="*" element={<Navigate to="/catalog" replace />} />
      </Routes>
    </CartProvider>
  )
}
