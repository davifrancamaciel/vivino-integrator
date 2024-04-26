import React from 'react';
import { useHistory } from 'react-router-dom';
import { EditOutlined } from '@ant-design/icons';
import { systemColors } from 'utils/defaultValues';
import { ActionButton } from '../_inputs';

interface PropTypes {
  router: any;
  id: string | number;
}

const ActionUpdate: React.FC<PropTypes> = (props) => {
  const history = useHistory();

  const onClick = () => {
    if (typeof props.router === 'function') props.router(props.id);
    else history.push(`${props.router}/${props.id}`);
  };

  return (
    <ActionButton
      title={'Alterar'}
      backgroundColor={systemColors.YELLOW}
      icon={<EditOutlined />}
      onClick={onClick}
    />
  );
};

export default ActionUpdate;
