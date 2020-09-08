// import axios from 'axios';
import { API } from '../config/apiConfig';
import { message } from 'antd';
import axios from '@/services/request.js';


export function apiGet(pathname, data = {}, callback) {
  return new Promise((resolve, reject) => {
    let promise;
    promise = axios.get(`${pathname}`, {
      baseURL: API,
      params: data
      // data: data
    });
    promise.then(res => {
      resolve(res.data);
    }).catch(err => {
      return;
    })
  })
}


export function apiPost(pathname, data = {}, ) {
  return new Promise((resolve, reject) => {
    let promise;
    console.log('post body', data)
    promise = axios.post(`${API}${pathname}`, data);

    promise.then(res => {      
      resolve(res.data);
    }).catch(err => {})
  })
}


export function apiDelete(pathname, data = {}) {
  // console.log(data);
  return new Promise((resolve, reject) => {
    const promise = axios.delete(`${API}${pathname}`, {
      data: data,
    });
    promise.then(res => {
      resolve(res.data);
    }).catch(err => {
    })
  })
}


export function parseResSubmit(response, ) {
  console.log('submit response', response);
  if (response) {
    if (response.status === 0) {
      const data = { ...response.data };
      return data;
    }
    message.error(response.message);
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
