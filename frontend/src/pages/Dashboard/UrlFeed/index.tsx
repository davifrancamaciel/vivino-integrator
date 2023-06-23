import React, { useEffect, useState } from 'react';
import { Button, Col, Input, notification, Row, Tooltip } from 'antd';
import { CopyOutlined } from '@ant-design/icons';

import { useAppContext } from 'hooks/contextLib';

const UrlFeed: React.FC = () => {
  const [urlFeed, setUrlFeed] = useState('');
  const { userAuthenticated } = useAppContext();

  useEffect(() => {
    const companyId = userAuthenticated?.attributes['custom:company_id'];
    getUrlFeed(companyId);
  }, [userAuthenticated]);

  const getUrlFeed = (companyId: string) => {
    const isProd = window.location.href.includes('prod');
    const enviroment = isProd ? 'prd' : 'dev';
    const url = `https://services-integrator-api-${enviroment}-public.s3.amazonaws.com/${companyId}/vivinofeed.xml`;
    setUrlFeed(url);
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
  );
};

export default UrlFeed;
