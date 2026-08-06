import React, { useEffect, useState } from 'react';

import PrintContainer from 'components/Report/PrintContainer';
import TableReport from 'components/Report/TableReport';

import { Expense } from '../../../interfaces';

import { formatPrice } from 'utils/formatPrice';
import { Footer, Summary } from './styles';
import { PropTypes } from '../interfaces';
interface ISummaryTotals {
  value: string;
}

const Print: React.FC<PropTypes> = ({ actionFilter, items, print, title }) => {
  const [totalSummary, setTotalSummary] = useState<ISummaryTotals>(
    {} as ISummaryTotals
  );

  useEffect(() => {
    const summary = items.reduce(
      (acc, r) => {
        acc.value += Number(r.value);

        return acc;
      },
      { value: 0 }
    );

    setTotalSummary({
      value: formatPrice(summary.value)
    });
  }, [items]);

  return (
    <>
      <a onClick={() => actionFilter('pdf')}>Imprimir</a>
      <PrintContainer show={false} print={print} filename={`Relatório de ${title}`}>
        <TableReport
          image={items[0]?.company?.image || ''}
          title={`Relatório de ${title}`}
          headerList={[
            'CÓDIGO',
            'EMPRESA',
            'TIPO',
            'TITULO',
            'PAGO',
            'VALOR',
            'VENCIMENTO'
          ]}
        >
          {items.map((item: Expense, i: number) => (
            <tr key={i}>
              <td>{item.id}</td>
              <td>{item.company?.name}</td>
              <td>{item.expenseType?.name}</td>
              <td>{item.title}</td>
              <td>{item.paidOut}</td>
              <td>{item.valueFormatted}</td>
              <td>{item.paymentDate}</td>
            </tr>
          ))}
        </TableReport>
        <Footer>
          <div>
            <span>Quantidade total {items.length}</span>
          </div>
          <Summary>
            <span>Valor total {totalSummary.value}</span>
          </Summary>
        </Footer>
      </PrintContainer>
    </>
  );
};

export default Print;
