import React, { useEffect, useState } from 'react';
import { Select, Typography, SelectProps } from 'antd';
import { IOptions } from 'utils/commonInterfaces';
import api from 'services/api-aws-amplify';

const { Option } = Select;

const PropsSelect = {
  allowClear: true,
  showSearch: true,
  placeholder: 'Selecione um item',
  optionFilterProp: 'label',
  filterOption: (input: any, option: any) =>
    option?.label?.toLowerCase().indexOf(input?.toLowerCase()) >= 0,
  notFoundContent: <>Não encontrado</>,
  style: { width: '100%' }
};

interface PropTypes extends SelectProps<any> {
  options?: IOptions[];
  label?: string;
  url?: string;
  data?: any;
  setcallback?: (options: IOptions[]) => void;
}

const SelectCustom: React.FC<PropTypes> = (props) => {
  const [options, setOptions] = useState<IOptions[]>([] as IOptions[]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (props.url && !options.length) {
      getOptions();
    } else {
      setLoading(props.loading || false);
      setOptions(props.options || []);
    }
    return () => {
      setLoading(false);
      setOptions([]);
    };
  }, []); // eslint-disable-line

  const getOptions = async () => {
    try {
      setLoading(true);
      const resp = await api.get(props.url || '', props.data, false);
      setLoading(false);
      resp.success && setOptions(resp.data);
      if (resp.success && props.setcallback) {
        props.setcallback(resp.data);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <>
      {props.label && (
        <Typography.Title level={5} style={{ marginBottom: 0 }}>
          {props.label}
        </Typography.Title>
      )}
      <Select loading={loading} {...PropsSelect} {...props}>
        {options.map((i: IOptions, index) => (
          <Option key={index} value={i.value}>
            {i.label}
          </Option>
        ))}
      </Select>
    </>
  );
};

export default SelectCustom;
