import axios from 'axios';
import {isAuthenticated} from './authorize';
import {message} from 'antd';



const codeMessage = {
  // 200: '服务器成功返回请求的数据。',
  // 201: '新建或修改数据成功。',
  // 202: '一个请求已经进入后台排队（异步任务）。',
  // 204: '删除数据成功。',
  400: 'Bad request',
  401: 'Unauthorized。',
  403: 'You are not authorized to access this',
  // 404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  // 406: '请求的格式不可得。',
  // 410: '请求的资源被永久删除，且不会再得到的。',
  // 422: '当创建一个对象时，发生一个验证错误。',
  500: 'System error',
  // 502: '网关错误。',
  // 503: '服务不可用，服务器暂时过载或维护。',
  // 504: '网关超时。',
};

/**
 * error handler
 */
const errorHandler = error => {
  const { response = {} } = error;
  const errortext = codeMessage[response.status] || response.statusText;
  const { status, url } = response;
  console.log('error',error)
  console.log(error.response);
  message.error(errortext);
  return;
};


// request interceptor
axios.interceptors.request.use(
  config => {
    // console.log(config);
    const {token} = isAuthenticated();
    // console.log(token);
    if (token) { //判断token是否存在
      config.headers['Authorization'] = `Bearer ${token}`;  //将token设置成请求头

    }
    console.log(config);
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

// http response intercptors
axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    errorHandler(error);
    // return Promise.reject(error);
  }
);


export default axios;