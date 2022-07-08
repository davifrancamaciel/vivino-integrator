export interface Credentials {
  email: string;
  code: string;
  password: string;
  confirmPassword: string;
}

export const initialStateForm: Credentials = {
  email: '',
  code: '',
  password: '',
  confirmPassword: ''
};

export interface Reset {
  login: string;
}
