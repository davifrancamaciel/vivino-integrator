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
const ProductList = lazy(() => import('pages/Product/List'));
const ProductCreateEdit = lazy(() => import('pages/Product/CreateEdit'));
const ProductDetails = lazy(() => import('pages/Product/Details'));
const RomanainList = lazy(() => import('pages/Romanain/List'));
const RomanainCreateEdit = lazy(() => import('pages/Romanain/CreateEdit'));
const RomanainDetails = lazy(() => import('pages/Romanain/Details'));
const SaleList = lazy(() => import('pages/Sale/List'));
const SaleCreateEdit = lazy(() => import('pages/Sale/CreateEdit'));
const SaleDetails = lazy(() => import('pages/Sale/Details'));
const ExpenseList = lazy(() => import('pages/Expense/List'));
const ExpenseCreateEdit = lazy(() => import('pages/Expense/CreateEdit'));
const ExpenseDetails = lazy(() => import('pages/Expense/Details'));

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
    component: ProductList,
    roule: roules.products
  },
  {
    path: `/${appRoutes.products}/create`,
    component: ProductCreateEdit,
    roule: roules.products
  },
  {
    path: `/${appRoutes.products}/edit/:id`,
    component: ProductCreateEdit,
    roule: roules.products
  },
  {
    path: `/${appRoutes.products}/details/:id`,
    component: ProductDetails,
    roule: roules.products
  },
  {
    path: `/${appRoutes.romanians}`,
    component: RomanainList,
    roule: roules.romanians
  },
  {
    path: `/${appRoutes.romanians}/create`,
    component: RomanainCreateEdit,
    roule: roules.romanians
  },
  {
    path: `/${appRoutes.romanians}/edit/:id`,
    component: RomanainCreateEdit,
    roule: roules.romanians
  },
  {
    path: `/${appRoutes.romanians}/details/:id`,
    component: RomanainDetails,
    roule: roules.romanians
  },
  {
    path: `/${appRoutes.sales}`,
    component: SaleList,
    roule: roules.sales
  },
  {
    path: `/${appRoutes.sales}/create`,
    component: SaleCreateEdit,
    roule: roules.sales
  },
  {
    path: `/${appRoutes.sales}/edit/:id`,
    component: SaleCreateEdit,
    roule: roules.sales
  },
  {
    path: `/${appRoutes.sales}/details/:id`,
    component: SaleDetails,
    roule: roules.sales
  },
  {
    path: `/${appRoutes.expenses}`,
    component: ExpenseList,
    roule: roules.expenses
  },
  {
    path: `/${appRoutes.expenses}/create`,
    component: ExpenseCreateEdit,
    roule: roules.expenses
  },
  {
    path: `/${appRoutes.expenses}/edit/:id`,
    component: ExpenseCreateEdit,
    roule: roules.expenses
  },
  {
    path: `/${appRoutes.expenses}/details/:id`,
    component: ExpenseDetails,
    roule: roules.expenses
  },
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
