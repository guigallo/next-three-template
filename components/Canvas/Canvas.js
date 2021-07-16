import { useEffect, Suspense } from 'react'
import * as THREE from 'three'
import { PerspectiveCamera, Environment, Loader } from '@react-three/drei'
import { Canvas as CanvasFiber } from '@react-three/fiber'
import { Perf } from 'r3f-perf'
import { Leva } from 'leva'
import useCanvasStore from '@/store/canvasStore'
import useTexturedMaterial from '@/hooks/useTexturedMaterial'
import styles from './canvas.module.scss'

const Floor = () => {
  const texturedMaterial = useTexturedMaterial({
    name: 'mat-floor',
    path: '/materials/stone-floor/',
    repeatX: 10,
    repeatY: 10,
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
    <mesh name="floor" rotation={[Math.PI * 1.5, 0, 0]}>
      <planeGeometry args={[25, 25]} />
      {texturedMaterial}
    </mesh>
  )
}

const Canvas = () => {
  const { childrens } = useCanvasStore()

  useEffect(() => {
    console.log('childrens changed')
  }, [childrens])

  return (
    <>
      <Leva collapsed />

      <CanvasFiber className={styles.scene}>
        <Perf position="top-left" />

        <ambientLight />
        <PerspectiveCamera makeDefault position={[15, 15, 15]} />
        <Suspense fallback={null}>
          <Environment background={false} preset="apartment" />
          <Floor />
        </Suspense>

        {Object.keys(childrens).map((key) => childrens[key])}
      </CanvasFiber>

      <Loader />
    </>
  )
}

export default Canvas
