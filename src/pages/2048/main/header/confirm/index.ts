import { render, createVNode } from 'vue'

import { insertDivToBody } from '@/utils/browser'
import NewGame from './NewGame.vue'

export function showNewGameConfirm() {
  const { el, close } = insertDivToBody()

  return new Promise<boolean>((resolve) => {
    const vnode = createVNode(NewGame, {
      onConfirm: () => resolve(true),
      onCancel: () => resolve(false),
    })

    render(vnode, el)
  }).finally(close)
}
