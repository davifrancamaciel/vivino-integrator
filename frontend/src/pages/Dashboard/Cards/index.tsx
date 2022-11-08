import React, { useEffect, useState } from 'react';
import {
  WarningOutlined,
  CheckOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined
} from '@ant-design/icons';

import { CardsReuslt } from './Card/interfaces';
import { roules, systemColors } from 'utils/defaultValues';
import { useAppContext } from 'hooks/contextLib';

import api from 'services/api-aws-amplify';
import { apiRoutes, appRoutes } from 'utils/defaultValues';
import { formatPrice } from 'utils/formatPrice';
import { checkRouleProfileAccess } from 'utils/checkRouleProfileAccess';
import Card from './Card';

const Cards: React.FC = () => {
  const { userAuthenticated } = useAppContext();
  const [groups, setGroups] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState<CardsReuslt>();

  useEffect(() => {
    const { signInUserSession } = userAuthenticated;
    setGroups(signInUserSession.accessToken.payload['cognito:groups']);
    action();
  }, []);

  const action = async () => {
    try {
      setLoading(true);
      const url = `${apiRoutes.dashboard}/cards`;
      const resp = await api.get(url);
      setCards(resp.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <>
      <Card
        loading={loading}
        value={formatPrice(cards?.sales.totalValueMonth!)}
        color={systemColors.GREEN}
        text={`Valor total das ${
          cards?.sales.count ? cards?.sales.count : 0
        } vendas este mês`}
        isPermission={Boolean(checkRouleProfileAccess(groups, roules.sales))}
        icon={<ArrowUpOutlined />}
        url={`${appRoutes.sales}`}
      />
      <Card
        loading={loading}
        value={formatPrice(cards?.sales.commissionMonth!)}
        color={systemColors.YELLOW}
        text={`Commissão a pagar sob ${
          cards?.sales.count ? cards?.sales.count : 0
        } vendas este mês`}
        isPermission={Boolean(checkRouleProfileAccess(groups, roules.sales))}
        icon={<ArrowDownOutlined />}
        url={`${appRoutes.sales}`}
      />
      <Card
        loading={loading}
        value={`${cards?.productsActive.count}`}
        color={systemColors.LIGHT_BLUE}
        text={'Vinhos disponíveis para integração'}
        isPermission={Boolean(checkRouleProfileAccess(groups, roules.products))}
        icon={<CheckOutlined />}
        url={`${appRoutes.products}?active=true`}
      />

      <Card
        loading={loading}
        value={`${cards?.productsNotActive.count}`}
        color={systemColors.RED}
        text={'Vinhos não integrados'}
        isPermission={Boolean(checkRouleProfileAccess(groups, roules.products))}
        icon={<WarningOutlined />}
        url={`${appRoutes.products}?active=false`}
      />
    </>
  );
};

export default Cards;
