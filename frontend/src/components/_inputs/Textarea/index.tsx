import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Input, Typography } from 'antd';
import CharLimit from '../CharLimit';
import { TextAreaProps } from 'antd/lib/input/TextArea';
import Required from '../Required';

const { TextArea } = Input;

interface PropTypes extends TextAreaProps {
  label: string;
}

const TextareaCustom: React.FC<PropTypes> = (props) => {
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
    <>
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
      <TextArea
        rows={props.rows ? props.rows : 4}
        allowClear
        value={value}
        {...props}
      />
    </>
  );
};

export default TextareaCustom;
