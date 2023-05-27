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
      <TableReport title={`Venda ${sale.id}`} isFlower={true}>
        {/* <tr style={{ border: '0' }}>
          <td style={{ border: '0' }}> */}
        <table>
          <thead>
            <tr>
              <th>Codigo</th>
              <th>Produto</th>
              <th>Preço</th>
              <th>Valor vendido</th>
              <th>Quantidade</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {sale.productsSales.map((sp: SaleProduct, index: number) => (
              <tr key={index}>
                <td >{sp.productId}</td>
                <td >{sp.product.name}</td>
                <td>{formatPrice(Number(sp.product.price!))}</td>
                <td>{formatPrice(Number(sp.value!))}</td>
                <td >{sp.amount}</td>
                <td>{formatPrice(Number(sp.valueAmount!))}</td>
              </tr>
            ))}
            <tr>
              <Td title="Data" value={sale.createdAt} />
              <Td colSpan={4} title="Vendedor" value={sale.userName} />
              <Td title="Valor total" value={sale.value} />
            </tr>
            <tr>
              <Td colSpan={6} title="Obs." value={sale.note} />
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
