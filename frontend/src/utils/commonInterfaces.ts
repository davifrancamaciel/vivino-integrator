export interface IOptions {
  value: string;
  label: string;
  icon?: any;
}

export interface Response {
  success: boolean;
  message: string;
  data: any;
}

export const initialStateResponse: Response = {
  success: false,
  message: '',
  data: null
};
export interface Group {
  key: React.Key;
  label: string;
  description: string;
}
