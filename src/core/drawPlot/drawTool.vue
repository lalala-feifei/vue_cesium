<script>
/* global Cesium */
import CreatePolyline from "./createPolyline.vue";
import CreateRectangle from "./createRectangle.vue";
import CreatePolygon from "./createPolygon.vue";
import CreateBillboard from "./createBillboard.vue";
import CreateCircle from "./createCircle.vue";
// 动态绘制工具
class DrawTool {
  constructor() {
    this.hasEdit = false;
    this.toolArr = [];
    this.show = true;
    this.viewer = null;
    this.handler = null;
    this.prompt = null;
    this.rectanglePointArr = [];
    this.pointArr = [];
    this.pointArrForDegrees = [];
  }
  initParam(viewer, prompt) {
    this.prompt = prompt;
    this.viewer = viewer;
    this.handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  }
  destroyPolygon () {
    CreatePolygon.remove()
  }
  // 开始绘制
  startDraw(opt) {
    var that = this;
    that.hasEdit = opt.style.hasEdit;
    if (opt.type === "polyline") {
      CreatePolyline.initPolyline(this.viewer, opt.style, this.prompt);
      CreatePolyline.start(function (positions) {
        if (that.hasEdit) {
          that.unbindEdit();
          CreatePolyline.startModify(opt.modifySuccess);
          that.lastSelectEntity = CreatePolyline;
        }
        if (opt.success) opt.success(positions);
        if (that.show === false) CreatePolyline.setVisible(false);
      });
      this.toolArr.push(CreatePolyline);
    }
    if (opt.type === "polygon") {
      CreatePolygon.initPolygon(this.viewer, opt.style, this.prompt);
      CreatePolygon.start(function () {
        if (that.hasEdit) {
          that.unbindEdit();
          CreatePolygon.startModify();
          that.lastSelectEntity = CreatePolygon;
        }
        if (opt.success) opt.success(CreatePolygon);
        if (that.show === false) CreatePolygon.setVisible(false);
        that.pointArrForDegrees = CreatePolygon.positions.map((position)=>{
          let tem = Cesium.Cartographic.fromCartesian(position)
          var long = Cesium.Math.toDegrees(tem.longitude);
          var lat = Cesium.Math.toDegrees(tem.latitude); 
          return [long,lat]
        })
        that.pointArrForDegrees.push(that.pointArrForDegrees[0])
        

      });
      this.toolArr.push(CreatePolygon);
      console.log(this.toolArr);
    }
    if (opt.type === "billboard") {
      CreateBillboard.initillboard(this.viewer, opt.style, this.prompt);
      CreateBillboard.start(function () {
        if (that.hasEdit) {
          that.unbindEdit();
          CreateBillboard.startModify();
          that.lastSelectEntity = CreateBillboard;
        }
        if (opt.success) opt.success(CreateBillboard);
        if (that.show === false) CreateBillboard.setVisible(false);
      });
      this.toolArr.push(CreateBillboard);
    }
    if (opt.type === "circle") {
      CreateCircle.initCircle(this.viewer, opt.style, this.prompt);
      CreateCircle.start(function () {
        if (that.hasEdit) {
          that.unbindEdit();
          CreateCircle.startModify();
          that.lastSelectEntity = CreateCircle;
        }

        if (opt.success) opt.success(CreateCircle);

        if (that.show === false) CreateCircle.setVisible(false);
      });
      this.toolArr.push(CreateCircle);
    }
    if (opt.type === "rectangle") {
      CreateRectangle.initRectangle(this.viewer, opt.style, this.prompt);
      CreateRectangle.start(function () {
        if (that.hasEdit) {
          that.unbindEdit();
          CreateRectangle.startModify();
          that.lastSelectEntity = CreateRectangle;
        }

        if (opt.success) {
          opt.success(CreateRectangle);
        }
        if (that.show == false) rectangle.setVisible(false);

        // var leftupCartographic = Cesium.Cartographic.fromCartesian(
        //   CreateRectangle.leftupForCartesian3
        // );
        // var leftdownCartographic = Cesium.Cartographic.fromCartesian(
        //   CreateRectangle.leftdownForCartesian3
        // );
        // var rightupCartographic = Cesium.Cartographic.fromCartesian(
        //   CreateRectangle.rightupForCartesian3
        // );
        // var rightdownCartographic = Cesium.Cartographic.fromCartesian(
        //   CreateRectangle.rightdownForCartesian3
        // );
        // that.pointArr.push(
        //   leftupCartographic,
        //   leftdownCartographic,
        //   rightupCartographic,
        //   rightdownCartographic
        // );
        // // console.log(that.pointArr);

        // for (let i = 0; i < that.pointArr.length; i++) {
        //   var long = Cesium.Math.toDegrees(that.pointArr[i].longitude);
        //   var lat = Cesium.Math.toDegrees(that.pointArr[i].latitude);
        //   that.pointArrForDegrees.push([long, lat]);
        // }
        // var long = Cesium.Math.toDegrees(that.pointArr[0].longitude);
        // var lat = Cesium.Math.toDegrees(that.pointArr[0].latitude);
        // that.pointArrForDegrees.push([long, lat]);
      });
      this.toolArr.push(CreateRectangle);
    }
    // 重写材质
    if (opt.type === "flowPolyline") {
      var polyline = new CreatePolyline(this.viewer, opt.style);
      polyline.start(function () {
        if (that.hasEdit) {
          that.unbindEdit();
          polyline.startModify();
        }
        if (opt.success) opt.success(polyline);
      });
      this.toolArr.push(polyline);
    }
  }
  unbindEdit() {
    for (var i = 0; i < this.toolArr.length; i++) {
      this.toolArr[i].endModify();
    }
  }
}
export default new DrawTool();
</script>