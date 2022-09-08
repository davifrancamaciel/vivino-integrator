import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Col, notification } from 'antd';
import { DatePicker, Input, Select, Switch } from 'components/_inputs';
import PanelCrud from 'components/PanelCrud';
import { apiRoutes, appRoutes } from 'utils/defaultValues';
import useFormState from 'hooks/useFormState';
import { initialStateForm } from '../interfaces';
import api from 'services/api-aws-amplify';

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
      const resp = await api.get(`${apiRoutes.romanians}/${id}`);
      dispatch({ ...resp.data });
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const action = async () => {
    try {
      if (!state.noteNumber || !state.companyId || !state.shippingCompanyId) {
        notification.warning({
          message: 'Existem campos obrigatórios não preenchidos'
        });
        return;
      }
      setLoading(true);
      const method = type === 'update' ? 'put' : 'post';
      const result = await api[method](apiRoutes.romanians, state);

      setLoading(false);

      result.success && history.push(`/${appRoutes.romanians}`);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <PanelCrud
      title={`${type === 'update' ? 'Editar' : 'Novo'} romaneio`}
      type={type}
      onClickActionButton={action}
      loadingBtnAction={false}
      loadingPanel={loading}
    >
      <Col lg={6} md={12} sm={24} xs={24}>
        <Select
          label={'Empresa'}
          url={`${apiRoutes.companies}`}
          value={state.companyId}
          onChange={(companyId) => dispatch({ companyId })}
        />
      </Col>
      <Col lg={6} md={12} sm={24} xs={24}>
        <Input
          label={'Nome do cliente'}
          placeholder="José Almeida"
          value={state.clientName}
          onChange={(e) => dispatch({ clientName: e.target.value })}
        />
      </Col>
      <Col lg={6} md={12} sm={24} xs={24}>
        <Input
          label={'Numero da nota'}
          required={true}
          placeholder=""
          value={state.noteNumber}
          onChange={(e) => dispatch({ noteNumber: e.target.value })}
        />
      </Col>

      <Col lg={6} md={12} sm={24} xs={24}>
        <Input
          label={'Valor da nota'}
          type={'number'}
          placeholder="15.00"
          value={state.noteValue}
          onChange={(e) => dispatch({ noteValue: e.target.value })}
        />
      </Col>

      <Col lg={12} md={12} sm={24} xs={24}>
        <Select
          label={'Transporadora/Entregador'}
          url={`${apiRoutes.shippingCompanies}`}
          value={state.shippingCompanyId}
          onChange={(shippingCompanyId) => dispatch({ shippingCompanyId })}
        />       
      </Col>
      <Col lg={12} md={12} sm={24} xs={24}>
        <Input
          label={'Código/link de rastreamento'}
          placeholder=""
          value={state.trackingCode}
          onChange={(e) => dispatch({ trackingCode: e.target.value })}
        />
      </Col>
      <Col lg={6} md={12} sm={24} xs={24}>
        <Input
          label={'Valor do frete'}
          type={'number'}
          placeholder="15.00"
          value={state.shippingValue}
          onChange={(e) => dispatch({ shippingValue: e.target.value })}
        />
      </Col>
      <Col lg={6} md={12} sm={24} xs={24}>
        <Input
          label={'Volumes'}
          placeholder=""
          value={state.volume}
          onChange={(e) => dispatch({ volume: e.target.value })}
        />
      </Col>
      <Col lg={6} md={12} sm={24} xs={24}>
        <Input
          label={'Forma PGTO'}
          placeholder=""
          value={state.formOfPayment}
          onChange={(e) => dispatch({ formOfPayment: e.target.value })}
        />
      </Col>

      <Col lg={6} md={12} sm={24} xs={24}>
        <Input
          label={'Origem da venda'}
          placeholder="Mercado livre"
          value={state.originSale}
          onChange={(e) => dispatch({ originSale: e.target.value })}
        />
      </Col>
      <Col lg={6} md={12} sm={24} xs={24}>
        <DatePicker
          label={'Data da expedição'}
          value={state.saleDateAt}
          onChange={(saleDateAt) => dispatch({ saleDateAt })}
        />
      </Col>
      <Col lg={6} md={8} sm={24} xs={24}>
        <Switch
          label={'Entregue'}
          title="Não / Sim"
          checked={state.delivered}
          checkedChildren="Sim"
          unCheckedChildren="Não"
          onChange={() => dispatch({ delivered: !state.delivered })}
        />
      </Col>
    </PanelCrud>
  );
};

export default CreateEdit;
