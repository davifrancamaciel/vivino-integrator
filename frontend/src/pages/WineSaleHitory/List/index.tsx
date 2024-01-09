import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { EyeOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Col, Image, Tooltip } from 'antd';
import PanelFilter from 'components/PanelFilter';
import GridList from 'components/GridList';
import { Input, Select, RangePicker } from 'components/_inputs';
import {
  apiRoutes,
  appRoutes,
  pageItemsFilter,
  systemColors
} from 'utils/defaultValues';
import { initialStateFilter, WineSaleHistory, WineSale } from '../interfaces';
import useFormState from 'hooks/useFormState';
import api from 'services/api-aws-amplify';
import { formatDateHour, formatDate } from 'utils/formatDate';
import moment from 'moment';
import Sales from '../Sales';

const List: React.FC = () => {
  const history = useHistory();
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
      dispatch({ pageNumber });

      setLoading(true);
      const resp = await api.get(`${apiRoutes.wines}/sale-history`, {
        ...state,
        pageNumber
      });
      setLoading(false);

      const { count, rows } = resp.data;
      const itemsFormatted = rows.map((histo: WineSaleHistory) => ({
        ...histo,
        productName: histo.wine.productName,
        image: (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Image style={{ height: '60px' }} src={histo.wine.image} />
          </div>
        ),
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
        updatedAt: formatDateHour(histo.updatedAt),
        custonActions: (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Tooltip
              placement="top"
              title={`Visualizar vinho ${histo.wine.productName}`}
            >
              <Button
                icon={<EyeOutlined />}
                onClick={() =>
                  history.push(`/${appRoutes.wines}/details/${histo.wineId}`)
                }
                style={{
                  backgroundColor: systemColors.GREY,
                  color: '#fff',
                  marginRight: 4
                }}
              />
            </Tooltip>
            <Tooltip
              placement="top"
              title={`Alterar vinho ${histo.wine.productName}`}
            >
              <Button
                icon={<EditOutlined />}
                onClick={() =>
                  history.push(`/${appRoutes.wines}/edit/${histo.wineId}`)
                }
                style={{
                  backgroundColor: systemColors.YELLOW,
                  color: '#fff',
                  marginRight: 4
                }}
              />
            </Tooltip>
          </div>
        )
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
    <div>
      <Sales visible={visible} setVisible={setVisible} sales={sales} />
      <PanelFilter
        title="Histórico de vendas na vivino"
        actionButton={() => actionFilter()}
        loading={loading}
      >
        <Col lg={3} md={6} sm={24} xs={24}>
          <Input
            label={'Código'}
            type={'number'}
            placeholder="Ex.: 100"
            value={state.wineId}
            onChange={(e) => dispatch({ wineId: e.target.value })}
          />
        </Col>
        <Col lg={3} md={6} sm={24} xs={24}>
          <Input
            label={'SKU Vivino'}
            placeholder="VD-XXXXXXXXX"
            value={state.skuVivino}
            onChange={(e) => dispatch({ skuVivino: e.target.value })}
          />
        </Col>
        <Col lg={5} md={12} sm={24} xs={24}>
          <Input
            label={'Nome do produto'}
            placeholder="Ex.: Famille Perrin Réserve Côtes-du-Rhône 2019 Rouge"
            value={state.productName}
            onChange={(e) => dispatch({ productName: e.target.value })}
          />
        </Col>
        <Col lg={5} md={12} sm={24} xs={24}>
          <RangePicker
            label="Data de confirmação"
            value={[
              state.dateReferenceStart
                ? moment(state.dateReferenceStart)
                : null,
              state.dateReferenceEnd ? moment(state.dateReferenceEnd) : null
            ]}
            onChange={(value: any, dateString: any) => {
              dispatch({
                dateReferenceStart: dateString[0]
                  ?.split('/')
                  .reverse()
                  .join('-')
              });
              dispatch({
                dateReferenceEnd: dateString[1]?.split('/').reverse().join('-')
              });
            }}
          />
        </Col>
        <Col lg={5} md={12} sm={24} xs={24}>
          <RangePicker
            label="Data de importação"
            value={[
              state.createdAtStart ? moment(state.createdAtStart) : null,
              state.createdAtEnd ? moment(state.createdAtEnd) : null
            ]}
            onChange={(value: any, dateString: any) => {
              dispatch({
                createdAtStart: dateString[0]?.split('/').reverse().join('-')
              });
              dispatch({
                createdAtEnd: dateString[1]?.split('/').reverse().join('-')
              });
            }}
          />
        </Col>
        <Col lg={3} md={12} sm={24} xs={24}>
          <Select
            label={'Itens por pág'}
            options={pageItemsFilter}
            value={state?.pageSize}
            onChange={(pageSize) => dispatch({ pageSize })}
          />
        </Col>
      </PanelFilter>
      <GridList
        scroll={{ x: 840 }}
        columns={[
          { title: 'Imagem', dataIndex: 'image' },
          { title: 'Código', dataIndex: 'wineId' },
          { title: 'Nome do produto', dataIndex: 'productName' },
          {
            title: 'Data da confirmação na Vivino',
            dataIndex: 'dateReference'
          },
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
          { title: 'Importado em', dataIndex: 'createdAt' },
          { title: 'Ações', dataIndex: 'custonActions' }
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
    </div>
  );
};

export default List;
