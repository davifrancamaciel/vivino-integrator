import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Col, notification, Row } from 'antd';
import { Input, Switch } from 'components/_inputs';
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
      const resp = await api.get(`${apiRoutes.expenseTypes}/${id}`);
      dispatch(resp.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const action = async () => {
    try {
      if (!state.name) {
        notification.warning({
          message: 'O campo Nome é obrigatório'
        });
        return;
      }
      setLoading(true);
      const method = type === 'update' ? 'put' : 'post';
      const result = await api[method](apiRoutes.expenseTypes, state);

      setLoading(false);

      result.success && history.push(`/${appRoutes.expenseTypes}`);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <PanelCrud
      title={`${type === 'update' ? 'Editar' : 'Novo'} Tipo de Despesa`}
      type={type}
      onClickActionButton={action}
      loadingBtnAction={false}
      loadingPanel={loading}
    >
      <Col lg={24} md={24} sm={24} xs={24}>
        <Row gutter={[16, 24]}>
          <Col lg={8} md={12} sm={24} xs={24}>
            <Input
              label={'Nome'}
              required={true}
              value={state.name}
              onChange={(e) => dispatch({ name: e.target.value })}
            />
          </Col>
          <Col lg={16} md={12} sm={24} xs={24}>
            <Input
              label={'Descrição'}
              value={state.description}
              onChange={(e) => dispatch({ description: e.target.value })}
            />
          </Col>
          <Col lg={8} md={12} sm={24} xs={24}>
            <Switch
              title="Não / Sim"
              checkedChildren="Sim"
              unCheckedChildren="Não"
              label={'Recorrente - Replicar Próximo Mês?'}
              checked={state.replicateNextMonth}
              onChange={(replicateNextMonth) =>
                dispatch({ replicateNextMonth })
              }
            />
          </Col>
        </Row>
      </Col>
    </PanelCrud>
  );
};

export default CreateEdit;
