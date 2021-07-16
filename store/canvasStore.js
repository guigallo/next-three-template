import create from 'zustand'
import produce from 'immer'

const validateKey = (children) => {
  if (!children.key) throw new Error('missing key')
}

const useCanvasStore = create((set) => {
  const setState = (fn) => set(produce(fn))

  return {
    childrens: {},
    actions: {
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
