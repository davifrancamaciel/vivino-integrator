import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Col, notification } from 'antd';
import {
  DatePicker,
  Input,
  Select,
  Switch,
  Textarea
} from 'components/_inputs';
import PanelCrud from 'components/PanelCrud';
import ShowByRoule from 'components/ShowByRoule';
import {
  apiRoutes,
  appRoutes,
  expensesTypesEnum,
  roules,
  userType
} from 'utils/defaultValues';
import useFormState from 'hooks/useFormState';
import { initialStateForm } from '../interfaces';
import api from 'services/api-aws-amplify';
import {
  formatValueWhithDecimalCaseOnChange,
  priceToNumber
} from 'utils/formatPrice';
import { getTitle, getType, paymentMethods } from '../utils';
import { IOptions } from 'utils/commonInterfaces';
import { useAppContext } from 'hooks/contextLib';
import { Users } from 'pages/User/interfaces';

const CreateEdit: React.FC = (props: any) => {
  const history = useHistory();
  const { companies } = useAppContext();
  const { state, dispatch } = useFormState(initialStateForm);
  const [type, setType] = useState<'create' | 'update'>('create');
  const [loading, setLoading] = useState(false);
  const [path, setPath] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [usersOptions, setUsersOptions] = useState<IOptions[]>();
  const [expenseTypes, setExpenseTypes] = useState<any[]>([]);
  const [vehiclesOptions, setVehiclesOptions] = useState<IOptions[]>([]);
  const arrayTypeExpensesRequiredUser = [expensesTypesEnum.PAGAMENTO_COMISSAO];
  const arrayTypeExpensesRequiredVehicle = [1000];

  useEffect(() => {
    const typePath = getType();
    setPath(typePath);
    onLoad(typePath);
    props.match.params.id && get(props.match.params.id);
    props.match.params.id ? setType('update') : setType('create');
  }, [props.match.params.id]); // eslint-disable-line

  useEffect(() => {
    const filtered = users?.filter(
      (u: Users) => u.companyId === state.companyId
    );
    setUsersOptions(filtered);
  }, [state.companyId]);

  const get = async (id: string) => {
    try {
      setLoading(true);
      const resp = await api.get(`${apiRoutes.expenses}/${id}`);
      dispatch({
        ...resp.data,
        value: formatValueWhithDecimalCaseOnChange(resp.data?.value),
        amount: formatValueWhithDecimalCaseOnChange(resp.data?.amount)
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  const onLoad = async (typePath: string) => {
    try {
      setLoading(true);
      const respUser = await api.get(`${apiRoutes.users}/all`, {
        type: userType.USER
      });
      setUsers(respUser.data);

      if (typePath == appRoutes.expenses) {
        const respEpensesTypes = await api.get(`${apiRoutes.expenseTypes}/all`);
        setExpenseTypes(respEpensesTypes.data);
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const action = async () => {
    try {
      if (!state.value || !state.expenseTypeId) {
        notification.warning({
          message: 'Existem campos obrigatórios não preenchidos'
        });
        return;
      }
      setLoading(true);
      const method = type === 'update' ? 'put' : 'post';
      const result = await api[method](apiRoutes.expenses, {
        ...state,
        value: priceToNumber(state.value),
        amount: priceToNumber(state.amount),
        userId: arrayTypeExpensesRequiredUser.includes(state.expenseTypeId)
          ? state.userId
          : null,
        vehicleId: arrayTypeExpensesRequiredVehicle.includes(
          state.expenseTypeId
        )
          ? state.vehicleId
          : null,
        replicateNextMonth: checkAvailableType()
          ? state.replicateNextMonth
          : false
      });

      setLoading(false);
      if (result.success) {
        if (type === 'update') history.goBack();
        else
          dispatch({
            ...initialStateForm,
            title: '',
            description: '',
            // supplierId: null,
            // vehicleId: null,
            dividedIn: 1,
            value: 0,
            userId: null,
            paidOut: false
          });
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const checkAvailableType = () => {
    const type = expenseTypes?.find((e) => e.value === state.expenseTypeId);
    return type ? type?.replicateNextMonth : false;
  };
  return (
    <PanelCrud
      title={`${type === 'update' ? 'Editar' : 'Novo'} ${getTitle(
        path
      ).toLocaleLowerCase()}`}
      type={type}
      onClickActionButton={action}
      loadingBtnAction={false}
      loadingPanel={loading}
    >
      <Col lg={24} md={24} sm={24} xs={24}>
        <Input
          label={'Título'}
          value={state.title}
          onChange={(e) => dispatch({ title: e.target.value })}
        />
      </Col>
      <Col lg={24} md={24} sm={24} xs={24}>
        <Textarea
          label={'Descrição'}
          value={state.description}
          onChange={(e) => dispatch({ description: e.target.value })}
        />
      </Col>
      <ShowByRoule roule={roules.administrator}>
        <Col lg={8} md={8} sm={12} xs={24}>
          <Select
            label={'Empresa'}
            options={companies}
            value={state.companyId}
            onChange={(companyId) => dispatch({ companyId })}
          />
        </Col>
      </ShowByRoule>

      <Col lg={8} md={8} sm={12} xs={24}>
        <Input
          label={'Valor'}
          type={'tel'}
          required={true}
          placeholder="15,00"
          value={state.value}
          onChange={(e) =>
            dispatch({
              value: formatValueWhithDecimalCaseOnChange(e.target.value)
            })
          }
        />
      </Col>

      <Col lg={8} md={8} sm={12} xs={24}>
        <DatePicker
          label={'Data de pagamento'}
          value={state.paymentDate}
          onChange={(paymentDate) => dispatch({ paymentDate })}
        />
      </Col>

      {path == appRoutes.expenses && (
        <>
          <Col lg={8} md={8} sm={24} xs={24}>
            <Select
              label={'Tipo'}
              options={expenseTypes}
              value={state.expenseTypeId}
              onChange={(expenseTypeId) => dispatch({ expenseTypeId })}
            />
          </Col>
          {arrayTypeExpensesRequiredUser.includes(state.expenseTypeId) && (
            <Col lg={8} md={8} sm={24} xs={24}>
              <Select
                label={'Usuario'}
                options={usersOptions?.filter(
                  (u: any) => u.type === userType.USER
                )}
                value={state.userId}
                onChange={(userId) => dispatch({ userId })}
              />
            </Col>
          )}
          {arrayTypeExpensesRequiredVehicle.includes(state.expenseTypeId) && (
            <Col lg={8} md={8} sm={24} xs={24}>
              <Select
                label={'Veiculo'}
                options={vehiclesOptions}
                value={state.vehicleId}
                onChange={(vehicleId) => dispatch({ vehicleId })}
              />
            </Col>
          )}
        </>
      )}

      {type === 'create' && (
        <Col lg={5} md={12} sm={12} xs={24}>
          <Input
            label={'Dividido em'}
            required={true}
            type={'number'}
            placeholder=""
            value={state.dividedIn}
            onChange={(e) => dispatch({ dividedIn: e.target.value })}
          />
        </Col>
      )}
      <Col lg={3} md={8} sm={12} xs={24}>
        <Switch
          label={'Paga'}
          title="Não / Sim"
          checked={state.paidOut}
          checkedChildren="Sim"
          unCheckedChildren="Não"
          onChange={() => dispatch({ paidOut: !state.paidOut })}
        />
      </Col>
      {checkAvailableType() && (
        <Col lg={6} md={8} sm={12} xs={24}>
          <Switch
            label={'Recorrente - Replicar próx. mês'}
            title="Não / Sim"
            checked={state.replicateNextMonth}
            checkedChildren="Sim"
            unCheckedChildren="Não"
            onChange={() =>
              dispatch({ replicateNextMonth: !state.replicateNextMonth })
            }
          />
        </Col>
      )}
    </PanelCrud>
  );
};

export default CreateEdit;
