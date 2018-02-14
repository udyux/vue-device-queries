# Vue device-queries

> Reactive Vue.js media-queries without resize event listeners using `window.matchMedia`. Includes a polyfill that uses resize events when browser support is missing.

## Usage

> Requires Vue.js 2+

### Install

```bash
npm i vue-device-queries
```

### Define queries

```javascript
import Vue from 'vue'
import DeviceQueries from 'vue-device-queries'

Vue.use(DeviceQueries, {
  phone: 'max-width: 567px',
  tablet: 'min-width: 568px',
  mobile: 'max-width: 1024px',
  laptop: 'min-width: 1025px',
  desktop: 'min-width: 1280px',
  monitor: 'min-width: 1448px'
})
```

### Use in components

```html
<template>
  <main class="app">
    <side-bar v-if="$device.laptop"/>
    <dash-board :items-per-row="itemsPerRow"/>
  </main>
</template>

<script>
export default {
  name: 'App',
  computed: {
    itemsPerRow() {
      return (this.$device.phone) ? 1
        : (this.$device.tablet) ? 2
        : 3
    }
  }
}
</script>
```
