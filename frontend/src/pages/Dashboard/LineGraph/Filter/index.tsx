import React, { useEffect } from 'react';
import { Col, Typography } from 'antd';
import PanelFilter from 'components/PanelFilter';
import moment from 'moment';
import { endOfDay, startOfDay, addYears } from 'date-fns';

import { RangePicker } from 'components/_inputs';
import { Filter, PropTypes } from './interfaces';
import ExportCSV from './Export';
import useFormState from 'hooks/useFormState';

const date = new Date();

export const initialStateFilter: Filter = {
  createdAtStart: startOfDay(addYears(date, -1)).toISOString(),
  createdAtEnd: endOfDay(date).toISOString(),
  pageSize: 500,
  type: 'wines'
};
const FilterComponent: React.FC<PropTypes> = (props) => {
  const { state, dispatch } = useFormState(initialStateFilter);

  useEffect(() => {
    props.setFilter(state);   
  }, [state]);

  return (
    <PanelFilter
      title="Vinhos mais vendidos"
      actionButton={() => props.action(props.filter!)}
      loading={props.loading}
      isBtnInLine
    >
      <Col lg={8} md={12} sm={24} xs={24}>
        <RangePicker
          label="Data de venda"
          value={[
            state.createdAtStart ? moment(state.createdAtStart) : null,
            state.createdAtEnd ? moment(state.createdAtEnd) : null
          ]}
          onChange={(value: any, dateString: any) => {
            dispatch({
              createdAtStart: dateString[0]?.split('/').reverse().join('-')
            });
            dispatch({
              createdAtEnd: dateString[1]?.split('/').reverse().join('-')
            });
          }}
        />
      </Col>
      <Col lg={8} md={0} sm={0} xs={0}></Col>
      <Col
        lg={4}
        md={6}
        sm={24}
        xs={24}
        style={{
          justifyContent: 'end',
          display: 'flex',
          alignItems: 'flex-end'
        }}
      >
        <Typography.Title level={5} style={{ marginBottom: 0 }}>
          &nbsp;
        </Typography.Title>
        <ExportCSV {...state} />
      </Col>
    </PanelFilter>
  );
};

export default FilterComponent;
