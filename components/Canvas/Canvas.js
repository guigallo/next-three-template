import { useEffect } from 'react'
import { Loader } from '@react-three/drei'
import { Canvas as CanvasFiber } from '@react-three/fiber'
import { Physics, Debug } from '@react-three/cannon'
import { Perf } from 'r3f-perf'
import { Leva, useControls } from 'leva'
import useCanvasStore from '@/store/canvasStore'
import styles from './canvas.module.scss'

const DebugWrapper = ({ children }) => {
  const { debug } = useControls('Physics', { debug: false })
  if (!debug) return children
  return (
    <Debug color="black" scale={1.1}>
      {children}
    </Debug>
  )
}

const PerfWrapper = () => {
  const { enabled } = useControls('Perf', { enabled: false })
  if (!enabled) return null
  return <Perf position="top-left" />
}

const Canvas = () => {
  const { childrens } = useCanvasStore()

  useEffect(() => {
    console.log('canvas childrens changed')
  }, [childrens])

  return (
    <>
      <Leva collapsed />

      <CanvasFiber className={styles.scene}>
        <Physics>
          <DebugWrapper>
            <PerfWrapper />
            {Object.keys(childrens).map((key) => childrens[key])}
          </DebugWrapper>
        </Physics>
      </CanvasFiber>

      <Loader />
    </>
  )
}

export default Canvas
