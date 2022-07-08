import React from 'react';
import { systemColors } from 'utils/defaultValues';

interface PropTypes {
  maxLength: number;
  length: number;
}

const CharLimit: React.FC<PropTypes> = ({ maxLength, length }) => (
  <span
    style={{
      display: length > 0 ? 'initial' : 'none',
      color: length > maxLength ? systemColors.RED : '#b1aeae'
    }}
  >
    {length}/{maxLength}
  </span>
);

export default CharLimit;
