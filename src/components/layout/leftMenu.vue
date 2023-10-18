<!-- 主界面右侧主菜单 -->
<template>
  <div class="firstMenuWrap">
    <div class="mainMenuLeft">
      <div class="menuTool">
        <div
          :class="[{ active: selectMenuIndex == indexP }, 'menuToolItem']"
          v-for="(itemParent, indexP) in menuData"
          :key="indexP"
          @click="clickMenu(itemParent, indexP)"
        >
          <img
            v-show="selectMenuIndex != indexP"
            class="toolImg"
            :src="
              require('../../../static/img/firstMenu/' +
                itemParent.name +
                '.png')
            "
            alt
          />
          <img
            v-show="selectMenuIndex == indexP"
            class="toolImg"
            :src="
              require('../../../static/img/firstMenu/' +
                itemParent.name +
                '1.png')
            "
            alt
          />
          {{ itemParent.name }}
        </div>
      </div>
    </div>
    <div class="menuRightPanel" v-show="showPanelBtn">
      <div class="headerMenu">
        {{ menuName }}
        <img
          class="closeImg"
          src="../../../static/img/index/close.png"
          @click="closeRightChild"
          alt
        />
      </div>
      <component
        class="contentPanel"
        v-bind:is="dynamicComponents"
        ref="child"
      ></component>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menuImgPre: "../../../static/img/firstMenu/",
      imgLast: ".png",
      selectMenuIndex: -1,
      showPanelBtn: false,
      selectData: null,
      menuName: "",
      dynamicComponents: null,
      treeDefaultCheck: [],
      treeCheckNode: [],
      menuData: [
        {
          name: "图层目录",
          children: [],
        },
        {
          name: "空间测量",
          children: [
            {
              name: "空间距离",
              active: false,
            },
            {
              name: "垂直距离",
              active: false,
            },

            {
              name: "水平面积",
              active: false,
            },
            {
              name: "贴地距离",
              active: false,
            },
            {
              name: "贴地面积",
              active: false,
            },
            // {
            //   name: '角度',
            //   active: false
            // }
          ],
        },
        {
          name: "数据下载",
          children: [],
        },
        {
          name: "数据中心",
          children: [],
        },
        {
          name: "数据处理",
          children: [
            {
              name: "脚本",
              active: false,
            },
            {
              name: "脚本",
              active: false,
            },
            {
              name: "脚本",
              active: false,
            },
            {
              name: "脚本",
              active: false,
            },
            {
              name: "脚本",
              active: false,
            },
            {
              name: "脚本",
              active: false,
            },
          ],
        },
        {
          name: "图上标绘",
          children: [
            {
              name: "点",
              active: false,
            },
            {
              name: "线",
              active: false,
            },
            {
              name: "面",
              active: false,
            },
            {
              name: "圆",
              active: false,
            },
            {
              name: "矩形",
              active: false,
            },
          ],
        },
        {
          name: "空间分析",
          children: [
            {
              name: "日照分析",
              active: false,
            },
            // {
            //   name: '通视分析',
            //   active: false
            // },
            {
              name: "可视域",
              active: false,
            },
            // {
            //   name: '控高分析',
            //   active: false
            // },
            {
              name: "淹没分析",
              active: false,
            },
            {
              name: "地形开挖",
              active: false,
            },
            {
              name: "剖面分析",
              active: false,
            },
            // {
            //   name: '挖填方',
            //   active: false
            // }
          ],
        },

        {
          name: "对比分析",
          children: [
            {
              name: "双图对比",
              active: false,
            },
            {
              name: "卷帘对比",
              active: false,
            },
          ],
        },
        {
          name: "飞行漫游",
          children: [],
        },
        {
          name: "数据可视化",
          children: [],
        },
      ],
    };
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {
    hideRight() {
      const self = this;
      // self.selectMenuIndex = -1;
      self.showPanelBtn = false;
    },
    openRight() {
      const self = this;
      if (self.selectMenuIndex === -1) {
        self.$message({
          message: "未选择功能按钮",
          type: "warning",
        });
      } else {
        self.showPanelBtn = true;
      }
    },
    closeRightChild() {
      const self = this;
      self.selectMenuIndex = -1;
      self.showPanelBtn = false;
    },

    clickMenu(data, index) {
      const self = this;
      self.showPanelBtn = true;
      self.selectMenuIndex = index;
      if (self.selectData) {
        self.selectData.children.forEach((item) => {
          item.active = false;
        });
      }
      self.menuName = data.name;
      self.selectData = data;
      switch (data.name) {
        case "图层目录":
          self.$nextTick(() => {
            self.dynamicComponents = (resolve) =>
              require(["../toolsPanel/layersTree.vue"], resolve);
          });
          break;
        case "空间测量":
          self.$nextTick(() => {
            self.dynamicComponents = (resolve) =>
              require(["../toolsPanel/spaceMeasure.vue"], resolve);
          });
          break;
        case "数据下载":
          self.$nextTick(() => {
            self.dynamicComponents = (resolve) =>
              require(["../toolsPanel/download.vue"], resolve);
          });
          break;
        case "数据中心":
          self.$nextTick(() => {
            self.dynamicComponents = (resolve) =>
              require(["../toolsPanel/dataCenter.vue"], resolve);
          });
          break;
        case "数据处理":
          self.$nextTick(() => {
            self.dynamicComponents = (resolve) =>
              require(["../toolsPanel/scriptProcess.vue"], resolve);
          });
          break;
        case "图上标绘":
          self.$nextTick(() => {
            self.dynamicComponents = (resolve) =>
              require(["../toolsPanel/drawMarks.vue"], resolve);
          });
          break;
        case "数据可视化":
          self.$nextTick(() => {
            self.dynamicComponents = (resolve) =>
              require(["../toolsPanel/test.vue"], resolve);
          });
          break;
        default:
          break;
      }
    },
  },
};
</script>
<style scoped>
.firstMenuWrap {
  position: fixed;
  left: 0;
  top: 14vh;
  color: #fff;
  font-size: 16px;
}
.mainMenuLeft {
  margin-left: 1vw;
  display: inline-block;
}
.menuLogo {
  width: 13vw;
  cursor: pointer;
  margin-top: -3vh;
}
.menuTool {
  width: 7rem;
  margin: 0 auto;
  padding: 0 1.2vw;
  background: rgba(63, 72, 84, 0.85);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.4);
}
.menuToolItem {
  padding: 1vh 0;
  cursor: pointer;
}
.toolImg {
  vertical-align: middle;
  width: 1.5rem;
  height: 1.5rem;
}
.active {
  color: #55f32f;
}
.menuRightPanel {
  float: right;
  width: 300px;
  height: 80vh;
  background: rgba(63, 72, 84, 0.7);
  margin-left: 5px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.4);
}
.headerMenu {
  width: 100%;
  height: 2.2vw;
  line-height: 2.2vw;
  padding-left: 1vw;
  font-size: 0.9rem;
  background: rgba(63, 72, 84, 1);
  box-sizing: border-box;
}
.closeImg {
  position: absolute;
  right: 0.8vw;
  top: 0.8vh;
  cursor: pointer;
}
.contentPanel {
  width: 100%;
  height: 75vh;
  padding: 1vh 0.5vw;
  box-sizing: border-box;
}
</style>
