import React from 'react';
import { DatePicker, Typography } from 'antd';
import { PickerDateProps } from 'antd/lib/date-picker/generatePicker';
import locale from 'antd/es/date-picker/locale/pt_BR';
import { Moment } from 'moment';
import 'moment/locale/pt-br';
import moment from 'moment';

interface PropTypes extends PickerDateProps<Moment> {
  label?: string;
}

const RangePickerComponent: React.FC<PropTypes> = (props) => {
  const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY'];

  const formattDate = (value?: any) => {
    if (!value) return;
    if (typeof value === 'string') {
      const date = value.split('T')[0];
      const dateBr = date.split('-').reverse().join('/');
      return moment(dateBr, dateFormatList[0]);
    } else return value;
  };

  return (
    <>
      {props.label && (
        <Typography.Title level={5} style={{ marginBottom: 0 }}>
          {props.label}
        </Typography.Title>
      )}
      <DatePicker
        {...props}
        allowClear
        style={{ width: '100%' }}
        locale={locale}
        placeholder="Selecione uma data"
        defaultValue={formattDate(props.value)}
        value={formattDate(props.value)}
        format={dateFormatList}
      />
    </>
  );
};

export default RangePickerComponent;
