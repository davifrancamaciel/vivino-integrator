import React, { useEffect, useState } from 'react';

import { Button, Col, Input, notification, Row, Tooltip } from 'antd';
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
  const [urlFeed, setUrlFeed] = useState('');

  useEffect(() => {
    const { signInUserSession } = userAuthenticated;
    setGroups(signInUserSession.accessToken.payload['cognito:groups']);
    getUrlFeed();
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
      text: 'Vinhos não integrados',
      active: false,
      isPermission,
      icon: <WarningOutlined />
    }
  ];

  const getUrlFeed = () => {
    const isProd = window.location.href.includes('prod');

    setUrlFeed(
      `https://vivino-integrator-api-${
        isProd ? 'prod' : 'dev'
      }-feeds.s3.amazonaws.com/vivinofeed.xml`
    );
  };

  const copyTextToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text).then(
      function () {
        console.log('Async: Copying to clipboard was successful!');
        notification.success({
          message: 'Link copiado'
        });
        return true
      },
      function (err) {
        console.error('Async: Could not copy text: ', err);
        return false
      }
    );
  };
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
              defaultValue={urlFeed}
              value={urlFeed}
            />
            <Tooltip title="Copiar o link do feed">
              <Button
                icon={<CopyOutlined />}
                onClick={() => copyTextToClipboard(urlFeed)}
              />
            </Tooltip>
          </Input.Group>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
