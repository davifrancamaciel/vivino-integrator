import React, { useEffect, useState } from 'react';

import { Switch } from 'components/_inputs';
import api from 'services/api-aws-amplify';

interface PropTypes {
  propName?: string;
  apiRoutes: string;
  item: any;
  setUpdate: (items: any) => void;
}
const Action: React.FC<PropTypes> = ({
  item,
  setUpdate,
  apiRoutes,
  propName = 'active'
}) => {
  const [loading, setLoading] = useState(false);
  const [cheked, setCheked] = useState<boolean>();

  useEffect(() => {
    setCheked(item[propName]);
  }, [item]);

  const action = async (obj: any) => {
    try {
      const isCheked = !cheked;
      setCheked(isCheked);
      setLoading(true);

      let data = obj;
      data[propName] = isCheked;

      const result = await api['put'](apiRoutes, data);
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
