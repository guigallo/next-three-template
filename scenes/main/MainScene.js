import { Suspense } from 'react'
import { PerspectiveCamera, OrbitControls } from '@react-three/drei'
import { Canvas } from 'react-three-fiber'
import Basic from '../../components/generated/Basic'
import styles from './main.module.scss'

const MainScene = () => {
  return (
    <Canvas className={styles.scene}>
      <Suspense fallback={null}>
        <ambientLight />
        <PerspectiveCamera makeDefault position={[15, 15, 15]} />
        <OrbitControls />
        <Basic />
      </Suspense>
    </Canvas>
  )
}

export default MainScene
