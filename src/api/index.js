/*
* 接口文件
*
*/
import axios from 'axios';

// 使用 axios 进行数据处理
axios.interceptors.request.use(
  (config) => {
    return config;
  },
  error => Promise.reject('Axios发起请求失败', error),
);

axios.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 远程服务接口路径
export const appInterface = 'http://148.70.219.244:8080/';
// 本地接口路径
// export const appInterface = 'http://localhost:8080/';
// 图片前缀
export const baseImage = 'http://wechatcool.xyz/ecommerce_backend/images/'

const service = axios.create({
  appInterface,
  timeout: 20000 // 请求超时时间
})



//yk-获取上传结果
export const amazonUploadResults = params => axios.get(`${appInterface}amazon/uploadresults`, { params });

//登录接口
export const userlogin = params => axios.get(`${appInterface}user`, { params });

//列表接口
export const listProducts = params => axios.get(`${appInterface}listProducts`, { params });

//产品列表接口
export const productList = params => axios.get(`${appInterface}products/classifyall/0`, { params });

//工作人员下拉接口
export const workUser = params => axios.get(`${appInterface}users`, { params });

//创建产品接口
export const addProduct = params => axios.post(`${appInterface}product`, params );

//获取产品详细信息
export const editProduct = params => axios.get(`${appInterface}products`, { params });

//修改商品
export const updateProduct = params => axios.post(`${appInterface}product/update`, params );

// 获取亚马逊用户
export const gettingUser = params => axios.get(`${appInterface}amazon/accounts`, { params });

// 产品搜索
export const searchProduct = params => axios.post(`${appInterface}product/search`, params );

// 亚马逊分类
export const getamazon = params => axios.get(`${appInterface}products/classifyall/amazon/v2/0`, {params} );

// 亚马逊上传产品
export const amazonUpload = params => axios.post(`${appInterface}amazon/products/upload`, params );

// 亚马逊点击历史
export const amazonhistory = params => axios.get(`${appInterface}amazon/productType`, {params} );

// 亚马逊点击查找
export const amazonlookup = params => axios.get(`${appInterface}products/classifyall/amazon/v2/0`, {params} );

// 查找里搜索
export const amazonsearch = params => axios.get(`${appInterface}products/classify/amazon/search`, {params} );
