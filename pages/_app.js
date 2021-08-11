import 'scripts/wdyr'

import Canvas from '@/components/Canvas'
import useCanvasStore from '@/store/canvasStore'
import '../styles/globals.scss'

function MyApp({ Component, pageProps, router }) {
  const initialized = useCanvasStore((state) => state.initialized)

  return (
    <>
      {initialized && <Canvas pageProps={pageProps} router={router} />}
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
