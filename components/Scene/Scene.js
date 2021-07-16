import { Suspense, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls, useTexture } from '@react-three/drei'
import { useLoader } from '@react-three/fiber'
import { OBJLoader, MTLLoader } from 'three-stdlib'
import { useControls } from 'leva'

const ObjMtl = ({ position = [0, 0, 0], objPath, mtlPath }) => {
  const mtl = useLoader(MTLLoader, `/gltf/${mtlPath}`)
  const obj = useLoader(OBJLoader, `/gltf/${objPath}`, (loader) => {
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

function Scene() {
  return (
    <Suspense fallback={null}>
      <OrbitControls />

      <ObjMtl
        position={[0, -2.4, 0]}
        objPath="Arquibanquina.obj"
        mtlPath="Arquibanquina.mtl"
      />
      <ObjMtl objPath="Primeira_parede.obj" mtlPath="Primeira_parede.mtl" />

      <PlaneObj
        name="8008 parede"
        mapPath="/images/8008.B.jpg"
        alphaMapPath="/images/8008.B-alpha.jpg"
        width={5504}
        height={8622}
        scale={0.28}
        rotation={[0, 1.57, 0]}
        position={[1.41, 2.04, 3.2]}
      />

      <PlaneObj
        name="8008 arquibanquina"
        mapPath="/images/8008.B.jpg"
        alphaMapPath="/images/8008.B-alpha.jpg"
        width={5504}
        height={8622}
        scale={0.5}
        rotation={[0, 0.76, 0]}
        position={[7.44, 1.05, 1.86]}
      />
    </Suspense>
  )
}

export default Scene
