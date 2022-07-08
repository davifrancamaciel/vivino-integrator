import React, { useEffect, useState } from 'react';
import { Col, Tag, Tooltip } from 'antd';
import PanelFilter from 'components/PanelFilter';
import GridList from 'components/GridList';
import { Input } from 'components/_inputs';
import {
  apiRoutes,
  appRoutes,
  enumStatusUserAws,
  systemColors
} from 'utils/defaultValues';
import { initialStateFilter, UserCognito, Users } from '../interfaces';
import useFormState from 'hooks/useFormState';
import api from 'services/api-aws-amplify';
import { mapUser } from '../utils';

const List: React.FC = () => {
  const { state, dispatch } = useFormState(initialStateFilter);
  const [items, setItems] = useState<Users[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    actionFilter();
  }, []);

  const actionFilter = async (pageNumber: number = 1) => {
    setLoading(true);
    try {
      const queryStringParameters = { limit: 60, ...state };
      const resp = await api.get(apiRoutes.users, queryStringParameters);

      const dataItems = resp.data.Users.map((x: UserCognito) => mapUser(x));
      const dataItemsFormatted = dataItems.map((item: Users) => ({
        ...item,
        userStatusText: userStatusTag(item.userStatusText),
        statusText: (
          <Tag color={item.status ? systemColors.GREEN : systemColors.RED}>
            {item.status ? 'Ativo' : 'Inativo'}
          </Tag>
        ),
        accessTypeText: accessTypeTags(item.accessTypeText)
      }));
      dispatch({ pageNumber });
      setItems(dataItemsFormatted);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const userStatusTag = (userStatusText: string) => {
    let color, text, title;
    switch (userStatusText) {
      case enumStatusUserAws.FORCE_CHANGE_PASSWORD:
        color = systemColors.RED;
        text = 'NÃO CONFIRMADO';
        title = 'Quando o usuário nunca efetuou login na aplicação';
        break;
      case enumStatusUserAws.CONFIRMED:
        color = systemColors.GREEN;
        text = 'CONFIRMADO';
        title = 'Quando o usuário efetuou login ao menos uma vez na aplicação';
        break;
      default:
        break;
    }
    return color ? (
      <Tooltip title={title}>
        <Tag color={color}>{text}</Tag>
      </Tooltip>
    ) : undefined;
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
        title="Usuários cadastrados"
        actionButton={() => actionFilter()}
        loading={loading}
      >
        <Col lg={24} md={24} sm={24} xs={24}>
          <Input
            label={'Nome'}
            placeholder="Ex.: Davi"
            value={state.name}
            onChange={(e) => dispatch({ name: e.target.value })}
          />
        </Col>
      </PanelFilter>
      <GridList
        scroll={{ x: 600 }}
        columns={[
          { title: 'Nome', dataIndex: 'name' },
          { title: 'Login', dataIndex: 'login' },
          { title: 'Permissões de acesso', dataIndex: 'accessTypeText' },
          { title: 'Status', dataIndex: 'statusText' },
          { title: 'Status de cadastro', dataIndex: 'userStatusText' }
        ]}
        dataSource={items}
        onPagination={(pageNumber) => actionFilter(pageNumber)}
        onDelete={() => actionFilter(state.pageNumber)}
        propTexObjOndelete={'name'}
        pageSize={state.pageSize}
        totalRecords={items.length}
        hidePagination={true}
        loading={loading}
        routes={{
          routeCreate: `/${appRoutes.users}/create`,
          routeUpdate: `/${appRoutes.users}/edit`,
          routeDelete: `/${appRoutes.users}`
        }}
      />
    </div>
  );
};

export default List;
