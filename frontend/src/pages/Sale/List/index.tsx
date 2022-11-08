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
import { Product } from '../CreateEdit/Products/interfaces';
import PrintAll from './PrintAll';
import Print from './Print';

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
      const itemsFormatted = rows.map((p: any) => {
        const sale = {
          ...p,
          valueFormatted: formatPrice(Number(p.value!)),
          products: p.productsFormatted,
          productsFormatted: formatProductName(p.products),
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

  const formatProductName = (products: any) => {
    const productsArray: Product[] = JSON.parse(products);
    return `${productsArray
      .map((p: Product) => p.name)
      .join(', ')
      .slice(0, 20)}...`;
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