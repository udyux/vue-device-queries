import createDevice from './device'
import createHandler from './handler'

// match media fallback using resize event
const matchMediaFallback = () => {
  let listeners = []
  let idle = true

  const device = createDevice()

  const parseQuery = (queryString) => {
    let [feature, value] = queryString.replace(/[()\s]/g, '').split(':')
    return createHandler(feature, value, device)
  }

  window.addEventListener('resize', () => {
    // back out if window is still resizing
    if (!idle) return;
    idle = false

    let width = device.width
    let height = device.height

    let timer = setInterval(() => {
      if (width !== device.width || height !== device.height) {
        // still resizing, update sizes
        width = device.width
        height = device.height
      } else {
        // cancel the timer and call each handler
        clearTimeout(timer)
        listeners.forEach(handler => handler())
        idle = true
      }
    }, 60)
  })

  return function(queryString) {
    const query = parseQuery(queryString)

    // return object must replicate native matchMedia API
    return {
      get matches() {
        return query()
      },
      addListener(responder) {
        listeners.push(() => responder(this))
      }
    }
  }
}

const matchMedia = window.matchMedia || matchMediaFallback()

export { matchMedia as default }
