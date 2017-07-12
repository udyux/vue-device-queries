import { MediaSynchronizer } from './MediaSynchronizer'

export default {
  install(Vue, queries) {
    let vm = new MediaSynchronizer(Vue, queries)
    Vue.prototype.$device = vm.device
  }
}
