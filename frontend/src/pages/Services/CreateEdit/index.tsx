import React, { useEffect, useState } from 'react';
import { Col, Modal, Row } from 'antd';
import { EditOutlined, CloseSquareOutlined } from '@ant-design/icons';

import { Input, Switch } from 'components/_inputs';
import api from 'services/api-aws-amplify';
import { apiRoutes, systemColors } from 'utils/defaultValues';
import useFormState from 'hooks/useFormState';
import { PropTypes } from '../interfaces';

const CreateEdit: React.FC<PropTypes> = (props) => {
  const { state, dispatch } = useFormState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(props.item);
  }, [props.item]);

  const action = async () => {
    try {
      const { Name, ScheduleExpression, active, nameFormatted } = state;
      const obj = {
        Name,
        ScheduleExpression,
        State: active ? 'ENABLED' : 'DISABLED',
        active,
        Description: nameFormatted
      };
      setLoading(true);
      const result = await api.put(`${apiRoutes.services}`, obj);

      if (result.success) {
        showHideModal();
        props.onComplete(obj);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const showHideModal = () => props.setVisible(!props.visible);

  return (
    <Modal
      title="Editar serviço"
      visible={props.visible}
      onOk={action}
      onCancel={showHideModal}
      okText="Alterar"
      cancelText="Cancelar"
      okButtonProps={{
        icon: <EditOutlined />,
        loading,
        style: {
          border: 'hidden',
          color: '#fff',
          backgroundColor: systemColors.YELLOW
        }
      }}
      cancelButtonProps={{ icon: <CloseSquareOutlined /> }}
    >
      <Row gutter={[16, 24]}>
        <Col lg={24} md={24} sm={24} xs={24}>
          <Input
            label={'Descrição do servico'}
            value={state.nameFormatted}
            onChange={(e) => dispatch({ nameFormatted: e.target.value })}
          />
        </Col>
        <Col lg={12} md={24} sm={24} xs={24}>
          <Input
            label={'Expressão'}
            value={state.ScheduleExpression}
            placeholder="cron(0 6 ? * MON-FRI *) ou rate(5 minutes)"
            onChange={(e) => dispatch({ ScheduleExpression: e.target.value })}
          />
        </Col>
        <Col lg={12} md={24} sm={24} xs={24}>
          <Switch
            label={'Ativo'}
            title="Inativo / Ativo"
            checked={state.active}
            checkedChildren="Ativo"
            unCheckedChildren="Inativo"
            onChange={() => dispatch({ active: !state.active })}
          />
        </Col>
        <Col lg={24} md={24} sm={24} xs={24}>
          <p>Modelos</p>
          <p>
            cron(0 4 * * ? *) <i>1h00 de todos dias hora BR</i>
          </p>
          <p>
            cron(0 4 1 * ? *) <i>1h00 no primeiro dia do mês hora BR</i>
          </p>
          <p>
            cron(0 6 ? * MON-FRI *){' '}
            <i>3h00 de segunda-feira a sexta-feira hora BR</i>
          </p>
          <p>
            cron(30 3 ? * MON *) <i>0h30 de segunda-feira hora BR</i>
          </p>
          <p>
            rate(5 minutes) <i>A cada 5 min</i>
          </p>
          <p>
            rate(1 minute) <i>A cada 1 min</i>
          </p>
        </Col>
      </Row>
    </Modal>
  );
};

export default CreateEdit;
