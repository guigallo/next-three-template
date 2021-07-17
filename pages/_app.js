import Canvas from '@/components/Canvas'
import useCanvasStore from '@/store/canvasStore'
import '../styles/globals.scss'

function MyApp({ Component, pageProps }) {
  const initialized = useCanvasStore((state) => state.initialized)

  return (
    <>
      {initialized && <Canvas pageProps={pageProps} />}
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
