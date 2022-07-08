import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { EditOutlined } from '@ant-design/icons';
import { Tooltip, Button } from 'antd';
import { systemColors } from 'utils/defaultValues';

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
    <Tooltip placement="top" title={'Alterar'}>
      {/* <Link to={`${props.router}/${props.id}`}> */}
      <Button
        onClick={onClick}
        style={{
          backgroundColor: systemColors.YELLOW,
          color: '#fff',
          marginRight: 4
        }}
        icon={<EditOutlined />}
      />
      {/* </Link> */}
    </Tooltip>
  );
};

export default ActionUpdate;
