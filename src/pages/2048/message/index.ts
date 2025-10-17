import { render, createVNode } from 'vue'

import { insertDivToBody } from '@/utils/browser'
import CMessage from './CMessage.vue'

type CMessageProps = InstanceType<typeof CMessage>['$props']
export function message(options: CMessageProps) {
  const { el, close } = insertDivToBody()

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
