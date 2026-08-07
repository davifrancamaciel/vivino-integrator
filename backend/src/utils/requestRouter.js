"use strict";

/**
 * Router de requisições unificado que roteia GET, POST, PUT e DELETE
 * para as funções correspondentes dentro do mesmo arquivo
 * 
 * Uso:
 * module.exports.handler = createRouter({
 *   list: async (event, context) => {},
 *   listById: async (event, context) => {},
 *   listAll: async (event, context) => {},
 *   create: async (event, context) => {},
 *   update: async (event, context) => {},
 *   delete: async (event, context) => {}
 * })
 */

const createRouter = (handlers) => {
  return async (event, context) => {
    event.queryStringParameters = event.queryStringParameters || {};
    event.multiValueQueryStringParameters = event.multiValueQueryStringParameters || {};
    event.pathParameters = event.pathParameters || {};

    const { httpMethod, pathParameters, path } = event;
    const pathSuffix = path?.split('/').filter(Boolean).pop();

    try {
      // GET request
      if (httpMethod === 'GET') {
        // GET /resource/all
        if ((pathParameters?.proxy === 'all' || pathSuffix === 'all') && handlers.listAll) {
          return await handlers.listAll(event, context);
        }
        // GET /resource/{id}
        else if (pathParameters?.id && handlers.listById) {
          return await handlers.listById(event, context);
        }
        // GET /resource
        else if (handlers.list) {
          return await handlers.list(event, context);
        }
      }

      // POST request
      if (httpMethod === 'POST') {
        // POST /resource/delete - special case for batch delete
        if ((pathParameters?.proxy === 'delete' || pathSuffix === 'delete') && handlers.delete) {
          return await handlers.delete(event, context);
        }
        // POST /resource
        else if (handlers.create) {
          return await handlers.create(event, context);
        }
      }

      // PUT request
      if (httpMethod === 'PUT') {
        if (handlers.update) {
          return await handlers.update(event, context);
        }
      }

      // DELETE request
      if (httpMethod === 'DELETE') {
        if (pathParameters?.id && handlers.delete) {
          return await handlers.delete(event, context);
        }
      }

      return {
        statusCode: 405,
        body: JSON.stringify({
          statusCode: 405,
          data: {},
          message: 'Método não permitido'
        })
      };
    } catch (err) {
      const { handlerErrResponse } = require('./handleResponse');
      return await handlerErrResponse(err);
    }
  };
};

module.exports = { createRouter };
