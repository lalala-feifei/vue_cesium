import { Get, Post, Put, Patch, Delete,DownFileAction } from "@/api/request";
import { Test } from "./request";
let localhost = "http://127.0.0.1:5000"
let linuxIp = "http://192.168.152.16:80"

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
    // return Post('http://192.168.153.11:80/getSLCData', params)
    // return Post('http://127.0.0.1:5000/getSLCData',params)

    return Post(linuxIp+'/getSLCData',params)
    // return Post(localhost+'/getSLCData',params)
  },
  getDownloadData: () => {
    // return Get('http://192.168.153.11:80/getDownloadData')

    
    return Get(linuxIp+'/getDownloadData')
    // return Get('http://127.0.0.1:5000/getDownloadData')
  },
  downloadById: (params) => {
    // return Post('http://192.168.153.11:80/downloadById', params)

    return Post(linuxIp+'/downloadById',params)
    // return Post('http://127.0.0.1:5000/downloadById',params)
  },
  productZipList: (params) => {
    // return Post('http://192.168.153.11:80/productZipList', params)
    return Post(linuxIp+'/productZipList',params)
    // return Post('http://127.0.0.1:5000/productZipList', params)
  },
  cutFile: (params) => {
    // return Get('http://192.168.153.11:80/cutFile', params)
    return Get(linuxIp+'/cutFile',params)
  }, 
  getImg: (params) => {
    // return DownFileAction('http://192.168.153.11:80/getImg', params)
    // return DownFileAction('http://127.0.0.1:5000/getImg', params)
    return DownFileAction(linuxIp+'/getImg',params)
  },
  getBmp: (params) => {

    return DownFileAction(linuxIp+'/getBmp',params)
    // return DownFileAction('http://192.168.153.11:80/getBmp',params)

    // return DownFileAction('http://127.0.0.1:5000/getBmp',params)
  },
  testGet:()=>{
    return Test('http://192.168.153.11:80/api/hello')
  },
  productTOPS: (params) => {
    return Post(linuxIp+'/productTOPS',params)
    // return Post('http://192.168.153.11:80/productTOPS', params)
    return Post('http://127.0.0.1:5000/productTOPS', params)
  },
  splitBmp:(params) =>{
    return Get(linuxIp+'/splitBmp',params)
    // return Get('http://192.168.153.11:80/splitBmp', params)
    return Get('http://127.0.0.1:5000/splitBmp', params)
  },
  getOPOD:(params) =>{
    return Post(linuxIp+'/getOPOD',params)
    // return Post('http://192.168.153.11:80/getOPOD', params)
    // return Post('http://127.0.0.1:5000/getOPOD', params)
  },
  productFolder:(params) =>{
    return Post(linuxIp+'/productFolder',params)
    // return Post(localhost+'/productFolder',params)
    // return Post('http://192.168.153.11:80/productFolder', params)
    // return Post('http://127.0.0.1:5000/productFolder', params)
  },

  productCoordinateFile:(params) =>{
    return Post(linuxIp+'/productCoordinateFile',params)
    // return Post('http://192.168.153.11:80/productCoordinateFile', params)
    // return Post('http://127.0.0.1:5000/productCoordinateFile', params)
  },
  getFootprintAndDemFootprint:(params) => {
    return Get(linuxIp+'/getFootprintAndDemFootprint',params)
    // return Get('http://192.168.153.11:80/getFootprintAndDemFootprint', params)
    // return Get('http://127.0.0.1:5000/getFootprintAndDemFootprint', params)
  },
  getPixel:(params) =>{
    return Post(linuxIp+'/getPixel',params)
    // return Post('http://192.168.153.11:80/getPixel', params)
    // return Post('http://127.0.0.1:5000/getPixel', params)
  },
  getTaskStatus:(params) => {
    // return Get('http://192.168.153.11:80/getTaskStatus', params)

    return Get(linuxIp+'/getTaskStatus',params)
    return Get('http://127.0.0.1:5000/getTaskStatus', params)
  },
  checkOPODDownload:(params) =>{
    return Post(linuxIp+'/checkOPODDownload',params)
    // return Post(localhost+'/checkOPODDownload',params)
    // return Post('http://192.168.153.11:80/checkOPODDownload', params)
    // return Post('http://127.0.0.1:5000/checkOPODDownload', params)
  },
  getBmpPixel:(params) =>{
    return Post(linuxIp+'/getBmpPixel',params)
    // return Post('http://192.168.153.11:80/getBmpPixel', params)
    // return Post('http://127.0.0.1:5000/getBmpPixel', params)
  },
  checkSplitStatus:(params) =>{
    return Post(linuxIp+'/checkSplitStatus',params)
    // return Post('http://192.168.153.11:80/checkSplitStatus', params)
    // return Post('http://127.0.0.1:5000/checkSplitStatus', params)
  },
  triggerAndDownLoadOffline:(params) =>{
    return Post(linuxIp+'/triggerOffline',params)
    // return Post('http://192.168.153.11:80/triggerOffline', params)
    // return Post('http://127.0.0.1:5000/triggerOffline', params)
  },
  downloadForList:(params) =>{
    return Post(linuxIp+'/downloadForList',params)
    // return Post('http://192.168.153.11:80/downloadForList', params)
    // return Post('http://127.0.0.1:5000/downloadForList', params)
  },
}
