<template>
  <div class="container">
    <div class="headerWrap">
      <img src="../../../static/img/index/logo.png" alt="" />
      <h1 class="titleText">卫星雷达三维可视化展示系统</h1>
    </div>
    <div id="cesiumContainer"></div>
    <footerMain v-if="showGloble"></footerMain>
  </div>
</template>
  
  <script>
import footerMain from "./footer";
// import Globe from '../../core/globe.vue'

import Globe from "../../core/test.vue";
// import CesiumNavigation from "cesium-navigation-es6";
export default {
  name: "cesiumPage",
  data() {
    return {
      showGloble: false,
    };
  },
  mounted() {
    const self = this;``
    Globe.initGlobe();
    Globe.changeInitGlobe(self.viewer);
    Globe.flytochina_hz(115.0529, 39.1993, 117.5802, 40.6345, self.viewer);
    self.showGloble = true;

    // let polygon1 = self.viewer.entities.add({
    //   name: "polygon_height",
    //   polygon: {
    //     show: true,
    //     hierarchy: Cesium.Cartesian3.fromDegreesArray([
    //       120.706329, 29.866108, 123.290184, 30.272421, 122.97084, 31.893534,
    //       120.340843, 31.489588,
    //     ]),
    //     height: 100000,
    //     material: Cesium.Color.RED.withAlpha(0.5),
    //     outline: true,
    //     outlineColor: Cesium.Color.BLACK,
    //   },
    // });
 
    // self.viewer.flyTo(polygon1);

  },
  components: {
    footerMain,
  },
};
</script>
  
  <style scoped>
.container {
  width: 100%;
  height: 100vh;
}
#cesiumContainer {
  width: 100%;
  height: 100vh;
}
.headerWrap {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 998;
  width: 100%;
}
.headerWrap img {
  width: 100%;
}
.titleText {
  z-index: 999;
  color: #fff;
  width: 100%;
  position: fixed;
  top: 0;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}
</style>
  