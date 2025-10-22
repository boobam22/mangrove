import { type VNodeChild, render, createVNode } from 'vue'

import { insertDivToBody } from '@/utils/browser'
import CMessage from './CMessage.vue'

type CMessageProps = InstanceType<typeof CMessage>['$props']
export function message(options: CMessageProps, children?: Record<string, () => VNodeChild>) {
  const { el, close } = insertDivToBody()

  const origin = options.onClose ?? (() => {})
  const vnode = createVNode(
    CMessage,
    {
      ...options,
      onClose() {
        origin()
        close()
      },
    },
    children,
  )

  render(vnode, el)

  return close
}
