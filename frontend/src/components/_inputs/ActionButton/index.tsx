import React from 'react';
import { Button, Tooltip } from 'antd';

interface PropTypes {
  icon: React.ReactNode;
  onClick: React.MouseEventHandler<HTMLElement>;
  title: string;
  backgroundColor: string;
  loading?: boolean;
}

const CustomButton: React.FC<PropTypes> = (props) => {
  return (
    <Tooltip placement="top" title={props.title}>
      <Button
        loading={props.loading}
        disabled={props.loading}
        icon={props.icon}
        onClick={props.onClick}
        style={{
          backgroundColor: props.backgroundColor,
          color: '#fff',
          marginRight: 4
        }}
      />
    </Tooltip>
  );
};

export default CustomButton;
