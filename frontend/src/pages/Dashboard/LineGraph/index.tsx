import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'antd';
import api from 'services/api-aws-amplify';
import { apiRoutes } from 'utils/defaultValues';
import { Column, ColumnConfig } from '@ant-design/plots';
import { PropTypes, Products } from './intefaces';
import { useHistory } from 'react-router-dom';

const LineGraph: React.FC<PropTypes> = ({ label, type }) => {
  const history = useHistory();
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
          label: p.label.length > 20 ? `${p.label.slice(0, 20)}...` : p.label,
          value: Number(p.value)
        }));
        setData(pFormatted);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const config: ColumnConfig = {
    data,
    xField: 'label',
    yField: 'value',
    label: {
      position: 'middle',
      // 'top', 'bottom', 'middle',
      style: { fill: '#FFFFFF', opacity: 1.6 }
    },

    xAxis: {
      label: {
        autoHide: true,
        autoRotate: true
        // rotate: -45,
        // style: { top: 100 }
      }
    },
    meta: {
      label: { alias: label },
      value: { alias: 'Quantidade vendida' }
    },
    slider: { start: 0.0, end: 0.2 },
    onReady: (plot) => {
      plot.on('element:click', (...args: any) => {
        const [event] = args;
        history.push(`/${type}/details/${event?.data?.data?.id}`);
      });
    }
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
