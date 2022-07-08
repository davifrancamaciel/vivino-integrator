import axios from 'axios';
import { notification } from 'antd';
import { Response } from 'utils/commonInterfaces';
// import {
//   localStorageGetItem,
//   localStorageRemoveItem
// } from '../utils/localStorage';
// import { KEY_STORAGE } from './defaultValues';

const api = {
  get: (url: string, showNotification: boolean = true): Promise<Response> => {
    return request('GET', url, null, showNotification);
  },
  post: (
    url: string,
    data: any,
    showNotification: boolean = true
  ): Promise<Response> => {
    return request('POST', url, data, showNotification);
  },
  put: (
    url: string,
    data: any,
    showNotification: boolean = true
  ): Promise<Response> => {
    return request('PUT', url, data, showNotification);
  },
  delete: (
    url: string,
    showNotification: boolean = true
  ): Promise<Response> => {
    return request('DELETE', url, showNotification);
  },
  patch: (
    url: string,
    data: any,
    showNotification: boolean = true
  ): Promise<Response> => {
    return request('PATCH', url, data, showNotification);
  }
};

const request = async (
  method: 'POST' | 'GET' | 'PUT' | 'DELETE' | 'PATCH',
  url: string,
  data: any = null,
  showNotification: boolean = true
): Promise<Response> => {
  /**
   * Definição da chamada das requests axios
   */
  const token = ''; //localStorageGetItem(KEY_STORAGE);
  const Authorization = token ? `Bearer ${token}` : '';

  const apiAxios = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL_API || '',
    headers: {
      'Content-type': 'application/json',
      Authorization
    }
  });

  try {
    const response = await apiAxios({ method, url, data });

    if (showNotification) {
      if (response.data.success)
        notification.success({
          message: response.data.message,
          placement: 'topRight'
        });
      else
        notification.error({
          message: response.data.message,
          placement: 'topRight'
        });
    }

    return response.data;
  } catch (e: any) {
    if (e && e.response && e.response.status === 401) {
      //localStorageRemoveItem(KEY_STORAGE);
      const btnLogout = document.getElementById('logout');
      if (btnLogout) {
        btnLogout.click();
      }
      notification.error({
        message: 'Ops! Sua autenticação expirou',
        description: 'Faça login novamente',
        placement: 'topRight'
      });
    } else {
      notification.error({
        message: 'Algo inesperado aconteceu',
        description:
          e.response && e.response.data ? e.response.data.message : e.message,
        placement: 'topRight'
      });
    }

    return { success: false, message: e.message, data: null };
  }
};

export default api;
