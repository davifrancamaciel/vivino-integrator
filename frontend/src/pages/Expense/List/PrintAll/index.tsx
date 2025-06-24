import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';

import PrintContainer from 'components/Report/PrintContainer';
import TableReport from 'components/Report/TableReport';

import { apiRoutes, systemColors } from 'utils/defaultValues';
import { Filter, ExpenseType, Expense } from '../../interfaces';

import api from 'services/api-aws-amplify';
import { formatDate } from 'utils/formatDate';
import { formatPrice, priceToNumber } from 'utils/formatPrice';
import { Footer, Summary } from './styles';

interface PropTypes {
  state: Filter;
}

interface ISummaryTotals {
  value: string;
  ammount: string;
}

const Print: React.FC<PropTypes> = ({ state }) => {
  const [items, setItems] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [print, setPrint] = useState(false);
  const [totalSummary, setTotalSummary] = useState<ISummaryTotals>(
    {} as ISummaryTotals
  );

  useEffect(() => {
    const summary = items.reduce(
      (acc, r) => {
        acc.value += Number(r.value);
        // acc.ammount += Number(r.ammount || 0);

        return acc;
      },
      { value: 0, ammount: 0, volume: 0 }
    );

    setTotalSummary({
      value: formatPrice(summary.value),
      ammount: formatPrice(summary.ammount)
    });
  }, [items]);

  const actionFilter = async (
    pageNumber: number = 1,
    itemsArray: Expense[] = []
  ) => {
    try {
      setPrint(false);
      setLoading(true);
      const resp = await api.get(apiRoutes.expenses, {
        ...state,
        pageNumber,
        pageSize: 100
      });

      const { count, rows } = resp.data;
      const itemsFormatted = rows.map((item: Expense) => ({
        ...item,
        value: formatPrice(Number(item.value) || 0),
        paymentDate: formatDate(item.paymentDate || '')
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
          image=""
          // image={items[0]?.company?.image || ''}
          title="Relatório de despesas"
          headerList={[
            'CÓDIGO',
            'TIPO',
            'TITULO',
            'STATUS',
            'VALOR',
            'VENCIMENTO',
            'DATA CADASTRO.'
          ]}
        >
          {items.map((item: Expense, i: number) => (
            <tr key={i}>
              <td>{item.id}</td>
              <td>{item.expenseType?.name}</td>
              <td>{item.title}</td>
              <td>{item.paidOut}</td>
              <td>{item.value}</td>
              <td>{item.paymentDate}</td>
              <td>{item.createdAt}</td>
            </tr>
          ))}
        </TableReport>
        <Footer>
          <div>
            {/* <span>Quantidade total de volumes {totalSummary.volume}</span> */}
            <span>Quantidade total de entregas {items.length}</span>
          </div>
          <Summary>
            <span>Valor total de frete {totalSummary.value}</span>
            {/* <span>Valor total das mercadorias {totalSummary.noteValue}</span> */}
          </Summary>
        </Footer>
      </PrintContainer>
    </>
  );
};

export default Print;
