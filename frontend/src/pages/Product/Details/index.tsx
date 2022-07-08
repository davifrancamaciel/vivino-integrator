import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Divider, Col, Tag } from 'antd';

import useFormState from 'hooks/useFormState';
import PanelCrud from 'components/PanelCrud';
import ViewData from 'components/ViewData';

import { initialStateForm, MessageGroup } from 'pages/Product/interfaces';
import api from 'services/api-aws-amplify';
import { apiRoutes, appRoutes, systemColors } from 'utils/defaultValues';
import { formatDateHour } from 'utils/formatDate';

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
      const item: MessageGroup = {
        ...data,
        createdAt: formatDateHour(data.createdAt),
        updatedAt: formatDateHour(data.updatedAt),
        statusTag: (
          <Tag color={data.active ? systemColors.GREEN : systemColors.RED}>
            {data.active ? 'Ativo' : 'Inativo'}
          </Tag>
        )
      };
      dispatch(item);
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
      <Col lg={12} md={24} sm={24} xs={24}>
        <ViewData label="Nome" value={state.name} />
      </Col>
      <Col lg={12} md={24} sm={24} xs={24}>
        <ViewData label="Solicitante" value={state.requester} />
      </Col>
      <Col lg={24} md={24} sm={24} xs={24}>
        <ViewData label="Briefing" value={state.briefing} />
      </Col>
      <Col lg={24} md={24} sm={24} xs={24}>
        <ViewData label="Objetivo" value={state.objective} />
      </Col>
      <Col lg={5} md={10} sm={12} xs={24}>
        <ViewData label="Status" value={state.statusTag} />
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
