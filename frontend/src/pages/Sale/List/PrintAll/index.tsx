import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import { parseISO, format } from 'date-fns';

import PrintContainer from 'components/Report/PrintContainer';
import TableReport from 'components/Report/TableReport';

import { apiRoutes, systemColors } from 'utils/defaultValues';
import { Filter, Sale, SaleProduct } from '../../interfaces';

import api from 'services/api-aws-amplify';
import { formatDate } from 'utils/formatDate';
import { formatPrice, priceToNumber } from 'utils/formatPrice';
import { Footer, Summary } from './styles';
import Td from './Td';
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
  const [totalCommission, setTotalCommission] = useState(0);
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
        acc.totalCommission +=
          Number(priceToNumber(r.value!.toString())) * (totalCommission / 100);

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

      const { count, rows, commission } = resp.data;
      setTotalCommission(commission);

      const itemsFormatted = rows.map((s: Sale) => ({
        ...s,
        userName: s.user!.name,
        clientName: s.client?.name,
        products: s.productsSales.map(
          (sp: SaleProduct) =>
            `${sp.amount} ${sp.product.name} ${formatPrice(
              Number(sp.valueAmount! || 0)
            )}, `
        ),
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
          image={items[0]?.company?.image || ''}
          title={`Relatorio de vendas ${filteredPeriod}`}
          // headerList={['Código', 'Data', 'Vendedor', 'Valor', 'Obs.']}
        >
          {items.map((sale: Sale, i: number) => (
            <tr key={i} style={{ border: 'solid 1px #000' }}>
              <table>
                <tr>
                  <Td colSpan={1} title="Código" value={sale.id} />
                  <Td colSpan={1} title="Data" value={sale.createdAt} />
                  <Td colSpan={2} title="Vendedor" value={sale.userName} />
                  <Td colSpan={2} title="Cliente" value={sale.clientName} />
                  <Td colSpan={2} title="Valor" value={sale.value} />
                </tr>
                <tr>
                  <Td colSpan={8} title="Produtos" value={sale.products} />
                </tr>
                {sale.note && (
                  <tr>
                    <Td colSpan={8} title="Observações" value={sale.note} />
                  </tr>
                )}
              </table>
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
            {state.showCommission && (
              <span>
                Valor total de comissões dos vendedores sob as vendas em (
                {totalCommission}%) {totalSummary.totalCommission}
              </span>
            )}
          </Summary>
        </Footer>
        {state.showCommission && (
          <Footer>
            <p>
              Obs a comissão a pagar individual de cada vendedor poderá ser
              vista no menu de despesas a partir do dia 1º dia de cada mes
              referente ao mes anterior
            </p>
          </Footer>
        )}
      </PrintContainer>
    </>
  );
};

export default Print;
