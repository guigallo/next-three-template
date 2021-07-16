import { useRouter } from 'next/router'
import Logo from '@/components/Logo'
import CanvasChildren from '@/components/CanvasChildren'
import Scene from '@/components/Scene'

const Index = () => {
  const router = useRouter()

  return (
    <div>
      <Logo />

      <CanvasChildren>
        <Scene key="scene" />
      </CanvasChildren>

      <div style={{ position: 'absolute', bottom: 0 }}>
        <button onClick={() => router.push('info')}>Info</button>
      </div>
    </div>
  )
}

export default Index
