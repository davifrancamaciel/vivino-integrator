import React, { useEffect, useState } from 'react';
import { Col, Tag, Image } from 'antd';
import PanelFilter from 'components/PanelFilter';
import GridList from 'components/GridList';
import { Input, Select } from 'components/_inputs';
import {
  apiRoutes,
  appRoutes,
  booleanFilter,
  systemColors
} from 'utils/defaultValues';
import { initialStateFilter, Product } from '../interfaces';
import useFormState from 'hooks/useFormState';
import api from 'services/api-aws-amplify';
import { formatDateHour } from 'utils/formatDate';
import { formatPrice } from 'utils/formatPrice';
import { useQuery } from 'hooks/queryString';

const List: React.FC = () => {
  const query = useQuery();
  const { state, dispatch } = useFormState(initialStateFilter);
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    actionFilter(1, query.get('active') || undefined);
  }, []);

  const actionFilter = async (
    pageNumber: number = 1,
    active: string = state.active
  ) => {
    try {
      dispatch({ pageNumber, active });

      setLoading(true);
      const resp = await api.get(apiRoutes.products, {
        ...state,
        pageNumber,
        active
      });
      setLoading(false);

      const { count, rows } = resp.data;
      const itemsFormatted = rows.map((p: Product) => ({
        ...p,
        image: (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Image style={{ height: '60px' }} src={p.image} />
          </div>
        ),
        price: formatPrice(Number(p.price) || 0),
        createdAt: formatDateHour(p.createdAt),
        updatedAt: formatDateHour(p.updatedAt),
        active: (
          <Tag color={p.active ? systemColors.GREEN : systemColors.RED}>
            {p.active ? 'Ativo' : 'Inativo'}
          </Tag>
        )
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
        title="Produtos cadastrados"
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
            placeholder="Ex.: Famille Perrin Réserve Côtes-du-Rhône 2019 Rouge"
            value={state.productName}
            onChange={(e) => dispatch({ productName: e.target.value })}
          />
        </Col>
        <Col lg={10} md={12} sm={24} xs={24}>
          <Input
            label={'Produtor'}
            placeholder="Ex.: Famille Perrin"
            value={state.producer}
            onChange={(e) => dispatch({ producer: e.target.value })}
          />
        </Col>
        <Col lg={4} md={12} sm={24} xs={24}>
          <Select
            label={'Ativos'}
            options={booleanFilter}
            value={state?.active}
            onChange={(active) => dispatch({ active })}
          />
        </Col>
        <Col lg={10} md={12} sm={24} xs={24}>
          <Input
            label={'Nome do vinho'}
            placeholder="Ex.: Réserve"
            value={state.wineName}
            onChange={(e) => dispatch({ wineName: e.target.value })}
          />
        </Col>
        <Col lg={5} md={6} sm={12} xs={24}>
          <Input
            label={'Preco de'}
            placeholder="Ex.: 1"
            type={'number'}
            value={state.priceMin}
            onChange={(e) => dispatch({ priceMin: e.target.value })}
          />
        </Col>
        <Col lg={5} md={6} sm={12} xs={24}>
          <Input
            label={'Preco até'}
            placeholder="Ex.: 1000"
            type={'number'}
            value={state.priceMax}
            onChange={(e) => dispatch({ priceMax: e.target.value })}
          />
        </Col>
        
      </PanelFilter>
      <GridList
        scroll={{ x: 840 }}
        columns={[
          { title: 'Imagem', dataIndex: 'image' },
          { title: 'Código', dataIndex: 'id' },
          { title: 'Nome do produto', dataIndex: 'productName' },
          { title: 'Preço', dataIndex: 'price' },
          { title: 'Tamanho', dataIndex: 'bottleSize' },
          { title: 'País', dataIndex: 'country' },
          { title: 'Produtor', dataIndex: 'producer' },
          { title: 'Ativo', dataIndex: 'active' },
          { title: 'Criado em', dataIndex: 'createdAt' },
          { title: 'Alterado em', dataIndex: 'updatedAt' }
        ]}
        dataSource={items}
        onPagination={(pageNumber) => actionFilter(pageNumber)}
        onDelete={() => {
          actionFilter(state.pageNumber);
          api.get(`${apiRoutes.products}/run-update-xml`);
        }}
        propTexObjOndelete={'productName'}
        totalRecords={totalRecords}
        pageSize={state.pageSize}
        loading={loading}
        routes={{
          routeCreate: `/${appRoutes.products}/create`,
          routeUpdate: `/${appRoutes.products}/edit`,
          routeView: `/${appRoutes.products}/details`,
          routeDelete: `/${appRoutes.products}`
        }}
      />
    </div>
  );
};

export default List;
