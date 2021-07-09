import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { useLoader } from '@react-three/fiber'

const useTextureMaterial = ({
  path = '',
  repeatX = 1,
  repeatY = 1,
  aoMapIntensity = 5,
  baseColorPath,
  bumpScale = 10,
  displacementPath,
  // normal = 1,
  // normalPath,
  ambientOcclusionPath,
  // roughness = 5,
  // roughnessPath,
}) => {
  const [
    base,
    bump,
    //normalMap,
    ao,
    // rough,
  ] = useLoader(THREE.TextureLoader, [
    `${path}${baseColorPath}`,
    `${path}${displacementPath}`,
    // `${path}${normalPath}`,
    `${path}${ambientOcclusionPath}`,
    // `${path}${roughnessPath}`,
  ])

  useEffect(() => {
    // ;[base, bump, normalMap, ao, rough].forEach((texture) => {
    ;[base, bump, ao].forEach((texture) => {
      texture.wrapS = THREE.MirroredRepeatWrapping
      texture.wrapT = THREE.MirroredRepeatWrapping
      texture.repeat.set(repeatX, repeatY)
    })
  }, [repeatY, repeatX, base, bump, ao])

  const texturedMaterial = useRef(
    <meshPhysicalMaterial
      attach="material"
      map={base}
      bumpScale={bumpScale}
      bumpMap={bump}
      aoMapIntensity={aoMapIntensity}
      aoMap={ao}
      // normal={normal}
      // normalMap={normalMap}
      // roughness={roughness}
      // roughnessMap={rough}
      // envMap={scene.background}
      side={THREE.DoubleSide}
      reflectivity={0.5}
      metalness={0}
    />
  ).current

  return texturedMaterial
}

export default useTextureMaterial
