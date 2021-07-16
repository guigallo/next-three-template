import Canvas from '@/components/Canvas'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Canvas pageProps={pageProps} />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
