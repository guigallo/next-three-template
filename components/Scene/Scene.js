import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Environment, useTexture, useGLTF } from '@react-three/drei'
import { useControls } from 'leva'
import Player from '@/components/Player'
import PrimitiveObjMtl from '@/components/PrimitiveObjMtl'
import Floor from '@/components/Floor'

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
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} castShadow />
      <Environment background preset="dawn" />
      <Floor />

      <Player />

      <group position={[0, -2.4, 0]}>
        <PrimitiveObjMtl
          translateColiders={{ x: 0, y: -2.4, z: 0 }}
          objPath="Arquibanquina.obj"
          mtlPath="Arquibanquina.mtl"
        />
      </group>
      <PrimitiveObjMtl
        objPath="Primeira_parede.obj"
        mtlPath="Primeira_parede.mtl"
      />

      {/**
        <group scale={0.05} position={[0, 3, 0]}>
          <PrimitiveObjMtl objPath="statue.obj" mtlPath="statue.mtl" />
        </group>
      **/}

      <PlaneObj
        name="8008 parede"
        mapPath="/images/8008.B_low.jpg"
        alphaMapPath="/images/8008.B-alpha_low.jpg"
        width={1376}
        height={2156}
        scale={0.28}
        rotation={[0, 1.57, 0]}
        position={[1.41, 2.04, 3.2]}
      />

      <PlaneObj
        name="8008 arquibanquina"
        mapPath="/images/8008.B_low.jpg"
        alphaMapPath="/images/8008.B-alpha_low.jpg"
        width={1376}
        height={2156}
        scale={0.5}
        rotation={[0, 0.76, 0]}
        position={[7.44, 1.05, 1.86]}
      />

      <Glb />
      <GlbNew />

      <Glb2 />
    </>
  )
}

const Glb2 = () => {
  const { nodes } = useGLTF('/gltf/escultura/scene.gltf')

  return (
    <group position={[3, 1, -3]} scale={0.5}>
      {Object.keys(nodes).map((key) => {
        const object = nodes[key]
        if (object.type !== 'Mesh') return null
        return <primitive key={key} object={object} />
      })}
    </group>
  )
}

const Glb = () => {
  const { nodes } = useGLTF('/gltf/statue9-1.glb')

  return (
    <group receiveShadow castShadow position={[-3, 0.2, -3]} scale={20}>
      <primitive object={nodes.Sphere1} />
    </group>
  )
}

const GlbNew = () => {
  const { nodes } = useGLTF('/gltf/statue-15.glb')

  return (
    <group position={[-0, 1, -3]} scale={0.2}>
      <primitive object={nodes.Capsule} />
    </group>
  )
}

export default Scene
