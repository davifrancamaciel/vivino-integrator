import React from 'react';
import { CheckOutlined } from '@ant-design/icons';
import { ActionButton } from '../_inputs';

interface PropTypes {
  onClick: any;
  item: any;
}

const ActionSelect: React.FC<PropTypes> = (props) => (
  <ActionButton
    title={'Selecionar'}
    backgroundColor={props.item?.selected ? 'rgb(1 87 155)' : '#fff'}
    icon={<CheckOutlined />}
    onClick={props.onClick}
  />
);

export default ActionSelect;
