import React, { useEffect, useState } from 'react';
import { Col } from 'antd';
import PanelFilter from 'components/PanelFilter';
import GridList from 'components/GridList';
import { Input, RangePicker } from 'components/_inputs';
import { apiRoutes, appRoutes } from 'utils/defaultValues';
import { initialStateFilter, Romanian } from '../interfaces';
import useFormState from 'hooks/useFormState';
import api from 'services/api-aws-amplify';
import { formatDateHour } from 'utils/formatDate';
import { formatPrice } from 'utils/formatPrice';

const List: React.FC = () => {
  const { state, dispatch } = useFormState(initialStateFilter);
  const [items, setItems] = useState<Romanian[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    actionFilter();
  }, []);

  useEffect(() => {
    actionFilter();
  }, []);

  const actionFilter = async (pageNumber: number = 1) => {
    try {
      dispatch({ pageNumber });

      setLoading(true);
      const resp = await api.get(apiRoutes.romanians, {
        ...state,
        pageNumber
      });
      setLoading(false);

      const { count, rows } = resp.data;
      const itemsFormatted = rows.map((r: Romanian) => ({
        ...r,
        nameInfoDel: `Romaneio código ${r.id} empresa ${r.company?.name}`,
        companyName: r.company?.name,
        shippingCompanyName: r.shippingCompany?.name,
        noteValue: formatPrice(Number(r.noteValue) || 0),
        shippingValue: formatPrice(Number(r.shippingValue) || 0),
        saleDateAt: formatDateHour(r.saleDateAt),
        createdAt: formatDateHour(r.createdAt),
        updatedAt: formatDateHour(r.updatedAt)
      }));
      setItems(itemsFormatted);
      console.log(itemsFormatted);
      setTotalRecords(count);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div>
      <PanelFilter
        title="Romaneios cadastrados"
        actionButton={() => actionFilter()}
        loading={loading}
      >
        <Col lg={3} md={12} sm={24} xs={24}>
          <Input
            label={'Código'}
            type={'number'}
            placeholder="Ex.: 100"
            value={state.id}
            onChange={(e) => dispatch({ id: e.target.value })}
          />
        </Col>
        <Col lg={7} md={12} sm={24} xs={24}>
          <Input
            label={'Empresa'}
            placeholder="Ary Delicatessen"
            value={state.companyName}
            onChange={(e) => dispatch({ companyName: e.target.value })}
          />
        </Col>

        <Col lg={7} md={12} sm={24} xs={24}>
          <Input
            label={'Cliente'}
            placeholder="Ex.: José Almeida"
            value={state.clientName}
            onChange={(e) => dispatch({ clientName: e.target.value })}
          />
        </Col>
        <Col lg={7} md={12} sm={24} xs={24}>
          <Input
            label={'Transportadora'}
            placeholder="Ex.: Camilo dos Santos"
            value={state.shippingCompanyName}
            onChange={(e) => dispatch({ shippingCompanyName: e.target.value })}
          />
        </Col>
        <Col lg={3} md={12} sm={24} xs={24}>
          <Input
            label={'Numero da nota'}
            placeholder="Ex.: 002379"
            value={state.noteNumber}
            onChange={(e) => dispatch({ noteNumber: e.target.value })}
          />
        </Col>
        <Col lg={7} md={12} sm={24} xs={24}>
          <Input
            label={'Origem da venda'}
            placeholder="Ex.: Mercado livre"
            value={state.originSale}
            onChange={(e) => dispatch({ originSale: e.target.value })}
          />
        </Col>
        <Col lg={7} md={12} sm={24} xs={24}>
          <Input
            label={'Código/link de rastreio'}
            placeholder="Ex.: 111213217"
            value={state.trackingCode}
            onChange={(e) => dispatch({ trackingCode: e.target.value })}
          />
        </Col>
        <Col lg={7} md={16} sm={24} xs={24}>
          <RangePicker
            label="Data da venda"
            onChange={(value: any, dateString: any) => {
              dispatch({
                saleDateAtStart: dateString[0]?.split('/').reverse().join('-')
              });
              dispatch({
                saleDateAtEnd: dateString[1]?.split('/').reverse().join('-')
              });
            }}
          />
        </Col>
      </PanelFilter>
      <GridList
        scroll={{ x: 840 }}
        columns={[
          { title: 'Código', dataIndex: 'id' },
          { title: 'Empresa', dataIndex: 'companyName' },
          { title: 'Cliente', dataIndex: 'clientName' },
          { title: 'Transportadora/Entregador', dataIndex: 'shippingCompanyName' },
          { title: 'Nota', dataIndex: 'noteNumber' },
          { title: 'Valor', dataIndex: 'noteValue' },
          { title: 'Código/link de rastreio', dataIndex: 'trackingCode' },
          { title: 'Origem da venda', dataIndex: 'originSale' },
          { title: 'Data da venda', dataIndex: 'saleDateAt' }
        ]}
        dataSource={items}
        onPagination={(pageNumber) => actionFilter(pageNumber)}
        onDelete={() => {
          actionFilter(state.pageNumber);
        }}
        propTexObjOndelete={'nameInfoDel'}
        totalRecords={totalRecords}
        pageSize={state.pageSize}
        loading={loading}
        routes={{
          routeCreate: `/${appRoutes.romanians}/create`,
          routeUpdate: `/${appRoutes.romanians}/edit`,
          routeView: `/${appRoutes.romanians}/details`,
          routeDelete: `/${appRoutes.romanians}`
        }}
      />
    </div>
  );
};

export default List;
