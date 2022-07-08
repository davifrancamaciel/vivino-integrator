import React from 'react';
import { DatePicker, Typography } from 'antd';
import { RangePickerDateProps } from 'antd/lib/date-picker/generatePicker';
import locale from 'antd/es/date-picker/locale/pt_BR';
import { Moment } from 'moment';
import 'moment/locale/pt-br';

const { RangePicker } = DatePicker;

interface PropTypes extends RangePickerDateProps<Moment> {
  label?: string;
}

const RangePickerComponent: React.FC<PropTypes> = (props) => {
  return (
    <>
      {props.label && (
        <Typography.Title level={5} style={{ marginBottom: 0 }}>
          {props.label}
        </Typography.Title>
      )}
      <RangePicker
        style={{ width: '100%' }}
        format="DD/MM/YYYY"
        locale={locale}
        {...props}
      />
    </>
  );
};

export default RangePickerComponent;
