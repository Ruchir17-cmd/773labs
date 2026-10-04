import { lazy, Suspense } from 'react'

const LabExperience = lazy(() => import('./LabExperience.jsx'))

export default function Hero() {
  return (
    <Suspense fallback={<section className="lab-loading" aria-label="Loading the print studio"><span>Opening the studio…</span></section>}>
      <LabExperience />
    </Suspense>
  )
}
