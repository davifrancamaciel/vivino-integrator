import { RouteProps } from 'react-router-dom';

export interface IRouteProps extends RouteProps {
  exact?: boolean;
  path: string;
  isPrivate?: boolean;
  roule?: string;
  component: React.ComponentType;
}
