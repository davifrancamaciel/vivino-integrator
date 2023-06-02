import React, { useEffect, useState } from 'react';
import { Col, Modal, Row } from 'antd';
import { EditOutlined, CloseSquareOutlined } from '@ant-design/icons';

import { Input, Switch } from 'components/_inputs';
import api from 'services/api-aws-amplify';
import { apiRoutes, systemColors } from 'utils/defaultValues';
import useFormState from 'hooks/useFormState';

export interface PropTypes {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  item: any | undefined;
  onComplete: (item: any) => void;
}

const CreateEdit: React.FC<PropTypes> = (props) => {
  const { state, dispatch } = useFormState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(props.item);
  }, [props.item]);

  const action = async () => {
    try {
      const { Name, ScheduleExpression, active } = state;
      const obj = {
        Name,
        ScheduleExpression,
        State: active ? 'ENABLED' : 'DISABLED',
        active
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
     
    </Modal>
  );
};

export default CreateEdit;
