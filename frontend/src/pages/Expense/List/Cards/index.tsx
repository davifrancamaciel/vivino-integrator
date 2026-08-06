import React, { useEffect, useState } from 'react';
import {
  WarningOutlined,
  CheckOutlined,
  ArrowUpOutlined
} from '@ant-design/icons';

import { formatPrice } from 'utils/formatPrice';

import Card from 'components/Card';
import {
  systemColors,
  appRoutes,
  expensesTypesEnum
} from 'utils/defaultValues';
import { Header, Container } from 'components/Card/styles';
import { getType } from '../../utils';
import { CardsResult, ExpenseResult } from '../../interfaces';
import { getValueExpensesByTypes } from 'pages/Expense/utils';

interface PropTypes {
  dataTotal: CardsResult;
  loading: boolean;
}

interface Result {
  value: number;
  count: number;
}

interface Totals {
  payTrue: Result;
  payFalse: Result;
  payTotal: Result;
  equipaments: Result;
  food: Result;
  market: Result;
}

const initialStateResult: Result = {
  value: 0,
  count: 0
};

let initialState: Totals = {
  payTrue: initialStateResult,
  payFalse: initialStateResult,
  payTotal: initialStateResult,
  equipaments: initialStateResult,
  food: initialStateResult,
  market: initialStateResult
};

const Cards: React.FC<PropTypes> = ({ dataTotal, loading }) => {
  const typePath = getType();
  const [total, setTotal] = useState<Totals>(initialState);

  useEffect(() => {
    let newState: Totals = initialState;
    const payTrue = dataTotal.pay.find((x) => Number(x.paidOut) == 1);
    newState.payTrue = setValueResult(payTrue);

    const payFalse = dataTotal.pay.find((x) => Number(x.paidOut) == 0);
    newState.payFalse = setValueResult(payFalse);

    newState.payTotal = {
      count: newState.payTrue.count + newState.payFalse.count,
      value: newState.payTrue.value + newState.payFalse.value
    } as Result;

    const _food = getValueExpensesByTypes(
      dataTotal.type,
      [expensesTypesEnum.ALIMENTO],
      true
    ) as ExpenseResult;
    newState.food = setValueResult(_food);

    const _market = getValueExpensesByTypes(
      dataTotal.type,
      [expensesTypesEnum.MERCADO],
      true
    ) as ExpenseResult;
    newState.market = setValueResult(_market);

    const _equipaments = getValueExpensesByTypes(
      dataTotal.type,
      [expensesTypesEnum.EQUIPAMENTOS],
      true
    ) as ExpenseResult;
    newState.equipaments = setValueResult(_equipaments);

    setTotal({ ...total, ...newState });
  }, [dataTotal]);

  const setValueResult = (result?: ExpenseResult) => {
    if (!result) return initialStateResult;
    else
      return {
        value: Number(result.totalValueMonth),
        count: Number(result.count)
      } as Result;
  };
  return (
    <Container>
      <Header>
        <Card
          loading={loading}
          value={formatPrice(total.payTrue.value)}
          color={systemColors.GREEN}
          text={`PAGO (${total.payTrue.count})`}
          icon={<CheckOutlined />}
          width={150}
        />

        <Card
          loading={loading}
          value={formatPrice(total.payFalse.value)}
          color={systemColors.RED}
          text={`A PAGAR (${total.payFalse.count})`}
          icon={<WarningOutlined />}
          width={150}
        />

        <Card
          loading={loading}
          value={formatPrice(total.payTotal.value)}
          color={systemColors.BLUE}
          text={`TOTAL (${total.payTotal.count})`}
          icon={<ArrowUpOutlined />}
          width={150}
        />
        {typePath === appRoutes.expenses && (
          <>
            <Card
              loading={loading}
              value={formatPrice(total.equipaments.value)}
              color={systemColors.ORANGE}
              text={`EQUIPAMENTOS (${total.equipaments.count})`}
              icon={<ArrowUpOutlined />}
              width={150}
            />
            <Card
              loading={loading}
              value={formatPrice(total.food.value)}
              color={systemColors.ORANGE}
              text={`ALIMENTO (${total.food.count})`}
              icon={<ArrowUpOutlined />}
              width={150}
            />
            <Card
              loading={loading}
              value={formatPrice(total.market.value)}
              color={systemColors.ORANGE}
              text={`MERCADO (${total.market.count})`}
              icon={<ArrowUpOutlined />}
              width={150}
            />
          </>
        )}
      </Header>
    </Container>
  );
};

export default Cards;
