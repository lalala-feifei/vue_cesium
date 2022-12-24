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
        <el-button type="primary" size="mini" @click="productList"
          >生成list</el-button
        >
        <el-select
          v-model="value"
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
          size="mini"
          @click="showImg"
          :disabled="runAble"
          >查看影像</el-button
        >
      </div>

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
          <!-- <img :src="SLC_img" alt="" /> -->
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
              :disabled="runAble"
              >文件生成</el-button
            >
          </div>
          <div class="right_select">
            <el-button
              type="primary"
              size="mini"
              @click="showBmp"
              :disabled="runAble"
              >查看BMP影像</el-button
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
      <img :src="Bmp_img" ref="BmpImg" alt="" />
      <!-- <canvas id="mycanvas" ref="mycanvas" width="1000" height="250">
        <img :src="Bmp_img" ref="BmpImg" alt="" />
      </canvas> -->

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
        <el-button type="primary" size="small" @click="splitBmp"
          >切割</el-button
        >
      </div>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span> -->
    </el-dialog>
  </div>
</template>
  

<script>
export default {
  data() {
    return {
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
      value: "",
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
    splitBmp() {
      let params = {
        bmpRow: this.bmpRow,
        bmpWidth: this.bmpWidth,
        bmpCol: this.bmpCol,
        bmpHeight: this.bmpHeight,
      };
      this.$axios.splitBmp(params).then((res) => {
        console.log(res);
        this.$alert("影像已切割");
      });
    },
    draw() {
      var canvas = this.$refs.mycanvas;
      var ctx = canvas.getContext("2d");
      var img = new Image();
      img.src = this.SLC_img;
      img.onload = function () {
        ctx.drawImage(img, 0, 0, 250, 900);
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
    showBmp() {
      let params = {
        bmpTitle: this.value.slice(17, 25) + ".rslc.bmp",
      };

      this.$axios.getBmp(params).then((res) => {
        const myBlob = new window.Blob([res], { type: "image/bmp" });
        this.Bmp_img = window.URL.createObjectURL(res.data);
      });
      this.canvasFlag = 1;
      this.dialogVisible = true;
    },
    async showImg() {
      this.imgShow = true;
      let params = {
        imgTitle: this.value,
      };
      let paramsForOPOD = {
        dateArr: this.options.map((element) => {
          return element["date"];
        }),
      };
      console.log(paramsForOPOD);
      let resForOPOD = await this.$axios.getOPOD(paramsForOPOD);
      console.log(resForOPOD);

      // const myBlob = new window.Blob([resForImg], { type: "image/png" });
      // this.SLC_img = window.URL.createObjectURL(myBlob);
      // console.log(this.SLC_img);
      this.$axios.getImg(params).then((res) => {
        const myBlob = new window.Blob([res], { type: "image/png" });
        this.SLC_img = window.URL.createObjectURL(res.data);
        console.log(this.SLC_img);
      });
      this.loading = false;
      this.canvasFlag = 1;
    },
    async productTops() {
      let params = {
        iw: this.iw_value,
        burst_num: this.burst_num,
        burst_first: this.burst_first,
        cutTime: this.cutTime,
      };
      // let resForTop = await this.$axios.productTOPS(params)
      // if(resForTop =='success'){
      //   this.$alert("TOPS文件已生成，请在后台查看！");
      // }
      this.$axios.productTOPS(params).then(
        (res) => {
          console.log(res);
          this.$alert("TOPS文件已生成，请在后台查看！");
        },
        (err) => {
          this.$alert("TOPS文件已生成，请在后台查看！");
        }
      );

      // this.$axios.getBmp(params).then((res) => {
      //   const myBlob = new window.Blob([res], { type: "image/bmp" });
      //   this.Bmp_img = window.URL.createObjectURL(res.data);
      // });
    },
    changeIWValue() {
      this.inputShow = false;
      console.log(this.iw_value);
    },
    changeCutValue() {
      this.runAble = false;
      console.log(this.value);
      console.log(this.value.slice(17, 25));
      this.cutTime = this.value.slice(17, 25);
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
    handleSelectionChange(val) {
      console.log(val);
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

  width: 250px;
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