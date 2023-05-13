import React from 'react';
import { PlayCircleOutlined } from '@ant-design/icons';
import { Tooltip, Button } from 'antd';
import { systemColors } from 'utils/defaultValues';

interface PropTypes {
  onClick: any;
  item: any;
}

const ActionRun: React.FC<PropTypes> = (props) => {
  return (
    <Tooltip placement="top" title={'Rodar'}>
      <Button
        onClick={props.onClick}
        icon={<PlayCircleOutlined />}
        style={{
          backgroundColor: systemColors.GREEN,
          color: '#fff',
          marginRight: 4
        }}
      />
    </Tooltip>
  );
};

export default ActionRun;
