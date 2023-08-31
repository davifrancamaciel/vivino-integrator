import React, { useEffect, useState } from 'react';
import { Col, Tag } from 'antd';
import PanelFilter from 'components/PanelFilter';
import GridList from 'components/GridList';
import { Input } from 'components/_inputs';
import {
  apiRoutes,
  appRoutes,
  roules,
  systemColors,
  userType
} from 'utils/defaultValues';
import { initialStateFilter, Users } from '../interfaces';
import useFormState from 'hooks/useFormState';
import api from 'services/api-aws-amplify';
import { formatDateHour } from 'utils/formatDate';
import ShowByRoule from 'components/ShowByRoule';
import BooleanTag from 'components/BooleanTag';

const List: React.FC = () => {
  const { state, dispatch } = useFormState(initialStateFilter);
  const [items, setItems] = useState<Users[]>([]);
  const [loading, setLoading] = useState(false);
  const [path, setPath] = useState(userType.USER);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    setPath(
      window.location.pathname.includes(appRoutes.clients)
        ? userType.CLIENT
        : userType.USER
    );
    actionFilter();
  }, []);

  const actionFilter = async (pageNumber: number = 1) => {
    setLoading(true);
    try {
      const resp = await api.get(apiRoutes.users, {
        ...state,
        pageNumber,
        type: window.location.pathname.includes(appRoutes.clients)
          ? userType.CLIENT
          : userType.USER
      });
      const { count, rows } = resp.data;

      const dataItemsFormatted = rows.map((item: Users) => ({
        ...item,
        active: <BooleanTag value={item.active} />,
        deleteName: `${item.name} da empresa ${item.company?.name}`,
        companyName: item.company?.name,
        createdAt: formatDateHour(item.createdAt),
        updatedAt: formatDateHour(item.updatedAt),
        accessTypeText: accessTypeTags(item.accessTypeText)
      }));
      dispatch({ pageNumber });
      setItems(dataItemsFormatted);
      setLoading(false);
      setTotalRecords(count);
    } catch (error) {
      setLoading(false);
    }
  };

  const accessTypeTags = (accessType?: string) => {
    if (!accessType)
      return (
        <Tag color={systemColors.ORANGE}>Nenhuma permissão foi concedida</Tag>
      );
    if (accessType.includes(',')) {
      const array = accessType.split(',');
      return array.map((item: string) => (
        <Tag style={{ margin: '3px' }} color={systemColors.LIGHT_BLUE}>
          {item}
        </Tag>
      ));
    } else return <Tag color={systemColors.LIGHT_BLUE}>{accessType}</Tag>;
  };
  return (
    <div>
      <PanelFilter
        title={`${
          path === userType.USER ? 'Usuários' : 'Clientes'
        } cadastrados`}
        actionButton={() => actionFilter()}
        loading={loading}
      >
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

        <Col lg={8} md={12} sm={24} xs={24}>
          <Input
            label={'Nome'}
            placeholder="Ex.: Davi"
            value={state.name}
            onChange={(e) => dispatch({ name: e.target.value })}
          />
        </Col>
        <Col lg={8} md={12} sm={24} xs={24}>
          <Input
            label={'Email'}
            placeholder="Ex.: davi@gmail"
            value={state.email}
            onChange={(e) => dispatch({ email: e.target.value })}
          />
        </Col>
      </PanelFilter>
      <GridList
        scroll={{ x: 600 }}
        columns={[
          { title: 'Código', dataIndex: 'id' },
          { title: 'Empresa', dataIndex: 'companyName' },
          { title: 'Nome', dataIndex: 'name' },
          { title: 'Email', dataIndex: 'email' },
          { title: 'Ativo', dataIndex: 'active' },
          { title: 'Criado em', dataIndex: 'createdAt' },
          { title: 'Alterado em', dataIndex: 'updatedAt' }
        ]}
        dataSource={items}
        onPagination={(pageNumber) => actionFilter(pageNumber)}
        onDelete={() => actionFilter(state.pageNumber)}
        propTexObjOndelete={'deleteName'}
        pageSize={state.pageSize}
        totalRecords={totalRecords}
        // hidePagination={true}
        loading={loading}
        routes={{
          routeCreate: `/${path.toLowerCase()}s/create`,
          routeUpdate: `/${path.toLowerCase()}s/edit`,
          routeDelete: `/${appRoutes.users}`
        }}
      />
    </div>
  );
};

export default List;
