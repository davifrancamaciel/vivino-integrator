import React, { useEffect, useState } from 'react';

import { Button, Col, Input, notification, Row, Tooltip } from 'antd';
import { CopyOutlined } from '@ant-design/icons';

import Cards from './Cards';
import { Header } from './styles';
import Products from './Products';

const Dashboard: React.FC = () => {
  const [urlFeed, setUrlFeed] = useState('');

  useEffect(() => {
    getUrlFeed();
  }, []);

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
        <Cards />
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
