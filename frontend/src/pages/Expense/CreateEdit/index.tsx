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
import { apiRoutes, appRoutes, roules } from 'utils/defaultValues';
import useFormState from 'hooks/useFormState';
import { initialStateForm } from '../interfaces';
import api from 'services/api-aws-amplify';
import {
  formatValueWhithDecimalCaseOnChange,
  priceToNumber
} from 'utils/formatPrice';

const CreateEdit: React.FC = (props: any) => {
  const history = useHistory();
  const { state, dispatch } = useFormState(initialStateForm);
  const [type, setType] = useState<'create' | 'update'>('create');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    props.match.params.id && get(props.match.params.id);
    props.match.params.id ? setType('update') : setType('create');
  }, [props.match.params.id]); // eslint-disable-line

  const get = async (id: string) => {
    try {
      setLoading(true);
      const resp = await api.get(`${apiRoutes.expenses}/${id}`);
      dispatch({ ...resp.data });
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
        value: priceToNumber(state.value)
      });

      setLoading(false);

      result.success && history.push(`/${appRoutes.expenses}`);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <PanelCrud
      title={`${type === 'update' ? 'Editar' : 'Nova'} despesa`}
      type={type}
      onClickActionButton={action}
      loadingBtnAction={false}
      loadingPanel={loading}
    >
      <ShowByRoule roule={roules.administrator}>
        <Col lg={8} md={8} sm={12} xs={24}>
          <Select
            label={'Empresa'}
            url={`${apiRoutes.companies}/all`}
            value={state.companyId}
            onChange={(companyId) => dispatch({ companyId })}
          />
        </Col>
      </ShowByRoule>
      <Col lg={8} md={8} sm={24} xs={24}>
        <Select
          label={'Tipo'}
          url={`${apiRoutes.expenseTypes}`}
          value={state.expenseTypeId}
          onChange={(expenseTypeId) => dispatch({ expenseTypeId })}
        />
      </Col>

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

      {type === 'create' && (
        <Col lg={6} md={12} sm={12} xs={24}>
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
      <Col lg={6} md={8} sm={12} xs={24}>
        <Switch
          label={'Paga'}
          title="Não / Sim"
          checked={state.paidOut}
          checkedChildren="Sim"
          unCheckedChildren="Não"
          onChange={() => dispatch({ paidOut: !state.paidOut })}
        />
      </Col>
    </PanelCrud>
  );
};

export default CreateEdit;
