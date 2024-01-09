import React from 'react';
import { Col, Divider } from 'antd';
import ViewData from 'components/ViewData';
import WhatsApp from 'components/WhatsApp';

interface PropTypes {
  title: string;
  address: any;
}

const Address: React.FC<PropTypes> = ({ title, address }) => (
  <>
    <Divider>{title}</Divider>
    <Col lg={12} md={12} sm={24} xs={24}>
      <ViewData label="Nome" value={address?.name} />
    </Col>
    <Col lg={4} md={12} sm={24} xs={24}>
      <ViewData label="Telefone" value={<WhatsApp phone={address?.phone} />} />
    </Col>
    <Col lg={4} md={12} sm={24} xs={24}>
      <ViewData label="CPF" value={address?.vat_number} />
    </Col>
    <Col lg={4} md={12} sm={24} xs={24}>
      <ViewData label="CEP" value={address?.zip} />
    </Col>
    <Col lg={6} md={12} sm={24} xs={24}>
      <ViewData
        label="Rua"
        value={`${address?.street} ${address?.street2 ? address?.street2 : ''}`}
      />
    </Col>
    <Col lg={4} md={12} sm={24} xs={24}>
      <ViewData label="Complemento" value={address?.addition} />
    </Col>
    <Col lg={4} md={12} sm={24} xs={24}>
      <ViewData label="Bairro" value={address?.neighborhood} />
    </Col>
    <Col lg={4} md={12} sm={24} xs={24}>
      <ViewData label="Cidade" value={address?.city} />
    </Col>
    <Col lg={4} md={12} sm={24} xs={24}>
      <ViewData label="Estado" value={address?.state?.toLocaleUpperCase()} />
    </Col>
    <Col lg={2} md={12} sm={24} xs={24}>
      <ViewData label="País" value={address?.country?.toLocaleUpperCase()} />
    </Col>
  </>
);

export default Address;
