export interface Credentials {
  oldPassword: string;
  password: string;
  confirmPassword: string;
}

export const initialStateForm: Credentials = {
  oldPassword: '',
  password: '',
  confirmPassword: ''
};
