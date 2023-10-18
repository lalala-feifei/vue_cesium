<template>
  <div>
    <div>
      <div class="date">
        <div class="dateStart">
          <span>开始日期: </span><input type="date" v-model="startDate" />
        </div>
        <div class="dateEnd">
          <span>结束日期: </span><input type="date" v-model="endDate" />
        </div>
      </div>
      <div class="buttonList">
        <button @click="drawPolygon">区域选择</button>
        <button @click="dataSearch().then(() => checkSearch())">
          数据查询
        </button>
        <button @click="downloadManageShow = !downloadManageShow">
          下载管理
        </button>
        <button @click="clear">清除</button>
        <!-- <button class="download" v-show="isDownload" @click="download">
          数据下载
        </button> -->
      </div>
      <div class="fileList" v-show="fileListShow">
        <span class="fileNum">该区域SLC文件数:{{ this.fileNum }}</span>
        <el-table
          :data="tableData"
          v-loading="loading"
          element-loading-text="数据检索中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.3)"
          max-height="380"
          size="mini"
          style="width: 100%"
          :row-class-name="tableRowClassName"
          @row-click="polygonFill"
        >
          <!-- <el-table-column prop="index" label="序号" align="center">
          </el-table-column> -->
          <el-table-column prop="title" label="文件名" align="center">
          </el-table-column>
          <el-table-column
            prop="size"
            label="文件大小"
            width="50"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="title" label="详情" align="center" width="50">
            <template slot-scope="scope">
              <el-button
                type="info"
                icon="el-icon-search"
                size="mini"
                circle
                @click="detail(scope.$index)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-dialog
          title="下载管理"
          :visible.sync="downloadManageShow"
          width="40%"
          append-to-body
        >
          <el-table
            :data="SLCDownloadList"
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column label="日期" width="180">
              <template slot-scope="scope">
                <i class="el-icon-time"></i>
                <span style="margin-left: 10px">{{ scope.row.fileTime }}</span>
              </template>
            </el-table-column>
            <el-table-column label="产品" width="180">
              <template slot-scope="scope">
                <el-popover trigger="hover" placement="top">
                  <p>fileTitle: {{ scope.row.fileTitle }}</p>
                  <p>fileSize: {{ scope.row.fileSize }}</p>
                  <div slot="reference" class="name-wrapper">
                    <el-tag size="medium">{{
                      scope.row.fileTitle.slice(-4)
                    }}</el-tag>
                  </div>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <!-- <el-button
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)"
                  >编辑</el-button
                > -->
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="selection" width="55"> </el-table-column>
          </el-table>
          <span slot="footer" class="dialog-footer">
            <el-button
              type="primary"
              @click="downloadForList()"
              size="mini"
              >下载</el-button
            >
          </span>
        </el-dialog>

        <el-dialog
          title="文件详情"
          :visible.sync="dialogVisible"
          width="30%"
          append-to-body
        >
          <el-descriptions class="margin-top" :column="2" size="mini" border>
            <el-descriptions-item span="2" label="序号">
              {{ fileOrder }}
            </el-descriptions-item>
            <el-descriptions-item span="2" label="文件名">
              {{ fileTitle }}
            </el-descriptions-item>

            <el-descriptions-item span="2" label="id">
              {{ fileid }}
            </el-descriptions-item>

            <el-descriptions-item label="文件大小">
              {{ fileSize }}
            </el-descriptions-item>

            <el-descriptions-item label="时间">
              {{ fileTime }}
            </el-descriptions-item>
            <el-descriptions-item label="Instrument">
              {{ Instrument }}
            </el-descriptions-item>
            <el-descriptions-item label="Online">
              {{ Online }}
            </el-descriptions-item>
          </el-descriptions>

          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false" size="mini"
              >取 消</el-button
            >
            <el-button
              type="primary"
              @click="addToDownloadList(fileid, fileTitle, fileSize, fileTime, Online)"
              size="mini"
              >加入下载队列</el-button
            >
          </span>
        </el-dialog>
      </div>
    </div>

    <promptBox ref="prompt"></promptBox>
  </div>
</template>

<script>
import DrawTool from "../../core/drawPlot/drawTool";
import promptBox from "../common/promptBox";
import footerVue from "../layout/footer.vue";

