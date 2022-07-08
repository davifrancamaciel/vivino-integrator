import React from 'react';
import { TimePicker, Typography } from 'antd';
import { TimePickerProps } from 'antd/lib/time-picker';
import locale from 'antd/es/date-picker/locale/pt_BR';
import 'moment/locale/pt-br';
import moment from 'moment';

interface PropTypes extends TimePickerProps {
  label?: string;
}

const TimePikerComponent: React.FC<PropTypes> = (props) => {
  const format = 'HH:mm';

  const formattDate = (value?: any) => {
    if (!value) return;
    if (typeof value === 'string') return moment(value, format);
    else return value;
  };

  return (
    <>
      {props.label && (
        <Typography.Title level={5} style={{ marginBottom: 0 }}>
          {props.label}
        </Typography.Title>
      )}
      <TimePicker
        {...props}
        allowClear
        style={{ width: '100%' }}
        locale={locale}
        value={formattDate(props.value)}
        defaultValue={formattDate(props.value)}
        format={format}
      />
    </>
  );
};
export default TimePikerComponent;
