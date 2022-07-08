export interface Users {
  id?: string;
  name: string;
  email: string;
  login: string;
  accessType?: string[];
  accessTypeText?: string;
  status: boolean;
  password?: string;
  statusText?: any;
  userStatusText?: any;
  resetPassword?: boolean;
}

export const initialStateForm: Users = {
  id: undefined,
  name: '',
  email: '',
  login: '',
  accessType: [],
  status: true,
  password: ''
};

export interface Filter {
  name: string;
  typeAccess: string;
  pageNumber: number;
  pageSize: number;
}

export const initialStateFilter: Filter = {
  name: '',
  typeAccess: '',
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