export default {
  data() {
    return {
      SLCDownloadList: [
      ],
      downloadList:[],
      downloadManageShow: false,
      seachTaskId: "",
      startDate: "",
      endDate: "",
      tableData: [],
      fileNum: "",
      fileListShow: false,
      loading: true,
      isDownload: false,
      footprints: [],
      unActiveList: [],
      fileOrder: "",
      fileid: "",
      fileSize: "",
      fileTitle: "",
      fileTime: "",
      // fileMode: "",
      Instrument: "",
      productclass: "",
      res: "",
      Online: true,
      geojson: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            geometry: {
              coordinates: [],
              type: "Polygon",
            },
          },
        ],
      },
      dialogVisible: false,
    };
  },

  components: { promptBox },
  mounted() {
    DrawTool.initParam(this.viewer, this.$refs.prompt);
  },
  // watch: {
  //   SLCDownloadList: function (newList, oldList) {
  //     if (newList.length > 0) {
  //       this.myFunction();
  //     }
  //   },
  // },
  methods: {
    detail(rowIndex) {
      console.log(this.res);
      this.dialogVisible = !this.dialogVisible;
      this.fileOrder = rowIndex;
      this.fileid = this.res.products[rowIndex].id;
      // this.fileMode = this.footprints[rowIndex].properties.polarisationmode;
      this.fileSize = this.res.products[rowIndex].size;
      this.fileTitle = this.res.products[rowIndex].title;
      this.fileTime = this.res.products[rowIndex].date;
      this.Online = this.res.products[rowIndex].Online;
      this.Instrument = this.res.products[rowIndex].ingestion;
      // this.productclass = this.footprints[rowIndex].properties.productclass;
    },
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex;
    },
    polygonFill(row, col, event) {
      const that = this;
      let temEntity = that.viewer.entities.getById("polygon_" + row.index);
      this.cancelFill();
      temEntity.polygon.fill = new Cesium.CallbackProperty(() => {
        return true;
      }, false);
    },
    cancelFill() {
      const that = this;
      for (let i = 0; i < that.fileNum; i++) {
        let temEntity = that.viewer.entities.getById("polygon_" + i);
        temEntity.polygon.fill = new Cesium.CallbackProperty(() => {
          return false;
        }, false);
      }
    },
    // for循环，如果子元素还是数组，则递归调用该方法
    flatten(arr) {
      var rets = [];
      for (var i = 0; i < arr.length; i++) {
        if (Array.isArray(arr[i])) {
          rets = rets.concat(this.flatten(arr[i]));
        } else {
          rets.push(arr[i]);
        }
      }
      return rets;
    },
    addToDownloadList(fileid, fileTitle, fileSize, fileTime, Online) {
      let item = {
        fileid: fileid,
        fileTitle: fileTitle,
        fileSize: fileSize,
        fileTime: fileTime,
        Online: Online,
        demFootPrint: DrawTool.pointArrForDegrees,
      };
      if(JSON.stringify(this.SLCDownloadList).indexOf(JSON.stringify(item)) == -1){
        this.SLCDownloadList.push(item);
        this.$alert("已放入下载队列！");
      }else{
        this.$alert("下载队列已存在该数据！");
      }

    },
    downloadForList(){
      let params = {
        downloadList:this.downloadList
      }
      console.log(params);
      this.$axios.downloadForList(params).then((res)=>{
        console.log(res);
      })
      this.downloadList = []
      this.$alert("后台下载，请耐心等待！");
    },
    downloadById(productId, productTitle) {
      let params = {
        productId: productId,
        productTitle: productTitle,
        demFootPrint: DrawTool.pointArrForDegrees,
      };
      console.log(params);

      this.$axios.downloadById(params).then((res) => {
        console.log(res);
        if (res == "existed") {
          this.$alert("该文件已存在！");
        } else {
          let item = {
            productTitle: productTitle,
            status: "PENDING",
          };
          this.SLCDownloadList.push(item);
          this.$alert("已放入下载队列，请耐心等待！");
        }
      });

      this.dialogVisible = false;
    },
    triggerAndDownLoadOffline() {
      console.log("triggerAndDownLoadOffline");
      let params = {
        unActiveList: this.unActiveList,
      };
      this.$axios.triggerAndDownLoadOffline(params).then((res) => {
        console.log(res);
      });
    },
    checkSearch() {
      let params = {
        task_id: this.seachTaskId,
      };
      // console.log(params);
      this.$axios.getTaskStatus(params).then((res) => {
        const status = res.status;
        console.log(status);
        // 如果任务已经完成，则返回任务结果
        if (status === "SUCCESS") {
          if (res.result.success) {
            console.log("res:", res);
            this.res = res.result;
            this.tableData = res.result.products;
            this.fileNum = res.result.total_num;
            this.loading = false;
            this.isDownload = true;
            this.footprints = res.result.footprint;
            res.result.products.forEach((item, index) => {
              // console.log(item);
              let degreesArray = item["footprint"];
              console.log(degreesArray);
              this.viewer.entities.add({
                id: "polygon_" + index,
                name: "polygon_height",
                polygon: {
                  show: true,
                  hierarchy: Cesium.Cartesian3.fromDegreesArray(
                    degreesArray.slice(0, -2)
                  ),
                  height: 0,
                  material: Cesium.Color.RED.withAlpha(0.3),
                  fill: false,
                  outline: true,
                  outlineWidth: 1.0,
                  outlineColor: Cesium.Color.RED,
                },
              });
            });
          } else {
            console.log(res);
            this.clear();
            this.loading = true;
            this.$alert("网络中断或初始条件错误！", "警告", {
              confirmButtonText: "确定",
            });
          }
        }
        // 如果任务正在处理中，则等待一段时间后再次查询
        else if (status === "PENDING") {
          return new Promise((resolve) => {
            setTimeout(() => resolve(this.checkSearch()), 1000);
          });
        }
        // 如果任务失败，则抛出异常
        else {
          this.$alert("下载失败，请重新尝试！");
          throw new Error(`Task failed `);
        }
      });
    },
    dataSearch() {
      // DrawTool.destroyPolygon();

      // for (let i = 0; i < this.fileNum; i++) {
      //   console.log(this.viewer.entities);
      //   this.viewer.entities.removeById("polygon_" + i);
      // }
      // this.fileNum = "";

      const that = this;
      this.loading = true;
      this.tableData = [];
      this.fileListShow = true;
      this.geojson.features[0].geometry.coordinates = [
        DrawTool.pointArrForDegrees,
      ];
      let params = {
        startDate: this.startDate,
        endDate: this.endDate,
        geojson: this.geojson,
      };
      console.log(params);
      return this.$axios.getSLCData(params).then(
        (res) => {
          console.log(res);
          this.seachTaskId = res;
        },
        (err) => {
          this.clear();
        }
      );
    },
    selectAllDownloadSLC(selections){
      this.downloadList = selections
      console.log(this.downloadList);
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
      this.SLCDownloadList.splice(index, 1)
    },
    handleSelectionChange(val) {
      console.log(val);
      this.downloadList = val
    },
    clear() {
      this.startDate = "";
      this.endDate = "";
      this.fileListShow = false;
      this.tableData = [];
      this.isDownload = false;
      this.products = {};
      DrawTool.pointArrForDegrees = [];
      (this.geojson = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            geometry: {
              coordinates: [],
              type: "Polygon",
            },
          },
        ],
      }),
        (this.loading = true);

      DrawTool.destroyPolygon();

      for (let i = 0; i < this.fileNum; i++) {
        console.log(this.viewer.entities);
        this.viewer.entities.removeById("polygon_" + i);
      }
      this.fileNum = "";
    },
    drawPolygon() {
      DrawTool.startDraw({
        type: "polygon",
        style: {
          clampToGround: true,
          material: Cesium.Color.WHITE.withAlpha(0.5),
        },
        success: function (evt) {},
      });
    },
  },
};
</script>

