import React from 'react';
import PrintContainer from 'components/Report/PrintContainer';

import TableReport from 'components/Report/TableReport';
import Td from './Td';
import { Sale } from '../../interfaces';
import { Product } from '../../CreateEdit/Products/interfaces';
import { formatPrice } from 'utils/formatPrice';

interface PropTypes {
  sale: Sale;
}

const Print: React.FC<PropTypes> = ({ sale }) => {
  return (
    <PrintContainer show={true}>
      <TableReport title={`Venda ${sale.id}`} isFlower={true}>
        {/* <tr style={{ border: '0' }}>
          <td style={{ border: '0' }}> */}
        <table>
          <thead>
            <tr>
              <th colSpan={3}>Produto</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            {sale.products.map((p: Product, index: number) => (
              <tr key={index}>
                <td colSpan={3}>{p.name}</td>
                <td>{formatPrice(Number(p.value!))}</td>
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
        </table>
        {/* </td>
        </tr> */}
      </TableReport>
    </PrintContainer>
  );
};

export default Print;
