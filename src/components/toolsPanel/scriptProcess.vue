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
      size="800"
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
        @select-all="selectAll"
      >
        <el-table-column label="序号" width="45">
          <template slot-scope="scope">{{ scope.$index }}</template>
        </el-table-column>
        <el-table-column label="文件日期" width="85">
          <template slot-scope="scope">{{ scope.row.date }}</template>
        </el-table-column>
        <el-table-column label="下载日期" width="85">
          <template slot-scope="scope">{{ scope.row.download_time }}</template>
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
          @click="productFolder().then(() => checkOPOD())"
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
            v-for="(item, index) in options_cut"
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
          <canvas id="mycanvas" ref="mycanvas" width="400" height="240">
            <img :src="SLC_img" ref="SLC_img" alt="" />
          </canvas>
        </div>

        <el-table :data="burstData" style="width: 100%">
          <el-table-column prop="iw" label="iw" width="50"> </el-table-column>
          <el-table-column label="burst_start" width="175">
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.burst_start"
                @change="changeBurstParam(scope.row)"
                size="mini"
              >
                <el-option
                  v-for="item in options_burst_start"
                  :key="item.label"
                  :label="item.label"
                  :value="item.label"
                >
                </el-option>
              </el-select>
            </template>
          </el-table-column>

          <el-table-column label="burst_num" width="175">
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.burst_num"
                @change="changeBurstParam(scope.row)"
                size="mini"
              >
                <el-option
                  v-for="item in options_burst_nums"
                  :key="item.label"
                  :label="item.label"
                  :value="item.label"
                >
                </el-option>
              </el-select>
            </template>
          </el-table-column>
        </el-table>

        <div class="right_select">
          <el-button
            type="primary"
            size="mini"
            :disabled="productTopsButtonShow"
            @click="productTops"
            >提交</el-button
          >
          <el-button
            type="primary"
            size="mini"
            :disabled="topTaskStateShow"
            @click="getTaskStatus"
            >查看任务状态</el-button
          >
          <el-button
            type="primary"
            size="mini"
            @click="showBmp"
            :disabled="bmpShow"
            >BMP影像</el-button
          >
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
        <!-- <img :src="Bmp_img" ref="BmpImg" alt="" /> -->
        <canvas id="BmpCanvas" ref="BmpCanvas" width="1000" height="250">
          <img :src="Bmp_img" ref="Bmp_img" alt="" />
        </canvas>
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
          @click="splitBmp().then(() => checkSplit())"
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
      bigLnglat: [],
      smallLnglat: [],
      img_small_left_top_x: 0,
      img_small_left_top_y: 0,
      img_small_right_top_x: 0,
      img_small_right_top_y: 0,
      img_small_left_bottom_x: 0,
      img_small_left_bottom_y: 0,
      img_small_right_bottom_x: 0,
      img_small_right_bottom_y: 0,
      demFootPrint: [],
      footprint: [],
      bmpLoadingText: "影像生成中",
      splitAble: false,
      bmpLoading: true,
      bmpShow: false,
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
      BmpCanvasFlag: 0,
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
      tableData: [],
      taskId: "",
      taskId_list_OPOD: [],
      splitTaskId: "",
      topTaskStateShow: true,
      productTopsButtonShow: false,
      bmpPolygonPixel: [],
      planTemplateColums: [
        {
          burst_start: "burst起始块号",
        },
      ],
      burstParam: {
        iw1: {
          burst_start: 0,
          burst_nums: 0,
        },
        iw2: {
          burst_start: 0,
          burst_nums: 0,
        },
        iw3: {
          burst_start: 0,
          burst_nums: 0,
        },
      },
      burstData: [
        {
          disabled: true,
          value: "1",
          iw: 1,
          burst_start: "",
          burst_num: "",
        },
        {
          disabled: true,
          value: "2",
          iw: 2,
          burst_start: "",
          burst_num: "",
        },
        {
          disabled: true,
          value: "3",
          iw: 3,
          burst_start: "",
          burst_num: "",
        },
      ],
      options_cut: [
        {
          value: "选项1",
          label: "1",
        },
        {
          value: "选项2",
          label: "2",
        },
        {
          value: "选项3",
          label: "3",
        },
      ],
      options_burst_start: [
        {
          value: "选项1",
          label: 1,
        },
        {
          value: "选项2",
          label: 2,
        },
        {
          value: "选项3",
          label: 3,
        },
        {
          value: "选项4",
          label: 4,
        },
        {
          value: "选项5",
          label: 5,
        },

        {
          value: "选项6",
          label: 6,
        },
        {
          value: "选项7",
          label: 7,
        },
        {
          value: "选项8",
          label: 8,
        },
        {
          value: "选项9",
          label: 9,
        },
        {
          value: "选项10",
          label: 10,
        },
      ],
      options_burst_nums: [
        {
          value: "选项1",
          label: 1,
        },
        {
          value: "选项2",
          label: 2,
        },
        {
          value: "选项3",
          label: 3,
        },
        {
          value: "选项4",
          label: 4,
        },
        {
          value: "选项5",
          label: 5,
        },

        {
          value: "选项6",
          label: 6,
        },
        {
          value: "选项7",
          label: 7,
        },
        {
          value: "选项8",
          label: 8,
        },
        {
          value: "选项9",
          label: 9,
        },
        {
          value: "选项10",
          label: 10,
        },
      ],

      multipleSelection: [],
    };
  },
  mounted() {
    const self = this;
    var dateformat = require("dateformat-util");
    this.$axios.getDownloadData().then((res) => {
      console.log(11111,res);
      res["Downloaded_data"].forEach((element) => {
        let time = dateformat.format(new Date(element["date"]), "yyyy-MM-dd");
        let fileName = element["title"];
        let download_time = dateformat.format(
          new Date(element["download_time"]),
          "yyyy-MM-dd"
        );
        self.tableData.push({
          date: time,
          fileName: fileName,
          download_time: download_time,
        });
      });
    });
  },
  updated() {
    if (this.canvasFlag) {
      this.draw();
    }
    if (this.BmpCanvasFlag) {
      this.BmpDraw();
    }
  },
  methods: {
    async productCoordinateFileandOPOD() {
      this.loadingFlag = true;
      this.loadingText = "图像生成ing";

      console.log(this.folderName);

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
        zipList: this.options_cut.map((element) => {
          return element["fileName"];
        }),
        dateArr: this.options_cut.map((element) => {
          return element["date"];
        }),
      };
      console.log(params);

      return this.$axios.productFolder(params).then(
        (res) => {
          console.log(res);
          this.folderName = res.folderName;
          this.taskId_list_OPOD = res.taskId_list_OPOD;
        },
        (err) => {
          this.$alert("文件夹建立失败，请重新尝试！");
          this.disabledProductFolder = false;
        }
      );
    },
    checkOPOD() {
      let params = {
        taskId_list_OPOD: this.taskId_list_OPOD,
      };
      this.$axios.checkOPODDownload(params).then((res) => {
        const status = res.status;
        console.log(status);
        // 如果任务已经完成，则返回任务结果
        if (status === "SUCCESS") {
          this.selectDisable = false;
          this.loadingFlag = false;
          this.$alert("文件夹已建立");
        }
        // 如果任务正在处理中，则等待一段时间后再次查询
        else if (status === "PENDING") {
          return new Promise((resolve) => {
            setTimeout(() => resolve(this.checkOPOD()), 1000);
          });
        }
        // 如果任务失败，则抛出异常
        else {
          this.$alert("下载失败，请重新尝试！");
          this.disabledProductFolder = false;
          throw new Error(`Task failed `);
        }
      });
    },
    checkSplit() {
      let params = {
        splitTaskId: this.splitTaskId,
      };
      // console.log("checkSplit:",params);
      this.$axios.checkSplitStatus(params).then((res) => {
        const status = res.status;
        console.log(status);
        // 如果任务已经完成，则返回任务结果
        if (status === "SUCCESS") {
          this.bmpLoading = false;
          this.$alert("SUCCESS");
        }
        // 如果任务正在处理中，则等待一段时间后再次查询
        else if (status === "PENDING") {
          return new Promise((resolve) => {
            setTimeout(() => resolve(this.checkSplit()), 5000);
          });
        }
        // 如果任务失败，则抛出异常
        else {
          this.$alert("Task failed！");
          throw new Error(`Task failed `);
        }
      });
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
      console.log("splitBmp:", params);
      return this.$axios.splitBmp(params).then(
        (res) => {
          console.log(res);
          // this.bmpLoading = false;
          this.splitTaskId = res;
        },
        (err) => {
          this.$alert("切割失败，请重新尝试！");
        }
      );
    },
    // 一维数组转二维数组
    construct2DArray(original, m, n) {
      if (original.length !== m * n) {
        return [];
      }
      const ans = new Array(m).fill(0).map(() => new Array(n).fill(0));
      for (let i = 0; i < original.length; i += n) {
        ans[Math.floor(i / n)].splice(0, n, ...original.slice(i, i + n));
      }
      return ans;
    },
    BmpDraw() {
      let that = this;
      var canvas = this.$refs.BmpCanvas;
      var ctx = canvas.getContext("2d");
      var bmpImg = new Image();
      bmpImg.src = this.Bmp_img;

      // let params = {
      //   burstParam: this.burstParam,
      //   bmpPolygonPixel: this.bmpPolygonPixel,
      // };
      // console.log("params",params);

      // this.$axios.getBmpPixel(params).then((res) => {
      //   console.log("1111111111");
      // });

      bmpImg.onload = function () {
        ctx.drawImage(bmpImg, 0, 0, 1000, 250);
        let params = {
          burstParam: that.burstParam,
          bmpPolygonPixel: that.bmpPolygonPixel,
          bmpTitle: that.cutTime + ".rslc.bmp",
          folderName: that.folderName,
        };
        console.log(22222, params);
        that.$axios.getBmpPixel(params).then((res) => {
          console.log("1111111111", res);
          that.bmpRow = res["x_start"];
          that.bmpCol = res["y_start"];
          that.bmpHeight = res["bmpHeight"];
          that.bmpWidth = res["bmpWidth"];

          let new_points = res["new_points"];
          let out_rectangle = res["out_rectangle"];
          let out_rectangle_width = res["out_width"];
          let out_rectangle_height = res["out_height"];

          let leftTop = new_points[0];
          let rightTop = new_points[1];
          let rightBottom = new_points[2];
          let leftBottom = new_points[3];
          // // 绘制四边形
          ctx.beginPath();
          ctx.moveTo(leftTop[0], leftTop[1]);
          ctx.lineTo(rightTop[0], rightTop[1]);
          ctx.lineTo(rightBottom[0], rightBottom[1]);
          ctx.lineTo(leftBottom[0], leftBottom[1]);
          ctx.closePath();
          ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
          ctx.fill();

          ctx.strokeStyle = "white";
          ctx.strokeRect(
            out_rectangle[0][0],
            out_rectangle[0][1],
            out_rectangle_width,
            out_rectangle_height
          );
          ctx.stroke();
        });
      };
    },
    draw() {
      let that = this;
      var canvas = this.$refs.mycanvas;
      var ctx = canvas.getContext("2d");
      var img = new Image();
      img.src = this.SLC_img;
      canvas.width = 400;
      canvas.height = 240;
      let bigLnglat = that.construct2DArray(that.footprint, 4, 2);
      let smallLnglat = that.construct2DArray(that.demFootPrint, 4, 2);
      img.onload = function () {
        const scaleX = canvas.height / img.width;
        const scaleY = canvas.width / img.height;
        const scale = Math.max(scaleX, scaleY);

        // 计算绘制时的偏移量，使图像的中心和画布的中心重合
        const offsetX = (canvas.width - img.height * scale) / 2;
        const offsetY = (canvas.height - img.width * scale) / 2;

        // 保存画布状态
        ctx.save();

        // 将画布移动到画布中心
        ctx.translate(canvas.width / 2, canvas.height / 2);

        // 将画布逆时针旋转90度
        ctx.rotate(-Math.PI / 2);

        // 缩放画布，将图像的最大尺寸渲染至画布大小
        ctx.scale(scale, scale);

        // 将旋转后的图像居中渲染到画布上
        ctx.drawImage(img, -img.width / 2, -img.height / 2);

        // 恢复画布状态
        ctx.restore();
        console.log(bigLnglat);
        let params = {
          bigLnglat: bigLnglat,
          smallLnglat: smallLnglat,
        };
        console.log(params);
        that.$axios.getPixel(params).then((res) => {
          console.log(res);
          var leftTop = res.leftTop;
          var leftBottom = res.leftBottom;
          var rightTop = res.rightTop;
          var rightBottom = res.rightBottom;
          that.bmpPolygonPixel = [
            res.leftTop,
            res.rightTop,
            res.rightBottom,
            res.leftBottom,
          ];
          console.log(that.bmpPolygonPixel);
          // // 绘制四边形
          ctx.beginPath();
          ctx.moveTo(leftTop[0], leftTop[1]);
          ctx.lineTo(rightTop[0], rightTop[1]);
          ctx.lineTo(rightBottom[0], rightBottom[1]);
          ctx.lineTo(leftBottom[0], leftBottom[1]);
          ctx.closePath();
          ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
          ctx.fill();
          var xSpacing = canvas.width / 10; // 水平间隔
          var xStart = 0; // 起点X坐标
          var yStart = 0; // 起点Y坐标
          var yEnd = canvas.height; // 终点Y坐标
          ctx.setLineDash([5, 5]); // 设置虚线样式
          ctx.strokeStyle = "#000"; // 设置线条颜色

          for (var i = 0; i < 10; i++) {
            ctx.font = "20px Arial";
            var x = xStart + i * xSpacing;
            ctx.beginPath();
            ctx.moveTo(x, yStart);
            ctx.lineTo(x, yEnd);
            ctx.stroke();
            // 标注刻度
            ctx.fillStyle = "#fff";
            ctx.fillText(i + 1, x + xSpacing / 2, 20);
          }

          // 垂直方向画3等分的虚线，并标注刻度
          var ySpacing = canvas.height / 3; // 垂直间隔
          var xStart = 0; // 起点X坐标
          var xEnd = canvas.width; // 终点X坐标

          for (var i = 0; i < 3; i++) {
            ctx.font = "20px Arial";
            var y = i * ySpacing;
            ctx.beginPath();
            ctx.moveTo(xStart, y);
            ctx.lineTo(xEnd, y);
            ctx.stroke();
            // 标注刻度
            ctx.fillStyle = "#fff";
            ctx.fillText(3 - i, xEnd + 5, y + 3);
            ctx.fillText("iw" + String(3 - i), 0, y + ySpacing / 2);
          }
        });
      };
    },
    productTops() {
      // this.bmpShow = false;
      // this.fileProductAble = true;
      // this.productTopsButtonShow = true;
      let params = {
        burstParam: this.burstParam,
        cutTime: this.cutTime,
        folderName: this.folderName,
      };
      console.log(params);
      this.$axios.productTOPS(params).then((res) => {
        console.log("res", res);
        this.$alert("TOPS文件正在后台生成，请耐心等待！");
        this.taskId = res;
        this.topTaskStateShow = false;
      });
    },
    getTaskStatus() {
      let taskId = this.taskId;
      console.log(taskId);
      this.$axios.getTaskStatus({ task_id: taskId }).then((res) => {
        const status = res.status;
        this.bmpShow = false;
        console.log(status, status === "PENDING");
        if (status === "SUCCESS") {
          // 异步任务已完成
          this.$alert("任务已完成！");
          this.bmpShow = false;
        } else if (status === "FAILURE") {
          // 异步任务失败
          throw new Error("Task failed");
        } else if (status === "PENDING") {
          // 异步任务进行中
          this.$alert("任务进行中！");
        }
        // else {
        //   // 异步任务还在进行中，继续轮询
        //   return new Promise((resolve) => setTimeout(resolve, 1000)).then(() =>
        //     getTaskStatus(taskId)
        //   );
        // }
      });
    },
    showBmp() {
      this.runAble = false;
      // this.bmpShow = true;
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
      this.BmpCanvasFlag = 1;

      let that = this;
      var canvas = this.$refs.mycanvas;
      var ctx = canvas.getContext("2d");
      var img = new Image();
      img.src = this.Bmp_img;
      this.dialogVisible = true;
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
      });
      this.loading = false;
      this.canvasFlag = 1;
    },

    changeIWValue(val) {
      this.inputShow = false;
      console.log(val);
    },
    changeCutValue() {
      this.runAble = false;
      this.disabledProductCoordinateFileandOPOD = false;
      this.cutTime = this.selectValue.slice(17, 25);
    },

    changeBurstParam(row) {
      switch (row.iw) {
        case 1:
          this.burstParam.iw1.burst_start = row.burst_start;
          this.burstParam.iw1.burst_nums = row.burst_num;
          break;
        case 2:
          this.burstParam.iw2.burst_start = row.burst_start;
          this.burstParam.iw2.burst_nums = row.burst_num;
          break;
        case 3:
          this.burstParam.iw3.burst_start = row.burst_start;
          this.burstParam.iw3.burst_nums = row.burst_num;
          break;
      }
      console.log(row, this.burstParam);
    },
    // test(selection, row) {
    //   let selected = selection.length && selection.indexOf(row) !== -1;
    //   console.log(selected); // true就是选中，0或者false是取消选中
    // },

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
    drawFootprintAndDemFootprint(title, redID, whiteID) {
      // row.isDisabled = true; //这个isDisabled 是每行数据里都存在的一个属性
      let that = this;
      let params = {
        title: title,
      };
      this.$axios.getFootprintAndDemFootprint(params).then(
        (res) => {
          // console.log(res);
          that.footprint = res["footprint"];
          that.demFootPrint = res["demFootPrint"];
          // console.log(that.footprint, that.demFootPrint);
          let tem = this.construct2DArray(that.footprint, 4, 2);
          // console.log(that.footprint.length, tem);
          let whiteEntity =
            !this.viewer.entities.getById(whiteID) &&
            this.viewer.entities.add({
              id: whiteID,
              name: "polygon_height",
              polygon: {
                show: true,
                hierarchy: Cesium.Cartesian3.fromDegreesArray(
                  that.demFootPrint
                ),
                height: 0,
                material: Cesium.Color.WHITE.withAlpha(0.1),
                fill: true,
                outline: true,
                outlineWidth: 1.0,
                outlineColor: Cesium.Color.WHITE,
              },
            });
          // console.log(whiteEntity);
          let redEntity =
            !this.viewer.entities.getById(redID) &&
            this.viewer.entities.add({
              id: redID,
              name: "polygon_height",
              polygon: {
                show: true,
                hierarchy: Cesium.Cartesian3.fromDegreesArray(that.footprint),
                height: 0,
                material: Cesium.Color.RED.withAlpha(0.1),
                fill: true,
                outline: true,
                outlineWidth: 1.0,
                outlineColor: Cesium.Color.RED,
              },
            });
          redEntity &&
            this.viewer.flyTo(redEntity, {
              offset: new Cesium.HeadingPitchRange(0, -90, 1500000),
            });
        },
        (err) => {
          console.log(23232, err);
        }
      );
    },

    addEntity(selection, row) {
      var that = this;
      console.log(selection, row);
      let selected = selection.length && selection.indexOf(row) !== -1;
      let redID = row.fileName;
      let whiteID = "dem" + row.fileName;
      if (selected === true) {
        // // row.isDisabled = true; //这个isDisabled 是每行数据里都存在的一个属性

        this.drawFootprintAndDemFootprint(row.fileName, redID, whiteID);
      } else {
        // row.isDisabled = false;
        let whiteID = row.fileName;
        let redID = "dem" + row.fileName;
        this.viewer.entities.removeById(whiteID);
        this.viewer.entities.removeById(redID);
      }
    },
    selectAll(selections) {
      if (selections.length == 0) {
        this.viewer.entities.removeAll();
      } else {
        for (let i = 0; i < selections.length; i++) {
          const element = selections[i];
          let redID = element.fileName;
          let whiteID = "dem" + element.fileName;
          this.drawFootprintAndDemFootprint(element.fileName, redID, whiteID);
        }
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.options_cut = val;
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

::v-deep
  .el-popup-parent--hidden
  .el-drawer__container
  .el-drawer__open
  .el-drawer
  .rtl {
  width: 35% !important;
}

::v-deep .el-drawer__body .el-button {
  margin-top: 5px;
  margin-left: 5px;
  margin-right: 5px;
  float: right;
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

::v-deep .el-table__header .el-table-column--selection .cell .el-checkbox {
  /* display: none; */
}
::v-deep .el-table__header .el-table-column--selection .cell:before {
  content: "选择";
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
  /* background-color: rgba(63, 72, 84, 0.3); */
  margin-top: 10px;

  /* height: 245px; */
  /* padding: 0; */
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