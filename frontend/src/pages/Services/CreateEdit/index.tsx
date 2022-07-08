import React, { useEffect, useState } from 'react';
import { Col, Modal, Row } from 'antd';
import { EditOutlined, CloseSquareOutlined } from '@ant-design/icons';

import { Input, Select } from 'components/_inputs';
import api from 'services/api-aws-amplify';
import { apiRoutes, systemColors } from 'utils/defaultValues';
import useFormState from 'hooks/useFormState';
import { PropTypes, listTypes, types } from '../interfaces';
import { IOptions } from 'utils/commonInterfaces';

const CreateEdit: React.FC<PropTypes> = (props) => {
  const { state, dispatch } = useFormState({});
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<IOptions[]>([]);

  useEffect(() => {
    onChangeType(props?.item?.type || '');
    dispatch(props.item);
  }, [props.item]);

  const action = async () => {
    try {
      const { value, type, Name } = state;
      const obj = {
        Name,
        ScheduleExpression: `rate(${value} ${type}${
          Number(value) > 1 ? 's' : ''
        })`
      };
      setLoading(true);
      const result = await api.put(`${apiRoutes.services}/services`, obj);

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

  const handleCreateTimesArray = (label: string, length: number) => {
    const array: IOptions[] = [];
    for (let i = 1; i <= length; i++) {
      array.push({
        value: i.toString(),
        label: `${i} ${label}${i > 1 ? 's' : ''}`
      });
    }
    return array;
  };

  const onChangeType = (type: string) => {
    let array: IOptions[] = [];

    if (type.includes(types.MINUTE))
      array = handleCreateTimesArray('Minuto', 60);
    if (type.includes(types.HOUR)) array = handleCreateTimesArray('Hora', 24);
    if (type.includes(types.DAY)) array = handleCreateTimesArray('Dia', 30);

    setOptions(array);
  };
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
            label={'Nome do servico'}
            readOnly={true}
            value={state.nameFormatted}
          />
        </Col>
        <Col lg={12} md={12} sm={24} xs={24}>
          <Select
            label={'Unidade de tempo'}
            options={listTypes}
            value={state.type}
            onChange={(type) => {
              onChangeType(type);
              dispatch({ type, value: '' });
            }}
          />
        </Col>
        <Col lg={12} md={12} sm={24} xs={24}>
          <Select
            label={'Valor'}
            options={options}
            value={state.value}
            onChange={(value) => dispatch({ value })}
          />
        </Col>
      </Row>
    </Modal>
  );
};

export default CreateEdit;
