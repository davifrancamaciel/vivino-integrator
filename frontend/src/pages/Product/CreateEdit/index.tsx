import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Col, notification } from 'antd';
import { Input, Switch, Textarea } from 'components/_inputs';
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
      const resp = await api.get(`${apiRoutes.products}/${id}`);
      dispatch({ ...resp.data });
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const action = async () => {
    try {
      if (!state.name) {
        notification.warning({
          message: 'Existem campos obrigatórios não preenchidos'
        });
        return;
      }
      setLoading(true);
      const method = type === 'update' ? 'put' : 'post';
      const result = await api[method](apiRoutes.products, state);

      setLoading(false);

      result.success && history.push(`/${appRoutes.products}`);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <PanelCrud
      title={`${type === 'update' ? 'Editar' : 'Novo'} produto`}
      type={type}
      onClickActionButton={action}
      loadingBtnAction={false}
      loadingPanel={loading}
    >
      <Col lg={12} md={24} sm={24} xs={24}>
        <Input
          label={'Nome'}
          required={true}
          placeholder="Insira o Nome do produto"
          value={state.name}
          onChange={(e) => dispatch({ name: e.target.value })}
        />
      </Col>
      <Col lg={12} md={24} sm={24} xs={24}>
        <Input
          label={'Solicitate'}
          maxLength={100}
          placeholder="Insira o nome de quem solicitou o produto"
          value={state.requester}
          onChange={(e) => dispatch({ requester: e.target.value })}
        />
      </Col>
      <Col lg={24} md={24} sm={24} xs={24}>
        <Textarea
          label={'Briefing'}
          placeholder="Insira o Briefing do produto"
          value={state.briefing}
          onChange={(e) => dispatch({ briefing: e.target.value })}
        />
      </Col>
      <Col lg={24} md={24} sm={24} xs={24}>
        <Textarea
          label={'Objetivo'}
          placeholder="Insira o Objetivo do produto"
          value={state.objective}
          onChange={(e) => dispatch({ objective: e.target.value })}
        />
      </Col>

      <Col lg={8} md={8} sm={24} xs={24}>
        <Switch
          label={'Status'}
          title="Inativo / Ativo"
          checked={state.active}
          checkedChildren="Ativo"
          unCheckedChildren="Inativo"
          onChange={() => dispatch({ active: !state.active })}
        />
      </Col>
    </PanelCrud>
  );
};

export default CreateEdit;
