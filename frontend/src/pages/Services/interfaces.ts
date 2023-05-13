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
  active: boolean;
}

export interface PropTypes {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  item: ServicesFormatted | undefined;
  onComplete: (item: any) => void;
}
