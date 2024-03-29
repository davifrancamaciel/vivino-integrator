import React, { useEffect, useMemo, useState } from 'react';
import { format, subMonths, addMonths } from 'date-fns';
import pt from 'date-fns/locale/pt';
import {
  WarningOutlined,
  CheckOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
  BarChartOutlined,
  LeftOutlined,
  RightOutlined,
  DollarOutlined
} from '@ant-design/icons';

import {
  CardPropTypes,
  CardsReuslt,
  initialStateCards
} from './Card/interfaces';
import { roules, systemColors } from 'utils/defaultValues';
import { useAppContext } from 'hooks/contextLib';

import api from 'services/api-aws-amplify';
import { apiRoutes, appRoutes } from 'utils/defaultValues';
import { formatPrice } from 'utils/formatPrice';
import { checkRouleProfileAccess } from 'utils/checkRouleProfileAccess';
import Card from './Card';
import { Container, Header } from './styles';
import { formatDateEn } from 'utils/formatDate';

const Cards: React.FC = () => {
  const { userAuthenticated } = useAppContext();
  const [groups, setGroups] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState<CardsReuslt>(initialStateCards);
  const [date, setDate] = useState(new Date());
  const [dateEn, setDateEn] = useState('');
  const dateFormated = useMemo(
    () => format(date, "MMMM 'de' yyyy", { locale: pt }),
    [date]
  );

  useEffect(() => {
    const { signInUserSession } = userAuthenticated;
    setGroups(signInUserSession.accessToken.payload['cognito:groups']);
  }, []);

  useEffect(() => {
    action(date);
    setDateEn(formatDateEn(date.toISOString()));
  }, [date]);

  const action = async (date: Date) => {
    try {
      setLoading(true);
      const url = `${apiRoutes.dashboard}/cards`;
      const resp = await api.get(url, { dateReference: date.toISOString() });

      resp?.data && setCards(resp?.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleCardSaleMonth = (cards: CardsReuslt) => {
    return {
      loading,
      value: formatPrice(cards?.sales.totalValueMonth!),
      color: systemColors.GREEN,
      text: `Valor total das ${cards?.sales.count!} vendas no mês`,
      icon: <DollarOutlined />,
      url: `${appRoutes.sales}?dateReference=${dateEn}`
    } as CardPropTypes;
  };

  const handleCardSaleCommision = (cards: CardsReuslt) => {
    const { totalValueMonth, totalValueCommissionMonth, count } = cards?.sales;
    const commission = (totalValueCommissionMonth / totalValueMonth) * 100;
    return {
      loading,
      value: formatPrice(totalValueCommissionMonth),
      color: systemColors.YELLOW,
      text: `Commissão a pagar de ${
        commission ? parseFloat(commission.toString()).toFixed(2) : 0
      }% sob ${count} vendas no mês seguinte`,
      icon: <ArrowDownOutlined />,
      url: `${appRoutes.sales}`
    } as CardPropTypes;
  };

  const handleCardSaleCommisionUser = (cards: CardsReuslt) => {
    const { totalValueMonth, totalValueCommissionMonth, count, users } =
      cards?.user;
    const commission = (totalValueCommissionMonth / totalValueMonth) * 100;
    return {
      loading,
      value: formatPrice((totalValueCommissionMonth / users) | 0),
      color: systemColors.BLUE,
      text: `Minha commissão sob ${count} vendas a receber de ${
        commission ? parseFloat(commission.toString()).toFixed(2) : 0
      }% no mês seguinte`,
      icon: <ArrowUpOutlined />,
      url: `${appRoutes.sales}/my-commisions`
    } as CardPropTypes;
  };

  const handleCardExpenseMonth = (cards: CardsReuslt) => {
    const { totalValueMonth, count } = cards?.expenses;
    return {
      loading,
      value: formatPrice(totalValueMonth),
      color: systemColors.ORANGE,
      text: `Valor total das ${count} despesas no mês`,
      icon: <ArrowUpOutlined />,
      url: `${appRoutes.expenses}?dateReference=${dateEn}`
    } as CardPropTypes;
  };

  const handleCardSaleExpenseMonth = (cards: CardsReuslt) => {
    const { total: winesSalesMonthValueStr } = cards?.winesSalesMonthValue;
    const { totalValueMonth: totalValueMonthExpensesStr } = cards?.expenses;
    const { totalValueMonth: totalValueMonthSalesStr } = cards?.sales;

    const totalValueMonthExpenses = Number(totalValueMonthExpensesStr || 0);
    const totalValueMonthSales = Number(totalValueMonthSalesStr || 0);
    const winesSalesMonthValue = Number(winesSalesMonthValueStr || 0);
    const totalSales = totalValueMonthSales + winesSalesMonthValue;

    const isPositive = totalValueMonthExpenses < totalSales;
    return {
      loading,
      value: formatPrice(totalSales - totalValueMonthExpenses),
      color: isPositive ? systemColors.GREEN : systemColors.RED,
      text: `Valor das vendas menos as despesas`,
      icon: isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />,

      url: `${appRoutes.expenses}`
    } as CardPropTypes;
  };

  const handlePrevMonth = () => setDate(subMonths(date, 1));

  const handleNextMonth = () => setDate(addMonths(date, 1));

  return (
    <>
      <Container>
        <span onClick={handlePrevMonth}>
          <LeftOutlined />
        </span>
        <strong>{dateFormated}</strong>
        <span onClick={handleNextMonth}>
          <RightOutlined />
        </span>
      </Container>
      <Header>
        {Boolean(checkRouleProfileAccess(groups, roules.wines)) && (
          <>
            <Card
              loading={loading}
              value={`${formatPrice(cards?.winesSalesMonthValue.total ?? 0)}`}
              color={systemColors.GREEN}
              text={'Valor total das vendas no mês'}
              icon={<DollarOutlined />}
              url={`${appRoutes.wines}/sales?dateReference=${dateEn}`}
            />
            <Card
              loading={loading}
              value={`${cards?.winesSalesDay.count ?? 0}`}
              color={systemColors.GREEN}
              text={'Garrafas vendidas ontem'}
              icon={<BarChartOutlined />}
              url={`${appRoutes.wines}/sale-history`}
            />
            <Card
              loading={loading}
              value={`${cards?.winesSalesMonth.count ?? 0}`}
              color={systemColors.LIGHT_BLUE}
              text={'Garrafas vendidas no mês'}
              icon={<BarChartOutlined />}
              url={`${appRoutes.wines}/sale-history?dateReference=${dateEn}`}
            />
            <Card
              loading={loading}
              value={`${cards?.winesActive.count}`}
              color={systemColors.BLUE}
              text={'Vinhos disponíveis para integração'}
              icon={<CheckOutlined />}
              url={`${appRoutes.wines}?active=true`}
            />
            <Card
              loading={loading}
              value={`${cards?.winesNotActive.count}`}
              color={systemColors.RED}
              text={'Vinhos não integrados'}
              icon={<WarningOutlined />}
              url={`${appRoutes.wines}?active=false`}
            />
          </>
        )}
        {Boolean(checkRouleProfileAccess(groups, roules.sales)) && (
          <>
            <Card {...handleCardSaleMonth(cards)} />
            <Card {...handleCardSaleCommision(cards)} />
          </>
        )}
        {Boolean(checkRouleProfileAccess(groups, roules.expenses)) && (
          <>
            <Card {...handleCardExpenseMonth(cards)} />
            <Card {...handleCardSaleExpenseMonth(cards)} />
          </>
        )}
        {Boolean(checkRouleProfileAccess(groups, roules.sales)) && (
          <Card {...handleCardSaleCommisionUser(cards)} />
        )}
      </Header>
    </>
  );
};

export default Cards;
