import matchMedia from './match-media'

export default {
  install(Vue, queries) {
    // reactive store for media-queries
    const DeviceVM = new Vue({
      data() {
        return {
          devices: {}
        }
      },

      methods: {
        addDevice(name, active) {
          this.$set(this.devices, name, active)

          return ({ matches }) => {
            this.devices[name] = matches
          }
        }
      }
    })

    Object.keys(queries).forEach(name => {
      let query = matchMedia(`(${queries[name]})`)
      let update = DeviceVM.addDevice(name, query.matches)
      query.addListener(update)
    })

    // only make device states available app wide
    Vue.prototype.$device = DeviceVM.devices
  }
}
