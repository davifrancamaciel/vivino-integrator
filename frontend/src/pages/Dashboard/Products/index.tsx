import React, { useEffect, useState } from 'react';
import { Card, Col, Image, Row, Tag } from 'antd';

import GridList from 'components/GridList';
import { Product } from 'pages/Product/interfaces';
import api from 'services/api-aws-amplify';
import { apiRoutes, appRoutes, systemColors } from 'utils/defaultValues';

const Products: React.FC = () => {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);
      const resp = await api.get(`${apiRoutes.dashboard}/products-warning`);
      setLoading(false);
      const itemsFormatted = resp.data.map((p: Product) => ({
        ...p,
        image: (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Image style={{ height: '60px' }} src={p.image} />
          </div>
        ),
        active: <Tag color={systemColors.GREEN}>Ativo </Tag>
      }));
      setItems(itemsFormatted);
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
              { title: 'Contagem de inventário', dataIndex: 'inventoryCount' },
              { title: 'Quantidade de grarrafas', dataIndex: 'bottleQuantity' }
            ]}
            dataSource={items}
            totalRecords={items.length}
            pageSize={50}
            loading={loading}
            routes={{
              routeView: `/${appRoutes.products}/details`,
              routeUpdate: `/${appRoutes.products}/edit`
            }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default Products;
