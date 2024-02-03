import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Col, Tag, Image } from 'antd';
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
import { initialStateFilter, Users, WineSaleUser } from '../interfaces';
import useFormState from 'hooks/useFormState';
import api from 'services/api-aws-amplify';
import { formatDateHour } from 'utils/formatDate';
import ShowByRoule from 'components/ShowByRoule';
import BooleanTag from 'components/BooleanTag';
import { useAppContext } from 'hooks/contextLib';
import { checkRouleProfileAccess } from 'utils/checkRouleProfileAccess';
import ExportCSV from './Export';
import { useQuery } from 'hooks/queryString';
import WhatsApp from 'components/WhatsApp';

const List: React.FC = () => {
  const query = useQuery();
  const { userAuthenticated } = useAppContext();
  const { state, dispatch } = useFormState(initialStateFilter);
  const [items, setItems] = useState<Users[]>([]);
  const [loading, setLoading] = useState(false);
  const [path, setPath] = useState(userType.USER);
  const [totalRecords, setTotalRecords] = useState(0);
  const [groups, setGroups] = useState<string[]>([]);

  useEffect(() => {
    const { signInUserSession } = userAuthenticated;
    setGroups(signInUserSession.accessToken.payload['cognito:groups']);
    setPath(
      window.location.pathname.includes(appRoutes.clients)
        ? userType.CLIENT
        : userType.USER
    );
    actionFilter(1, query.get('email') || undefined);
  }, []);

  const actionFilter = async (
    pageNumber: number = 1,
    email: string = state.email
  ) => {
    setLoading(true);
    dispatch({ pageNumber, email });
    try {
      const resp = await api.get(apiRoutes.users, {
        ...state,
        pageNumber,
        email,
        type: window.location.pathname.includes(appRoutes.clients)
          ? userType.CLIENT
          : userType.USER
      });
      const { count, rows } = resp.data;

      const dataItemsFormatted = rows.map((item: Users) => ({
        ...item,
        image: (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Image style={{ height: '60px' }} src={item.image} />
          </div>
        ),
        email: item.wineSaleUsers?.length ? (
          <Link to={`/wines/sales?sale=${item.email}`}>{item.email}</Link>
        ) : (
          item.email
        ),
        name: item.wineSaleUsers?.length ? (
          <Link to={`/wines/sales?sale=${item.name}`}>{item.name}</Link>
        ) : (
          item.name
        ),
        phone: <WhatsApp phone={item.phone} />,
        active: <BooleanTag value={item.active} />,
        deleteName: `${item.name} da empresa ${item.company?.name}`,
        companyName: item.company?.name,
        createdAt: formatDateHour(item.createdAt),
        updatedAt: formatDateHour(item.updatedAt),
        expandable: item.wineSaleUsers?.length ? (
          <div>
            <p>Clique no código para ver a venda</p>
            {salesTags(item.wineSaleUsers)}
          </div>
        ) : undefined
      }));
      dispatch({ pageNumber });
      setItems(dataItemsFormatted);
      setLoading(false);
      setTotalRecords(count);
    } catch (error) {
      setLoading(false);
    }
  };

  const salesTags = (wineSaleUsers?: WineSaleUser[]) => {
    if (wineSaleUsers) {
      return wineSaleUsers.map((item: WineSaleUser) => (
        <Link to={`/wines/sales?code=${item.code}`} target={'_blank'}>
          <Tag style={{ margin: '3px' }} color={systemColors.LIGHT_BLUE}>
            {item.code}
          </Tag>
        </Link>
      ));
    }
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
        headerChildren={<ExportCSV {...state} />}
        columns={[
          { title: 'Imagem', dataIndex: 'image' },
          { title: 'Código', dataIndex: 'id' },
          { title: 'Nome', dataIndex: 'name' },
          { title: 'Email', dataIndex: 'email' },
          {
            title: checkRouleProfileAccess(groups, roules.administrator)
              ? 'Empresa'
              : 'Telefone',
            dataIndex: checkRouleProfileAccess(groups, roules.administrator)
              ? 'companyName'
              : 'phone'
          },
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
