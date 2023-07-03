import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Row, Tooltip } from 'antd';
import { EyeOutlined } from '@ant-design/icons';

import GridList from 'components/GridList';
import { apiRoutes, systemColors } from 'utils/defaultValues';
import { initialStateFilter, WineSale, WineSaleHistory } from '../interfaces';
import useFormState from 'hooks/useFormState';
import api from 'services/api-aws-amplify';
import { formatDateHour, formatDate } from 'utils/formatDate';
import Sales from '../Sales';

interface PropTypes {
  wineId: number;
}

const List: React.FC<PropTypes> = ({ wineId }) => {
  const { state, dispatch } = useFormState(initialStateFilter);
  const [items, setItems] = useState<WineSaleHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [sales, setSales] = useState<WineSale[]>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    actionFilter(1);
  }, []);

  const actionFilter = async (pageNumber: number = 1) => {
    try {
      dispatch({ pageNumber, wineId });

      setLoading(true);
      const resp = await api.get(`${apiRoutes.wines}/sale-history`, {
        ...state,
        pageNumber,
        wineId
      });
      setLoading(false);

      const { count, rows } = resp.data;
      const itemsFormatted = rows.map((histo: WineSaleHistory) => ({
        ...histo,
        sales: (
          <Tooltip
            placement="top"
            title={`Visualizar ${histo.salesFormatted.length} vendas`}
          >
            <Button
              icon={<EyeOutlined />}
              onClick={() => handleView(histo)}
              style={{
                backgroundColor: systemColors.GREY,
                color: '#fff',
                marginRight: 4
              }}
            />
          </Tooltip>
        ),
        inventoryCountAfter: histo.inventoryCountBefore - histo.total,
        dateReference: formatDate(histo.dateReference),
        createdAt: formatDateHour(histo.createdAt),
        updatedAt: formatDateHour(histo.updatedAt)
      }));
      setItems(itemsFormatted);
      console.log(itemsFormatted);
      setTotalRecords(count);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleView = (item: WineSaleHistory) => {
    setVisible(true);
    setSales(item.salesFormatted!);
  };

  return (
    <Row style={{ width: '100%', marginTop: '30px' }}>
      <Sales visible={visible} setVisible={setVisible} sales={sales} />
      <Col lg={24} md={24} sm={24} xs={24}>
        <Card
          title={`Histórico de vendas deste vinho codigo ${wineId}`}
          bordered={false}
        >
          <GridList
            scroll={{ x: 840 }}
            columns={[
              { title: 'Data da confirmação na Vivino', dataIndex: 'dateReference' },
              { title: 'Estoque anterior', dataIndex: 'inventoryCountBefore' },
              { title: 'Total vendido', dataIndex: 'total' },
              {
                title: 'Estoque após as vendas',
                dataIndex: 'inventoryCountAfter'
              },
              {
                title: 'Vendas',
                dataIndex: 'sales'
              },
              { title: 'Importado em', dataIndex: 'createdAt' }
            ]}
            dataSource={items}
            onPagination={(pageNumber) => actionFilter(pageNumber)}
            onDelete={() => actionFilter(state.pageNumber)}
            propTexObjOndelete={'productName'}
            totalRecords={totalRecords}
            pageSize={state.pageSize}
            loading={loading}
            routes={{}}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default List;
