import { useEffect } from 'react'
import { Canvas as CanvasFiber } from '@react-three/fiber'
import { Environment, Loader, Stats, OrbitControls } from '@react-three/drei'
import { Physics, Debug } from '@react-three/cannon'
import { Perf } from 'r3f-perf'
import { Leva, useControls } from 'leva'
import Player from '@/components/Player'
import Floor from '@/components/Floor'
import useCanvasStore from '@/store/canvasStore'
import styles from './canvas.module.scss'

const DebugWrapper = ({ children }) => {
  const { debug } = useControls(
    'Developer',
    {
      debug: { value: false, label: 'physics' },
    },
    { collapsed: true }
  )

  if (!debug) return children
  return (
    <Debug color="black" scale={1.1}>
      {children}
    </Debug>
  )
}

const PerfWrapper = () => {
  const { enabled } = useControls(
    'Developer',
    {
      enabled: { value: false, label: 'show perf' },
    },
    { collapsed: true }
  )

  if (!enabled) return null
  return <Perf position="top-left" />
}

const Canvas = () => {
  const { childrens } = useCanvasStore()

  const { showFps, showOrbit } = useControls(
    'Developer',
    {
      showFps: { value: false, label: 'show fps' },
      showOrbit: { value: false, label: 'orbit controls' },
    },
    { collapsed: true }
  )

  useControls('Light', {}, { collapsed: true })

  const { ambientLightIntensity } = useControls(
    'Light.Ambient Light',
    {
      ambientLightIntensity: { label: 'intensity', value: 1 },
    },
    { collapsed: true }
  )

  const { directionalLightIntensity } = useControls(
    'Light.Directional Light',
    {
      directionalLightPosition: { label: 'position', value: [10, 10, 10] },
      directionalLightIntensity: { label: 'intensity', value: 1 },
    },
    { collapsed: true }
  )

  useEffect(() => {
    console.log('canvas childrens changed')
  }, [childrens])

  return (
    <>
      <Leva collapsed />

      <CanvasFiber className={styles.scene}>
        <Stats enabled={showFps} />
        <Physics>
          <DebugWrapper>
            <PerfWrapper />

            <group name="DefaultScene">
              <ambientLight intensity={ambientLightIntensity} />
              <directionalLight
                position={[10, 10, 10]}
                intensity={directionalLightIntensity}
              />
              <Environment background preset="dawn" />
              <Floor />
              {showOrbit ? <OrbitControls /> : <Player />}
            </group>

            {Object.keys(childrens).map((key) => childrens[key])}
          </DebugWrapper>
        </Physics>
      </CanvasFiber>

      <Loader />
    </>
  )
}

export default Canvas
