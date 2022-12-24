<template>
  <div class="home">
    <cesiumPage></cesiumPage>
  </div>
</template>

<script>
// @ is an alias to /src
import cesiumPage from '../components/layout/cesium.vue'

export default {
  name: 'Home',
  components: {
    cesiumPage
  }
}
</script>
