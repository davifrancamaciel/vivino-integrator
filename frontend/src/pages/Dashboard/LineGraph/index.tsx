import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'antd';
import api from 'services/api-aws-amplify';
import { apiRoutes } from 'utils/defaultValues';
import { Column, ColumnConfig } from '@ant-design/plots';
import { PropTypes, Products } from './intefaces';

const LineGraph: React.FC<PropTypes> = ({ label, type }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Products[]>([]);

  useEffect(() => {
    action();
  }, []);

  const action = async () => {
    try {
      setLoading(true);
      const resp = await api.get(`${apiRoutes.dashboard}/graph-bar/${type}`);
      setLoading(false);
      if (resp?.data) {
        const pFormatted = resp?.data.map((p: Products) => ({
          ...p,
          total: Number(p.total)
        }));
        setData(pFormatted);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const config: ColumnConfig = {
    data,
    xField: 'name',
    yField: 'total',
    label: {
      position: 'middle',
      // 'top', 'bottom', 'middle',
      style: { fill: '#FFFFFF', opacity: 1.6 }
    },
    xAxis: {
      label: { autoHide: true, autoRotate: false }
    },
    meta: {
      name: { alias: label },
      total: { alias: 'Quantidade vendida' }
    },
    slider: { start: 0.0, end: 0.2 }
  };
  return (
    <Row style={{ width: '100%', marginTop: '30px' }}>
      <Col lg={24} md={24} sm={24} xs={24}>
        <Card
          title={`${label} mais vendidos`}
          bordered={false}
          loading={loading}
        >
          <Column {...config} />
        </Card>
      </Col>
    </Row>
  );
};

export default LineGraph;
