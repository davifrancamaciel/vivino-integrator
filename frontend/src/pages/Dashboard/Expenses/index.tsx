import React, { useEffect, useState } from 'react';
import { Card, Col, Image, Row, Tag } from 'antd';

import GridList from 'components/GridList';
import api from 'services/api-aws-amplify';
import { formatDate, formatDateHour } from 'utils/formatDate';
import { apiRoutes, appRoutes, systemColors } from 'utils/defaultValues';
import useFormState from 'hooks/useFormState';

import { formatPrice } from 'utils/formatPrice';
import Action from 'components/Action';
import { Expense } from './interfaces';

const Wines: React.FC = () => {
  const { state, dispatch } = useFormState({ pageNumber: 1, pageSize: 10 });
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    const date = new Date();
    const paymentDate = date.toISOString();
    const paidOut = false;
    actionFilter(paymentDate, paidOut);
  }, []);

  const actionFilter = async (paymentDate: string, paidOut: boolean) => {
    try {
      dispatch({ paymentDate, paidOut });
      setLoading(true);
      const url = `${apiRoutes.dashboard}/${apiRoutes.expenses}`;
      const resp = await api.get(`${url}`, {
        ...state,
        paymentDate,
        paidOut
      });
      setLoading(false);

      const itemsFormatted = resp.data.map((e: Expense) => {
        const expense = {
          ...e,
          id: e.ids,
          value: formatPrice(Number(e.value) || 0),
          paymentDate: formatDate(e.paymentDate),
          paidOut: (
            <Action
              item={e}
              setUpdate={() => {}}
              apiRoutes={url}
              propName="paidOut"
            />
          )
        };
        return expense;
      });
      setItems(itemsFormatted);
      setTotalRecords(resp?.data.length);
    } catch (error) {
      setItems([]);
      setTotalRecords(0);
      console.log(error);
      setLoading(false);
    }
  };
  return (
    <Row style={{ width: '100%', marginTop: '30px' }}>
      <Col lg={24} md={24} sm={24} xs={24}>
        <Card
          title={`Despesas ${
            state.paidOut ? 'pagas' : 'a pagar'
          } nos próximos 30 dias.`}
          bordered={false}
        >
          <GridList
            size="small"
            scroll={{ x: 840 }}
            columns={[
              { title: 'Vencimento', dataIndex: 'paymentDate' },
              { title: 'Quantidade', dataIndex: 'amount' },
              { title: 'Valor', dataIndex: 'value' },
              { title: 'Paga', dataIndex: 'paidOut' }
            ]}
            dataSource={items}
            totalRecords={totalRecords}
            pageSize={state.pageSize}
            loading={loading}
            routes={{}}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default Wines;
