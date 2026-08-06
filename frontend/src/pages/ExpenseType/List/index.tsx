import React, { useEffect, useState } from 'react';
import { Col } from 'antd';
import PanelFilter from 'components/PanelFilter';
import GridList from 'components/GridList';
import { Input } from 'components/_inputs';
import { apiRoutes, appRoutes } from 'utils/defaultValues';
import { initialStateFilter, ExpenseType } from '../interfaces';
import useFormState from 'hooks/useFormState';
import api from 'services/api-aws-amplify';
import { formatDateHour } from 'utils/formatDate';
import Action from 'components/Action';

const List: React.FC = () => {
  const { state, dispatch } = useFormState(initialStateFilter);
  const [items, setItems] = useState<ExpenseType[]>([]);

  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    actionFilter();
  }, []);

  const actionFilter = async (pageNumber: number = 1) => {
    try {
      dispatch({ pageNumber });

      setLoading(true);
      const resp = await api.get(apiRoutes.expenseTypes, {
        ...state,
        pageNumber
      });
      setLoading(false);

      const { count, rows } = resp.data;
      const itemsFormatted = rows.map((item: ExpenseType) => {
        const itemFormatted = {
          ...item,
          nameInfoDel: `Tipo de Despesa ${item.name} descrição ${item.description}`,
          createdAt: formatDateHour(item.createdAt),
          updatedAt: formatDateHour(item.updatedAt),          
          replicateNextMonth: (
            <Action
              item={item}
              setUpdate={() => {}}
              apiRoutes={apiRoutes.expenseTypes}
              propName="replicateNextMonth"
            />
          )
        };
        return itemFormatted;
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
        title={`Tipos de Despesas cadastrados`}
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

        <Col lg={8} md={8} sm={12} xs={24}>
          <Input
            label={'Nome'}
            value={state.name}
            onChange={(e) => dispatch({ name: e.target.value })}
          />
        </Col>

        <Col lg={8} md={8} sm={12} xs={24}>
          <Input
            label={'Descrição'}
            value={state.description}
            onChange={(e) => dispatch({ description: e.target.value })}
          />
        </Col>
      </PanelFilter>

      <GridList
        size="small"
        scroll={{ x: 840 }}
        columns={[
          { title: 'Código', dataIndex: 'id' },
          { title: 'Nome', dataIndex: 'name' },
          { title: 'Descrição', dataIndex: 'description' },
          { title: 'Recorrente', dataIndex: 'replicateNextMonth' },
          { title: 'Criada em', dataIndex: 'createdAt' },
          { title: 'Alterado em', dataIndex: 'updatedAt' }
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
        routes={{
          routeCreate: `/${appRoutes.expenseTypes}/create`,
          routeUpdate: `/${appRoutes.expenseTypes}/edit`,
          routeDelete: `/${appRoutes.expenseTypes}`
        }}
      />
    </div>
  );
};

export default List;
