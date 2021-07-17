import create from 'zustand'
import produce from 'immer'

const validateKey = (children) => {
  if (!children.key) throw new Error('missing key')
}

const useCanvasStore = create((set) => {
  const setState = (fn) => set(produce(fn))

  return {
    show: false,
    initialized: false,
    childrens: {},

    actions: {
      init: () => {
        setState((state) => {
          state.initialized = true
          state.show = true
        })
      },

      add: (children) => {
        validateKey(children)

        setState((state) => {
          state.childrens[children.key] = children
        })
      },
      remove: (children) => {
        validateKey(children)

        setState((state) => {
          if (!state.childrens[children.key]) return
          delete state.childrens[children.key]
        })
      },
    },
  }
})

export default useCanvasStore
