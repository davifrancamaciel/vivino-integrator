import React, { useEffect, useState } from 'react';

import { Button, Col, Input, Row, Tooltip } from 'antd';
import {
  CopyOutlined,
  WarningOutlined,
  CheckOutlined
} from '@ant-design/icons';

import { CardPropTypes } from './Card/interfaces';
import { roules, systemColors } from 'utils/defaultValues';
import { useAppContext } from 'hooks/contextLib';
import Card from './Card';
import { Header } from './styles';
import { checkRouleProfileAccess } from 'utils/checkRouleProfileAccess';

const Dashboard: React.FC = () => {
  const { userAuthenticated } = useAppContext();
  const [groups, setGroups] = useState<string[]>([]);
  const [isPermission, setIsPermission] = useState(false);

  useEffect(() => {
    const { signInUserSession } = userAuthenticated;
    setGroups(signInUserSession.accessToken.payload['cognito:groups']);
  }, []);

  useEffect(() => {
    setIsPermission(Boolean(checkRouleProfileAccess(groups, roules.products)));
  }, [groups]);

  const arrayCards: CardPropTypes[] = [
    {
      color: systemColors.GREEN,
      text: 'Vinhos integrados',
      active: true,
      isPermission,
      icon: <CheckOutlined />
    },
    {
      color: systemColors.RED,
      text: 'Vinhos não itegrados',
      active: false,
      isPermission,
      icon: <WarningOutlined />
    }
  ];
  return (
    <div>
      <Header>
        {arrayCards.map((card: CardPropTypes, index: number) => (
          <Card key={index} {...card} />
        ))}
      </Header>
      <Row>
        <Col lg={24} md={24} sm={24} xs={24}>
          <Input.Group compact>
            <Input
              readOnly={true}
              style={{ width: 'calc(100% - 32px)' }}
              defaultValue="https://vivino-integrator-api-prod-feeds.s3.amazonaws.com/vivinofeed.xml"
            />
            <Tooltip title="Copiar url do feed">
              <Button icon={<CopyOutlined />} />
            </Tooltip>
          </Input.Group>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
