import React, { useEffect, useState } from 'react';
import { Col } from 'antd';
import { startOfMonth, endOfMonth } from 'date-fns';

import PanelFilter from 'components/PanelFilter';
import GridList from 'components/GridList';
import { Input, RangePicker } from 'components/_inputs';
import { apiRoutes, appRoutes } from 'utils/defaultValues';
import { initialStateFilter, Sale, SaleProduct } from '../interfaces';
import useFormState from 'hooks/useFormState';
import api from 'services/api-aws-amplify';
import { formatDateHour } from 'utils/formatDate';
import { formatPrice } from 'utils/formatPrice';
import { Product } from '../CreateEdit/Products/interfaces';
import PrintAll from './PrintAll';
import Print from './Print';
import moment from 'moment';

const List: React.FC = () => {
  const { state, dispatch } = useFormState(initialStateFilter);
  const [items, setItems] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    const date = new Date();
    const createdAtStart = startOfMonth(date).toISOString();
    const createdAtEnd = endOfMonth(date).toISOString();
    actionFilter(1, createdAtStart, createdAtEnd);
  }, []);

  const actionFilter = async (
    pageNumber: number = 1,
    createdAtStart = state.createdAtStart,
    createdAtEnd = state.createdAtEnd
  ) => {
    try {
      dispatch({ ...state, pageNumber, createdAtStart, createdAtEnd });

      setLoading(true);
      const resp = await api.get(apiRoutes.sales, {
        ...state,
        pageNumber,
        createdAtStart,
        createdAtEnd
      });
      setLoading(false);

      const { count, rows } = resp.data;
      const itemsFormatted = rows.map((p: Sale) => {
        const sale = {
          ...p,
          userName: p.user!.name,
          valueFormatted: formatPrice(Number(p.value!)),
          productsFormatted: formatProductName(p.productsSales),
          createdAt: formatDateHour(p.createdAt),
          updatedAt: formatDateHour(p.updatedAt)
        };
        return { ...sale, print: <Print sale={sale} /> };
      });
      setItems(itemsFormatted);
      console.log(itemsFormatted);
      setTotalRecords(count);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const formatProductName = (productsArray: SaleProduct[]) => {
    const limit = 50;
    let products = productsArray
      .map((p: SaleProduct) => p.product.name)
      .join(', ');
    return products.length > limit
      ? `${products.slice(0, limit)}...`
      : products;
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
            label={'Produto'}
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
            value={[
              state.createdAtStart ? moment(state.createdAtStart) : null,
              state.createdAtEnd ? moment(state.createdAtEnd) : null
            ]}
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
        <Col lg={5} md={6} sm={12} xs={24}>
          <Input
            label={'Valor de'}
            placeholder="Ex.: 1"
            type={'number'}
            value={state.valueMin}
            onChange={(e) => dispatch({ valueMin: e.target.value })}
          />
        </Col>
        <Col lg={5} md={6} sm={12} xs={24}>
          <Input
            label={'Valor até'}
            placeholder="Ex.: 1000"
            type={'number'}
            value={state.valueMax}
            onChange={(e) => dispatch({ valueMax: e.target.value })}
          />
        </Col>
      </PanelFilter>
      <GridList
        headerChildren={<PrintAll state={state} />}
        scroll={{ x: 840 }}
        columns={[
          { title: 'Código', dataIndex: 'id' },
          { title: 'Produtos', dataIndex: 'productsFormatted' },
          { title: 'Valor', dataIndex: 'valueFormatted' },
          { title: 'Vendedor', dataIndex: 'userName' },
          { title: 'Criada em', dataIndex: 'createdAt' },
          { title: 'Alterada em', dataIndex: 'updatedAt' },
          { title: '', dataIndex: 'print' }
        ]}
        dataSource={items}
        onPagination={(pageNumber) => actionFilter(pageNumber)}
        onDelete={() => {
          actionFilter(state.pageNumber);
        }}
        propTexObjOndelete={'productsFormatted'}
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
