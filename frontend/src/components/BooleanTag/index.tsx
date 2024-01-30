import React from 'react';
import { Tag, Tooltip } from 'antd';

import { systemColors } from 'utils/defaultValues';

interface PropTypes {
  value: boolean;
  title?: string;
  yes?: string;
  no?: string;
}

const BooleanTag: React.FC<PropTypes> = ({ value, title, yes, no }) => {
  const textYes = yes ? yes : 'SIM';
  const textNo = no ? no : 'NÃO';
  const text = value ? textYes : textNo;
  const color = value ? systemColors.GREEN : systemColors.RED;
  return (
    <Tooltip title={title}>
      <Tag color={color}>{text}</Tag>
    </Tooltip>
  );
};

export default BooleanTag;
