import { Suspense, lazy, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const HeroScene = lazy(() => import('./HeroScene.jsx'))

export default function Hero() {
  const [coords, setCoords] = useState({ x: '128.400', y: '096.200', z: '042.860' })

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return
    let z = 42.86
    const id = setInterval(() => {
      const x = (128.4 + (Math.random() * 2 - 1)).toFixed(3)
      const y = (96.2 + (Math.random() * 2 - 1)).toFixed(3)
      z += 0.02
      if (z > 60) z = 42.86
      setCoords({ x: x.padStart(7, '0'), y: y.padStart(7, '0'), z: z.toFixed(3).padStart(7, '0') })
    }, 900)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="hero">
      <Suspense fallback={null}>
        <HeroScene />
      </Suspense>
      <div className="hero-grid-decor" aria-hidden="true"></div>
      <div className="wrap hero-inner">
        <div className="telemetry" aria-hidden="true">
          <span>X:<b>{coords.x}</b></span>
          <span>Y:<b>{coords.y}</b></span>
          <span>Z:<b>{coords.z}</b></span>
          <span>NOZZLE:<b>204°C</b></span>
          <span>BED:<b>60°C</b></span>
        </div>
        <h1>
          <span className="hero-line"><span>Precision printing.</span><span className="nozzle" aria-hidden="true"></span></span>
          <span className="hero-line"><span>Made to order, shipped fast.</span><span className="nozzle" aria-hidden="true"></span></span>
          <span className="hero-line"><span>Zero guesswork.</span><span className="nozzle" aria-hidden="true"></span></span>
        </h1>
        <p className="lede">
          Browse 773 Labs' catalog of printable designs — prototypes, props, miniatures, and more.
          Pick what you want and order it directly on WhatsApp.
        </p>
        <div className="hero-ctas">
          <Link to="/shop" className="btn btn-primary">Browse the catalog →</Link>
          <Link to="/quote" className="btn btn-ghost">Get a custom quote</Link>
        </div>
      </div>
    </section>
  )
}
