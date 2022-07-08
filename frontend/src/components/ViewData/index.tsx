import React from 'react';
import { Typography } from 'antd';
import { PropTypes } from './interfaces';

const ViewData: React.FC<PropTypes> = (props) => {
  return (
    <>
      <Typography.Title level={5} style={{ marginBottom: 0 }}>
        {props.label}
      </Typography.Title>
      <Typography.Title
        level={4}
        style={{ marginTop: 0, fontWeight: 'lighter' }}
      >
        {props.value}
      </Typography.Title>
    </>
  );
};

export default ViewData;
