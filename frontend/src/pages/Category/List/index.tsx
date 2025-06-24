import React, { useEffect, useState } from 'react';
import { Col } from 'antd';
import PanelFilter from 'components/PanelFilter';
import GridList from 'components/GridList';
import { Input } from 'components/_inputs';
import { apiRoutes, appRoutes, roules } from 'utils/defaultValues';
import { initialStateFilter, Category } from '../interfaces';
import useFormState from 'hooks/useFormState';
import api from 'services/api-aws-amplify';
import { formatDateHour } from 'utils/formatDate';
import ShowByRoule from 'components/ShowByRoule';
import Action from 'components/Action';

const List: React.FC = () => {
  const { state, dispatch } = useFormState(initialStateFilter);
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    actionFilter();
  }, []);

  const actionFilter = async (pageNumber: number = 1) => {
    try {
      dispatch({ pageNumber });

      setLoading(true);
      const resp = await api.get(apiRoutes.categories, {
        ...state,
        pageNumber
      });
      setLoading(false);

      const { count, rows } = resp.data;
      const itemsFormatted = rows.map((c: Category) => {
        const item = {
          ...c,
          companyName: c.company?.name,
          createdAt: formatDateHour(c.createdAt),
          updatedAt: formatDateHour(c.updatedAt),
          active: (
            <Action
              item={c}
              setUpdate={() => {}}
              apiRoutes={apiRoutes.categories}
            />
          )
        };
        return { ...item };
      });
      setItems(itemsFormatted);
      setTotalRecords(count);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div>
      <PanelFilter
        title="Categorias cadastradas"
        actionButton={() => actionFilter()}
        loading={loading}
      >
        <Col lg={3} md={12} sm={24} xs={24}>
          <Input
            label={'Código'}
            value={state.id}
            onChange={(e) => dispatch({ id: e.target.value })}
          />
        </Col>

        <Col lg={8} md={12} sm={24} xs={24}>
          <Input
            label={'Categoria'}
            placeholder="Lanches"
            value={state.name}
            onChange={(e) => dispatch({ name: e.target.value })}
          />
        </Col>

        <ShowByRoule roule={roules.administrator}>
          <Col lg={8} md={12} sm={24} xs={24}>
            <Input
              label={'Empresa'}
              placeholder="Ex.: Loja"
              value={state.companyName}
              onChange={(e) => dispatch({ companyName: e.target.value })}
            />
          </Col>
        </ShowByRoule>
      </PanelFilter>
      <GridList
        size="small"
        scroll={{ x: 840 }}
        columns={[
          { title: 'Código', dataIndex: 'id' },
          { title: 'Empresa', dataIndex: 'companyName' },
          { title: 'Categoria', dataIndex: 'name' },
          { title: 'Criada em', dataIndex: 'createdAt' },
          { title: 'Alterada em', dataIndex: 'updatedAt' },
          { title: 'Ativa', dataIndex: 'active' }
        ]}
        dataSource={items}
        onPagination={(pageNumber) => actionFilter(pageNumber)}
        onDelete={() => {
          actionFilter(state.pageNumber);
        }}
        propTexObjOndelete={'name'}
        totalRecords={totalRecords}
        pageSize={state.pageSize}
        loading={loading}
        routes={{
          routeCreate: `/${appRoutes.categories}/create`,
          routeUpdate: `/${appRoutes.categories}/edit`,
          routeDelete: `/${appRoutes.categories}`
        }}
      />
    </div>
  );
};

export default List;
