import React, { useEffect, useState } from 'react';
import { startOfMonth, endOfMonth } from 'date-fns';

import moment from 'moment';
import { Col, TableProps, Tooltip } from 'antd';
import PanelFilter from 'components/PanelFilter';
import GridList from 'components/GridList';
import { Input, RangePicker, Select, SelectMultiple } from 'components/_inputs';
import {
  apiRoutes,
  appRoutes,
  booleanFilter,
  expensesTypesEnum,
  roules
} from 'utils/defaultValues';
import {
  initialStateFilter,
  Expense,
  CardsResult,
  initialStateCards,
  DataType
} from '../interfaces';
import useFormState from 'hooks/useFormState';
import api from 'services/api-aws-amplify';
import { formatDate, formatDateHour } from 'utils/formatDate';

import Action from 'components/Action';
import GridEditText from 'components/GridEditText';
import GridEditSelect from 'components/GridEditSelect';
import { getTitle, getType } from '../utils';
import ShowByRoule from 'components/ShowByRoule';
import { useAppContext } from 'hooks/contextLib';
import Cards from './Cards';
import FastFilter from 'components/FastFilter';
import Actions from './Actions';
import { createQueryString } from 'utils';
import { useHistory } from 'react-router-dom';
import { useQuery } from 'hooks/queryString';
import { IOptions } from 'utils/commonInterfaces';

