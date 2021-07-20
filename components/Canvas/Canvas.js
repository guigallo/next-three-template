import { useEffect } from 'react'
import * as THREE from 'three'
import { Environment, Loader } from '@react-three/drei'
import { Canvas as CanvasFiber } from '@react-three/fiber'
import { Physics, Debug, usePlane } from '@react-three/cannon'
import { Perf } from 'r3f-perf'
import { Leva, useControls } from 'leva'
import useCanvasStore from '@/store/canvasStore'
import useTexturedMaterial from '@/hooks/useTexturedMaterial'
import styles from './canvas.module.scss'

const Floor = () => {
  const args = [25, 25]
  const rotation = [Math.PI * 1.5, 0, 0]

  const [ref] = usePlane(() => ({ args, rotation }))

  const texturedMaterial = useTexturedMaterial({
    name: 'mat-floor',
    path: '/materials/stone-floor/',
    repeatX: 7,
    repeatY: 7,
    aoMapIntensity: 1,
    baseColorPath: 'Stone_Floor_003_COLOR.jpg',
    bumpScale: 0.2,
    displacementPath: 'Stone_Floor_003_DISP.png',
    normal: 0,
    normalPath: 'Stone_Floor_003_NORMAL.jpg',
    ambientOcclusionPath: 'Stone_Floor_003_OCC.jpg',
    roughness: 0.01,
    roughnessPath: 'Stone_Floor_003_ROUGH.jpg',
    side: THREE.FrontSide,
  })

  return (
    <mesh ref={ref} name="floor" rotation={rotation}>
      <planeGeometry args={args} />
      {texturedMaterial}
    </mesh>
  )
}

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

const DefaultScene = () => {
  return (
    <>
      <Environment background preset="dawn" />
      <Floor />
      <ambientLight />
    </>
  )
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

            <DefaultScene />
            {Object.keys(childrens).map((key) => childrens[key])}
          </DebugWrapper>
        </Physics>
      </CanvasFiber>

      <Loader />
    </>
  )
}

export default Canvas
