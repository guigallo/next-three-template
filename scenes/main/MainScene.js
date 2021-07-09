import { Suspense, useMemo, useRef } from 'react'
import * as THREE from 'three'
import {
  PerspectiveCamera,
  OrbitControls,
  useTexture,
  Environment,
} from '@react-three/drei'
import { Canvas, useLoader } from '@react-three/fiber'
import { OBJLoader, MTLLoader, VRMLLoader } from 'three-stdlib'
import { useControls } from 'leva'
import useTexturedMaterial from '../../hooks/useTexturedMaterial'
import styles from './main.module.scss'

const ObjMtl = ({ position = [0, 0, 0], objPath, mtlPath }) => {
  const mtl = useLoader(MTLLoader, mtlPath)
  const obj = useLoader(OBJLoader, objPath, (loader) => {
    mtl.preload()
    loader.setMaterials(mtl)
  })

  return <primitive position={position} object={obj} />
}

const PlaneObj = ({
  name = '',
  mapPath = '',
  alphaMapPath = '',
  width = 1920,
  height = 1080,
  scale: initialScale = 1,
  rotation: initialRotation = [0, 0, 0],
  position: initialPosition = [0, 0, 0],
}) => {
  const [map, alphaMap] = useTexture([mapPath, alphaMapPath])
  const mesh = useRef()

  const args = useMemo(() => {
    const aspect = Math.min(width, height)
    return [width / aspect, height / aspect]
  }, [width, height])

  const { position, rotation, scale } = useControls(name, {
    position: initialPosition,
    rotation: initialRotation,
    scale: initialScale,
  })

  return (
    <mesh
      name={name}
      ref={mesh}
      scale={scale}
      position={position}
      rotation={rotation}
    >
      <planeGeometry args={args} />
      <meshBasicMaterial
        transparent
        map={map}
        alphaMap={alphaMap}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

const Floor = () => {
  const texturedMaterial = useTexturedMaterial({
    path: '/stone-floor/',
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
  })

  return (
    <mesh rotation={[Math.PI * 1.5, 0, 0]}>
      <planeGeometry args={[25, 25]} />
      {texturedMaterial}
    </mesh>
  )
}

const Man = () => {
  const object = useLoader(VRMLLoader, 'Paul 3d.wrl')

  return (
    <group position={[50, 0, 50]}>
      <primitive object={object} />
    </group>
  )
}

const MainScene = () => {
  return (
    <Canvas className={styles.scene}>
      <Suspense fallback={null}>
        <Environment background={false} preset="apartment" />
        <ambientLight />
        <PerspectiveCamera makeDefault position={[15, 15, 15]} />
        <OrbitControls />

        <ObjMtl
          position={[0, -2.4, 0]}
          objPath="Arquibanquina.obj"
          mtlPath="Arquibanquina.mtl"
        />
        <ObjMtl objPath="Primeira_parede.obj" mtlPath="Primeira_parede.mtl" />

        <Floor />

        <PlaneObj
          name="8008 parede"
          mapPath="8008.B.jpg"
          alphaMapPath="8008.B-alpha.jpg"
          width={5504}
          height={8622}
          scale={0.28}
          rotation={[0, 1.57, 0]}
          position={[1.41, 2.04, 3.2]}
        />

        <PlaneObj
          name="8008 arquibanquina"
          mapPath="8008.B.jpg"
          alphaMapPath="8008.B-alpha.jpg"
          width={5504}
          height={8622}
          scale={0.5}
          rotation={[0, 0.76, 0]}
          position={[7.44, 1.05, 1.86]}
        />

        <Man />
      </Suspense>
    </Canvas>
  )
}

export default MainScene
