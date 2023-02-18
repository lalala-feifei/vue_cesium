import { Get, Post, Put, Patch, Delete,DownFileAction } from "@/api/request";
import { Test } from "./request";
// let localhost = "http://127.0.0.1:5000"
// let linuxIp = "http://192.168.153.11:80"

export default {
  getListData: (params) => {
    return Get('http://127.0.0.1:5000/api/hello', params);
  },
  postListData: (params) => {
    return Post('../../static/data.json', params);
  },
  deleteListData: (params) => {
    return Delete('../../static/data.json', params);
  },
  downloadSLC: (params) => {
    return Post('http://192.168.153.11:80/download', params)
  },
  getSLCData: (params) => {
    return Post('http://192.168.153.11:80/getSLCData', params)
    return Post('http://127.0.0.1:5000/getSLCData',params)
  },
  getDownloadData: () => {
    return Get('http://192.168.153.11:80/getDownloadData')
    return Get('http://127.0.0.1:5000/getDownloadData')
  },
  downloadById: (params) => {
    return Post('http://192.168.153.11:80/downloadById', params)
    return Post('http://127.0.0.1:5000/downloadById',params)
  },
  productZipList: (params) => {
    return Post('http://192.168.153.11:80/productZipList', params)
    return Post('http://127.0.0.1:5000/productZipList', params)
  },
  cutFile: (params) => {
    return Get('http://192.168.153.11:80/cutFile', params)
  }, 
  getImg: (params) => {
    return DownFileAction('http://192.168.153.11:80/getImg', params)
    return DownFileAction('http://127.0.0.1:5000/getImg', params)
  },
  getBmp: (params) => {
    return DownFileAction('http://192.168.153.11:80/getBmp',params)
    return DownFileAction('http://127.0.0.1:5000/getBmp',params)
  },
  testGet:()=>{
    return Test('http://192.168.153.11:80/api/hello')
  },
  productTOPS: (params) => {
    return Get('http://192.168.153.11:80/productTOPS', params)
    return Get('http://127.0.0.1:5000/productTOPS', params)
  },
  splitBmp:(params) =>{
    return Get('http://192.168.153.11:80/splitBmp', params)
    return Get('http://127.0.0.1:5000/splitBmp', params)
  },
  getOPOD:(params) =>{
    return Post('http://192.168.153.11:80/getOPOD', params)
    return Post('http://127.0.0.1:5000/getOPOD', params)
  },
  productFolder:(params) =>{
    return Post('http://192.168.153.11:80/productFolder', params)
    return Post('http://127.0.0.1:5000/productFolder', params)
  },

  productCoordinateFile:(params) =>{
    return Post('http://192.168.153.11:80/productCoordinateFile', params)
    return Post('http://127.0.0.1:5000/productCoordinateFile', params)
  },
  getFootprintAndDemFootprint:(params) => {
    // return Get('http://192.168.153.11:80/getFootprintAndDemFootprint', params)
    return Get('http://127.0.0.1:5000/getFootprintAndDemFootprint', params)
  }
}
