import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { Col, notification } from 'antd';
import { Input, Textarea } from 'components/_inputs';
import PanelCrud from 'components/PanelCrud';
import { apiRoutes, appRoutes } from 'utils/defaultValues';
import useFormState from 'hooks/useFormState';
import { initialStateForm } from '../interfaces';
import api from 'services/api-aws-amplify';
import Products from './Products';
import { Product } from './Products/interfaces';

const CreateEdit: React.FC = (props: any) => {
  const history = useHistory();
  const { state, dispatch } = useFormState(initialStateForm);
  const [type, setType] = useState<'create' | 'update'>('create');
  const [loading, setLoading] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);

  useEffect(() => {
    props.match.params.id && get(props.match.params.id);
    props.match.params.id ? setType('update') : setType('create');
  }, [props.match.params.id]); // eslint-disable-line

  useEffect(() => {
    console.log(state);
  }, [state]);

  const get = async (id: string) => {
    try {
      setLoading(true);
      setLoadingEdit(true)
      const resp = await api.get(`${apiRoutes.sales}/${id}`);
      dispatch({ ...resp.data, products: resp.data?.productsFormatted });
      setLoading(false);
      setLoadingEdit(false)
    } catch (error) {
      setLoading(false);
      setLoadingEdit(false)
    }
  };

  const action = async () => {
    try {
      const productsSale = state.products?.filter(
        (p: Product) => p.name && p.value
      );
      if (!productsSale || !productsSale.length) {
        notification.warning({
          message: 'Não existe produtos validos'
        });
        return;
      }
      setLoading(true);
      const method = type === 'update' ? 'put' : 'post';
      const result = await api[method](apiRoutes.sales, {
        ...state,
        products: JSON.stringify(productsSale)
      });

      setLoading(false);

      result.success && history.push(`/${appRoutes.sales}`);
    } catch (error) {
      setLoading(false);
    }
  };

  const setProducts = (products: Product[]) => {
    dispatch({ products });
  };

  return (
    <PanelCrud
      title={`${type === 'update' ? 'Editar' : 'Nova'} venda`}
      type={type}
      onClickActionButton={action}
      loadingBtnAction={loading}
      loadingPanel={loadingEdit}
    >
      <Products products={state.products} setProducts={setProducts} />

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
