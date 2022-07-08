import React from 'react';
import { Input, Typography, InputProps } from 'antd';
import { LockOutlined } from '@ant-design/icons';

const { Password } = Input;

interface PropTypes extends InputProps {
  label?: string;
}

const InputPassword: React.FC<PropTypes> = (props) => (
  <>
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
  </>
);

export default InputPassword;
