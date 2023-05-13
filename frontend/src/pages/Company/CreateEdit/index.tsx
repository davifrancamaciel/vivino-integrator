import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Col, notification } from 'antd';
import { Input, Switch } from 'components/_inputs';
import PanelCrud from 'components/PanelCrud';
import { apiRoutes, appRoutes } from 'utils/defaultValues';
import useFormState from 'hooks/useFormState';
import { initialStateForm } from '../interfaces';
import api from 'services/api-aws-amplify';
import AccessType from 'pages/User/CreateEdit/AccessType';

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
      const resp = await api.get(`${apiRoutes.companies}/${id}`);
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
      const result = await api[method](apiRoutes.companies, state);

      setLoading(false);

      result.success && history.push(`/${appRoutes.companies}`);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <PanelCrud
      title={`${type === 'update' ? 'Editar' : 'Nova'} empresa`}
      type={type}
      onClickActionButton={action}
      loadingBtnAction={false}
      loadingPanel={loading}
    >
      <Col lg={8} md={12} sm={24} xs={24}>
        <Input
          label={'Nome da empresa'}
          required={true}
          value={state.name}
          onChange={(e) => dispatch({ name: e.target.value })}
        />
      </Col>
      <Col lg={8} md={8} sm={12} xs={24}>
        <Input
          label={'Email'}
          required={true}
          type={'email'}
          value={state.email}
          onChange={(e) => dispatch({ email: e.target.value })}
        />
      </Col>
      <Col lg={8} md={8} sm={12} xs={24}>
        <Input
          label={'Telefone'}
          required={true}
          type={'tel'}
          value={state.phone}
          onChange={(e) => dispatch({ phone: e.target.value })}
        />
      </Col>
      <Col lg={3} md={4} sm={24} xs={24}>
        <Switch
          label={'Ativa'}
          title="Não / Sim"
          checked={state.active}
          checkedChildren="Sim"
          unCheckedChildren="Não"
          onChange={() => dispatch({ active: !state.active })}
        />
      </Col>
      <Col lg={12} md={8} sm={24} xs={24}>
        <Switch
          label={'Integação com API de vendas vivino'}
          title="Não / Sim"
          checked={state.vivinoApiIntegrationActive}
          checkedChildren="Sim"
          unCheckedChildren="Não"
          onChange={() =>
            dispatch({
              vivinoApiIntegrationActive: !state.vivinoApiIntegrationActive
            })
          }
        />
      </Col>

      <AccessType
        groupsSelecteds={state.groupsFormatted}
        setGroupsSelecteds={(groupsFormatted: string[]) =>
          dispatch({ groupsFormatted })
        }
      />
    </PanelCrud>
  );
};

export default CreateEdit;
