import React, { useEffect, useState } from 'react';
import { notification } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { Select } from 'components/_inputs';
import api from 'services/api-aws-amplify';
import { IOptions } from 'utils/commonInterfaces';

interface PropTypes {
  propName: string;
  apiRoutes: string;
  item: any;
  setUpdate: (items: any) => void;
  setLoading: (loading: boolean) => void;
  options: Array<IOptions>;
}
const GridEditSelect: React.FC<PropTypes> = ({
  item,
  setUpdate,
  setLoading,
  apiRoutes,
  propName,
  options
}) => {
  const [enable, setEnable] = useState<boolean>();
  const [value, setValue] = useState<string>();

  useEffect(() => {
    setValue(item[propName]);
  }, [item]);

  const action = async (value: any) => {
    try {
      if (!value) {
        notification.warning({
          message: 'Este campo é obrigatório'
        });
        return;
      }
      setValue(value);
      setLoading(true);

      let data = item;
      data[propName] = value;

      const result = await api['put'](apiRoutes, data);
      setLoading(false);
      setEnable(false);
      setUpdate(result.data);
    } catch (error) {
      setLoading(false);
    }
  };

  return enable ? (
    <Select
      options={options}
      value={value}
      onChange={(value) => action(value)}
    />
  ) : (
    <span onClick={() => setEnable(true)}>
      {options && options.find((x: IOptions) => x.value === value)?.label} <EditOutlined />
    </span>
  );
};

export default GridEditSelect;
