// import axios from 'axios';
import { API } from '../config/apiConfig';
import { message } from 'antd';
import axios from '@/services/request.js';




export function apiGet(pathname, data = {}, callback) {
  return new Promise((resolve, reject) => {
    let promise;
    // const queryData = {
    //   queryContent: JSON.stringify(data),
    // };
    // // console.log('params',queryData);
  
    // return request(`/api${url}?${stringify(queryData)}`);
    promise = axios.get(`${pathname}`, {
      baseURL: API,
      params: data
      // data: data
    });
    promise.then(res => {
      resolve(res.data);
    }).catch(err => {
      // if (codeMessage[err.response.status]) {
      //   message.error(codeMessage[err.response.status]);
      //   return;
      // }
      // message.error(err.message);
      return;
    })
  })
}


export function apiPost(pathname, data = {}, ) {

  return new Promise((resolve, reject) => {
    let promise;
    promise = axios.post(`${API}${pathname}`, data);

    promise.then(res => {

      // ivan 20200906 parse response, if status 1, show message
      // const result = parseResDetail(res);
      // if(result) {
      //   resolve(result);
      // }
      
      resolve(res.data);
    }).catch(err => {
      // console.log('post err response')
      // console.log(err);
      // if (err.response.data) {
      //   message.error(err.response.data.error)
      // } else {
      //   message.error(err.message)
      // }
    })
  })
}

export function apiDelete(pathname, token, data = {}) {
  console.log(data);
  return new Promise((resolve, reject) => {
    const promise = axios.delete(`${API}${pathname}`, {
      data: data,
      headers: {
        "Authorization": `Bearer ${token}`
      },
    });
    promise.then(res => {
      resolve(res.data);
    }).catch(err => {
      if (err.response.data) {
        message.error(err.response.data.error)
      } else {
        message.error(err.message)
      }
    })
  })
}

// ivan 20200903 new apiDelete
export function apiDelete2(pathname, token, data = {}) {
  console.log(data);
  return new Promise((resolve, reject) => {
    const promise = axios.delete(`${API}${pathname}`, {
      data: data,
      headers: {
        "Authorization": `Bearer ${token}`
      },
    });
    promise.then(res => {
      resolve(res.data);
    }).catch(err => {
      console.log(err.response);
      if (err && err.response) {
        message.error(err.response.data.error)
      }
    })
  })
}


export function apiPut(pathname, data = {}, token) {

  return new Promise((resolve, reject) => {
    let promise;
    if (token) {
      promise = axios.put(`${API}${pathname}`, data, {
        headers: {
          "Authorization": `Bearer ${token}`
        },
      });
    } else {
      promise = axios.put(`${API}${pathname}`, data);
    }

    promise.then(res => {
      // console.log('post success response')
      // console.log(res);
      resolve(res.data);
    }).catch(err => {
      // console.log('post err response')
      // console.log(err);
      if (err.response.data) {
        message.error(err.response.data.error)
      } else {
        message.error(err.message)
      }
    })
  })
}


export function parseResSubmit(response, inShowError = false) {
  console.log('1response', response);
  if (response) {
    if (response.status === 0) {
      const data = { ...response.data };
      return data;
      // return response.data;
    }

    if (!inShowError) {
      message.error(response.info);
    }
  }
  return null;
}

export function parseResDetail(response) {
  console.log('parse response detail', response);
  if (response) {
    if (response.status === 0) {
      return response.data;
    }
    message.error(response.message);
    return;
  }
  return null;
}

export function parseResList(response, pagination) {
  console.log('list response', response);
  if (response) {
    if (response.status === 0) {
      return {
        list: response.list,
        pagination: {
          ...pagination,
          total: response.total
        }
      };
    }
    message.error(response.message);
    return;
  }
  return null;
}
