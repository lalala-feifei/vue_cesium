<template>
  <div class="data_visualization">
    <input
      class="fileSelect"
      type="file"
      accept=".csv"
      @change="handleFileChange"
    />
    <button class="rendering" @click="productPoints">渲染</button>
    <el-dialog
      title="Single TS selection"
      :visible.sync="dialogVisible"
      append-to-body
      width="30%"
      height="60%"
      :before-close="handleClose"
      v-dialogDrag
    >
      <el-form
        ref="form"
        class="my_form"
        :model="formInline"
        label-width="80px"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item class="my-form-item">
              <span>Case Study</span>
              <el-select
                v-model="formInline.region"
                placeholder="testname"
                size="mini"
              >
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item class="my-form-item">
              <span>Date of event</span>
              <el-date-picker
                v-model="time"
                type="date"
                placeholder="选择日期"
                style="width: 100%"
                size="mini"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item class="my-form-item">
              <span>Add Trendline</span>
              <el-select
                v-model="optionType"
                placeholder="Connect MP"
                size="mini"
                @change="optionChange"
              >
                <el-option label="line" value="line"></el-option>
                <el-option label="scatter" value="scatter"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item class="echart_item">
          <div id="echart"></div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import Papa from "papaparse";
import * as ecStat from "echarts-stat";
import * as echarts from "echarts";
import { log } from "console";
export default {
  data() {
    return {
      pointList: [],
      dialogVisible: false,
      formInline: {
        user: "",
        region: "",
      },
      time: ",",
      lineData: [],
      lineTime: "",
      csvData: [],
      myChart: "",
      optionType: null,
    };
  },
  computed: {
    scatterData() {

      return this.lineTime.map((element, index) => [
        new Date(element).getTime(),
        Number(this.lineData[index]),
      ]);
    },
  },
  mounted() {},
  methods: {
    transformDate() {
      const millisecondsPerSecond = 1000;
      const secondsPerMinute = 60;
      const minutesPerHour = 60;
      const hoursPerDay = 24;
      const daysBetweenEpochs = 719528;
      const millisecondsPerDay =
        millisecondsPerSecond * secondsPerMinute * minutesPerHour * hoursPerDay;
      this.lineTime = this.lineTime.map((timestamp) => {
        const millisecondsSinceEpoch = timestamp * millisecondsPerDay;
        const millisecondsFrom0000To1970 =
          daysBetweenEpochs * millisecondsPerDay;
        const date = new Date(
          millisecondsSinceEpoch - millisecondsFrom0000To1970
        );
        return date.toISOString().slice(0, 10);
      });
      console.log(this.lineTime); // "0002-03-25"
    },
    handleFileChange(event) {
      const file = event.target.files[0];
      Papa.parse(file, {
        complete: (results) => {
          this.csvData = results.data;
          this.pointList = results.data.slice(2);
          this.lineData = results.data[2].slice(3, -1);
          this.lineTime = results.data[1].slice(3, -1);
          // console.log(this.lineData, this.lineTime);
          this.transformDate();
        },
      });
    },
    productPoints() {
      var that = this;
      if (this.viewer.scene.primitives) {
        //销毁所有
        this.viewer.scene.primitives.removeAll();
      }
      //  生成PointPrimitiveCollection对象
      var pointCollection = this.viewer.scene.primitives.add(
        new Cesium.PointPrimitiveCollection()
      );

      var colorArray = this.pointList.slice(0, -1).map(function (value) {
        return Number(value[2]);
      });

      let colorsLength = colorArray.length; // 获取颜色数组的长度
      // console.log(colorsLength);
      // 计算数值范围

      var maxCesiumValue = -Infinity;
      for (var i = 0; i < colorArray.length; i++)
        if (colorArray[i] > maxCesiumValue) maxCesiumValue = colorArray[i];

      var minCesiumValue = Infinity;
      for (var j = 0; j < colorArray.length; j++)
        if (colorArray[j] < minCesiumValue) minCesiumValue = colorArray[j];

      console.log(minCesiumValue, maxCesiumValue);

      // var minCesiumValue = Math.min.apply(null, colorArray);
      // var maxCesiumValue = Math.max.apply(null, colorArray);

      // console.log(minCesiumValue,maxCesiumValue);

      // for (let i = 0; i < this.pointList.length - 1; i++) {
      //   var longitude = Number(this.pointList[i][0]);
      //   var latitude = Number(this.pointList[i][1]);

      //   // 将颜色数值归一化到0到1之间
      //   var normalizedValue =
      //     (colorArray[i] - minCesiumValue) / (maxCesiumValue - minCesiumValue);

      //   // 计算对应的Color.hue属性值
      //   var hueValue = 0.5 + (normalizedValue - 0.5) * 2;
      //   // console.log(colorArray[i],normalizedValue,hueValue);
      //   // 创建对应的颜色对象，并设置Color.hue属性
      //   var color = Cesium.Color.fromHsl(hueValue, 0.4, 0.5);

      //   pointCollection.add({
      //     position: Cesium.Cartesian3.fromDegrees(longitude, latitude),
      //     color: color,
      //     id: i,
      //   });
      // }
      function getColorFromValue(value) {
        if (value >= -33 && value < -11) {
          return new Cesium.Color.fromBytes(254, 35, 10);
        } else if (value >= -11 && value < -8) {
          return new Cesium.Color.fromBytes(255, 134, 7);
        } else if (value >= -8 && value < -4) {
          return new Cesium.Color.fromBytes(252, 198, 17);
        } else if (value >= -4 && value < -1.5) {
          return new Cesium.Color.fromBytes(242, 254, 30);
        } else if (value >= -1.5 && value < 0.43) {
          return new Cesium.Color.fromBytes(204, 254, 129);
        } else if (value >= 0.43 && value < 2.55) {
          return new Cesium.Color.fromBytes(148, 253, 194);
        } else if (value >= 2.55 && value < 5.06) {
          return new Cesium.Color.fromBytes(22, 253, 255);
        } else if (value >= 5.06 && value < 8.43) {
          return new Cesium.Color.fromBytes(88, 184, 255);
        } else if (value >= 8.43 && value < 13.9) {
          return new Cesium.Color.fromBytes(107, 110, 254);
        } else if (value >= 13.9 && value <= 33) {
          return new Cesium.Color.fromBytes(92, 9, 252);
        } else {
          return Cesium.Color.WHITE; // 默认颜色，对于不在任何范围内的值
        }
      }

      for (let i = 0; i < this.pointList.length - 1; i++) {
        var longitude = Number(this.pointList[i][0]);
        var latitude = Number(this.pointList[i][1]);
        var colorValue = Number(this.pointList[i][2]);

        var color = getColorFromValue(colorValue);

        pointCollection.add({
          position: Cesium.Cartesian3.fromDegrees(longitude, latitude),
          color: color,
          id: i,
        });
      }

      this.viewer.camera.flyTo({
        offset: new Cesium.HeadingPitchRange(0, -90, 1000000),
        destination: Cesium.Cartesian3.fromDegrees(
          longitude,
          latitude,
          10000.0
        ),
      });

      this.dialogVisible = true;
      var handler = new Cesium.ScreenSpaceEventHandler(
        that.viewer.scene.canvas
      );

      handler.setInputAction(function (click) {
        var pickedObject = that.viewer.scene.pick(click.position);
        if (Cesium.defined(pickedObject) && pickedObject.id) {
          // that.lineData = that.csvData[pickedObject.id + 2].slice(3, -1);
          that.lineData = [
            2.879774, 1.436196, 1.27909, 1.220698, 0.1403122, 1.36233, 1.142647,
            1.32657, 2.14447, 1.349807, 1.011574, 1.640374, 1.245198, 0.8276225,
            1.27709, 0.9823403, -0.4385202, -1.475836, -2.600387, -4.386768,
            -21.23432, -28.88852,
          ];

          console.log(that.lineData);

          that.LineOption.series[0].data = that.lineData;
          that.scatterOption.series[0].data = that.scatterData;
          console.log(1111111111,that.scatterData);
          that.dialogVisible = true;
          that.myChart.setOption(that.scatterOption);
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      this.$nextTick(() => {
        //  执行echarts方法
        this.initLineEcharts();
      });
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    optionChange(optionType) {
      if (optionType == "line") {
        this.myChart.setOption(this.LineOption);
      } else {
        this.myChart.setOption(this.scatterOption);
      }
    },
    initLineEcharts() {
      echarts.registerTransform(ecStat.transform.regression);
      // 基于准备好的dom，初始化echarts实例
      this.myChart = echarts.init(document.getElementById("echart"));
      // 绘制图表
      this.LineOption = {
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          type: "category",
          data: this.lineTime,
          boundaryGap: false,
          axisLabel: {
            rotate: 60, // 将标签旋转 45 度
          },
          axisLine: {
            onZero: false, //-----------重点
          },
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: this.lineData,
            type: "line",
          },
        ],
      };

      var regressionData = ecStat.regression("linear", this.scatterData);

      // 指定图表的配置项和数据
      this.scatterOption = {
        title: {
          text: "Scatter Chart with Linear Regression",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            animation: false,
          },
        },
        xAxis: {
          type: "time",
          boundaryGap: false,
          axisLine: {
            onZero: false, //-----------重点
          },
          axisLabel: {
            rotate: 60,
            formatter: function (value, index) {
              var date = new Date(value);
              var month = date.getMonth() + 1;
              var day = date.getDate();
              return (
                date.getFullYear() +
                "-" +
                (month < 10 ? "0" + month : month) +
                "-" +
                (day < 10 ? "0" + day : day)
              );
            },
          },
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "Scatter",
            type: "scatter",
            data: this.scatterData,
          },
          {
            name: "Linear Regression",
            type: "line",
            data: regressionData.points,
          },
        ],
      };

      this.myChart.setOption(this.scatterOption);
    },
  },
};
</script>

<style scoped>
.fileSelect {
  float: left;
}
.rendering {
  margin-top: 5px;
  float: left;
}
#echart {
  float: left;
  width: 25vw;
  height: 60vh;
}
.my-form-item ::v-deep .el-form-item__content {
  margin-left: 0 !important;
}
::v-deep .el-dialog {
  left: 30%;
  margin-top: 0 !important;
}
.echart_item ::v-deep .el-form-item__content {
  margin-left: 20px !important;
}
</style>