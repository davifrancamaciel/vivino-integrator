import { notification } from 'antd';
import { API, Auth } from 'aws-amplify';
import { Response } from 'utils/commonInterfaces';

const api = {
  get: (
    url: string,
    data?: any,
    showNotification: boolean = false
  ): Promise<Response> => {
    return request('get', url, data, showNotification);
  },
  post: (
    url: string,
    data: any,
    showNotification: boolean = true
  ): Promise<Response> => {
    return request('post', url, data, showNotification);
  },
  put: (
    url: string,
    data: any,
    showNotification: boolean = true
  ): Promise<Response> => {
    return request('put', url, data, showNotification);
  },
  delete: (
    url: string,
    showNotification: boolean = true
  ): Promise<Response> => {
    return request('del', url, showNotification);
  },
  patch: (
    url: string,
    data: any,
    showNotification: boolean = true
  ): Promise<Response> => {
    return request('patch', url, data, showNotification);
  }
};

const request = async (
  method: 'post' | 'get' | 'put' | 'del' | 'patch',
  url: string,
  data: any = null,
  showNotification: boolean = true
): Promise<Response> => {
  /**
   * Definição da chamada das requests axios
   */
  const userAuth = await Auth.currentAuthenticatedUser();
  const { signInUserSession } = userAuth;

  let init: any = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${signInUserSession.idToken.jwtToken}`,     
    }
  };

  switch (method) {
    case 'get':
      init.queryStringParameters = data;
      break;
    default:
      init.body = data;
      break;
  }

  try {
    const response = await API[method](url.split('/')[0], `/${url}`, init);
    console.log('sucesso', showNotification, url, response);
    if (showNotification) {
      if (response.success)
        notification.success({
          message: 'Sucesso!',
          description: response.message,
          placement: 'topRight'
        });
      else
        notification.error({
          message: 'Algo inesperado aconteceu',
          description: response.message,
          placement: 'topRight'
        });
    }

    return response;
  } catch (e: any) {
    console.log('erro', url, e);
    console.log(e.response);
    if (e && e.response && e.response.status === 401) {
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
      const description =
        e.response && e.response.data ? e.response.data.message : e.message;
      notification.error({
        message: 'Algo inesperado aconteceu',
        description: description ? description : e,
        placement: 'topRight'
      });
    }

    return { success: false, message: e.message, data: null };
  }
};

export default api;
