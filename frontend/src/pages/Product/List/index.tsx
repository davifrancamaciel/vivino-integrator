import React, { useEffect, useState } from 'react';
import { Col, Tag, Image } from 'antd';
import PanelFilter from 'components/PanelFilter';
import GridList from 'components/GridList';
import { Input } from 'components/_inputs';
import { apiRoutes, appRoutes, systemColors } from 'utils/defaultValues';
import { initialStateFilter, Product } from '../interfaces';
import useFormState from 'hooks/useFormState';
import api from 'services/api-aws-amplify';
import { formatDateHourByNumber } from 'utils/formatDate';
import Import from './Import';

const List: React.FC = () => {
  const { state, dispatch } = useFormState(initialStateFilter);
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    actionFilter();
  }, []);

  const actionFilter = async (pageNumber: number = 1) => {
    try {
      dispatch({ pageNumber });

      setLoading(true);
      const resp = await api.get(apiRoutes.products, {
        ...state,
        pageNumber
      });
      setLoading(false);

      const { count, rows } = resp.data;
      const itemsFormatted = rows.map((p: Product) => ({
        ...p,
        id: p.productId,
        image: (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Image style={{ height: '60px' }} src={p.image} />
          </div>
        ),
        createdAt: formatDateHourByNumber(p.createdAt),
        updatedAt: formatDateHourByNumber(p.updatedAt),
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
        <Col lg={3} md={12} sm={24} xs={24}>
          <Input
            label={'Código'}
            type={'number'}
            placeholder="Ex.: 100"
            value={state.productId}
            onChange={(e) => dispatch({ productId: e.target.value })}
          />
        </Col>
        <Col lg={7} md={12} sm={24} xs={24}>
          <Input
            label={'Nome do produto'}
            placeholder="Ex.: Famille Perrin Réserve Côtes-du-Rhône 2019 Rouge"
            value={state.productName}
            onChange={(e) => dispatch({ productName: e.target.value })}
          />
        </Col>
        <Col lg={7} md={12} sm={24} xs={24}>
          <Input
            label={'Produtor'}
            placeholder="Ex.: Famille Perrin"
            value={state.producer}
            onChange={(e) => dispatch({ producer: e.target.value })}
          />
        </Col>
        <Col lg={7} md={12} sm={24} xs={24}>
          <Input
            label={'Nome do vinho'}
            placeholder="Réserve"
            value={state.wineName}
            onChange={(e) => dispatch({ wineName: e.target.value })}
          />
        </Col>
      </PanelFilter>
      <GridList
        headerChildren={<Import onImportComplete={actionFilter} />}
        scroll={{ x: 840 }}
        columns={[
          { title: 'Imagem', dataIndex: 'image' },
          { title: 'Código', dataIndex: 'productId' },
          { title: 'Nome do produto', dataIndex: 'productName' },
          { title: 'Tamanho', dataIndex: 'bottleSize' },
          { title: 'País', dataIndex: 'country' },
          { title: 'Produtor', dataIndex: 'producer' },
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
