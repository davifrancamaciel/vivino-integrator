import React from 'react';
import { Input, Typography, InputProps, Tooltip } from 'antd';
import { LockOutlined } from '@ant-design/icons';

const { Password } = Input;

interface PropTypes extends InputProps {
  label?: string;
  tooltip?: string;
}

const InputPassword: React.FC<PropTypes> = (props) => (
  <Tooltip title={props.tooltip}>
    {props.label && (
      <Typography.Title level={5} style={{ marginBottom: 0 }}>
        {props.label}
      </Typography.Title>
    )}
    <Password
      prefix={<LockOutlined className="site-form-item-icon" />}
      allowClear
      {...props}
    />
  </Tooltip>
);

export default InputPassword;
