import React, { useState, useCallback, useEffect } from 'react';
import { Card, Col, Row, Button, Typography } from 'antd';
import { EditOutlined, PlusSquareOutlined } from '@ant-design/icons';

import { PropTypes } from './interfaces';
import { systemColors } from 'utils/defaultValues';
import { Header } from './styles';
import GoBack from '../GoBack';

const { Title } = Typography;

const Index: React.FC<PropTypes> = (props) => {
  const [actionButton, setActionButton] = useState<any>(null);

  const onClickActionButton = useCallback(
    (event: any) => {
      {
        event.preventDefault();
        props?.onClickActionButton && props.onClickActionButton();
      }
    },
    [props]
  );

  const btnActionCreate = useCallback(
    () =>
      setActionButton(
        <Button
          htmlType={'submit'}
          style={{ backgroundColor: systemColors.GREEN, color: '#fff' }}
          icon={<PlusSquareOutlined />}
          loading={props.loadingBtnAction}
          disabled={props.loadingBtnAction}
          block
        >
          {props.textBtnAction ? props.textBtnAction : 'Criar'}
        </Button>
      ),
    [onClickActionButton, props.loadingBtnAction]
  );

  const btnActionUpdate = useCallback(
    () =>
      setActionButton(
        <Button
          htmlType={'submit'}
          style={{ backgroundColor: systemColors.YELLOW, color: '#fff' }}
          icon={<EditOutlined />}
          loading={props.loadingBtnAction}
          disabled={props.loadingBtnAction}
          block
        >
          {props.textBtnAction ? props.textBtnAction : 'Alterar'}
        </Button>
      ),
    [onClickActionButton, props.loadingBtnAction]
  );

  const btnActionEdit = useCallback(
    () =>
      setActionButton(
        <Button
          style={{ backgroundColor: systemColors.YELLOW, color: '#fff' }}
          icon={<EditOutlined />}
          onClick={onClickActionButton}
          block
        >
          {props.textBtnAction ? props.textBtnAction : 'Alterar'}
        </Button>
      ),
    [onClickActionButton, props.loadingBtnAction]
  );
  useEffect(() => {
    if (props.type === 'create') btnActionCreate();
    else if (props.type === 'update') btnActionUpdate();
    else if (props.type === 'view') btnActionEdit();
  }, [props.type, btnActionCreate, btnActionUpdate]);

  return (
    <Card
      loading={props.loadingPanel}
      title={
        <Header>
          <span>
            <Title level={5}>{props.title}</Title>
          </span>
          <span>
            <GoBack />
          </span>
        </Header>
      }
      bodyStyle={{ border: 'solid 1px #d9d9d9' }}
      headStyle={{
        textAlign: 'right',
        backgroundColor: '#fafafa',
        border: 'solid 1px #d9d9d9'
      }}
    >
      <form onSubmit={onClickActionButton}>
        <Row gutter={[16, 24]}>{props.children}</Row>

        <Row style={{ marginTop: '16px' }}>
          <Col lg={20} md={18} sm={0} xs={0}></Col>
          <Col lg={4} md={6} sm={24} xs={24}>
            {actionButton}
          </Col>
        </Row>
      </form>
    </Card>
  );
};

export default Index;
