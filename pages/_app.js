import Canvas from '@/components/Canvas'
import '../styles/globals.scss'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Canvas pageProps={pageProps} />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
