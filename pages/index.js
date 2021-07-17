import { useRouter } from 'next/router'
import Logo from '@/components/Logo'
import CanvasChildren from '@/components/CanvasChildren'
import Scene from '@/components/Scene'
import useCanvasStore from '@/store/canvasStore'
import styles from './index.module.scss'

const Index = () => {
  const initialized = useCanvasStore((state) => state.initialized)
  const init = useCanvasStore((state) => state.actions.init)
  const router = useRouter()

  return (
    <div>
      <Logo />

      <CanvasChildren>
        <Scene key="scene" />
      </CanvasChildren>

      <div className={styles['dev']}>
        <button onClick={init}>Show</button>
        {initialized && (
          <button onClick={() => router.push('info')}>Info</button>
        )}
      </div>
    </div>
  )
}

export default Index
