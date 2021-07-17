import create from 'zustand'
import produce from 'immer'

const usePlayerStore = create((set) => {
  const setState = (fn) => set(produce(fn))

  const initialState = {
    player: {
      enabled: true,
      lockCursor: false,
    },
    movement: {
      forward: false,
      backward: false,
      left: false,
      right: false,
      jump: false,
    },
  }

  return {
    state: initialState,
    actions: {
      reset: () => {
        set({ state: { ...initialState } })
      },
      setLockCursor: (value) => {
        setState(({ state }) => {
          state.player.lockCursor = value
        })
      },
      onMove: (direction, value) => {
        setState(({ state }) => {
          state.movement[direction] = value
        })
      },
    },
  }
})

export default usePlayerStore
