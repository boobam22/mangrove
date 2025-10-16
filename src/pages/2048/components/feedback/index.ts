import { render, createVNode } from 'vue'

import NewGame from './NewGame.vue'
import CMessage from './CMessage.vue'

function insertDiv() {
  const el = document.createElement('div')
  document.body.appendChild(el)

  const close = () => {
    render(null, el)
    el.remove()
  }

  return { el, close }
}

export function showNewGameConfirm() {
  const { el, close } = insertDiv()

  return new Promise<boolean>((resolve) => {
    const vnode = createVNode(NewGame, {
      onConfirm: () => {
        close()
        resolve(true)
      },
      onCancel: () => {
        close()
        resolve(false)
      },
    })

    render(vnode, el)
  })
}

type CMessageProps = InstanceType<typeof CMessage>['$props']
export function message(options: CMessageProps) {
  const { el, close } = insertDiv()

  const origin = options.onClose ?? (() => {})
  const vnode = createVNode(CMessage, {
    ...options,
    onClose() {
      origin()
      close()
    },
  })

  render(vnode, el)

  return close
}
