import React, { useEffect, useState } from 'react';
import { Col, Tag, Image } from 'antd';
import PanelFilter from 'components/PanelFilter';
import GridList from 'components/GridList';
import { Input } from 'components/_inputs';
import { apiRoutes, appRoutes, systemColors } from 'utils/defaultValues';
import { initialStateFilter, Company } from '../interfaces';
import useFormState from 'hooks/useFormState';
import api from 'services/api-aws-amplify';
import { formatDateHour } from 'utils/formatDate';
import Action from 'components/Action';

const List: React.FC = () => {
  const { state, dispatch } = useFormState(initialStateFilter);
  const [items, setItems] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    actionFilter();
  }, []);

  const actionFilter = async (pageNumber: number = 1) => {
    try {
      dispatch({ pageNumber });

      setLoading(true);
      const resp = await api.get(apiRoutes.companies, {
        ...state,
        pageNumber
      });
      setLoading(false);

      const { count, rows } = resp.data;
      const itemsFormatted = rows.map((c: Company) => {
        const item = {
          ...c,
          active: (
            <Action
              item={c}
              setUpdate={() => {}}
              apiRoutes={apiRoutes.companies}
            />
          ),
          accessTypeText: accessTypeTags(c.groupsFormatted),
          createdAt: formatDateHour(c.createdAt),
          updatedAt: formatDateHour(c.updatedAt),
          image: (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Image style={{ height: '60px' }} src={c.image} />
            </div>
          ),
          banner: (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Image style={{ height: '60px' }} src={c.banner} />
            </div>
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

  const accessTypeTags = (accessType?: string[]) => {
    if (!accessType?.length)
      return (
        <Tag color={systemColors.ORANGE}>Nenhuma permissão foi concedida</Tag>
      );
    if (accessType) {
      return accessType.map((item: string) => (
        <Tag style={{ margin: '3px' }} color={systemColors.LIGHT_BLUE}>
          {item}
        </Tag>
      ));
    } else return <Tag color={systemColors.LIGHT_BLUE}>{accessType}</Tag>;
  };

  return (
    <div>
      <PanelFilter
        title="Empresas cadastradas"
        actionButton={() => actionFilter()}
        loading={loading}
      >
        <Col lg={12} md={12} sm={24} xs={24}>
          <Input
            label={'Código'}
            value={state.id}
            onChange={(e) => dispatch({ id: e.target.value })}
          />
        </Col>

        <Col lg={12} md={12} sm={24} xs={24}>
          <Input
            label={'Empresa'}
            placeholder="Vinho Delicatessen"
            value={state.name}
            onChange={(e) => dispatch({ name: e.target.value })}
          />
        </Col>
      </PanelFilter>
      <GridList
        scroll={{ x: 840 }}
        columns={[
          { title: 'Logo', dataIndex: 'image' },
          { title: 'Banner', dataIndex: 'banner' },
          { title: 'Código', dataIndex: 'id' },
          { title: 'Empresa', dataIndex: 'name' },
          { title: 'Permissões', dataIndex: 'accessTypeText' },
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
          routeCreate: `/${appRoutes.companies}/create`,
          routeUpdate: `/${appRoutes.companies}/edit`,
          routeDelete: `/${appRoutes.companies}`
        }}
      />
    </div>
  );
};

export default List;
