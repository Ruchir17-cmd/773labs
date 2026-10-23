import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Printers from './pages/Printers.jsx'
import Order from './pages/Order.jsx'
import Vulnerability from './pages/Vulnerability.jsx'
import Navbar from './components/Navbar.jsx'

export default function App() {
  return (
    <>
      <div className="bg-layer" aria-hidden="true" />
      <main id="top">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/printers" element={<Printers />} />
          <Route path="/order" element={<Order />} />
          <Route path="/vulnerability" element={<Vulnerability />} />
          <Route path="/vulnerability-report" element={<Vulnerability />} />
          <Route path="/vuln" element={<Vulnerability />} />
          <Route path="/security" element={<Vulnerability />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
    </>
  )
}
