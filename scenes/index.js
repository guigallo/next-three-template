import { Suspense } from 'react'
import { PerspectiveCamera, FlyControls, OrbitControls } from '@react-three/drei'
import { Canvas } from 'react-three-fiber'
import Basic from '../components/generated/Basic'

const Home = () => {
  return (
    <Canvas style={{ width: '100vw', height: '100vh' }}>
      <Suspense fallback={null}>
        <ambientLight />
        <PerspectiveCamera makeDefault position={[0, 0, 10]} />
        <FlyControls autoForward={false} dragToLook />
        <OrbitControls />
        {/* <Plane args={[3, 3]} position={[0, 0, 0]} receiveShadow /> */}
        <Basic />
      </Suspense>
    </Canvas>
  )
}

export default Home
