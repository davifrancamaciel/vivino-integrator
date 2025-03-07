import React, { useEffect, useState } from 'react';
import { EyeOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Col, Image } from 'antd';
import PanelFilter from 'components/PanelFilter';
import GridList from 'components/GridList';
import { Input, Select, RangePicker, ActionButton } from 'components/_inputs';
import { apiRoutes, pageItemsFilter, systemColors } from 'utils/defaultValues';
import { initialStateFilter, SaleVivino } from '../interfaces';
import useFormState from 'hooks/useFormState';
import api from 'services/api-aws-amplify';
import { formatDateHour } from 'utils/formatDate';
import moment from 'moment';
import Sales from '../Sales';
import { formatPrice } from 'utils/formatPrice';
import { useQuery } from 'hooks/queryString';
import { Link } from 'react-router-dom';
import WineGrid from '../WineGrid';

const List: React.FC = () => {
  const query = useQuery();
  const { state, dispatch } = useFormState(initialStateFilter);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [sale, setSale] = useState<SaleVivino>();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    actionFilter(
      1,
      query.get('code') || undefined,
      query.get('sale') || undefined
    );
  }, []);

  const actionFilter = async (
    pageNumber: number = 1,
    code: string = state.code,
    sale: string = state.sale
  ) => {
    try {
      dispatch({ pageNumber, code, sale });

      setLoading(true);
      const resp = await api.get(`${apiRoutes.wines}/sales`, {
        ...state,
        pageNumber,
        code,
        sale
      });
      setLoading(false);

      const { count, rows } = resp.data;
      const itemsFormatted = rows.map((sale: any) => ({
        ...sale,
        user: (
          <Link to={`/clients?email=${sale.saleFormatted?.user?.email}`}>
            {sale.saleFormatted?.user?.alias}
          </Link>
        ),
        image: (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Image
              style={{ height: '60px' }}
              src={sale.saleFormatted.user.image.location}
            />
          </div>
        ),
        value: formatPrice(sale.value),
        saleDate: formatDateHour(sale.saleDate),
        createdAt: formatDateHour(sale.createdAt),
        updatedAt: formatDateHour(sale.updatedAt),
        custonActions: (
          <>
            <div style={{ display: 'flex' }}>
              <ActionButton
                title={`Visualizar venda`}
                backgroundColor={systemColors.GREY}
                icon={<EyeOutlined />}
                onClick={() =>
                  handleView({
                    createdAt: formatDateHour(sale.createdAt),
                    ...sale.saleFormatted
                  })
                }
              />
              <ActionButton
                title={
                  sale.trackingUrl
                    ? `Clique aqui para ver o rastreio da entrega`
                    : 'Ainda não possui link de rastreio'
                }
                backgroundColor={
                  sale.trackingUrl ? systemColors.GREEN : systemColors.YELLOW
                }
                icon={<ShoppingCartOutlined />}
                onClick={() =>
                  sale.trackingUrl && window.open(sale.trackingUrl, '_blank')
                }
              />
            </div>
          </>
        ),
        expandable: (
          <WineGrid sale={sale.saleFormatted as SaleVivino} hidetotalRecords />
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

  const handleView = (sale: SaleVivino) => {
    setVisible(true);
    setSale(sale);
  };

  return (
    <div>
      <Sales visible={visible} setVisible={setVisible} sale={sale} />
      <PanelFilter
        title="Vendas na vivino"
        actionButton={() => actionFilter()}
        loading={loading}
      >
        <Col lg={3} md={5} sm={24} xs={24}>
          <Input
            label={'Código'}
            placeholder="Ex.: X2J5VU7P"
            value={state.code}
            onChange={(e) => dispatch({ code: e.target.value })}
          />
        </Col>
        <Col lg={4} md={7} sm={24} xs={24}>
          <Input
            label={'Venda'}
            placeholder="Ex.: "
            value={state.sale}
            onChange={(e) => dispatch({ sale: e.target.value })}
          />
        </Col>
        <Col lg={7} md={12} sm={24} xs={24}>
          <RangePicker
            label="Data de venda"
            value={[
              state.saleDateStart ? moment(state.saleDateStart) : null,
              state.saleDateEnd ? moment(state.saleDateEnd) : null
            ]}
            onChange={(value: any, dateString: any) => {
              dispatch({
                saleDateStart: dateString[0]?.split('/').reverse().join('-')
              });
              dispatch({
                saleDateEnd: dateString[1]?.split('/').reverse().join('-')
              });
            }}
          />
        </Col>
        <Col lg={7} md={12} sm={24} xs={24}>
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
          { title: 'Código', dataIndex: 'code' },
          { title: 'Foto', dataIndex: 'image' },
          { title: 'Cliente', dataIndex: 'user' },
          { title: 'Data da venda na Vivino', dataIndex: 'saleDate' },
          { title: 'Valor', dataIndex: 'value' },
          { title: 'Nota', dataIndex: 'noteNumber' },
          { title: 'Importada em', dataIndex: 'createdAt' },
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
