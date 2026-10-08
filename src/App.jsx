import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Product from './pages/Product.jsx'
import Shop from './pages/Shop.jsx'
import Services from './pages/Services.jsx'
import B2B from './pages/B2B.jsx'
import Sell from './pages/Sell.jsx'
import TrackOrder from './pages/TrackOrder.jsx'
import Compare from './pages/Compare.jsx'
import AppPromo from './pages/AppPromo.jsx'
import Navbar from './components/Navbar.jsx'

export default function App() {
  return (
    <main id="top">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/services" element={<Services />} />
        <Route path="/b2b" element={<B2B />} />
        <Route path="/sell" element={<Sell />} />
        <Route path="/track" element={<TrackOrder />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/app" element={<AppPromo />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
  )
}
