import { EyeOutlined } from '@ant-design/icons';
import { Tooltip, Button } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import { systemColors } from 'utils/defaultValues';

interface PropTypes {
  router: string;
  id: string | number;
}

const ActionView: React.FC<PropTypes> = (props) => {
  return (
    <Tooltip placement="top" title={'Visualizar'}>
      <Link to={`${props.router}/${props.id}`}>
        <Button
          icon={<EyeOutlined />}
          style={{
            backgroundColor: systemColors.GREY,
            color: '#fff',
            marginRight: 4
          }}
        />
      </Link>
    </Tooltip>
  );
};

export default ActionView;
