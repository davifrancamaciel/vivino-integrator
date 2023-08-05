import { Company } from './../Company/interfaces';
export interface Users {
  company?: Company;
  id?: string;
  companyId?: string;
  name: string;
  email: string;
  commissionMonth?: number;
  accessType?: string[];
  accessTypeText?: string;
  status: boolean;
  password?: string;
  statusText?: any;
  userStatusText?: any;
  resetPassword?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const initialStateForm: Users = {
  id: undefined,
  company: undefined,
  name: '',
  email: '',
  accessType: [],
  status: true,
  password: ''
};

export interface Filter {
  name: string;
  companyName: string;
  pageNumber: number;
  pageSize: number;
}

export const initialStateFilter: Filter = {
  name: '',
  companyName: '',
  pageNumber: 1,
  pageSize: 10
};

export interface UserCognito {
  Attributes: UserCognitoAttribute[];
  Enabled: boolean;
  UserCreateDate: string;
  UserLastModifiedDate: string;
  UserStatus: string;
  Username: string;
  Groups?: string[];
}
export interface UserCognitoAttribute {
  Name: string;
  Value: string;
}
