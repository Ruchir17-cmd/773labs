import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Product from './pages/Product.jsx'

export default function App() {
  return (
    <main id="top">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
  )
}
