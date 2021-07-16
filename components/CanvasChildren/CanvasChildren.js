import { useEffect } from 'react'
import useCanvasStore from '@/store/canvasStore'

function CanvasChildren({ children }) {
  const { add, remove } = useCanvasStore((state) => state.actions)

  useEffect(() => {
    if (!children) return

    if (Array.isArray(children)) {
      children.map(add)
    } else {
      add(children)
    }

    return () => {
      if (Array.isArray(children)) {
        children.map(remove)
      } else {
        remove(children)
      }
    }
  }, [children, add, remove])

  return null
}

export default CanvasChildren
