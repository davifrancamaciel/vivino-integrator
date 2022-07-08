import { IOptions } from 'utils/commonInterfaces';
export interface Services {
  Name: string;
  Arn: string;
  State: string;
  ScheduleExpression: string;
}

export interface ServicesFormatted extends Services {
  id: string;
  nameFormatted: string;
  scheduleExpressionFormatted: string;
  type: string;
  value: string;
}

export interface PropTypes {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  item: ServicesFormatted | undefined;
  onComplete: (item: any) => void;
}

export const types = {
  MINUTE: 'minute',
  HOUR: 'hour',
  DAY: 'day'
};

export const listTypes: IOptions[] = [
  { value: types.MINUTE, label: 'Minuto' },
  { value: types.HOUR, label: 'Hora' },
  { value: types.DAY, label: 'Dia' }
];
