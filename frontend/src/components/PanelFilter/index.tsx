import React, { useCallback } from 'react';
import { Col, Collapse, Row, Typography, Button } from 'antd';
import { FilterOutlined, SearchOutlined } from '@ant-design/icons';

import { PropTypes } from './interfaces';
import { systemColors } from 'utils/defaultValues';
import { Header } from './styles';

const { Panel } = Collapse;
const { Title } = Typography;

const Index: React.FC<PropTypes> = (props) => {
  const { footerChildren } = props;

  const header = (
    <Header>
      <span>
        <Title level={5}>{props.title}</Title>
      </span>
      <span>
        <Title level={5}>
          <FilterOutlined /> Filtros
        </Title>
      </span>
    </Header>
  );

  const actionButton = useCallback(
    (event: any) => {
      {
        event.preventDefault();
        props?.actionButton && props.actionButton();
      }
    },
    [props]
  );

  return (
    <Collapse defaultActiveKey={['1']}>
      <Panel showArrow={false} header={header} key="1">
        <form onSubmit={actionButton}>
          <Row gutter={[16, 24]}>{props.children}</Row>

          <Row style={{ marginTop: '16px' }}>
            <Col lg={20} md={18} sm={0} xs={0}></Col>
            <Col lg={4} md={6} sm={24} xs={24}>
              {footerChildren}
              {props.actionButton && (
                <Button
                  loading={props.loading}
                  htmlType={
                    props.htmlTypeButton ? props.htmlTypeButton : 'submit'
                  }
                  onClick={
                    props.htmlTypeButton === 'button' ? actionButton : undefined
                  }
                  block
                  disabled={props.disableButton}
                  icon={<SearchOutlined />}
                  style={{
                    color: props.disableButton ? '#00000040' : '#fff',
                    background: props.disableButton
                      ? '#f5f5f5'
                      : systemColors.BLUE,
                    borderColor: props.disableButton ? '#d9d9d9' : ''
                  }}
                >
                  Buscar
                </Button>
              )}
            </Col>
          </Row>
        </form>
      </Panel>
    </Collapse>
  );
};

export default Index;
