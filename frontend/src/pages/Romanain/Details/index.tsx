import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Divider, Col } from 'antd';

import useFormState from 'hooks/useFormState';
import PanelCrud from 'components/PanelCrud';
import ViewData from 'components/ViewData';

import { initialStateForm, originCompanys, Romanian } from '../interfaces';
import api from 'services/api-aws-amplify';
import { apiRoutes, appRoutes, roules } from 'utils/defaultValues';
import { formatDateHour } from 'utils/formatDate';
import { formatPrice } from 'utils/formatPrice';
import BooleanTag from 'components/BooleanTag';
import ShowByRoule from 'components/ShowByRoule';

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
      const resp = await api.get(`${apiRoutes.romanians}/${id}`);
      setLoading(false);
      const { data } = resp;
      const item: Romanian = {
        ...data,
        noteValue: formatPrice(Number(data.noteValue) || 0),
        shippingValue: formatPrice(Number(data.shippingValue) || 0),
        saleDateAt: formatDateHour(data.saleDateAt),
        createdAt: formatDateHour(data.createdAt),
        updatedAt: formatDateHour(data.updatedAt),
        sended: <BooleanTag value={data.sended} />,
        delivered: <BooleanTag value={data.delivered} />,
        originCompanyId: originCompanys.find(
          (x) => x.value === `${data.originCompanyId}`
        )?.label
      };
      dispatch(item);
      console.log(item);
    } catch (error) {
      setLoading(false);
    }
  };

  const action = () => {
    history.push(`/${appRoutes.romanians}/edit/${props.match.params.id}`);
  };

  return (
    <PanelCrud
      type="view"
      loadingBtnAction={false}
      loadingPanel={loading}
      onClickActionButton={action}
      title={`Detalhes do romaneio código (${props.match.params.id})`}
    >
      <ShowByRoule roule={roules.administrator}>
        <Col lg={6} md={12} sm={24} xs={24}>
          <ViewData label="Empresa" value={state.company?.name} />
        </Col>
      </ShowByRoule>

      <Col lg={6} md={12} sm={24} xs={24}>
        <ViewData label="Empresa" value={state.originCompanyId} />
      </Col>
      <Col lg={6} md={12} sm={24} xs={24}>
        <ViewData label="Nome do cliente" value={state.clientName} />
      </Col>
      <Col lg={6} md={12} sm={24} xs={24}>
        <ViewData label="Numero da nota" value={state.noteNumber} />
      </Col>
      <Col lg={6} md={12} sm={24} xs={24}>
        <ViewData label="Valor da nota" value={state.noteValue} />
      </Col>
      <Col lg={6} md={12} sm={24} xs={24}>
        <ViewData
          label="Transporadora/Entregador"
          value={state.shippingCompany?.name}
        />
      </Col>
      <Col lg={6} md={12} sm={24} xs={24}>
        <ViewData label="Valor do frete" value={state.shippingValue} />
      </Col>
      <Col lg={6} md={12} sm={24} xs={24}>
        <ViewData
          label="Código/link de rastreamento"
          value={state.trackingCode}
        />
      </Col>
      <Col lg={6} md={12} sm={24} xs={24}>
        <ViewData label="Origem da venda" value={state.originSale} />
      </Col>
      <Col lg={6} md={12} sm={24} xs={24}>
        <ViewData label="Volumes" value={state.volume} />
      </Col>
      <Col lg={6} md={12} sm={24} xs={24}>
        <ViewData label="Forma de pagamento" value={state.formOfPayment} />
      </Col>
      <Col lg={6} md={12} sm={24} xs={24}>
        <ViewData label="Enviado" value={state.sended} />
      </Col>
      <Col lg={6} md={12} sm={24} xs={24}>
        <ViewData label="Entregue" value={state.delivered} />
      </Col>

      <Divider />
      <Col lg={6} md={12} sm={12} xs={24}>
        <ViewData label="Data da expedição" value={state.saleDateAt} />
      </Col>
      <Col lg={6} md={12} sm={12} xs={24}>
        <ViewData label="Cadastro" value={state.createdAt} />
      </Col>
      <Col lg={6} md={12} sm={12} xs={24}>
        <ViewData label="Ultima alteração" value={state.updatedAt} />
      </Col>
    </PanelCrud>
  );
};

export default Details;
