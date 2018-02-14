export default () => {
  const node = document.createElement('div')
  const style = document.createElement('style')

  node.id = 'match-media-node'
  style.innerHTML = `#match-media-node {
    width: 100%;
    height: 100%;
    position: absolute;
    bottom: 100%;
    overflow: scroll;
  }`

  document.head.appendChild(style)
  document.body.insertBefore(node, document.body.children[0])

  return {
    get width() {
      return node.clientWidth
    },
    get height() {
      return node.clientHeight
    },
    get orientation() {
      return (node.clientHeight > node.clientWidth)
        ? 'portrait'
        : 'landscape'
    },
    get fontSize() {
      return window
        .getComputedStyle(document.documentElement)
        .getPropertyValue('font-size')
    }
  }
}
