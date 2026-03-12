import axios from 'axios';
import Cookies from 'js-cookie';
import type { ApiResponse } from '@nestjs-learning/shared';
import { API_PREFIX } from '@nestjs-learning/shared';
import { message } from 'antd';

const api = axios.create({
  baseURL: `/${API_PREFIX}`,
  timeout: 10000,
});

// 请求拦截器：自动携带 Bearer Token
api.interceptors.request.use((config) => {
  // 从 zustand persist 创建的 cookie 中解析出 token
  const authStorage = Cookies.get('auth-storage');
  if (authStorage) {
    try {
      const parsed = JSON.parse(authStorage);
      const token = parsed?.state?.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.error('Failed to parse auth token from cookie', e);
    }
  }
  return config;
});

// 响应拦截器：统一脱壳与错误处理
api.interceptors.response.use(
  (response) => {
    // 获取后端统一格式的响应体
    const res = response.data as ApiResponse;

    // 如果没有包裹业务层的 code，直接返回原始 data (例如下载文件等特殊情况)
    if (res.code === undefined) {
      return response;
    }

    // 后端规范：code === 0 为成功
    if (res.code === 0) {
      // 成功：直接脱壳返回业务层的数据 (res.data.data -> 真实 data)
      // 修改 axios 返回体的 data 属性为后端的 data
      response.data = res.data;
      return response;
    }

    // code !== 0 视为业务级失败，展示错误信息并拦截
    message.error(res.message || 'Error');
    return Promise.reject(new Error(res.message || 'Error'));
  },
  (error) => {
    // 捕获 HTTP 错误 (401, 500 等)
    const errRes = error.response?.data;

    // 其他状态码的错误提示（利用后端返回的标准 message）
    const errorMsg = errRes?.message || error.message || '网络请求失败';
    message.error(errorMsg);

    if (axios.isAxiosError(error)) {
      switch (error.response?.status) {
        // 统一处理 401 登录失效
        case 401:
          // 移除 zustand 状态和 cookie
          Cookies.remove('auth-storage', { path: '/' });
          setTimeout(() => {
            window.location.href = '/login';
          }, 1000);
          return Promise.reject(error);
        default:
          break;
      }
    } else {
      return Promise.reject(error);
    }
  },
);

export { api };
