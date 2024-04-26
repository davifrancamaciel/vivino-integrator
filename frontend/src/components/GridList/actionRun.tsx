import React from 'react';
import { PlayCircleOutlined } from '@ant-design/icons';
import { systemColors } from 'utils/defaultValues';
import { ActionButton } from '../_inputs';

interface PropTypes {
  onClick: any;
  item: any;
}

const ActionRun: React.FC<PropTypes> = (props) => {
  return (
    <ActionButton
      title={'Rodar'}
      backgroundColor={systemColors.GREEN}
      icon={<PlayCircleOutlined />}
      onClick={props.onClick}
    />
  );
};

export default ActionRun;
