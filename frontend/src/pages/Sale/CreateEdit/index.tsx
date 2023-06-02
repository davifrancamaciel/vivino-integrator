import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { Col, Divider, notification } from 'antd';
import { Select, Textarea } from 'components/_inputs';
import PanelCrud from 'components/PanelCrud';
import { apiRoutes, appRoutes, roules } from 'utils/defaultValues';
import useFormState from 'hooks/useFormState';
import { initialStateForm, SaleProduct } from '../interfaces';
import api from 'services/api-aws-amplify';
import Products from './Products';
import { Product } from './Products/interfaces';
import { formatPrice, priceToNumber } from 'utils/formatPrice';
import { useAppContext } from 'hooks/contextLib';

import ShowByRoule from 'components/ShowByRoule';
import { IOptions } from '../../../utils/commonInterfaces';

const CreateEdit: React.FC = (props: any) => {
  const history = useHistory();
  const { users, setUsers } = useAppContext();
  const { state, dispatch } = useFormState(initialStateForm);
  const [type, setType] = useState<'create' | 'update'>('create');
  const [loading, setLoading] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [total, setTotal] = useState<string>();

  useEffect(() => {
    !users.length && onLoadUsersSales();
  }, []);

  useEffect(() => {
    let userName = '';
    if (state.userId) {
      userName = users.find(
        (user: IOptions) => user.value === state.userId
      )?.label;
    }
    dispatch({ userName });
  }, [state.userId]);

  useEffect(() => {
    props.match.params.id && get(props.match.params.id);
    props.match.params.id ? setType('update') : setType('create');
  }, [props.match.params.id]); // eslint-disable-line

  useEffect(() => {
    const totalSale = state.products
      .filter((p: Product) => p.value)
      .reduce((acc: number, p: Product) => acc + priceToNumber(p.value!), 0);
    setTotal(formatPrice(totalSale));
  }, [state.products]);

  const get = async (id: string) => {
    try {
      setLoading(true);
      setLoadingEdit(true);
      const resp = await api.get(`${apiRoutes.sales}/${id}`);
      const productsFormatted = resp.data?.productsFormatted as Product[];
      const products = productsFormatted.map((p: Product) => ({
        ...p,
        value: p.value?.toString().replace('.', ',')
      }));
      console.log(products);
      dispatch({ ...resp.data, products });
      setLoading(false);
      setLoadingEdit(false);
    } catch (error) {
      setLoading(false);
      setLoadingEdit(false);
      console.error(error);
    }
  };

  const action = async () => {
    try {
      const productsSale = state.products
        ?.filter((p: Product) => p.name && p.value)
        .map((p: any) => ({ ...p, value: priceToNumber(p.value) }));
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

  const setProducts = (products: SaleProduct[]) => {
    dispatch({ products });
  };

  const onLoadUsersSales = async () => {
    try {
      setLoading(true);
      const resp = await api.get(`${apiRoutes.users}/all`);

      setUsers(resp.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <PanelCrud
      title={`${type === 'update' ? 'Editar' : 'Nova'} venda`}
      type={type}
      onClickActionButton={action}
      loadingBtnAction={loading}
      loadingPanel={loadingEdit}
    >
      <Divider>Total {total}</Divider>
      <Products products={state.products} setProducts={setProducts} />
      <Divider>Total {total}</Divider>
      <ShowByRoule roule={roules.saleUserIdChange}>
        <Col lg={12} md={12} sm={24} xs={24}>
          <Select
            label={'Vendedor'}
            options={users}
            value={state?.userId}
            onChange={(userId) => dispatch({ userId })}
          />
        </Col>
      </ShowByRoule>
      <ShowByRoule roule={roules.administrator}>
        <Col lg={12} md={12} sm={12} xs={24}>
          <Select
            label={'Empresa'}
            url={`${apiRoutes.companies}/all`}
            value={state.companyId}
            onChange={(companyId) => dispatch({ companyId })}
          />
        </Col>
      </ShowByRoule>
      <Col lg={24} md={24} sm={24} xs={24}>
        <Textarea
          label={'Observações'}
          placeholder=""
          value={state.note}
          onChange={(e) => dispatch({ note: e.target.value })}
        />
      </Col>
    </PanelCrud>
  );
};

export default CreateEdit;
