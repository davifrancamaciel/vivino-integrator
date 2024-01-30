import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Col, Divider, Image, Modal, Row } from 'antd';
import { EditOutlined, CloseSquareOutlined } from '@ant-design/icons';

import { systemColors } from 'utils/defaultValues';
import { SaleVivino } from '../interfaces';
import { formatDateHour } from 'utils/formatDate';
import ViewData from 'components/ViewData';
import { formatPrice } from 'utils/formatPrice';
import WineGrid from '../WineGrid';
import Address from './Address';
interface PropTypes {
  sale?: SaleVivino;
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

const Sales: React.FC<PropTypes> = (props) => {
  const [sale, setSale] = useState<any>();
  
  useEffect(() => {
    const formatted = {
      ...props.sale,
      image: (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Image
            style={{ height: '60px' }}
            src={props?.sale?.user?.image?.location}
          />
        </div>
      ),
      items_total_sum: formatPrice(props.sale?.items_total_sum!),
      created_at: formatDateHour(props.sale?.created_at),
      confirmed_at: formatDateHour(props.sale?.confirmed_at),
      authorized_at: formatDateHour(props.sale?.authorized_at)
    };

    props.sale && formatted && setSale(formatted);  
  }, [props.sale]);

  const showHideModal = () => props.setVisible(!props.visible);

  return (
    <Modal
      width={'100%'}
      title={`Venda ${sale?.id}`}
      visible={props.visible}
      onOk={() => {}}
      onCancel={showHideModal}
      okText=""
      cancelText="Fechar"
      okButtonProps={{
        icon: <EditOutlined />,
        style: {
          border: 'hidden',
          color: '#fff',
          backgroundColor: systemColors.YELLOW
        }
      }}
      cancelButtonProps={{ icon: <CloseSquareOutlined /> }}
    >
      <Row>
        <Col
          lg={4}
          md={24}
          sm={24}
          xs={24}
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          <ViewData label="" value={sale?.image} />
        </Col>

        <Col lg={5} md={12} sm={24} xs={24}>
          <ViewData
            label="Cliente"
            value={
              <Link to={`/clients?email=${props.sale?.user?.email}`}>
                {props.sale?.user?.alias}
              </Link>
            }
          />
        </Col>
        <Col lg={5} md={12} sm={24} xs={24}>
          <ViewData label="Origem da venda" value={props.sale?.source} />
        </Col>
        <Col lg={5} md={12} sm={24} xs={24}>
          <ViewData
            label="Total de itens"
            value={props.sale?.items_units_sum}
          />
        </Col>
        <Col lg={5} md={12} sm={24} xs={24}>
          <ViewData label="Valor da venda" value={sale?.items_total_sum} />
        </Col>
        <Divider>Datas</Divider>
        <Col lg={6} md={12} sm={24} xs={24}>
          <ViewData label="Data da venda na Vivino" value={sale?.created_at} />
        </Col>
        <Col lg={6} md={12} sm={24} xs={24}>
          <ViewData
            label="Data da autorização na Vivino"
            value={sale?.authorized_at}
          />
        </Col>
        <Col lg={6} md={12} sm={24} xs={24}>
          <ViewData
            label="Data da confirmação na Vivino"
            value={sale?.confirmed_at}
          />
        </Col>
        <Col lg={6} md={12} sm={24} xs={24}>
          <ViewData label="Data da importação" value={sale?.createdAt} />
        </Col>
      </Row>
      <WineGrid sale={props.sale!} />  
      <Row>
        <Address
          title={'Endereço de entrega'}
          address={props.sale?.shipping?.address}
        />
        <Address
          title={'Endereço de entrega todo'}
          address={props.sale?.shipping?.full_address}
        />
        <Address
          title={'Endereço de de cobrança'}
          address={props.sale?.billing.address}
        />
        <Address
          title={'Endereço de de cobrança todo'}
          address={props.sale?.billing.full_address}
        />
      </Row>
    </Modal>
  );
};

export default Sales;
