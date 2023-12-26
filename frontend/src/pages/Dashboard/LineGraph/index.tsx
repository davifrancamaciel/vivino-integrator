import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'antd';
import api from 'services/api-aws-amplify';
import { apiRoutes } from 'utils/defaultValues';
import { Column, ColumnConfig } from '@ant-design/plots';
import { PropTypes, Products } from './interfaces';
import { useHistory } from 'react-router-dom';
import FilterComponent from './Filter';
import { Filter } from './Filter/interfaces';
import { endOfDay, startOfDay, addYears } from 'date-fns';

const LineGraph: React.FC<PropTypes> = ({ type, label }) => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Products[]>([]);
  const [filter, setFilter] = useState<Filter>();

  useEffect(() => {
    const date = new Date();
    const fil: Filter = {
      pageSize: 100,
      createdAtStart: startOfDay(addYears(date, -1)).toISOString(),
      createdAtEnd: endOfDay(date).toISOString(),
      type
    };
    setFilter(fil);
    action(fil);
  }, []);

  const action = async (filter: Filter) => {
    try {
      setLoading(true);
      const resp = await api.get(`${apiRoutes.dashboard}/graph-bar/${type}`, {
        ...filter,
        pageSize: 100
      });
      setLoading(false);
      if (resp?.data) {
        const pFormatted = resp.data.map((p: Products) => ({
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
        {type == 'wines' && (
          <FilterComponent
            setFilter={setFilter}
            filter={filter!}
            loading={loading}
            action={action}
          />
        )}
        <Card title={label} bordered={false} loading={loading}>
          <Column {...config} />
        </Card>
      </Col>
    </Row>
  );
};

export default LineGraph;
