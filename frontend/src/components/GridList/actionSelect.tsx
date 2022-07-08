import React from 'react';
import { CheckOutlined } from '@ant-design/icons';
import { Tooltip, Button } from 'antd';

interface PropTypes {
  onClick: any;
  item: any;
}

const ActionSelect: React.FC<PropTypes> = props => (
  <Tooltip placement='top' title={'Selecionar'}>
    <Button
      onClick={props.onClick}
      icon={<CheckOutlined />}
      style={{
        backgroundColor: props.item?.selected ? 'rgb(1 87 155)' : '#fff',
        color: '#fff',
        marginRight: 4
      }}
    />
  </Tooltip>
);

export default ActionSelect;
