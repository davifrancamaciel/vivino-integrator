import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import { parseISO, format } from 'date-fns';

import PrintContainer from 'components/Report/PrintContainer';
import TableReport from 'components/Report/TableReport';

import { apiRoutes, systemColors, particularUsers } from 'utils/defaultValues';
import { Filter, Sale } from '../../interfaces';

import api from 'services/api-aws-amplify';
import { formatDate } from 'utils/formatDate';
import { formatPrice, priceToNumber } from 'utils/formatPrice';
import { Footer, Summary } from './styles';
interface PropTypes {
  state: Filter;
}

interface ISummaryTotals {
  totalSales: string;
  totalCommission: string;
}

const Print: React.FC<PropTypes> = ({ state }) => {
  const [filteredPeriod, setFilteredPeriod] = useState('');
  const [items, setItems] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(false);
  const [print, setPrint] = useState(false);
  const [totalSummary, setTotalSummary] = useState<ISummaryTotals>(
    {} as ISummaryTotals
  );

  useEffect(() => {
    if (state.createdAtStart && state.createdAtEnd) {
      const start = format(parseISO(state.createdAtStart), 'dd/MM/yyyy');
      const end = format(parseISO(state.createdAtEnd), 'dd/MM/yyyy');
      setFilteredPeriod(`período de ${start} à ${end}`);
    }
  }, [state]);

  useEffect(() => {
    const summary = items.reduce(
      (acc, r) => {
        acc.totalSales += Number(priceToNumber(r.value!.toString()));
        if (r.userId !== particularUsers.userIdRe) {
          acc.totalCommission +=
            Number(priceToNumber(r.value!.toString())) * 0.05;
        }

        return acc;
      },
      { totalSales: 0, totalCommission: 0 }
    );

    setTotalSummary({
      totalSales: formatPrice(summary.totalSales),
      totalCommission: formatPrice(summary.totalCommission)
    });
  }, [items]);

  const actionFilter = async (
    pageNumber: number = 1,
    itemsArray: Sale[] = []
  ) => {
    try {
      setPrint(false);
      setLoading(true);

      const resp = await api.get(apiRoutes.sales, {
        ...state,
        pageNumber,
        pageSize: 1000
      });

      const { count, rows } = resp.data;

      const itemsFormatted: Sale[] = rows.map((s: any) => ({
        ...s,
        products: s.productsFormatted,
        value: formatPrice(Number(s.value!)),
        createdAt: formatDate(s.createdAt || '')
      }));

      itemsArray = [...itemsArray, ...itemsFormatted];

      if (count > itemsArray.length) {
        const nextPage = pageNumber + 1;
        await actionFilter(nextPage, itemsArray);
      } else {
        setItems(itemsArray);
        setLoading(false);
        setPrint(true);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        style={{ backgroundColor: systemColors.YELLOW, color: '#fff' }}
        icon={<PrinterOutlined />}
        onClick={() => actionFilter()}
        loading={loading}
        block
      >
        Imprimir
      </Button>
      <PrintContainer show={false} print={print}>
        <TableReport
          isFlower={true}
          title={`Relatorio de vendas ${filteredPeriod}`}
          headerList={['Código', 'Data', 'Vendedor', 'Valor', 'Obs.']}
        >
          {items.map((sale: Sale, i: number) => (
            <tr key={i}>
              <td>{sale.id}</td>
              <td>{sale.createdAt}</td>
              <td>{sale.userName}</td>
              <td>{sale.value}</td>
              <td>{sale.note}</td>
              {/* <table>
                <thead>
                  <th colSpan={3}>Produto</th>
                  <th>Valor</th>
                </thead>
                <tbody>
                  {sale.products.map((p: Product, index: number) => (
                    <tr key={index}>
                      <td colSpan={3}>{p.name}</td>
                      <td>{formatPrice(p.value!)}</td>
                    </tr>
                  ))}
                  <tr>
                    <Td title="Data" value={sale.createdAt} />
                    <Td colSpan={2} title="Vendedor" value={sale.userName} />
                    <Td title="Valor total" value={sale.value} />
                  </tr>
                  <tr>
                    <Td colSpan={4} title="Obs." value={sale.note} />
                  </tr>
                </tbody>
              </table> */}
            </tr>
          ))}
        </TableReport>
        <Footer>
          <div>
            <span>Quantidade total de vendas {items.length}</span>
            <span>{filteredPeriod}</span>
          </div>
          <Summary>
            <span>
              Valor total de vendas no periodo {totalSummary.totalSales}
            </span>
            <span>
              Valor total de comissões sob as vendas em (5%){' '}
              {totalSummary.totalCommission}
            </span>
          </Summary>
        </Footer>
      </PrintContainer>
    </>
  );
};

export default Print;
