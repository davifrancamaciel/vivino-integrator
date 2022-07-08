import config from './config-aws';
import { apiRoutesArray } from './defaultValues';

const endpoints = apiRoutesArray.map((route: string) => ({
  name: route,
  endpoint: config.apiGateway.URL,
  region: config.apiGateway.REGION
}));

const configAplify = {
  Auth: {
    mandatorySignIn: true,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID
  },
  API: { endpoints }
};

export default configAplify;
