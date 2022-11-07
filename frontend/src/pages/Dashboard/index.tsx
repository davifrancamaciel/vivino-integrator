import React, { useEffect, useState } from 'react';

import { Button, Col, Input, notification, Row, Tooltip } from 'antd';
import {
  CopyOutlined,
  WarningOutlined,
  CheckOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined
} from '@ant-design/icons';

import { CardsReuslt } from './Card/interfaces';
import { roules, systemColors } from 'utils/defaultValues';
import { useAppContext } from 'hooks/contextLib';
import Card from './Card';
import { Header } from './styles';
import { checkRouleProfileAccess } from 'utils/checkRouleProfileAccess';
import Products from './Products';
import api from 'services/api-aws-amplify';
import { apiRoutes, appRoutes } from 'utils/defaultValues';
import { formatPrice } from 'utils/formatPrice';

const Dashboard: React.FC = () => {
  const { userAuthenticated } = useAppContext();
  const [groups, setGroups] = useState<string[]>([]);
  const [isPermission, setIsPermission] = useState(false);
  const [urlFeed, setUrlFeed] = useState('');
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState<CardsReuslt>();

  useEffect(() => {
    const { signInUserSession } = userAuthenticated;
    setGroups(signInUserSession.accessToken.payload['cognito:groups']);
    getUrlFeed();
  }, []);

  useEffect(() => {
    setIsPermission(Boolean(checkRouleProfileAccess(groups, roules.products)));
  }, [groups]);

  useEffect(() => {
    action();
  }, []);

  const action = async () => {
    try {
      setLoading(true);
      const url = `${apiRoutes.dashboard}/cards`;
      const resp = await api.get(url);
      setCards(resp.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

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
        return true;
      },
      function (err) {
        console.error('Async: Could not copy text: ', err);
        return false;
      }
    );
  };
  return (
    <div>
      <Header>
        <Card
          loading={loading}
          value={`${cards?.productsActive.count}`}
          color={systemColors.GREEN}
          text={'Vinhos disponíveis para integração'}
          isPermission={isPermission}
          icon={<CheckOutlined />}
          url={`${appRoutes.products}?active=true`}
        />

        <Card
          loading={loading}
          value={`${cards?.productsNotActive.count}`}
          color={systemColors.RED}
          text={'Vinhos não integrados'}
          isPermission={isPermission}
          icon={<WarningOutlined />}
          url={`${appRoutes.products}?active=false`}
        />
        <Card
          loading={loading}
          value={formatPrice(cards?.sales.totalValueMonth!)}
          color={systemColors.LIGHT_BLUE}
          text={`Valor total das ${
            cards?.sales.count ? cards?.sales.count : 0
          } vendas este mês`}
          isPermission={isPermission}
          icon={<ArrowUpOutlined />}
          url={`${appRoutes.sales}`}
        />
        <Card
          loading={loading}
          value={formatPrice(cards?.sales.commissionMonth!)}
          color={systemColors.YELLOW}
          text={`Commissão a pagar sob ${
            cards?.sales.count ? cards?.sales.count : 0
          } vendas este mês`}
          isPermission={isPermission}
          icon={<ArrowDownOutlined />}
          url={`${appRoutes.sales}`}
        />
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
      <Products />
    </div>
  );
};

export default Dashboard;
