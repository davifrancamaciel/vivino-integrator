import React, { useEffect, useState } from 'react';
import { Col, Tag } from 'antd';
import PanelFilter from 'components/PanelFilter';
import GridList from 'components/GridList';
import { Input } from 'components/_inputs';
import { apiRoutes, appRoutes, systemColors } from 'utils/defaultValues';
import { initialStateFilter, MessageGroup } from '../interfaces';
import useFormState from 'hooks/useFormState';
import api from 'services/api-aws-amplify';
import { formatDateHour } from 'utils/formatDate';
import { limitString } from 'utils';
import Import from './Import';

const List: React.FC = () => {
  const { state, dispatch } = useFormState(initialStateFilter);
  const [items, setItems] = useState<MessageGroup[]>([]);
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
      const itemsFormatted = rows.map((g: MessageGroup) => ({
        ...g,
        nameFormatted: limitString(g.name, 20),
        briefingFormatted: limitString(g.briefing, 20),
        objectiveFormatted: limitString(g.objective, 20),
        requesterFormatted: limitString(g.requester || '', 20),
        createdAt: formatDateHour(g.createdAt || ''),
        updatedAt: formatDateHour(g.updatedAt || ''),
        active: (
          <Tag color={g.active ? systemColors.GREEN : systemColors.RED}>
            {g.active ? 'Ativo' : 'Inativo'}
          </Tag>
        )
      }));
      setItems(itemsFormatted);
      setTotalRecords(count);
    } catch (error) {
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
            value={state.id}
            onChange={(e) => dispatch({ id: e.target.value })}
          />
        </Col>
        <Col lg={7} md={12} sm={24} xs={24}>
          <Input
            label={'Nome'}
            placeholder="Ex.: blindagem"
            value={state.name}
            onChange={(e) => dispatch({ name: e.target.value })}
          />
        </Col>
        <Col lg={7} md={12} sm={24} xs={24}>
          <Input
            label={'Briefing'}
            placeholder="Ex.: informar"
            value={state.briefing}
            onChange={(e) => dispatch({ briefing: e.target.value })}
          />
        </Col>
        <Col lg={7} md={12} sm={24} xs={24}>
          <Input
            label={'Objetivo'}
            placeholder="Ex.: comunicar"
            value={state.objective}
            onChange={(e) => dispatch({ objective: e.target.value })}
          />
        </Col>
      </PanelFilter>
      <GridList
        headerChildren={<Import onImportComplete={actionFilter} />}
        scroll={{ x: 840 }}
        columns={[
          { title: 'Código', dataIndex: 'id' },
          { title: 'Nome', dataIndex: 'nameFormatted' },
          { title: 'Solicitante', dataIndex: 'requesterFormatted' },
          { title: 'Briefing', dataIndex: 'briefingFormatted' },
          { title: 'Objetivo', dataIndex: 'objectiveFormatted' },
          { title: 'Status', dataIndex: 'active' },
          { title: 'Criado em', dataIndex: 'createdAt' },
          { title: 'Alterado em', dataIndex: 'updatedAt' }
        ]}
        dataSource={items}
        onPagination={(pageNumber) => actionFilter(pageNumber)}
        onDelete={() => actionFilter(state.pageNumber)}
        propTexObjOndelete={'name'}
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
