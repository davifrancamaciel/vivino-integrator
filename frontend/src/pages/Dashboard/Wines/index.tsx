import React, { useEffect, useState } from 'react';
import { Card, Col, Image, Row, Tag } from 'antd';

import GridList from 'components/GridList';
import { Wine } from '@/pages/Wine/interfaces';
import api from 'services/api-aws-amplify';
import { formatDateHour } from 'utils/formatDate';
import { apiRoutes, appRoutes, systemColors } from 'utils/defaultValues';
import useFormState from 'hooks/useFormState';

const Wines: React.FC = () => {
  const { state, dispatch } = useFormState({ pageNumber: 1, pageSize: 10 });
  const [items, setItems] = useState<Wine[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    actionFilter();
  }, []);

  const actionFilter = async (pageNumber: number = 1) => {
    try {
      dispatch({ pageNumber });
      setLoading(true);
      const resp = await api.get(`${apiRoutes.wines}`, {
        ...state,
        pageNumber,
        winesWarnig: true
      });
      setLoading(false);

      const { count, rows } = resp.data;
      const itemsFormatted = rows.map((p: Wine) => ({
        ...p,
        updatedAt: formatDateHour(p.updatedAt),
        image: (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Image style={{ height: '60px' }} src={p.image} />
          </div>
        ),
        active: <Tag color={systemColors.GREEN}>Ativo </Tag>
      }));
      setItems(itemsFormatted);
      setTotalRecords(count);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  return (
    <Row style={{ width: '100%', marginTop: '30px' }}>
      <Col lg={24} md={24} sm={24} xs={24}>
        <Card
          title="Os vinhos abaixo estão ativos mas possuem alguma inconformidade e por isso não estarão
          no arquivo de integração."
          bordered={false}
        >
          <GridList
            scroll={{ x: 840 }}
            columns={[
              { title: 'Imagem', dataIndex: 'image' },
              { title: 'Código', dataIndex: 'id' },
              { title: 'Ativo', dataIndex: 'active' },
              { title: 'Nome do produto', dataIndex: 'productName' },
              {
                title: 'Contagem de inventário  (estoque)',
                dataIndex: 'inventoryCount'
              },
              { title: 'Quantidade de grarrafas', dataIndex: 'bottleQuantity' },
              { title: 'Alterado em', dataIndex: 'updatedAt' }
            ]}
            dataSource={items}
            onPagination={(pageNumber) => actionFilter(pageNumber)}
            totalRecords={totalRecords}
            pageSize={state.pageSize}
            loading={loading}
            routes={{
              routeView: `/${appRoutes.wines}/details`,
              routeUpdate: `/${appRoutes.wines}/edit`
            }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default Wines;
