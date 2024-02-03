import React, { useEffect, useState } from 'react';
import { Input, Typography, InputProps, Tooltip } from 'antd';
import CharLimit from '../CharLimit';
import Required from '../Required';
interface PropTypes extends InputProps {
  label?: string;
  tooltip?: string;
}

const InputCustom: React.FC<PropTypes> = (props) => {
  const [value, setValue] = useState<any>();

  useEffect(() => {
    let newValue = props.value;
    const length = Number(props?.value?.toString().length);
    if (props.maxLength && length > props.maxLength) {
      newValue = props.value?.toString().slice(0, props.maxLength);
    }
    setValue(newValue);
  }, [props.value]);

  return (
    <Tooltip title={props.tooltip}>
      {props.label && (
        <Typography.Title level={5} style={{ marginBottom: 0 }}>
          {props.label}
          {props.required ? <Required /> : ' '}
          {props.maxLength && (
            <CharLimit
              maxLength={props.maxLength}
              length={Number(value?.toString().length)}
            />
          )}
        </Typography.Title>
      )}
      <Input allowClear value={value} {...props} />
    </Tooltip>
  );
};

export default InputCustom;
