import React, { useEffect, useState } from 'react';
import { notification } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { Input } from 'components/_inputs';
import api from 'services/api-aws-amplify';
import {
  formatPrice,
  formatValueWhithDecimalCaseOnChange,
  priceToNumber
} from 'utils/formatPrice';

interface PropTypes {
  propName: string;
  apiRoutes: string;
  item: any;
  setUpdate: (items: any) => void;
  setLoading: (loading: boolean) => void;
  type: 'text' | 'number';
}
const GridEditText: React.FC<PropTypes> = ({
  item,
  setUpdate,
  setLoading,
  apiRoutes,
  propName,

  type
}) => {
  const [enable, setEnable] = useState<boolean>();
  const [value, setValue] = useState<string>();

  useEffect(() => {
    setValue(item[propName]);
  }, [item]);

  const action = async (event: any) => {
    try {
      event.preventDefault();
      if (!value) {
        notification.warning({
          message: 'Este campo é obrigatório'
        });
        return;
      }
      setLoading(true);

      let data = item;
      data[propName] = type === 'number' ? priceToNumber(value) : value;

      const result = await api['put'](apiRoutes, data);
      setLoading(false);
      setEnable(false);
      setUpdate(result.data);
    } catch (error) {
      setLoading(false);
    }
  };

  const formatValue = (value: any) => {
    if (type === 'number') {
      const valueNumber = value?.toString()?.includes(',')
        ? priceToNumber(value)
        : value;
      return formatPrice(Number(valueNumber) || 0);
    }
    return value;
  };

  const inputText = () => (
    <Input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      style={{ minWidth: '300px' }}
    />
  );

  const inputNumber = () => (
    <Input
      type={'tel'}
      value={value}
      onChange={(e) =>
        setValue(formatValueWhithDecimalCaseOnChange(e.target.value))
      }
    />
  );

  const getInput = () => {
    switch (type) {
      case 'number':
        return inputNumber();
      default:
        return inputText();
    }
  };

  return enable ? (
    <form onSubmit={action}>{getInput()}</form>
  ) : (
    <span onClick={() => setEnable(true)}>
      {formatValue(value)} <EditOutlined />
    </span>
  );
};

export default GridEditText;
