import { CloseSquareOutlined, DeleteOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import React, { useState } from 'react';
import { systemColors } from 'utils/defaultValues';
import api from 'services/api-aws-amplify';
import { ActionButton } from 'components/_inputs';
interface PropTypes {
  router: string;
  id: string | number;
  item: any;
  onDelete?: (id?: string | number) => void;
  propTexObjOndelete?: string;
}

const ActionDelete: React.FC<PropTypes> = (props) => {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const showHideModal = () => {
    setVisible(!visible);
  };

  const deleteConfirm = async () => {
    try {
      const routeDel = props.router.replace('/', '');
      if (routeDel === 'CUSTOM_DELETE') {
        props.onDelete && props.onDelete(props.id);
        setVisible(false);
        return;
      }
      setLoading(true);
      const resp = await api.delete(`${routeDel}/${props.id}`);
      setLoading(false);

      if (resp.success) {
        setVisible(false);
        props.onDelete && props.onDelete(props.id);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <>
      <ActionButton
        title={'Apagar'}
        backgroundColor={systemColors.RED}
        icon={<DeleteOutlined />}
        onClick={showHideModal}
        loading={loading}
      />
      <Modal
        title="Confirmação"
        visible={visible}
        onOk={deleteConfirm}
        onCancel={showHideModal}
        okText="Sim"
        cancelText="Cancelar"
        okButtonProps={{
          icon: <DeleteOutlined />,
          loading,
          style: {
            border: 'hidden',
            color: '#fff',
            backgroundColor: systemColors.RED
          }
        }}
        cancelButtonProps={{ icon: <CloseSquareOutlined /> }}
      >
        <p style={{ textAlign: 'center' }}>
          Confirma remoção deste item?{' '}
          {props.propTexObjOndelete && (
            <>
              <br />
              <strong>{props.item[props.propTexObjOndelete]}</strong>
            </>
          )}
          <br /> Esta operação será irreversível
        </p>
      </Modal>
    </>
  );
};

export default ActionDelete;
