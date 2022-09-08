import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';

import PrintContainer from 'components/Report/PrintContainer';
import TableReport from 'components/Report/TableReport';

import { apiRoutes, systemColors } from 'utils/defaultValues';
import { Filter, Romanian } from '../interfaces';

import api from 'services/api-aws-amplify';
import { formatDate } from 'utils/formatDate';
import { formatPrice, priceToNumber } from 'utils/formatPrice';
import { Footer, Summary } from './styles';

interface PropTypes {
  state: Filter;
}

interface ISummaryTotals {
  noteValue: string;
  shippingValue: string;
  volume: string;
}

const Print: React.FC<PropTypes> = ({ state }) => {
  const [items, setItems] = useState<Romanian[]>([]);
  const [loading, setLoading] = useState(false);
  const [print, setPrint] = useState(false);
  const [totalSummary, setTotalSummary] = useState<ISummaryTotals>(
    {} as ISummaryTotals
  );

  useEffect(() => {
    const summary = items.reduce(
      (acc, r) => {
        acc.noteValue += Number(priceToNumber(r.noteValue || ''));
        acc.shippingValue += Number(r.shippingValue || 0);
        acc.volume += Number(r.volume || 0);

        return acc;
      },
      { noteValue: 0, shippingValue: 0, volume: 0 }
    );

    setTotalSummary({
      noteValue: formatPrice(summary.noteValue),
      shippingValue: formatPrice(summary.shippingValue),
      volume: summary.volume.toString()
    });
  }, [items]);

  const actionFilter = async (pageNumber: number = 1) => {
    try {
      setPrint(false);
      setLoading(true);
      const resp = await api.get(apiRoutes.romanians, {
        ...state,
        pageNumber,
        pageSize: 100
      });
      setLoading(false);

      const { count, rows } = resp.data;
      const itemsFormatted = rows.map((r: Romanian) => ({
        ...r,
        noteValue: formatPrice(Number(r.noteValue) || 0),
        saleDateAt: formatDate(r.saleDateAt || '')
      }));
      setItems(itemsFormatted);
      setPrint(true);
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
          title="Romaneio de entrega"
          headerList={[
            'DATA',
            'CLIENTE',
            'NOTA',
            'VALOR',
            'ORIGEM DA VENDA',
            'F.PAG.',
            'TRANSP/ENTRE'
          ]}
        >
          {items.map((romanian: Romanian, i: number) => (
            <tr key={i}>
              <td>{romanian.saleDateAt}</td>
              <td>{romanian.clientName}</td>
              <td>{romanian.noteNumber}</td>
              <td>{romanian.noteValue}</td>
              <td>{romanian.originSale}</td>
              <td>{romanian.formOfPayment}</td>
              <td>{romanian.shippingCompany?.name}</td>
            </tr>
          ))}
        </TableReport>
        <Footer>
          <div>
            <span>Quantidade total de volumes {totalSummary.volume}</span>
            <span>Quantidade total de entregas {items.length}</span>
          </div>
          <Summary>
            <span>Valor total de frete {totalSummary.shippingValue}</span>
            <span>Valor total das mercadorias {totalSummary.noteValue}</span>
          </Summary>
        </Footer>
      </PrintContainer>
    </>
  );
};

export default Print;
