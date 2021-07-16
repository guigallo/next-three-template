const withTM = require('next-transpile-modules')([
  '@react-three/fiber',
  '@react-three/drei',
  'three',
])

module.exports = withTM()
