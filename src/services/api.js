import axios from 'axios';
import { URL } from './env';

const api = axios.create({
  baseURL: URL,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Expose-Headers": "*",
    "Accept": "application/json",
    "Content-Type": "application/json",
  },
  // onUploadProgress: (progressEvent) => {
  //   const totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length');
  //   // console.log("onUploadProgress", totalLength);
  //   if (totalLength !== null) {
  //     // console.log(Math.round((progressEvent.loaded * 100) / totalLength));
  //   }
  // },
  // onDownloadProgress: function (progressEvent) {
  //   const totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length');
  //   // console.log("onDownloadProgress", totalLength);
  //   if (totalLength !== null) {
  //     // console.log(Math.round((progressEvent.loaded * 100) / totalLength));
  //   }
  // },
});

export default api;