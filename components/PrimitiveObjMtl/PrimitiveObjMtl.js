import { useMemo } from 'react'
import * as THREE from 'three'
import { useLoader } from '@react-three/fiber'
import { useCompoundBody } from '@react-three/cannon'
import { OBJLoader, MTLLoader } from 'three-stdlib'

const PrimitiveObjMtl = ({
  translateColiders = { x: 0, y: 0, z: 0 },
  objPath,
  mtlPath,
}) => {
  const mtl = useLoader(MTLLoader, `/gltf/${mtlPath}`)

  const obj = useLoader(OBJLoader, `/gltf/${objPath}`, (loader) => {
    mtl.preload()
    loader.setMaterials(mtl)
  })

  const shapes = useMemo(() => {
    if (!obj) return []

    return obj.children
      .filter((children) => children.type === 'Mesh')
      .map((mesh) => {
        mesh.geometry.computeBoundingBox()
        const boundingBox = mesh.geometry.boundingBox

        const args = [
          boundingBox.max.x - boundingBox.min.x,
          boundingBox.max.y - boundingBox.min.y,
          boundingBox.max.z - boundingBox.min.z,
        ]

        const positionVec = new THREE.Vector3()
        positionVec.subVectors(boundingBox.max, boundingBox.min)
        positionVec.multiplyScalar(0.5)
        positionVec.add(boundingBox.min)
        positionVec.add(translateColiders)
        positionVec.applyMatrix4(mesh.matrixWorld)
        const { x, y, z } = positionVec
        const position = [x, y, z]

        return { type: 'Box', args, position }
      })
  }, [obj, translateColiders])

  useCompoundBody(() => ({ shapes }))

  return <primitive object={obj} />
}

export default PrimitiveObjMtl
