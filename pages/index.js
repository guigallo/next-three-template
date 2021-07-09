import { Loader } from '@react-three/drei'
import { Logo } from '../components'
import { MainScene } from '../scenes'

const Index = () => {
  return (
    <div>
      <Logo />
      <MainScene />
      <Loader />
    </div>
  )
}

export default Index
