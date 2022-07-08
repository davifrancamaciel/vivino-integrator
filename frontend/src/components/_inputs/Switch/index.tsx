import React from 'react';
import { Switch as SwitchAnt, Typography, SwitchProps, Tooltip } from 'antd';

interface PropTypes extends SwitchProps {
  label?: string;
  title: string;
  tooltip?: string;
}

const Switch: React.FC<PropTypes> = (props) => (
  <>
    {props.label && (
      <Tooltip title={props.tooltip}>
        <Typography.Title level={5} style={{ marginBottom: 0 }}>
          {props.label}
        </Typography.Title>
      </Tooltip>
    )}
    <Tooltip title={props.title}>
      <SwitchAnt defaultChecked {...props} />
    </Tooltip>
  </>
);

export default Switch;
