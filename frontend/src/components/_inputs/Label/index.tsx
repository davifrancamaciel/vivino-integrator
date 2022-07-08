import { Typography } from 'antd';
import React from 'react';

const Label: React.FC = (props) => (
  <Typography.Title level={5} style={{ marginBottom: 0 }}>
    {props.children}
  </Typography.Title>
);

export default Label;