<style scoped>
.date {
  font-size: 10px;
}

.date::after {
  content: "";
  display: block;
  clear: both;
}

.clearfix::after {
  content: "";
  display: block;
  clear: both;
}
.dateStart {
  float: left;
  margin-bottom: 5px;
}

.dateEnd {
  float: left;
  margin-bottom: 5px;
}
.buttonList {
  display: flex;
  padding-left: 8px;
}
.buttonList button {
  margin-right: 5px;
}
input {
  width: 200px;
  text-align: center;
}

.file {
  margin: 10px 0;
  text-align: center;
}
.fileNum {
  font-size: 10px;
  text-align: left;
  /* float: left; */
}
/* .download{
  margin-top: 1px ;
} */

.fileList ::v-deep .el-table {
  background-color: rgba(63, 72, 84, 0);
  color: #fff;
}
.fileList ::v-deep .el-table th {
  background-color: rgba(63, 72, 84, 0.15);
  /* color: white; */
}
.fileList ::v-deep .el-table tr {
  background-color: rgba(63, 72, 84, 0.15);
}
::v-deep .el-loading-spinner .el-loading-text {
  color: #fff;
}

::v-deep .el-table tbody tr:hover > td {
  background-color: unset !important;
}
::v-deep .el-dialog__body .el-card__body .wrapper {
  display: grid;
  grid-template-columns: 60px 60px;
  grid-gap: 50px;
  /*  声明了两行，行高分别为 50px 50px  */
  grid-template-rows: 50px 50px;
}
</style>