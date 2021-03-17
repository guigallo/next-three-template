import dynamic from 'next/dynamic'

const Three = dynamic(() => import('../scenes'), {
  ssr: false,
})

const Index = () => {
  return <Three />
}

export default Index
