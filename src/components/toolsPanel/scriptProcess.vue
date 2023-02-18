<template>
  <div>
    <div class="drawMarksWrap">
      <ul class="contentToolImgUl" v-show="firstMenuShow">
        <li
          v-for="(item, index) in $parent.selectData.children"
          :key="index"
          @click="clickQuery(item, index)"
        >
          <div v-show="selectIndex !== index">
            <img
              class="toolImg"
              :src="
                require('../../../static/img/secondMenu/' + item.name + '.png')
              "
              alt
            />
            <div>{{ item.name }}</div>
          </div>
          <div v-show="selectIndex == index">
            <img
              class="toolImg"
              :src="
                require('../../../static/img/secondMenu/' + item.name + '1.png')
              "
              alt
            />
            <div style="color: #55f32f">{{ item.name }}</div>
          </div>
        </li>
      </ul>
    </div>
    <!-- <component v-bind:is="dynamicComponents" ref="child" class="scriptsComponents"></component> -->
    <el-drawer
      title="脚本1"
      :visible.sync="drawer"
      direction="rtl"
      append-to-body
      :before-close="handleClose"
    >
      <div class="title">文件选择</div>
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        max-height="350"
        style="width: 100%"
        size="mini"
        @select="addEntity"
        @selection-change="handleSelectionChange"
      >
        <el-table-column label="日期" width="85">
          <template slot-scope="scope">{{ scope.row.date }}</template>
        </el-table-column>
        <el-table-column prop="fileName" label="文件名" width="260">
        </el-table-column>
        <el-table-column type="selection" width="55"> </el-table-column>
      </el-table>

      <div class="process">
        <el-button
          type="primary"
          :disabled="disabledProductFolder"
          size="mini"
          @click="productFolder"
          >数据准备</el-button
        >

        <el-select
          v-model="selectValue"
          :disabled="selectDisable"
          size="mini"
          clearable
          placeholder="生成cut文件"
          @change="changeCutValue()"
        >
          <el-option
            v-for="(item, index) in options"
            :key="index"
            :value="item.fileName"
          >
          </el-option>
        </el-select>
        <el-button
          type="primary"
          :disabled="disabledProductCoordinateFileandOPOD"
          size="mini"
          @click="productCoordinateFileandOPOD"
          >图像生成</el-button
        >
        <!-- <el-button
          type="primary"
          size="mini"
          @click="showImg"
          :disabled="runAble"
          >查看影像</el-button
        > -->
      </div>
      <div
        class="loading"
        v-if="loadingFlag"
        v-loading="loading"
        element-loading-text="loadingText"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.3)"
      ></div>
      <div v-if="imgShow">
        <div
          class="SLC_img"
          v-loading="loading"
          element-loading-text="影像生成中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.3)"
        >
          <canvas id="mycanvas" ref="mycanvas" width="240" height="400">
            <img :src="SLC_img" ref="BmpImg" alt="" />
          </canvas>
        </div>

        <div class="burst">
          <div class="right_select">
            <span class="select_title">条带: </span>
            <el-select
              v-model="iw_value"
              size="mini"
              placeholder="请选择"
              @change="changeIWValue()"
            >
              <el-option
                v-for="item in burst"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>

          <div class="right_select">
            <span class="select_title">burst块数: </span>
            <el-input
              v-model="burst_num"
              placeholder="请输入选取的burst块数"
              size="mini"
              :disabled="inputShow"
            ></el-input>
          </div>

          <div class="right_select">
            <span class="select_title">起始burst号:</span>
            <el-input
              v-model="burst_first"
              placeholder="请输入起始burst号"
              size="mini"
              :disabled="inputShow"
            ></el-input>
          </div>
          <div class="right_select">
            <el-button
              type="primary"
              size="mini"
              @click="productTops"
              :disabled="fileProductAble"
              >文件生成</el-button
            >
          </div>
          <div class="right_select">
            <el-button
              type="primary"
              size="mini"
              @click="showBmp"
              :disabled="bmpShow"
              >BMP影像</el-button
            >
          </div>
        </div>
      </div>
    </el-drawer>

    <el-dialog
      title="影像切割"
      :visible.sync="dialogVisible"
      append-to-body
      :before-close="handleClose"
    >
      <div
        v-loading="bmpLoading"
        :element-loading-text="bmpLoadingText"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.3)"
      >
        <img :src="Bmp_img" ref="BmpImg" alt="" />
      </div>

      <div class="bmp_input">
        x轴起始点:
        <el-input
          v-model="bmpRow"
          placeholder="请输入选取的row"
          size="mini"
        ></el-input>
        宽度:
        <el-input
          v-model="bmpWidth"
          placeholder="请输入选取区域的宽度"
          size="mini"
        ></el-input>
        y轴起始点:
        <el-input
          v-model="bmpCol"
          placeholder="请输入选取的col"
          size="mini"
        ></el-input>
        长度:
        <el-input
          v-model="bmpHeight"
          placeholder="请输入选取的长度"
          size="mini"
        ></el-input>
        <el-button
          type="primary"
          :disabled="splitAble"
          size="small"
          @click="splitBmp"
          >切割</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
  

