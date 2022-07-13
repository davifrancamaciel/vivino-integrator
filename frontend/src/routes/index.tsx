import React, { Suspense, lazy } from 'react';
import {
  Redirect,
  BrowserRouter,
  Route as RouteDOM,
  Switch
} from 'react-router-dom';

import Route from './Route';
import SuspenseLoading from 'components/SuspenseLoading';

import { roules, appRoutes } from 'utils/defaultValues';
import { IRouteProps } from './interfaces';

const PageNotFound = lazy(() => import('components/PageNotFound'));
const PageForbidden = lazy(() => import('components/PageForbidden'));
const Login = lazy(() => import('pages/Login'));
const Forgot = lazy(() => import('pages/ForgotPassword'));
const ChangePassword = lazy(() => import('pages/ChangePassword'));
const Dashboard = lazy(() => import('pages/Dashboard'));
const UserList = lazy(() => import('pages/User/List'));
const UserCreateEdit = lazy(() => import('pages/User/CreateEdit'));
const MessageGroupList = lazy(() => import('pages/Product/List'));
const MessageGroupCreateEdit = lazy(
  () => import('pages/Product/CreateEdit')
);
const MessageGroupDetails = lazy(() => import('pages/Product/Details'));

const routesArray: IRouteProps[] = [
  { path: '/login', component: Login, isPrivate: false },
  { path: '/forgot-password', component: Forgot, isPrivate: false },
  { path: '/change-password', component: ChangePassword }, 
  { path: '/', component: Dashboard },
  { path: `/${appRoutes.users}`, component: UserList, roule: roules.users },
  {
    path: `/${appRoutes.users}/create`,
    component: UserCreateEdit,
    roule: roules.users
  },
  {
    path: `/${appRoutes.users}/edit/:id`,
    component: UserCreateEdit,
    roule: roules.users
  }, 
  {
    path: `/${appRoutes.products}`,
    component: MessageGroupList,
    roule: roules.products
  },
  {
    path: `/${appRoutes.products}/create`,
    component: MessageGroupCreateEdit,
    roule: roules.products
  },
  {
    path: `/${appRoutes.products}/edit/:id`,
    component: MessageGroupCreateEdit,
    roule: roules.products
  },
  {
    path: `/${appRoutes.products}/details/:id`,
    component: MessageGroupDetails,
    roule: roules.products
  }

];

const Routes: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<SuspenseLoading />}>
        <Switch>
          {routesArray.map((props: IRouteProps, i: number) => (
            <Route key={i} {...props} exact={true} />
          ))}
          <RouteDOM path="/access-not-allowed" component={PageForbidden} />
          <RouteDOM path="/not-found" component={PageNotFound} />
          <Redirect from="*" to="/not-found" />
        </Switch>
      </Suspense>
    </BrowserRouter>
  );
};

export default Routes;
