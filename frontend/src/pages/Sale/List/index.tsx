import React, { useEffect, useState } from 'react';
import { Col } from 'antd';
import PanelFilter from 'components/PanelFilter';
import GridList from 'components/GridList';
import { Input, RangePicker, Select } from 'components/_inputs';
import { apiRoutes, appRoutes, booleanFilter } from 'utils/defaultValues';
import { initialStateFilter, Sale } from '../interfaces';
import useFormState from 'hooks/useFormState';
import api from 'services/api-aws-amplify';
import { formatDateHour } from 'utils/formatDate';
import { formatPrice } from 'utils/formatPrice';

const List: React.FC = () => {
  const { state, dispatch } = useFormState(initialStateFilter);
  const [items, setItems] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    actionFilter(1);
  }, []);

  const actionFilter = async (pageNumber: number = 1) => {
    try {
      dispatch({ pageNumber });

      setLoading(true);
      const resp = await api.get(apiRoutes.sales, {
        ...state,
        pageNumber
      });
      setLoading(false);

      const { count, rows } = resp.data;
      const itemsFormatted = rows.map((p: Sale) => ({
        ...p,
        value: formatPrice(Number(p.value) || 0),
        createdAt: formatDateHour(p.createdAt),
        updatedAt: formatDateHour(p.updatedAt)
      }));
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
        title="Vendas cadastradas"
        actionButton={() => actionFilter()}
        loading={loading}
      >
        <Col lg={4} md={12} sm={24} xs={24}>
          <Input
            label={'Código'}
            type={'number'}
            placeholder="Ex.: 100"
            value={state.id}
            onChange={(e) => dispatch({ id: e.target.value })}
          />
        </Col>
        <Col lg={10} md={12} sm={24} xs={24}>
          <Input
            label={'Nome do produto'}
            placeholder="Ex.: Bola"
            value={state.product}
            onChange={(e) => dispatch({ product: e.target.value })}
          />
        </Col>
        <Col lg={10} md={12} sm={24} xs={24}>
          <Input
            label={'Vendedor'}
            placeholder="Ex.: Thamara"
            value={state.userName}
            onChange={(e) => dispatch({ userName: e.target.value })}
          />
        </Col>

        <Col lg={14} md={16} sm={24} xs={24}>
          <RangePicker
            label="Data de venda"
            onChange={(value: any, dateString: any) => {
              dispatch({
                createAtStart: dateString[0]
                  ?.split('/')
                  .reverse()
                  .join('-')
              });
              dispatch({
                createAtEnd: dateString[1]?.split('/').reverse().join('-')
              });
            }}
          />
        </Col>
        <Col lg={5} md={6} sm={12} xs={24}>
          <Input
            label={'Preco de'}
            placeholder="Ex.: 1"
            type={'number'}
            value={state.valueMin}
            onChange={(e) => dispatch({ valueMin: e.target.value })}
          />
        </Col>
        <Col lg={5} md={6} sm={12} xs={24}>
          <Input
            label={'Preco até'}
            placeholder="Ex.: 1000"
            type={'number'}
            value={state.valueMax}
            onChange={(e) => dispatch({ valueMax: e.target.value })}
          />
        </Col>
      </PanelFilter>
      <GridList
        scroll={{ x: 840 }}
        columns={[
          { title: 'Código', dataIndex: 'id' },
          { title: 'Nome do produto', dataIndex: 'product' },
          { title: 'Preço', dataIndex: 'value' },
          { title: 'Vendedor', dataIndex: 'userName' },
          { title: 'Criada em', dataIndex: 'createdAt' },
          { title: 'Alterada em', dataIndex: 'updatedAt' }
        ]}
        dataSource={items}
        onPagination={(pageNumber) => actionFilter(pageNumber)}
        onDelete={() => {
          actionFilter(state.pageNumber);
        }}
        propTexObjOndelete={'product'}
        totalRecords={totalRecords}
        pageSize={state.pageSize}
        loading={loading}
        routes={{
          routeCreate: `/${appRoutes.sales}/create`,
          routeUpdate: `/${appRoutes.sales}/edit`,
          // routeView: `/${appRoutes.sales}/details`,
          routeDelete: `/${appRoutes.sales}`
        }}
      />
    </div>
  );
};

export default List;
