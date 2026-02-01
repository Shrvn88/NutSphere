'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import NProgress from 'nprogress'

export default function NavigationProgress() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    NProgress.configure({ showSpinner: false, speed: 400, minimum: 0.25 })
  }, [])

  useEffect(() => {
    NProgress.done()
  }, [pathname, searchParams])

  return null
}
