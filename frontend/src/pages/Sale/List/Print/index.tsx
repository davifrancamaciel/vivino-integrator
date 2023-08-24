import React from 'react';
import PrintContainer from 'components/Report/PrintContainer';

import TableReport from 'components/Report/TableReport';
import Td from './Td';
import { Sale, SaleProduct } from '../../interfaces';
import { formatPrice } from 'utils/formatPrice';

interface PropTypes {
  sale: Sale;
}

const Print: React.FC<PropTypes> = ({ sale }) => {
  return (
    <PrintContainer show={true}>
      <TableReport
        title={`Venda ${sale.id}`}
        image={sale?.company?.image || ''}
      >
        <table>
          <thead>
            <tr>
              <th style={{ borderRight: '0' }}>Codigo</th>
              <th style={{ borderRight: '0', borderLeft: '0' }}>Produto</th>
              <th style={{ borderRight: '0', borderLeft: '0' }}>Preço</th>
              <th style={{ borderRight: '0', borderLeft: '0' }}>
                Valor vendido
              </th>
              <th style={{ borderRight: '0', borderLeft: '0' }}>Quantidade</th>
              <th style={{ borderLeft: '0' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {sale.productsSales.map((sp: SaleProduct, index: number) => (
              <tr key={index}>
                <td>{sp.productId}</td>
                <td>
                  {sp.product.name} {sp.product.size}
                </td>
                <td>{formatPrice(Number(sp.product.price!))}</td>
                <td>{formatPrice(Number(sp.value!))}</td>
                <td>{sp.amount}</td>
                <td>{formatPrice(Number(sp.valueAmount!))}</td>
              </tr>
            ))}
            <tr>
              <Td title="Data" value={sale.createdAt} />
              <Td colSpan={4} title="Vendedor" value={sale.userName} />
              <Td
                title="Valor total"
                value={formatPrice(Number(sale.value!))}
              />
            </tr>
            <tr>
              <Td colSpan={6} title="Obs." value={sale.note} />
            </tr>
          </tbody>
        </table>
      </TableReport>
    </PrintContainer>
  );
};

export default Print;
