import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Divider, Col, Tag, Image, Row } from 'antd';

import useFormState from 'hooks/useFormState';
import PanelCrud from 'components/PanelCrud';
import ViewData from 'components/ViewData';

import { initialStateForm, Product } from 'pages/Product/interfaces';
import api from 'services/api-aws-amplify';
import { apiRoutes, appRoutes, systemColors } from 'utils/defaultValues';
import { formatDateHour } from 'utils/formatDate';
import { formatPrice } from 'utils/formatPrice';

const Details: React.FC = (props: any) => {
  const history = useHistory();
  const { state, dispatch } = useFormState(initialStateForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    props.match.params.id && get(props.match.params.id);
  }, [props.match.params.id]);

  const get = async (id: string) => {
    try {
      setLoading(true);
      const resp = await api.get(`${apiRoutes.products}/${id}`);
      setLoading(false);
      const { data } = resp;
      const item: Product = {
        ...data,
        price: formatPrice(Number(data.price) || 0),
        image: <Image style={{ height: '200px' }} src={data.image} />,
        createdAt: formatDateHour(data.createdAt),
        updatedAt: formatDateHour(data.updatedAt),
        activeTag: (
          <Tag color={data.active ? systemColors.GREEN : systemColors.RED}>
            {data.active ? 'Ativo' : 'Inativo'}
          </Tag>
        )
      };
      dispatch(item);
      console.log(item);
    } catch (error) {
      setLoading(false);
    }
  };

  const action = () => {
    history.push(`/${appRoutes.products}/edit/${props.match.params.id}`);
  };

  return (
    <PanelCrud
      type="view"
      loadingBtnAction={false}
      loadingPanel={loading}
      onClickActionButton={action}
      title={`Detalhes do produto código (${props.match.params.id})`}
    >
      <Col lg={6} md={24} sm={24} xs={24}>
        <Row gutter={[16, 24]}>
          <Col
            lg={24}
            md={24}
            sm={24}
            xs={24}
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <ViewData label="" value={state.image} />
          </Col>
        </Row>
      </Col>
      <Col lg={18} md={24} sm={24} xs={24}>
        <Row gutter={[16, 24]}>
          <Col lg={8} md={12} sm={24} xs={24}>
            <ViewData label="Código do produto" value={props.match.params.id} />
          </Col>
          <Col lg={8} md={12} sm={24} xs={24}>
            <ViewData label="Nome do produto" value={state.name} />
          </Col>
          <Col lg={8} md={12} sm={24} xs={24}>
            <ViewData label="Preço" value={state.price} />
          </Col>

          <Col lg={8} md={12} sm={24} xs={24}>
            <ViewData label="Tamanho" value={state.size} />
          </Col>
          <Col lg={8} md={12} sm={24} xs={24}>
            <ViewData label="Cor" value={state.color} />
          </Col>
          <Col lg={8} md={12} sm={24} xs={24}>
            <ViewData label="Estoque" value={state.inventoryCount} />
          </Col>
          <Col lg={8} md={12} sm={24} xs={24}>
            <ViewData label="Cor" value={state.color} />
          </Col>
          <Col lg={8} md={12} sm={24} xs={24}>
            <ViewData label="Código de barras" value={state.ean} />
          </Col>
          <Col lg={8} md={12} sm={12} xs={24}>
            <ViewData label="Ativo" value={state.activeTag} />
          </Col>
          <Col lg={8} md={12} sm={12} xs={24}>
            <ViewData label="Total vendido" value={state.totalSaled} />
          </Col>
        </Row>
      </Col>

      <Col lg={24} md={24} sm={24} xs={24}>
        <ViewData label="Descrição" value={state.description} />
      </Col>

      <Divider />
      <Col lg={6} md={6} sm={12} xs={24}>
        <ViewData label="Cadastro" value={state.createdAt} />
      </Col>
      <Col lg={6} md={6} sm={12} xs={24}>
        <ViewData label="Ultima alteração" value={state.updatedAt} />
      </Col>
    </PanelCrud>
  );
};

export default Details;
