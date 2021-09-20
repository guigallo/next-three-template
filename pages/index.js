import { useMemo } from 'react'
import { useRouter } from 'next/router'
import { useSpring, animated } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
import Logo from '@/components/Logo'
import CanvasChildren from '@/components/CanvasChildren'
import Scene from '@/components/Scene'
import useCanvasStore from '@/store/canvasStore'
import styles from './index.module.scss'

// TODO move to utils
function clamp(min, val, max) {
  return Math.min(Math.max(val, min), max)
}

// TODO extract to component
const Directional = ({
  left = 'unset',
  right = 'unset',
  size = 64,
  onTriggerLeft = () => {},
  onTriggerRight = () => {},
  onTriggerUp = () => {},
  onTriggerDown = () => {},
  onRelease = () => {},
} = {}) => {
  const triggerPx = useMemo(() => size * 0.3, [size])
  const minLimit = useMemo(() => (size * 0.5) * -1, [size])
  const maxLimit = useMemo(() => size * 0.5, [size])
  const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }))

  const bind = useDrag(({ down, movement: [mx, my], dragging }) => {
    api.start({
      x: clamp(minLimit, down ? mx : 0, maxLimit),
      y: clamp(minLimit, down ? my : 0, maxLimit),
    })

    if (!dragging) {
      onRelease()
      return
    }

    const isTriggeredLeft = mx < -triggerPx
    const isTriggeredRight = mx > triggerPx
    const isTriggeredUp = my < -triggerPx
    const isTriggeredDown = my > triggerPx

    if (isTriggeredLeft) onTriggerLeft()
    if (isTriggeredRight) onTriggerRight()
    if (isTriggeredUp) onTriggerUp()
    if (isTriggeredDown) onTriggerDown()
  })

  return (
    <animated.div
      {...bind()}
      style={{
        x,
        y,
        touchAction: 'none',
        position: 'absolute',
        bottom: '30px',
        right,
        left,
        width: size,
        height: size,
        background: 'rgba(0,255,0,0.2)',
      }}
    />
  )
}

const Index = () => {
  const initialized = useCanvasStore((state) => state.initialized)
  const init = useCanvasStore((state) => state.actions.init)
  const router = useRouter()

  return (
    <div>
      <Logo />

      <CanvasChildren>
        <Scene key="Scene" />
      </CanvasChildren>

      <div className={styles['dev']}>
        {!initialized && <button onClick={init}>Show</button>}
        {initialized && (
          <button onClick={() => router.push('info')}>Info</button>
        )}
      </div>

      {
        /**
        * TODO connect to player and refactor
        **/
      }
      <Directional
        left={64}
        onTriggerLeft={() => console.log('move left')}
        onTriggerRight={() => console.log('move right')}
        onTriggerUp={() => console.log('move forward')}
        onTriggerDown={() => console.log('move backward')}
        onRelease={() => console.log('move stop')}
      />

      <Directional
        right={64}
        onTriggerLeft={() => console.log('look left')}
        onTriggerRight={() => console.log('look right')}
        onTriggerUp={() => console.log('look forward')}
        onTriggerDown={() => console.log('look backward')}
        onRelease={() => console.log('look stop')}
      />
    </div>
  )
}

export default Index
