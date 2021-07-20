import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'

const useQueryString = ({ key, router }) => {
  const [controlsEnabled, setControlsEnabled] = useState(false)
  const nextRouter = useRouter()
  const _router = router || nextRouter

  useEffect(() => {
    if (!_router) return

    const hascontrolsEnabled = Object.keys(_router.query).some((i) => i === key)
    if (!hascontrolsEnabled) {
      setControlsEnabled(false)
      return
    }

    const shouldHide = _router.query[key] === 'false'
    if (shouldHide) {
      setControlsEnabled(false)
      return
    }

    setControlsEnabled(true)
  }, [_router, key])

  const hideControls = useCallback(() => {
    if (!_router) return

    _router.push('.', '.', { shallow: false })
  }, [_router])

  return [controlsEnabled, hideControls]
}

export default useQueryString
