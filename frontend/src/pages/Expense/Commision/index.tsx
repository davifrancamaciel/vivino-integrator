import React, { useEffect, useState } from 'react';
import { Col } from 'antd';
import PanelFilter from 'components/PanelFilter';
import GridList from 'components/GridList';
import { Input, RangePicker, Select } from 'components/_inputs';
import { apiRoutes, booleanFilter } from 'utils/defaultValues';
import { initialStateFilter, Expense } from '../interfaces';
import useFormState from 'hooks/useFormState';
import api from 'services/api-aws-amplify';
import { formatDate, formatDateHour } from 'utils/formatDate';
import { formatPrice } from 'utils/formatPrice';
import BooleanTag from 'components/BooleanTag';

const List: React.FC = () => {
  const { state, dispatch } = useFormState(initialStateFilter);
  const [items, setItems] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    actionFilter();
  }, []);

  const actionFilter = async (pageNumber: number = 1) => {
    try {
      dispatch({ pageNumber });

      setLoading(true);
      const resp = await api.get(apiRoutes.expenses, {
        ...state,
        pageNumber,
        myCommision: true
      });
      setLoading(false);

      const { count, rows } = resp.data;
      const itemsFormatted = rows.map((e: Expense) => {
        const expense = {
          ...e,
          nameInfoDel: `Despesa ${e.title} do tipo ${e.expenseType?.name}`,
          expenseTypeName: e.expenseType?.name,
          value: formatPrice(Number(e.value) || 0),
          paymentDate: formatDate(e.paymentDate),
          createdAt: formatDateHour(e.createdAt),
          updatedAt: formatDateHour(e.updatedAt),
          paidOut: <BooleanTag value={e.paidOut} />
        };
        return expense;
      });
      setItems(itemsFormatted);
      console.log(itemsFormatted);
      setTotalRecords(count);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div>
      <PanelFilter
        title="Minhas comissões"
        actionButton={() => actionFilter()}
        loading={loading}
      >
        <Col lg={3} md={8} sm={12} xs={24}>
          <Input
            label={'Código'}
            type={'number'}
            placeholder="Ex.: 100"
            value={state.id}
            onChange={(e) => dispatch({ id: e.target.value })}
          />
        </Col>
        <Col lg={5} md={8} sm={12} xs={24}>
          <Select
            label={'Pagas'}
            options={booleanFilter}
            value={state?.paidOut}
            onChange={(paidOut) => dispatch({ paidOut })}
          />
        </Col>

        <Col lg={8} md={24} sm={24} xs={24}>
          <RangePicker
            label="Data de vencimento"
            onChange={(value: any, dateString: any) => {
              dispatch({
                paymentDateStart: dateString[0]?.split('/').reverse().join('-')
              });
              dispatch({
                paymentDateEnd: dateString[1]?.split('/').reverse().join('-')
              });
            }}
          />
        </Col>

        <Col lg={8} md={24} sm={24} xs={24}>
          <RangePicker
            label="Data de cadastro"
            onChange={(value: any, dateString: any) => {
              dispatch({
                createdAtStart: dateString[0]?.split('/').reverse().join('-')
              });
              dispatch({
                createdAtEnd: dateString[1]?.split('/').reverse().join('-')
              });
            }}
          />
        </Col>
      </PanelFilter>
      <GridList
        scroll={{ x: 840 }}
        columns={[
          { title: 'Código', dataIndex: 'id' },
          { title: 'Descrição', dataIndex: 'description' },
          { title: 'Valor', dataIndex: 'value' },
          { title: 'Paga', dataIndex: 'paidOut' },
          {
            title: 'Vencimento',
            dataIndex: 'paymentDate'
          },
          { title: 'Criada em', dataIndex: 'createdAt' }
        ]}
        dataSource={items}
        onPagination={(pageNumber) => actionFilter(pageNumber)}
        onDelete={() => {
          actionFilter(state.pageNumber);
        }}
        propTexObjOndelete={'nameInfoDel'}
        totalRecords={totalRecords}
        pageSize={state.pageSize}
        loading={loading}
        routes={{}}
      />
    </div>
  );
};

export default List;
