import { useEffect, useRef } from 'react'
import { useSphere } from '@react-three/cannon'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
// import CameraControls from 'camera-controls'
import useIsMobile from '@/hooks/useIsMobile'
import useStore from '@/store/playerStore'

// CameraControls.install({ THREE })

const KeyBindings = {
  KeyW: 'forward',
  KeyS: 'backward',
  KeyA: 'left',
  KeyD: 'right',
  Space: 'jump',
}

const { Vector3 } = THREE

function Player({
  initialPos = [0, 0.8, 0],
  radius = 0.7,
  heightOffset = 0.9,
  speed = 5,
}) {
  const { onMove, setLockCursor } = useStore((store) => store.actions)
  const { movement, player } = useStore((store) => store.state)
  const { camera, gl } = useThree()
  const currentVelocity = useRef([0, 0, 0])
  const touchCamera = useRef(null)
  const isMobile = useIsMobile()

  /**
   * Init touch camera on mobile
   **/
  useEffect(() => {
    if (!isMobile) return
    if (touchCamera.current) return

    // touchCamera.current = new CameraControls(camera, gl.domElement)
  }, [isMobile, touchCamera, camera, gl.domElement])

  const [ref, api] = useSphere(() => ({
    mass: 1,
    position: initialPos,
    args: radius,
  }))

  /**
   * Update player velocity
   **/
  useEffect(
    () => {
      api.position.subscribe(([x, y, z]) => {
        camera.position.set(x, y + heightOffset, z)
      })
      api.velocity.subscribe(
        (newVelocity) => (currentVelocity.current = newVelocity)
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  /**
   * Keyboard controls
   **/
  useEffect(() => {
    const onKeyDown = (event) => {
      const action = KeyBindings[event.code]
      if (action) onMove(action, true)
    }

    const onKeyUp = (event) => {
      const action = KeyBindings[event.code]
      if (action) onMove(action, false)
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('keyup', onKeyUp)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('keyup', onKeyUp)
    }
  }, [onMove])

  /**
   * Mouse controls
   **/
  useEffect(() => {
    camera.rotation.order = 'YXZ'

    const onMouseMove = (e) => {
      if (!player.lockCursor) return

      const scale = -0.005
      camera.rotation.y += e.movementX * scale

      const newX = camera.rotation.x + e.movementY * scale
      const isTooHighOrTooLow = Math.abs(newX) > Math.PI / 2 - 0.05
      if (!isTooHighOrTooLow) camera.rotation.x = newX

      camera.rotation.z = 0
    }

    window.addEventListener('mousemove', onMouseMove)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [player.lockCursor])

  /**
   * Pointer Lock
   **/
  useEffect(() => {
    const onClick = () => {
      gl.domElement.requestPointerLock()
    }

    const onPointerLockChange = () => {
      const isLock =
        gl.domElement.ownerDocument.pointerLockElement === gl.domElement
      setLockCursor(isLock)
    }

    window.addEventListener('click', onClick)
    gl.domElement.ownerDocument.addEventListener(
      'pointerlockchange',
      onPointerLockChange
    )
    // gl.domElement.ownerDocument.addEventListener(
    //   'mozpointerlockchange',
    //   onPointerLockChange
    // )

    return () => {
      window.removeEventListener('click', onClick)
      gl.domElement.ownerDocument.removeEventListener(
        'pointerlockchange',
        onPointerLockChange
      )
      // gl.domElement.ownerDocument.removeEventListener(
      //   'mozpointerlockchange',
      //   onPointerLockChange
      // )
    }
  }, [gl.domElement])

  /**
   * Player movement and update camera
   **/
  useFrame((state /** delta **/) => {
    if (!player.enabled) {
      api.velocity.set(0, 0, 0)
      return
    }

    // if (touchCamera.current) touchCamera.current.update(delta)

    // camera.position.copy(ref.current.position);
    // camera.position.y = height;

    const frontVector = new Vector3(
      0,
      0,
      (movement.backward ? 1 : 0) - (movement.forward ? 1 : 0)
    )
    const sideVector = new Vector3(
      (movement.left ? 1 : 0) - (movement.right ? 1 : 0),
      0,
      0
    )

    const newVelocity = new Vector3()
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(speed)
      .applyEuler(camera.rotation)

    // api.velocity.set(
    //   newVelocity.x,
    //   movement.jump ? 2 : currentVelocity.current[1],
    //   newVelocity.z
    // )
    api.velocity.set(newVelocity.x, currentVelocity.current[1], newVelocity.z)

    if (movement.jump && state.camera.position.y <= radius + heightOffset) {
      api.applyImpulse([0, 2.3, 0], [0, 0, 0])
    }
  }, 0)

  return <mesh ref={ref} />
}

export default Player
