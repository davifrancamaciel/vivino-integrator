import React, { useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { Divider, Col, Tag, Image, Row } from 'antd';

import useFormState from 'hooks/useFormState';
import PanelCrud from 'components/PanelCrud';
import ViewData from 'components/ViewData';

import { initialStateForm, Product } from 'pages/Product/interfaces';
import api from 'services/api-aws-amplify';
import { apiRoutes, appRoutes, systemColors } from 'utils/defaultValues';
import { formatDateHour } from 'utils/formatDate';
import BooleanTag from 'components/BooleanTag';
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
        link: (
          <a href={data.link} target={'_blank'}>
            Clique aqui
          </a>
        ),
        quantityIsMinimum: <BooleanTag value={data.quantityIsMinimum} />,
        containsMilkAllergens: (
          <BooleanTag value={data.containsMilkAllergens} />
        ),
        containsEggAllergens: <BooleanTag value={data.containsEggAllergens} />,
        nonAlcoholic: <BooleanTag value={data.nonAlcoholic} />,
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
          <Col lg={16} md={12} sm={24} xs={24}>
            <ViewData label="Nome do produto" value={state.productName} />
          </Col>
          <Col lg={8} md={12} sm={24} xs={24}>
            <ViewData label="Link do vinho no seu site" value={state.link} />
          </Col>
          <Col lg={8} md={12} sm={24} xs={24}>
            <ViewData label="Preço" value={state.price} />
          </Col>
          <Col lg={8} md={12} sm={24} xs={24}>
            <ViewData
              label="Quantidade é mínima"
              value={state.quantityIsMinimum}
            />
          </Col>
          <Col lg={8} md={12} sm={24} xs={24}>
            <ViewData label="Tamanho da garrafa" value={state.bottleSize} />
          </Col>
          <Col lg={8} md={12} sm={24} xs={24}>
            <ViewData
              label="Quantidade de garrafas"
              value={state.bottleQuantity}
            />
          </Col>
          <Col lg={8} md={12} sm={24} xs={24}>
            <ViewData
              label="Contagem de inventário"
              value={state.inventoryCount}
            />
          </Col>
        </Row>
      </Col>

      <Col lg={6} md={12} sm={24} xs={24}>
        <ViewData label="Produtor" value={state.producer} />
      </Col>
      <Col lg={12} md={12} sm={24} xs={24}>
        <ViewData label="Nome do vinho" value={state.wineName} />
      </Col>
      <Col lg={6} md={12} sm={24} xs={24}>
        <ViewData label="Denominação" value={state.appellation} />
      </Col>
      <Col lg={6} md={12} sm={24} xs={24}>
        <ViewData label="Vintage" value={state.vintage} />
      </Col>
      <Col lg={6} md={12} sm={24} xs={24}>
        <ViewData label="País" value={state.country} />
      </Col>
      <Col lg={6} md={12} sm={24} xs={24}>
        <ViewData label="Cor" value={state.color} />
      </Col>
      <Col lg={6} md={12} sm={24} xs={24}>
        <ViewData label="Código de barras" value={state.ean} />
      </Col>
      <Col lg={6} md={12} sm={24} xs={24}>
        <ViewData label="Álcool" value={state.alcohol} />
      </Col>
     
      <Col lg={6} md={12} sm={24} xs={24}>
        <ViewData label="Endereço do produtor" value={state.producerAddress} />
      </Col>
      <Col lg={6} md={12} sm={24} xs={24}>
        <ViewData
          label="Endereço do importador"
          value={state.importerAddress}
        />
      </Col>
      <Col lg={6} md={12} sm={24} xs={24}>
        <ViewData label="Varietal" value={state.varietal} />
      </Col>
      <Col lg={24} md={24} sm={24} xs={24}>
        <ViewData label="Descrição" value={state.description} />
      </Col>
      <Col lg={6} md={12} sm={24} xs={24}>
        <ViewData label="Envelhecimento" value={state.ageing} />
      </Col>
      <Col lg={6} md={12} sm={24} xs={24}>
        <ViewData label="Fecho" value={state.closure} />
      </Col>
      <Col lg={6} md={12} sm={24} xs={24}>
        <ViewData label="Winemaker" value={state.winemaker} />
      </Col>
      <Col lg={6} md={12} sm={24} xs={24}>
        <ViewData label="Tamanho da produção" value={state.productionSize} />
      </Col>
      <Col lg={6} md={12} sm={24} xs={24}>
        <ViewData label="Açúcar residual" value={state.residualSugar} />
      </Col>
      <Col lg={6} md={12} sm={24} xs={24}>
        <ViewData label="Acidez" value={state.acidity} />
      </Col>
      <Col lg={6} md={12} sm={24} xs={24}>
        <ViewData label="PH" value={state.ph} />
      </Col>
      <Col lg={6} md={12} sm={24} xs={24}>
        <ViewData
          label="Contém alérgenos do leite"
          value={state.containsMilkAllergens}
        />
      </Col>
      <Col lg={6} md={12} sm={24} xs={24}>
        <ViewData
          label="Contém alérgenos de ovo"
          value={state.containsEggAllergens}
        />
      </Col>
      <Col lg={6} md={12} sm={24} xs={24}>
        <ViewData label="Não alcoólico" value={state.nonAlcoholic} />
      </Col>
      <Col lg={6} md={12} sm={12} xs={24}>
        <ViewData label="Ativo" value={state.activeTag} />
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
