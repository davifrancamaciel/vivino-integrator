import React from 'react';
import { Radio, Typography, RadioProps } from 'antd';
import { IOptions } from 'utils/commonInterfaces';

interface PropTypes extends RadioProps {
  optionsList: IOptions[];
  label?: string;
}

const RadioCustom: React.FC<PropTypes> = (props) => {
  return (
    <>
      {props.label && (
        <Typography.Title level={5} style={{ marginBottom: 0 }}>
          {props.label}
        </Typography.Title>
      )}
      <Radio.Group {...props}>
        {props.optionsList.map((o: IOptions, index: number) => (
          <Radio.Button key={index} value={o.value}>
            {o.icon} {o.label}
          </Radio.Button>
        ))}
      </Radio.Group>
    </>
  );
};

export default RadioCustom;
