import { useState, useRef, useEffect } from 'react'
import * as THREE from 'three'
import { useLoader } from '@react-three/fiber'

const useTextureMaterial = ({
  name,
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
  side = THREE.DoubleSide,
}) => {
  const [fullLoaded, setFullLoaded] = useState(false)
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
      texture.wrapS = THREE.RepeatWrapping
      texture.wrapT = THREE.RepeatWrapping
      texture.repeat.set(repeatX, repeatY)
    })
    setFullLoaded(true)
  }, [repeatY, repeatX, base, bump, ao])

  const texturedMaterial = useRef(
    <meshPhysicalMaterial
      wrapT={THREE.RepeatWrapping}
      wrapS={THREE.RepeatWrapping}
      name={name}
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
      side={side}
      reflectivity={0.5}
      metalness={0}
    />
  ).current

  if (!fullLoaded) return null
  return texturedMaterial
}

export default useTextureMaterial
