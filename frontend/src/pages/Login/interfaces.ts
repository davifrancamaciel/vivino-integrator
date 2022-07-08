export interface Credentials {
  login: string;
  password: string;
}

export const initialStateForm: Credentials = {
  login: '',
  password: ''
};
