import { render } from 'vue'

export function insertDivToBody() {
  const el = document.createElement('div')
  document.body.appendChild(el)

  const close = () => {
    render(null, el)
    el.remove()
  }

  return { el, close }
}
