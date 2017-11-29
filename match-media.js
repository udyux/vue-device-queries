import createDevice from './create-device'
import createHandler from './create-handler'

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

  return (queryString) => {
    const query = parseQuery(queryString)
    const matcher = {
      get matches() {
        return query()
      }
    }

    // return object must replicate native matchMedia API
    return {
      ...matcher,
      addListener(cb) {
        const handler = () => cb(matcher)
        listeners.push(handler)
      }
    }
  }
}

const matchMedia = window.matchMedia || matchMediaFallback()

export { matchMedia as default }
