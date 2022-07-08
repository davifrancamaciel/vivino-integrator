import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Col, notification } from 'antd';
import { Input, Switch, InputPassword } from 'components/_inputs';
import PanelCrud from 'components/PanelCrud';
import { apiRoutes, appRoutes } from 'utils/defaultValues';
import useFormState from 'hooks/useFormState';
import { initialStateForm } from '../interfaces';
import api from 'services/api-aws-amplify';
import { mapUser } from '../utils';
import AccessType from './AccessType';

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
      const resp = await api.get(`${apiRoutes.users}/${id}`);
      dispatch({ ...mapUser(resp.data), resetPassword: false });
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const action = async () => {
    try {
      if (!state.email || !state.login) {
        notification.warning({
          message: 'Existem campos obrigatórios não preenchidos'
        });
        return;
      }

      setLoading(true);
      const method = type === 'update' ? 'put' : 'post';
      const result = await api[method](apiRoutes.users, state);

      setLoading(false);

      result.success && history.push(`/${appRoutes.users}`);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <PanelCrud
      title={`${type === 'update' ? 'Editar' : 'Novo'} usuário`}
      type={type}
      onClickActionButton={action}
      loadingBtnAction={loading}
      loadingPanel={false}
    >
      <Col lg={8} md={8} sm={12} xs={24}>
        <Input
          label={'Nome completo'}
          placeholder="Insira o nome completo do usuário"
          value={state.name}
          onChange={(e) => dispatch({ name: e.target.value })}
        />
      </Col>
      <Col lg={8} md={8} sm={12} xs={24}>
        <Input
          label={'Email'}
          required={true}
          disabled={type === 'update'}
          type={'email'}
          placeholder="Digite o email do usuário"
          value={state.email}
          onChange={(e) => dispatch({ email: e.target.value })}
        />
      </Col>
      <Col lg={8} md={8} sm={12} xs={24}>
        <Input
          label={'Login'}
          required={true}
          disabled={type === 'update'}
          placeholder="Defina um login para o usuário"
          value={state.login}
          onChange={(e) => dispatch({ login: e.target.value })}
        />
      </Col>
      <Col lg={8} md={8} sm={12} xs={24}>
        <InputPassword
          disabled={!(type === 'create' || state.resetPassword)}
          label={'Senha'}
          placeholder="Insira uma senha temporária para o usuário"
          value={state.password}
          onChange={(e) => dispatch({ password: e.target.value })}
        />
      </Col>
      {type === 'update' && (
        <Col lg={5} md={8} sm={12} xs={24}>
          <Switch
            label={'Resetar senha'}
            title="Sim / Não"
            checked={state.resetPassword}
            checkedChildren="Sim"
            unCheckedChildren="Não"
            onChange={() => dispatch({ resetPassword: !state.resetPassword })}
          />
        </Col>
      )}
      <Col lg={3} md={8} sm={12} xs={24}>
        <Switch
          label={'Status'}
          title="Inativo / Ativo"
          checked={state.status}
          checkedChildren="Ativo"
          unCheckedChildren="Inativo"
          onChange={() => dispatch({ status: !state.status })}
        />
      </Col>
      <AccessType
        groupsSelecteds={state.accessType}
        setGroupsSelecteds={(accessType: string[]) => dispatch({ accessType })}
      />
    </PanelCrud>
  );
};

export default CreateEdit;
