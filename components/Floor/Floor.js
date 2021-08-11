import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { useHeightfield } from '@react-three/cannon'
// import useTexturedMaterial from '@/hooks/useTexturedMaterial'

/* Generates a 2D array using Worley noise. */
function generateHeightmap({ width, height, number, scale }) {
  const data = []

  const seedPoints = []
  for (let i = 0; i < number; i++) {
    seedPoints.push([Math.random(), Math.random()])
  }

  let max = 0
  for (let i = 0; i < width; i++) {
    const row = []
    for (let j = 0; j < height; j++) {
      let min = Infinity
      seedPoints.forEach((p) => {
        const distance2 = (p[0] - i / width) ** 2 + (p[1] - j / height) ** 2
        if (distance2 < min) min = distance2
      })
      const d = Math.sqrt(min)
      if (d > max) max = d
      row.push(d)
    }
    data.push(row)
  }

  /* Normalize and scale. */
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      data[i][j] *= scale / max
    }
  }

  return data
}

function HeightmapGeometry({ heights, elementSize, ...rest }) {
  const ref = useRef()

  useEffect(() => {
    const dx = elementSize
    const dy = elementSize

    /* Create the vertex data from the heights. */
    const vertices = heights.flatMap((row, i) =>
      row.flatMap((z, j) => [i * dx, j * dy, z])
    )

    /* Create the faces. */
    const indices = []
    for (let i = 0; i < heights.length - 1; i++) {
      for (let j = 0; j < heights[i].length - 1; j++) {
        const stride = heights[i].length
        const index = i * stride + j
        indices.push(index + 1, index + stride, index + stride + 1)
        indices.push(index + stride, index + 1, index)
      }
    }

    ref.current.setIndex(indices)
    ref.current.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(vertices, 3)
    )
    ref.current.computeVertexNormals()
    ref.current.computeBoundingBox()
    ref.current.computeBoundingSphere()
  }, [heights])

  return <bufferGeometry {...rest} ref={ref} />
}

function Heightfield(props) {
  const { elementSize, heights, position, rotation, ...rest } = props

  const [ref] = useHeightfield(() => ({
    args: [heights, { elementSize }],
    position,
    rotation,
  }))

  // const texturedMaterial = useTexturedMaterial({
  //   name: 'mat-floor',
  //   path: '/materials/stone-floor/',
  //   repeatX: 7,
  //   repeatY: 7,
  //   aoMapIntensity: 1,
  //   baseColorPath: 'Stone_Floor_003_COLOR.jpg',
  //   bumpScale: 0.2,
  //   displacementPath: 'Stone_Floor_003_DISP.png',
  //   normal: 0,
  //   normalPath: 'Stone_Floor_003_NORMAL.jpg',
  //   ambientOcclusionPath: 'Stone_Floor_003_OCC.jpg',
  //   roughness: 0.01,
  //   roughnessPath: 'Stone_Floor_003_ROUGH.jpg',
  //   side: THREE.FrontSide,
  // })

  return (
    <mesh ref={ref} {...rest}>
      {/** texturedMaterial **/}
      <meshPhysicalMaterial color="#c2b280" />
      <HeightmapGeometry heights={heights} elementSize={elementSize} />
    </mesh>
  )
}

const scale = 30
function Floor() {
  return (
    <Heightfield
      elementSize={(scale * 1) / 128}
      heights={generateHeightmap({
        width: 128,
        height: 128,
        number: 30,
        scale: 1,
      })}
      position={[-scale / 2, -1 * 0.5, scale / 2]}
      rotation={[-Math.PI / 2, 0, 0]}
    />
  )
}

export default Floor
