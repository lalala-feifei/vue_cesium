<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="已下载" name="first">
        <el-table
          :data="Downloaded_data"
          max-height="350"
          size="mini"
          style="width: 100%"
          @row-click="detail"
        >
          <el-table-column prop="id" label="文件id" align="center">
          </el-table-column>
          <el-table-column prop="download_time" label="下载时间" align="center">
          </el-table-column>
        </el-table>
        <el-dialog
          title="文件详情"
          :visible.sync="dialogVisible"
          width="30%"
          append-to-body
        >
          <el-descriptions class="margin-top" :column="2" size="mini" border>
            <el-descriptions-item span="2" label="文件名">
              {{ fileTitle }}
            </el-descriptions-item>

            <el-descriptions-item span="2" label="id">
              {{ fileid }}
            </el-descriptions-item>

            <el-descriptions-item label="文件大小">
              {{ fileSize }}
            </el-descriptions-item>

            <el-descriptions-item label="下载时间">
              {{ download_time }}
            </el-descriptions-item>

            <el-descriptions-item label="creationDate">
              {{ creationDate }}
            </el-descriptions-item>

            <el-descriptions-item label="ingestionDate">
              {{ ingestionDate }}
            </el-descriptions-item>

            <el-descriptions-item label="Online">
              {{ Online }}
            </el-descriptions-item>

          </el-descriptions>

          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false" size="mini"
              >取 消</el-button
            >
            <el-button type="primary" @click="dialogVisible = false" size="mini"
              >确 定</el-button
            >
          </span>
        </el-dialog>
      </el-tab-pane>
      <el-tab-pane label="正在下载" name="second">
        <el-table
          :data="unDownloaded_data"
          max-height="350"
          size="mini"
          style="width: 100%"
          @row-click="detail"
        >
          <el-table-column prop="id" label="文件id" align="center">
          </el-table-column>
          <el-table-column prop="download_time" label="下载时间" align="center">
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: "first",
      tableData: [
        {
          title: "文件1",
          size: "50G",
        },
      ],
      Downloaded_data: [],
      unDownloaded_data: [],
      dialogVisible: false,
      fileid: "",
      fileSize: "",
      fileTitle: "",
      fileTime: "",
      creationDate:"",
      ingestionDate:"",
      fileMode: "",
      Instrument: "",
      productclass: "",
      res: "",
      download_time: "",
      Online: true,
    };
  },
  mounted() {
    // this.Downloaded_data = []
    this.$axios.getDownloadData().then((res) => {
      console.log(res);
      this.Downloaded_data = res["Downloaded_data"]
      this.unDownloaded_data = res["unDownloaded_data"]
      // [this.Downloaded_data, this.unDownloaded_data] = res;
    });
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    detail(row, col, event) {
      console.log(row);
      this.fileid = row.id;
      this.fileMode = row.polarisationmode;
      this.fileSize = row.size / (1000 * 1000 * 1000) + "G";
      this.fileTitle = row.title;
      this.fileTime = row.date;
      this.Online = row.Online;
      this.creationDate = row["Creation Date"]
      this.ingestionDate = row["Ingestion Date"]
      this.download_time = row.download_time;

      this.dialogVisible = true;
    },
  },
};
</script>

<!-- <style scoped> -->
<style scoped>
::v-deep .el-table {
  background-color: rgba(63, 72, 84, 0.15);
  color: #fff;
}

::v-deep .el-table th {
  background-color: rgba(63, 72, 84, 0.15);
  color: gainsboro;
}
::v-deep .el-table tr {
  background-color: rgba(63, 72, 84, 0.15);
}
::v-deep .el-table tbody tr:hover > td {
  background-color: unset !important;
}
::v-deep .el-tabs__item {
  color: #fff;
}
::v-deep .el-tabs__item.is-active {
  color: #409eff;
}

::v-deep .el-dialog__header {
  background: rgba(63, 72, 84, 0.35);
}
::v-deep .el-dialog__body {
  /* background:  rgba(63, 72, 84, 0.35); */
  padding: 10px 10px;
  font-size: 14px;
  /* height: 300px; */
}

::v-deep .el-dialog__body .el-card__body .wrapper {
  display: grid;
  grid-template-columns: 60px 60px 60px;
  grid-gap: 50px;
  /*  声明了两行，行高分别为 50px 50px  */
  grid-template-rows: 50px 50px;
}
</style>