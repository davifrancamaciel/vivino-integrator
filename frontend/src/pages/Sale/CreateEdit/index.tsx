import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Col, notification } from 'antd';
import { Input, Textarea } from 'components/_inputs';
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
      const resp = await api.get(`${apiRoutes.sales}/${id}`);
      dispatch({ ...resp.data });
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const action = async () => {
    try {
      if (!state.product || !state.value ) {
        notification.warning({
          message: 'Existem campos obrigatórios não preenchidos'
        });
        return;
      }
      setLoading(true);
      const method = type === 'update' ? 'put' : 'post';
      const result = await api[method](apiRoutes.sales, state);

      setLoading(false);

      result.success && history.push(`/${appRoutes.sales}`);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <PanelCrud
      title={`${type === 'update' ? 'Editar' : 'Nova'} venda`}
      type={type}
      onClickActionButton={action}
      loadingBtnAction={false}
      loadingPanel={loading}
    >
      <Col lg={16} md={12} sm={24} xs={24}>
        <Input
          label={'Nome do produto'}
          required={true}
          placeholder="Bola"
          value={state.product}
          onChange={(e) => dispatch({ product: e.target.value })}
        />
      </Col>
      <Col lg={8} md={12} sm={24} xs={24}>
        <Input
          label={'Preço'}
          required={true}
          type={'number'}
          placeholder="15.00"
          value={state.value}
          onChange={(e) => dispatch({ value: e.target.value })}
        />
      </Col>

      <Col lg={24} md={24} sm={24} xs={24}>
        <Textarea
          label={'Observação'}
          placeholder=""
          value={state.note}
          onChange={(e) => dispatch({ note: e.target.value })}
        />
      </Col>
    </PanelCrud>
  );
};

export default CreateEdit;
