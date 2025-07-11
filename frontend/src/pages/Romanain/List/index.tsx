import React, { useEffect, useState } from 'react';
import { Col } from 'antd';
import PanelFilter from 'components/PanelFilter';
import GridList from 'components/GridList';
import { Input, RangePicker, Select } from 'components/_inputs';
import { apiRoutes, appRoutes, booleanFilter } from 'utils/defaultValues';
import { initialStateFilter, Romanian, originCompanys } from '../interfaces';
import useFormState from 'hooks/useFormState';
import api from 'services/api-aws-amplify';
import { formatDate, formatDateHour } from 'utils/formatDate';
import { formatPrice } from 'utils/formatPrice';
import Print from '../Print';
import PrintAll from '../PrintAll';
import Action from './Action';
import { endOfMonth, startOfMonth } from 'date-fns';
import moment from 'moment';

const List: React.FC = () => {
  const { state, dispatch } = useFormState(initialStateFilter);
  const [items, setItems] = useState<Romanian[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [update, setUpdate] = useState<Romanian>();

  useEffect(() => {
    const date = new Date();
    const saleDateAtStart = startOfMonth(date).toISOString();
    const saleDateAtEnd = endOfMonth(date).toISOString();
    // actionFilter(1, saleDateAtStart, saleDateAtEnd);
    actionFilter(1, 'false');
  }, []);

  useEffect(() => {
    const newItems = items.map((x: any) => {
      return x.id === update!.id
        ? {
            ...x,
            noteValue: formatPrice(Number(update!.noteValue) || 0),
            saleDateAt: formatDate(update!.saleDateAt),
            print: <Print romanian={update!} />,
            sended: (
              <Action item={update!} setUpdate={setUpdate} type="sended" />
            ),
            delivered: (
              <Action item={update!} setUpdate={setUpdate} type="delivered" />
            )
          }
        : x;
    });
    setItems(newItems);
  }, [update]);

  const actionFilter = async (
    pageNumber: number = 1,
    // saleDateAtStart = state.saleDateAtStart,
    // saleDateAtEnd = state.saleDateAtEnd,
    delivered = state.delivered
  ) => {
    try {
      dispatch({
        ...state,
        pageNumber,
        // saleDateAtStart,
        // saleDateAtEnd,
        delivered
      });

      setLoading(true);
      const resp = await api.get(apiRoutes.romanians, {
        ...state,
        pageNumber,
        // saleDateAtStart,
        // saleDateAtEnd,
        delivered
      });
      setLoading(false);

      const { count, rows } = resp.data;
      const itemsFormatted = rows.map((r: Romanian) => {
        const item = {
          ...r,
          nameInfoDel: `Romaneio código ${r.id} empresa ${r.company?.name}`,
          companyName: r.company?.name,
          shippingCompanyName: r.shippingCompany?.name,
          noteValue: formatPrice(Number(r.noteValue) || 0),
          shippingValue: formatPrice(Number(r.shippingValue) || 0),
          saleDateAt: formatDate(r.saleDateAt),
          createdAt: formatDateHour(r.createdAt),
          updatedAt: formatDateHour(r.updatedAt)
        };
        return {
          ...item,
          print: <Print romanian={item} />,
          sended: <Action item={r} setUpdate={setUpdate} type="sended" />,
          delivered: <Action item={r} setUpdate={setUpdate} type="delivered" />
        };
      });
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
        <Col lg={4} md={12} sm={24} xs={24}>
          <Select
            label={'Enviados'}
            options={booleanFilter}
            value={state?.sended}
            onChange={(sended) => dispatch({ sended })}
          />
        </Col>
        <Col lg={3} md={12} sm={24} xs={24}>
          <Select
            label={'Entregues'}
            options={booleanFilter}
            value={state?.delivered}
            onChange={(delivered) => dispatch({ delivered })}
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
            label={'Nota'}
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
        <Col lg={7} md={24} sm={24} xs={24}>
          <RangePicker
            label="Data da expedição"
            value={[
              state.saleDateAtStart ? moment(state.saleDateAtStart) : null,
              state.saleDateAtEnd ? moment(state.saleDateAtEnd) : null
            ]}
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
        size="small"
        headerChildren={<PrintAll state={state} />}
        scroll={{ x: 840 }}
        columns={[
          { title: 'Código', dataIndex: 'id' },
          { title: 'Nota', dataIndex: 'noteNumber' },
          { title: 'Cliente', dataIndex: 'clientName' },
          {
            title: 'Transportadora/Entregador',
            dataIndex: 'shippingCompanyName'
          },
          { title: 'Valor', dataIndex: 'noteValue' },
          // { title: 'Código/link de rastreio', dataIndex: 'trackingCode' },
          { title: 'Data da expedição', dataIndex: 'saleDateAt' },
          { title: 'Enviado', dataIndex: 'sended' },
          { title: 'Entregue', dataIndex: 'delivered' },
          { title: '', dataIndex: 'print' }
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
