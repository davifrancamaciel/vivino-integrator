import React, { useEffect, useState } from 'react';
import { Col, Divider, Image, Modal, Row } from 'antd';
import { EditOutlined, CloseSquareOutlined } from '@ant-design/icons';

import { systemColors } from 'utils/defaultValues';
import { SaleVivino, WineSale } from '../interfaces';
import GridList from 'components/GridList';
import { formatDateHour } from 'utils/formatDate';
import ViewData from 'components/ViewData';
import { formatPrice } from 'utils/formatPrice';

interface PropTypes {
  sale?: SaleVivino;
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

const Sales: React.FC<PropTypes> = (props) => {
  const [sale, setSale] = useState<any>();
  const [items, setItems] = useState<any[]>([]);

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
    console.log(formatted);
    props.sale && formatted && setSale(formatted);
    if (props.sale?.items?.length) {
      const itemsFormmated = props.sale?.items.map((x: any) => ({
        ...x,
        sku: (
          <a
            target={'_blank'}
            href={`${window.location.origin}/wines/details/${x.sku}`}
          >
            {x.sku}
          </a>
        ),
        image: (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Image style={{ height: '60px' }} src={x?.image?.location} />
          </div>
        ),
        unit_price: formatPrice(x.unit_price),
        total_amount: formatPrice(x.total_amount)
      }));
      setItems(itemsFormmated);
    }

    console.log(props.sale);
  }, [props.sale]);

  const showHideModal = () => props.setVisible(!props.visible);

  return (
    <Modal
      width={'80%'}
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
          <ViewData label="Cliente" value={props.sale?.user?.alias} />
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
            label="Data da confirmação na Vivino"
            value={sale?.confirmed_at}
          />
        </Col>
        <Col lg={6} md={12} sm={24} xs={24}>
          <ViewData
            label="Data da autorização na Vivino"
            value={sale?.authorized_at}
          />
        </Col>
      </Row>
      <GridList
        scroll={{ x: 840 }}
        columns={[
          { title: 'Imagem', dataIndex: 'image' },
          { title: 'Códido', dataIndex: 'sku' },
          { title: 'Vinho', dataIndex: 'description' },
          { title: 'Preço unitário', dataIndex: 'unit_price' },
          { title: 'Quantidade', dataIndex: 'unit_count' },
          { title: 'Preço total', dataIndex: 'total_amount' }
        ]}
        dataSource={items}
        totalRecords={items.length}
        pageSize={items.length}
        loading={false}
        routes={{}}
      />
      <Row>
        <Divider>Endereço de entrega</Divider>
        <Col lg={12} md={12} sm={24} xs={24}>
          <ViewData label="Nome" value={props.sale?.shipping?.address?.name} />
        </Col>
        <Col lg={4} md={12} sm={24} xs={24}>
          <ViewData
            label="Telefone"
            value={props.sale?.shipping?.address?.phone}
          />
        </Col>
        <Col lg={4} md={12} sm={24} xs={24}>
          <ViewData
            label="CPF"
            value={props.sale?.shipping?.address?.vat_number}
          />
        </Col>
        <Col lg={4} md={12} sm={24} xs={24}>
          <ViewData label="CEP" value={props.sale?.shipping?.address?.zip} />
        </Col>
        <Col lg={6} md={12} sm={24} xs={24}>
          <ViewData
            label="Rua"
            value={`${props.sale?.shipping?.address?.street} ${props.sale?.shipping?.address?.street2}`}
          />
        </Col>
        <Col lg={4} md={12} sm={24} xs={24}>
          <ViewData
            label="Complemento"
            value={props.sale?.shipping?.address?.addition}
          />
        </Col>
        <Col lg={4} md={12} sm={24} xs={24}>
          <ViewData
            label="Bairro"
            value={props.sale?.shipping?.address?.neighborhood}
          />
        </Col>
        <Col lg={4} md={12} sm={24} xs={24}>
          <ViewData
            label="Cidade"
            value={props.sale?.shipping?.address?.city}
          />
        </Col>
        <Col lg={4} md={12} sm={24} xs={24}>
          <ViewData
            label="Estado"
            value={props.sale?.shipping?.address?.state}
          />
        </Col>
        <Col lg={2} md={12} sm={24} xs={24}>
          <ViewData
            label="País"
            value={props.sale?.shipping?.address?.country}
          />
        </Col>

        <Divider>Endereço de entrega todo</Divider>
        <Col lg={12} md={12} sm={24} xs={24}>
          <ViewData
            label="Nome"
            value={props.sale?.shipping?.full_address?.full_name}
          />
        </Col>
        <Col lg={4} md={12} sm={24} xs={24}>
          <ViewData
            label="Telefone"
            value={props.sale?.shipping?.full_address?.phone}
          />
        </Col>
        <Col lg={4} md={12} sm={24} xs={24}>
          <ViewData
            label="CPF"
            value={props.sale?.shipping?.full_address?.social_security_number}
          />
        </Col>
        <Col lg={4} md={12} sm={24} xs={24}>
          <ViewData
            label="CEP"
            value={props.sale?.shipping?.full_address?.zip}
          />
        </Col>
        <Col lg={6} md={12} sm={24} xs={24}>
          <ViewData
            label="Rua"
            value={`${props.sale?.shipping?.full_address?.street} ${props.sale?.shipping?.full_address?.street_number}`}
          />
        </Col>
        <Col lg={4} md={12} sm={24} xs={24}>
          <ViewData
            label="Complemento"
            value={props.sale?.shipping?.full_address?.addition}
          />
        </Col>
        <Col lg={4} md={12} sm={24} xs={24}>
          <ViewData
            label="Bairro"
            value={props.sale?.shipping?.full_address?.neighborhood}
          />
        </Col>
        <Col lg={4} md={12} sm={24} xs={24}>
          <ViewData
            label="Cidade"
            value={props.sale?.shipping?.full_address?.city}
          />
        </Col>
        <Col lg={4} md={12} sm={24} xs={24}>
          <ViewData
            label="Estado"
            value={props.sale?.shipping?.full_address?.state}
          />
        </Col>
        <Col lg={2} md={12} sm={24} xs={24}>
          <ViewData
            label="País"
            value={props.sale?.shipping?.full_address?.country}
          />
        </Col>

        <Divider>Endereço de cobrança</Divider>
        <Col lg={12} md={12} sm={24} xs={24}>
          <ViewData label="Nome" value={props.sale?.billing?.address?.name} />
        </Col>
        <Col lg={4} md={12} sm={24} xs={24}>
          <ViewData
            label="Telefone"
            value={props.sale?.billing?.address?.phone}
          />
        </Col>
        <Col lg={4} md={12} sm={24} xs={24}>
          <ViewData
            label="CPF"
            value={props.sale?.billing?.address?.vat_number}
          />
        </Col>
        <Col lg={4} md={12} sm={24} xs={24}>
          <ViewData label="CEP" value={props.sale?.billing?.address?.zip} />
        </Col>
        <Col lg={6} md={12} sm={24} xs={24}>
          <ViewData
            label="Rua"
            value={`${props.sale?.billing?.address?.street} ${props.sale?.billing?.address?.street2}`}
          />
        </Col>
        <Col lg={4} md={12} sm={24} xs={24}>
          <ViewData
            label="Complemento"
            value={props.sale?.billing?.address?.addition}
          />
        </Col>
        <Col lg={4} md={12} sm={24} xs={24}>
          <ViewData
            label="Bairro"
            value={props.sale?.billing?.address?.neighborhood}
          />
        </Col>
        <Col lg={4} md={12} sm={24} xs={24}>
          <ViewData label="Cidade" value={props.sale?.billing?.address?.city} />
        </Col>
        <Col lg={4} md={12} sm={24} xs={24}>
          <ViewData
            label="Estado"
            value={props.sale?.billing?.address?.state}
          />
        </Col>
        <Col lg={2} md={12} sm={24} xs={24}>
          <ViewData
            label="País"
            value={props.sale?.billing?.address?.country}
          />
        </Col>

        <Divider>Endereço de cobrança todo</Divider>
        <Col lg={12} md={12} sm={24} xs={24}>
          <ViewData
            label="Nome"
            value={props.sale?.billing?.full_address?.full_name}
          />
        </Col>
        <Col lg={4} md={12} sm={24} xs={24}>
          <ViewData
            label="Telefone"
            value={props.sale?.billing?.full_address?.phone}
          />
        </Col>
        <Col lg={4} md={12} sm={24} xs={24}>
          <ViewData
            label="CPF"
            value={props.sale?.billing?.full_address?.social_security_number}
          />
        </Col>
        <Col lg={4} md={12} sm={24} xs={24}>
          <ViewData
            label="CEP"
            value={props.sale?.billing?.full_address?.zip}
          />
        </Col>
        <Col lg={6} md={12} sm={24} xs={24}>
          <ViewData
            label="Rua"
            value={`${props.sale?.billing?.full_address?.street} ${props.sale?.billing?.full_address?.street_number}`}
          />
        </Col>
        <Col lg={4} md={12} sm={24} xs={24}>
          <ViewData
            label="Complemento"
            value={props.sale?.billing?.full_address?.addition}
          />
        </Col>
        <Col lg={4} md={12} sm={24} xs={24}>
          <ViewData
            label="Bairro"
            value={props.sale?.billing?.full_address?.neighborhood}
          />
        </Col>
        <Col lg={4} md={12} sm={24} xs={24}>
          <ViewData
            label="Cidade"
            value={props.sale?.billing?.full_address?.city}
          />
        </Col>
        <Col lg={4} md={12} sm={24} xs={24}>
          <ViewData
            label="Estado"
            value={props.sale?.billing?.full_address?.state}
          />
        </Col>
        <Col lg={2} md={12} sm={24} xs={24}>
          <ViewData
            label="País"
            value={props.sale?.billing?.full_address?.country}
          />
        </Col>
      </Row>
    </Modal>
  );
};

export default Sales;
