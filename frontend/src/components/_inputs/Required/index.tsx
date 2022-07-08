import React from 'react';
import { systemColors } from 'utils/defaultValues';

const Required: React.FC = () => {
  return <span style={{ color: systemColors.RED }}> *</span>;
};

export default Required;