<script>
import { log } from "console";

export default {
  data() {
    return {
      bmpLoadingText: "影像生成中",
      splitAble: false,
      bmpLoading: true,
      fileProductAble: false,
      bmpShow: true,
      disabledProductCoordinateFileandOPOD: true,
      disabledProductFolder: false,
      loadingText: "...",
      loadingFlag: false,
      folderName: "",
      loading: true,
      bmpCol: "",
      bmpWidth: "",
      bmpRow: "",
      bmpHeight: "",
      canvasFlag: 0,
      imgShow: false,
      selectIndex: -1,
      firstMenuShow: true,
      currentData: {}, // 当前选中的值
      dynamicComponents: null,
      dialogVisible: false,
      drawer: false,
      selectValue: "",
      runAble: true,
      selectDisable: true,
      SLC_img: "",
      Bmp_img: "",
      iw_value: "",
      inputShow: true,
      cutTime: "",
      burst_num: "",
      burst_first: "",
      burst: [
        {
          value: "1",
          label: "iw1",
        },
        {
          value: "2",
          label: "iw2",
        },
        {
          value: "3",
          label: "iw3",
        },
      ],
      options: [
        {
          value: "选项1",
          label:
            "S1A_IW_SLC__1SDV_20221028T100541_20221028T100603_045641_057529_45F6",
        },
        {
          value: "选项2",
          label:
            "S1A_IW_SLC__1SDV_20221028T100541_20221028T100603_045641_057529_45F6",
        },
        {
          value: "选项3",
          label:
            "S1A_IW_SLC__1SDV_20221028T100541_20221028T100603_045641_057529_45F6",
        },
      ],
      tableData: [],
      multipleSelection: [],
    };
  },
  mounted() {
    const self = this;
    var dateformat = require("dateformat-util");
    this.$axios.getDownloadData().then((res) => {
      res["Downloaded_data"].forEach((element) => {
        let time = dateformat.format(new Date(element["date"]), "yyyy-MM-dd");
        let fileName = element["title"];
        self.tableData.push({
          date: time,
          fileName: fileName,
        });
      });
    });
  },
  updated() {
    if (this.canvasFlag) {
      this.draw();
    }
  },
  methods: {
    async productCoordinateFileandOPOD() {
      this.loadingFlag = true;
      this.loadingText = "图像生成ing";

      this.disabledProductCoordinateFileandOPOD = true;

      console.log(this.folderName);
      let paramsForOPOD = {
        dateArr: this.options.map((element) => {
          return element["date"];
        }),
        folderName: this.folderName,
      };
      console.log(paramsForOPOD);

      let resForOPOD = await this.$axios.getOPOD(paramsForOPOD);

      let coordinatesParams = {
        selectFile: this.selectValue,
        folderName: this.folderName,
      };
      let resForCoordinateFile = await this.$axios
        .productCoordinateFile(coordinatesParams)
        .then((res) => {
          console.log(res);
          this.loadingFlag = false;
        });

      this.showImg();
    },
    productFolder() {
      this.disabledProductFolder = true;
      this.loadingFlag = true;
      this.loadingText = "正在建立文件夹";
      let params = {
        zipList: this.options.map((element) => {
          return element["fileName"];
        }),
      };
      console.log(params);
      this.$axios.productFolder(params).then((res) => {
        console.log(res);
        this.folderName = res;
        this.loadingFlag = false;
        this.$alert("文件夹已建立");
      });
      this.selectDisable = false;
    },
    splitBmp() {
      this.splitAble = true;
      this.bmpLoadingText = "正在切割ing";
      this.bmpLoading = true;
      let params = {
        cutTime: this.cutTime,
        folderName: this.folderName,
        bmpRow: this.bmpRow,
        bmpWidth: this.bmpWidth,
        bmpCol: this.bmpCol,
        bmpHeight: this.bmpHeight,
      };
      this.$axios.splitBmp(params).then((res) => {
        console.log(res);
        this.bmpLoading = false;
        this.$alert("影像已切割");
      });
    },
    draw() {
      var canvas = this.$refs.mycanvas;
      var ctx = canvas.getContext("2d");
      var img = new Image();
      img.src = this.SLC_img;
      img.onload = function () {
        ctx.drawImage(img, 0, 0, 240, 400);
        // 设置间隔
        var space = 80;

        var ySpace = 40;
        // 定义当前坐标
        var x = 0,
          y = 0;
        // 设置虚线
        ctx.setLineDash([5, 10]);
        //绘制水平方向的网格线
        for (y = ySpace; y < canvas.height; y += ySpace) {
          //开启路径
          ctx.beginPath();

          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }
        //绘制垂直方向的网格线
        for (x = space; x < canvas.width; x += space) {
          //开启路径
          ctx.beginPath();

          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }
      };
    },
    productTops() {
      this.bmpShow = false;
      this.fileProductAble = true;
      let params = {
        iw: this.iw_value,
        burst_num: this.burst_num,
        burst_first: this.burst_first,
        cutTime: this.cutTime,
        folderName: this.folderName,
      };

      this.$axios.productTOPS(params).then(
        (res) => {
          console.log("res", res);
          this.$alert("TOPS文件已生成，请在后台查看！");
        },
        (err) => {
          console.log("error", err);
          this.$alert("TOPS文件已生成，请在后台查看");
        }
      );
    },
    showBmp() {
      this.runAble = false;
      this.bmpShow = true;
      let params = {
        bmpTitle: this.cutTime + ".rslc.bmp",
        // bmpTitle:"20220901.rslc.bmp",
        folderName: this.folderName,
      };

      this.$axios.getBmp(params).then((res) => {
        const myBlob = new window.Blob([res], { type: "image/bmp" });
        this.Bmp_img = window.URL.createObjectURL(res.data);
        console.log(this.Bmp_img);
        this.bmpLoading = false;
      });
      this.dialogVisible = true;
      // this.canvasFlag = 1;
    },
    async showImg() {
      this.imgShow = true;
      let params = {
        imgTitle: this.selectValue,
        folderName: this.folderName,
        cutTime: this.cutTime,
      };

      this.$axios.getImg(params).then((res) => {
        const myBlob = new window.Blob([res], { type: "image/png" });
        this.SLC_img = window.URL.createObjectURL(res.data);

        console.log(this.SLC_img);
      });
      this.loading = false;
      this.canvasFlag = 1;
    },

    changeIWValue() {
      this.inputShow = false;
      console.log(this.iw_value);
    },
    changeCutValue() {
      this.runAble = false;
      this.disabledProductCoordinateFileandOPOD = false;
      console.log(this.selectValue);
      console.log(this.selectValue.slice(17, 25));
      this.cutTime = this.selectValue.slice(17, 25);
    },
    productList() {
      this.selectDisable = false;
      // console.log(this.options);
      let params = {
        zipList: this.options.map((element) => {
          return element["fileName"];
        }),
      };
      this.$axios.productZipList(params).then(
        (res) => {
          this.$alert("ziplist已在后台生成");
        },
        (err) => {
          console.log(23232, err);
        }
      );
    },
    addEntity(selection, row) {
      console.log(selection, row);
      let selected = selection.length && selection.indexOf(row) !== -1;
      let redID = row.fileName;
      let whiteID = "dem" + row.fileName;
      if (selected === true) {
        // row.isDisabled = true; //这个isDisabled 是每行数据里都存在的一个属性
        let params = {
          title: row.fileName,
        };
        this.$axios.getFootprintAndDemFootprint(params).then(
          (res) => {
            // console.log(res);
            let footprint = res["footprint"];
            let demFootPrint = res["demFootPrint"];
            // console.log(footprint);

            let whiteEntity = !this.viewer.entities.getById(whiteID)&&this.viewer.entities.add({
              id: whiteID,
              name: "polygon_height",
              polygon: {
                show: true,
                hierarchy: Cesium.Cartesian3.fromDegreesArray(demFootPrint),
                height: 0,
                material: Cesium.Color.WHITE.withAlpha(0.3),
                fill: true,
                outline: true,
                outlineWidth: 1.0,
                outlineColor: Cesium.Color.WHITE,
              },
            });
            // console.log(whiteEntity);
            let redEntity = !this.viewer.entities.getById(redID)&&this.viewer.entities.add({
              id: redID,
              name: "polygon_height",
              polygon: {
                show: true,
                hierarchy: Cesium.Cartesian3.fromDegreesArray(footprint),
                height: 0,
                material: Cesium.Color.RED.withAlpha(0.3),
                fill: true,
                outline: true,
                outlineWidth: 1.0,
                outlineColor: Cesium.Color.RED,
              },
            });
            redEntity && this.viewer.flyTo(redEntity, {
              offset: new Cesium.HeadingPitchRange(0, -90, 1500000),
            });
          },
          (err) => {
            console.log(23232, err);
          }
        );
      } else {
        // row.isDisabled = false;
        console.log(row.fileName);

        let whiteID = row.fileName;
        let redID = "dem" + row.fileName;
        this.viewer.entities.removeById(whiteID);
        this.viewer.entities.removeById(redID);
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.options = val;
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    childBackMenu() {
      const self = this;
      self.firstMenuShow = true;
      self.dynamicComponents = null;
      self.currentData.active = false;
      self.selectIndex = -1;
    },
    clickQuery(item, index) {
      const self = this;
      self.selectIndex = index;
      item.active = !item.active;
      self.currentData = item;
      if (item.active) {
        switch (item.name) {
          case "脚本":
            self.drawer = true;
            // self.$nextTick(() => {
            //   self.dynamicComponents = (resolve) =>
            //     require(["../scriptComponets/firstScripts"], resolve);
            // });
            break;
          default:
            break;
        }
      }
    },
  },
};
</script>

<style scoped>
.scriptsComponents {
  position: absolute;
}

.title {
  color: black;
  text-align: left;
  padding-left: 5px;
  font-size: 14px;
}

/* ::v-deep .el-dialog__body .el-table {
  margin-left: 20px;
} */
::v-deep .el-drawer__body .el-button {
  margin-top: 5px;
  margin-left: 5px;
  margin-right: 5px;
}

::v-deep .el-dialog {
  width: 1000px !important;
}

::v-deep .el-loading-spinner {
  margin-top: 10px;
}

::v-deep .el-dialog .el-dialog__body {
  padding: 0;
}

::v-deep .el-dialog img {
  margin-top: 0;
  width: 1000px;
  height: 250px;
}

/* .bmp_input{
  display: flex;
} */
.bmp_input ::v-deep .el-input {
  float: center;
  margin-right: 20px;
  width: 150px;
}

.process {
  display: flex;
}

.process ::v-deep .el-select {
  flex: 1;
  margin-top: 5px;
}

img {
  margin-top: 10px;
  /* position: relative; */

  width: 300px;
  /* transform: rotate(90deg); */
}

.SLC_img {
  float: left;
  margin-left: 5px;
}

.burst {
  float: left;
  width: 20%;
  margin-top: 10px;
  margin-left: 20px;
  color: black;
}

.burst ::v-deep .el-input {
  /* margin-top: 10px; */
  width: 120px;
}

.select_title {
  margin-left: 0;
}

.right_select {
  margin-top: 10px;
}
</style>