const List: React.FC = () => {
  const { companies } = useAppContext();
  const { state, dispatch } = useFormState(initialStateFilter);
  const [items, setItems] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [dataTotal, setDataTotal] = useState<CardsResult>(initialStateCards);
  const [path, setPath] = useState(apiRoutes.expenses);
  const [selectedRowKeysLoad, setSelectedRowKeysLoad] = useState<number[]>([]);
  const [expenseTypes, setExpenseTypes] = useState<IOptions[]>([]);
  const [selectedItems, setSelectedItems] = useState<Expense[]>([]);
  const history = useHistory();
  const query = useQuery();

  useEffect(() => {
    let date = new Date();

    if (query.get('_date')) date = new Date(query.get('_date') || new Date());

    const paymentDateStart = startOfMonth(date).toISOString();
    const paymentDateEnd = endOfMonth(date).toISOString();

    const newState = {
      ...state,
      paymentDateStart: query.get('paymentDateStart') || paymentDateStart,
      paymentDateEnd: query.get('paymentDateEnd') || paymentDateEnd,
      title: query.get('title') || state.title,
      paidOut: query.get('paidOut') || state.paidOut,
      userName: query.get('userName') || state.userName,
      companyId: query.get('companyId') || state.companyId,
      expenseTypeId: query.getAll('expenseTypeId') || state.expenseTypeId,
      setDate: 'false'
    };

    actionFilter(newState);
    setPath(getType());
  }, []);

  useEffect(() => {
    if (state.date && state.setDate === 'false') {
      const paymentDateStart = startOfMonth(state.date).toISOString();
      const paymentDateEnd = endOfMonth(state.date).toISOString();

      actionFilter({
        ...state,
        pageNumber: 1,
        paymentDateStart,
        paymentDateEnd
      });
    }
  }, [state.date, state?.companyId]);

  const actionFilter = async (state: any) => {
    try {
      setLoading(true);
      const type = getType();

      let expenseTypes: IOptions[] = [];
      if (state.setDate === 'false') expenseTypes = await onLoad(type);
      let newState = state;
      if (state.expenseTypeId)
        newState.expenseTypeId = state.expenseTypeId.map((x: string) =>
          Number(x.toString().replace(',', ''))
        );     

      setHistoryPath(type, newState);
      dispatch(newState);
      const resp = await api.get(apiRoutes.expenses, newState);
      setLoading(false);

      const { count, rows, data } = resp.data;
      const itemsFormatted = rows.map((e: Expense) => {
        const expense = {
          ...e,
          title: (
            <GridEditText
              type={'text'}
              item={e}
              setLoading={setLoading}
              setUpdate={() => {}}
              apiRoutes={apiRoutes.expenses}
              propName="title"
            />
          ),
          nameInfoDel: `${getTitle(path)} ${e.title} do tipo ${
            e.expenseType?.name
          }`,
          expenseTypeName: (
            <Tooltip title={e.expenseType?.description}>
              <GridEditSelect
                item={e}
                setLoading={setLoading}
                setUpdate={() => {}}
                apiRoutes={apiRoutes.expenses}
                propName="expenseTypeId"
                options={expenseTypes}
              />
            </Tooltip>
          ),
          companyName: e.company?.name,
          value: (
            <GridEditText
              type={'number'}
              item={e}
              setLoading={setLoading}
              setUpdate={() => {}}
              apiRoutes={apiRoutes.expenses}
              propName="value"
            />
          ),
          paymentDate: formatDate(e.paymentDate),
          createdAt: formatDateHour(e.createdAt),
          updatedAt: formatDateHour(e.updatedAt),
          paidOut: (
            <Action
              item={e}
              setUpdate={() => {}}
              apiRoutes={apiRoutes.expenses}
              propName="paidOut"
            />
          ),
          replicateNextMonth: e.expenseType?.replicateNextMonth && (
            <Action
              item={e}
              setUpdate={() => {}}
              apiRoutes={apiRoutes.expenses}
              propName="replicateNextMonth"
            />
          )
        };
        return expense;
      });
      setItems(itemsFormatted);
      setTotalRecords(count);
      state.pageNumber === 1 && setDataTotal(data);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleTableChange: TableProps<DataType>['onChange'] = (
    pagination,
    filters,
    sorter
  ) => {
    const sortOrder = Array.isArray(sorter) ? undefined : sorter.order;
    const field = Array.isArray(sorter) ? undefined : sorter.field;
    const order = sortOrder === 'ascend' ? 'asc' : 'desc';
    const newState = {
      ...state,
      pageNumber: 1,
      field: field?.toString(),
      order
    };
    actionFilter(newState);
  };

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: Expense[]) => {
      setSelectedItems(selectedRows);
    }
    // selectedRowKeys: selectedRowKeysLoad
  };

  const setHistoryPath = (path: string, state: any) => {
    history.push({
      pathname: `/${path}`,
      search: createQueryString(state)
    });
  };

  const onLoad = async (typePath: string) => {
    if (typePath == appRoutes.expenses) {
      const respEpensesTypes = await api.get(`${apiRoutes.expenseTypes}/all`);
      setExpenseTypes(respEpensesTypes.data);
      return respEpensesTypes.data;
    }
  };

  const getColls = () => {
    const path = getType();
    let colls: Array<any> = [];

    colls.push({ title: 'Empresa', dataIndex: 'companyName' });
    if (path == appRoutes.expenses)
      colls.push({ title: 'Tipo', dataIndex: 'expenseTypeName', sorter: true });
    colls.push({ title: 'Dia', dataIndex: 'paymentDate', sorter: true });
    colls.push({ title: 'Titulo', dataIndex: 'title', sorter: true });
    colls.push({ title: 'Valor', dataIndex: 'value', sorter: true });
    colls.push({ title: 'Paga', dataIndex: 'paidOut' });
    colls.push({ title: 'Recorrente', dataIndex: 'replicateNextMonth' });
    return colls;
  };

  return (
    <div>
      <FastFilter state={state} setState={dispatch} />
      <div style={{ marginBottom: '15px' }}>
        <Cards dataTotal={dataTotal} loading={loading} />
      </div>

      <PanelFilter
        title={`${getTitle(path, true)} cadastrados`}
        actionButton={() => actionFilter(state)}
        loading={loading}
      >
        <Col lg={6} md={24} sm={24} xs={24}>
          <RangePicker
            label="Data de vencimento"
            value={[
              state.paymentDateStart ? moment(state.paymentDateStart) : null,
              state.paymentDateEnd ? moment(state.paymentDateEnd) : null
            ]}
            onChange={(value: any, dateString: any) => {
              dispatch({
                paymentDateStart: dateString[0]?.split('/').reverse().join('-')
              });
              dispatch({
                paymentDateEnd: dateString[1]?.split('/').reverse().join('-')
              });
            }}
          />
        </Col>
        <Col lg={6} md={12} sm={12} xs={24}>
          <Select
            label={'Pagas'}
            options={booleanFilter}
            value={state?.paidOut}
            onChange={(paidOut) => dispatch({ paidOut })}
          />
        </Col>
        {path == appRoutes.expenses && (
          <Col lg={12} md={12} sm={12} xs={24}>
            <SelectMultiple
              label={'Tipo'}
              options={expenseTypes}
              value={state.expenseTypeId}
              onChange={(expenseTypeId) => {
                dispatch({ expenseTypeId });
                console.log(expenseTypeId);
              }}
            />
          </Col>
        )}

        <Col lg={6} md={12} sm={12} xs={24}>
          <Input
            label={'Titulo'}
            value={state.title}
            onChange={(e) => dispatch({ title: e.target.value })}
          />
        </Col>

        <Col lg={6} md={12} sm={12} xs={24}>
          <Input
            label={path == appRoutes.expenses ? 'Consultor' : 'Fornecedor'}
            value={state.userName}
            onChange={(e) => dispatch({ userName: e.target.value })}
          />
        </Col>
        {path == appRoutes.expenses && (
          <Col lg={6} md={12} sm={12} xs={24}>
            <Input
              label={'Veiculo'}
              value={state.vehicleModel}
              onChange={(e) => dispatch({ vehicleModel: e.target.value })}
            />
          </Col>
        )}

        <ShowByRoule roule={roules.administrator}>
          <Col lg={6} md={12} sm={12} xs={24}>
            <Select
              label={'Empresa'}
              options={companies}
              value={state.companyId}
              onChange={(companyId) => dispatch({ companyId })}
            />
          </Col>
        </ShowByRoule>
      </PanelFilter>

      <GridList
        headerChildren={
          <Actions
            state={state}
            title={getTitle(path, true)}
            selectedItems={selectedItems}
            onComplete={() => actionFilter}
          />
        }
        size="small"
        scroll={{ x: 640 }}
        rowSelection={{
          type: 'checkbox',
          ...rowSelection
        }}
        columns={getColls()}
        dataSource={items}
        onPagination={(pageNumber) => actionFilter({ ...state, pageNumber })}
        onDelete={() => {
          actionFilter(state);
        }}
        propTexObjOndelete={'nameInfoDel'}
        totalRecords={totalRecords}
        pageSize={state.pageSize}
        loading={loading}
        routes={{
          routeCreate: `/${path.toLowerCase()}/create`,
          routeUpdate: `/${path.toLowerCase()}/edit`,
          routeDelete: `/${appRoutes.expenses}`
        }}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default List;
