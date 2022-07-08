import React from 'react';
import { Tag, Tooltip } from 'antd';

import { systemColors } from 'utils/defaultValues';

interface PropTypes {
  value: boolean;
  title?: string;
}

const BooleanTag: React.FC<PropTypes> = ({ value, title }) => {
  const text = value ? 'SIM' : 'NÃO';
  const color = value ? systemColors.GREEN : systemColors.RED;
  return (
    <Tooltip title={title}>
      <Tag color={color}>{text}</Tag>
    </Tooltip>
  );
};

export default BooleanTag;
