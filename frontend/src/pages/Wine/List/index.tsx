import React, { useEffect, useState } from 'react';
import { Col, Tag, Image } from 'antd';
import PanelFilter from 'components/PanelFilter';
import GridList from 'components/GridList';
import { Input, Select } from 'components/_inputs';
import {
  apiRoutes,
  appRoutes,
  booleanFilter,
  systemColors,
  pageItemsFilter
} from 'utils/defaultValues';
import { initialStateFilter, Wine } from '../interfaces';
import useFormState from 'hooks/useFormState';
import api from 'services/api-aws-amplify';
import { formatDateHour } from 'utils/formatDate';
import { formatPrice } from 'utils/formatPrice';
import { useQuery } from 'hooks/queryString';
import ExportCSV from './Export';

const List: React.FC = () => {
  const query = useQuery();
  const { state, dispatch } = useFormState(initialStateFilter);
  const [items, setItems] = useState<Wine[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    actionFilter(
      1,
      query.get('active') || undefined,
      query.get('skuVivino') || undefined
    );
  }, []);

  const actionFilter = async (
    pageNumber: number = 1,
    active: string = state.active,
    skuVivino: string = state.skuVivino
  ) => {
    try {
      dispatch({ pageNumber, active, skuVivino });

      setLoading(true);
      const resp = await api.get(apiRoutes.wines, {
        ...state,
        pageNumber,
        active,
        skuVivino
      });
      setLoading(false);

      const { count, rows } = resp.data;
      const itemsFormatted = rows.map((p: Wine) => ({
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
        title="Vinhos cadastrados"
        actionButton={() => actionFilter()}
        loading={loading}
      >
        <Col lg={4} md={5} sm={24} xs={24}>
          <Input
            label={'Código'}
            type={'number'}
            placeholder="Ex.: 100"
            value={state.id}
            onChange={(e) => dispatch({ id: e.target.value })}
          />
        </Col>
        <Col lg={4} md={5} sm={24} xs={24}>
          <Input
            label={'SKU Vivino'}
            placeholder="VD-XXXXXXXXX"
            value={state.skuVivino}
            onChange={(e) => dispatch({ skuVivino: e.target.value })}
          />
        </Col>
        <Col lg={6} md={8} sm={24} xs={24}>
          <Input
            label={'Nome do produto'}
            placeholder="Ex.: Famille Perrin Réserve Côtes-du-Rhône 2019 Rouge"
            value={state.productName}
            onChange={(e) => dispatch({ productName: e.target.value })}
          />
        </Col>
        <Col lg={5} md={6} sm={24} xs={24}>
          <Input
            label={'Produtor'}
            placeholder="Ex.: Famille Perrin"
            value={state.producer}
            onChange={(e) => dispatch({ producer: e.target.value })}
          />
        </Col>
        <Col lg={5} md={6} sm={24} xs={24}>
          <Input
            label={'Nome do vinho'}
            placeholder="Ex.: Réserve"
            value={state.wineName}
            onChange={(e) => dispatch({ wineName: e.target.value })}
          />
        </Col>

        <Col lg={4} md={6} sm={12} xs={24}>
          <Input
            label={'Preco de'}
            placeholder="Ex.: 1"
            type={'number'}
            value={state.priceMin}
            onChange={(e) => dispatch({ priceMin: e.target.value })}
          />
        </Col>
        <Col lg={4} md={6} sm={12} xs={24}>
          <Input
            label={'Preco até'}
            placeholder="Ex.: 1000"
            type={'number'}
            value={state.priceMax}
            onChange={(e) => dispatch({ priceMax: e.target.value })}
          />
        </Col>
        <Col lg={5} md={6} sm={12} xs={24}>
          <Input
            label={'Estoque de'}
            placeholder="Ex.: 1"
            type={'number'}
            value={state.inventoryCountMin}
            onChange={(e) => dispatch({ inventoryCountMin: e.target.value })}
          />
        </Col>
        <Col lg={5} md={6} sm={12} xs={24}>
          <Input
            label={'Estoque até'}
            placeholder="Ex.: 1000"
            type={'number'}
            value={state.inventoryCountMax}
            onChange={(e) => dispatch({ inventoryCountMax: e.target.value })}
          />
        </Col>
        <Col lg={3} md={6} sm={12} xs={24}>
          <Select
            label={'Ativos'}
            options={booleanFilter}
            value={state?.active}
            onChange={(active) => dispatch({ active })}
          />
        </Col>
        <Col lg={3} md={12} sm={12} xs={24}>
          <Select
            label={'Itens por página'}
            options={pageItemsFilter}
            value={state?.pageSize}
            onChange={(pageSize) => dispatch({ pageSize })}
          />
        </Col>
      </PanelFilter>
      <GridList
        scroll={{ x: 840 }}
        headerChildren={<ExportCSV {...state} />}
        columns={[
          { title: 'Imagem', dataIndex: 'image' },
          { title: 'Código', dataIndex: 'id' },
          { title: 'Nome do vinho', dataIndex: 'productName' },
          { title: 'Preço', dataIndex: 'price' },
          { title: 'Tamanho', dataIndex: 'bottleSize' },
          { title: 'País', dataIndex: 'country' },
          {
            title: 'Contagem de inventário (estoque)',
            dataIndex: 'inventoryCount'
          },
          { title: 'Ativo', dataIndex: 'active' },
          { title: 'Criado em', dataIndex: 'createdAt' },
          { title: 'Alterado em', dataIndex: 'updatedAt' }
        ]}
        dataSource={items}
        onPagination={(pageNumber) => actionFilter(pageNumber)}
        onDelete={() => actionFilter(state.pageNumber)}
        propTexObjOndelete={'productName'}
        totalRecords={totalRecords}
        pageSize={state.pageSize}
        loading={loading}
        routes={{
          routeCreate: `/${appRoutes.wines}/create`,
          routeUpdate: `/${appRoutes.wines}/edit`,
          routeView: `/${appRoutes.wines}/details`,
          routeDelete: `/${appRoutes.wines}`
        }}
      />
    </div>
  );
};

export default List;
