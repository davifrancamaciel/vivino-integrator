import React, { useEffect, useState } from 'react';
import { Romanian } from '../../interfaces';
import { Switch } from 'components/_inputs';
import { apiRoutes } from 'utils/defaultValues';
import api from 'services/api-aws-amplify';

interface PropTypes {
  item: Romanian;
  setUpdate: (items: Romanian) => void;
  type: 'sended' | 'delivered';
}
const Action: React.FC<PropTypes> = ({ item, setUpdate, type }) => {
  const [loading, setLoading] = useState(false);
  const [cheked, setCheked] = useState<boolean>();

  useEffect(() => {
    if (type == 'sended') setCheked(item.sended);
    if (type == 'delivered') setCheked(item.delivered);
  }, [item]);

  const action = async (obj: Romanian) => {
    try {
      const isCheked = !cheked;
      setCheked(isCheked);
      setLoading(true);
      
      let data = obj;
      if (type == 'sended') data.sended = isCheked;
      if (type == 'delivered') data.delivered = isCheked;
      
      const result = await api['put'](apiRoutes.romanians, data);
      setLoading(false);
      setUpdate(result.data);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <Switch
      title="Não / Sim"
      checked={cheked}
      loading={loading}
      checkedChildren="Sim"
      unCheckedChildren="Não"
      onChange={() => action(item)}
    />
  );
};

export default Action;
