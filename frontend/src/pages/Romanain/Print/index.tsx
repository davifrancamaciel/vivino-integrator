import React from 'react';
import PrintContainer from 'components/Report/PrintContainer';
import { Romanian } from '../interfaces';

import TableReport from 'components/Report/TableReport';
import Td from './Td';

interface PropTypes {
  romanian: Romanian;
}

const Print: React.FC<PropTypes> = ({ romanian }) => {
  return (
    <PrintContainer show={true}>
      <TableReport title="Romaneio de entrega">
        <tr>
          <Td title="Empresa" value={romanian.company?.name} />
          <Td title="Empresa" value={romanian.company?.name} />
          <Td title="Nome do cliente" value={romanian.clientName} />
        </tr>
        <tr>
          <Td title="Numero da nota" value={romanian.noteNumber} />
          <Td title="Valor da nota" value={romanian.noteValue} />
          <Td
            title="Transporadora/Entregador"
            value={romanian.shippingCompany?.name}
          />
        </tr>
        <tr>
          <Td title="Valor do frete" value={romanian.shippingValue} />
          <Td
            title="Código/link de rastreamento"
            value={romanian.trackingCode}
          />
          <Td title="Origem da venda" value={romanian.originSale} />
        </tr>
        <tr>
          <Td title="Volumes" value={romanian.volume} />
          <Td title="Forma de pagamento" value={romanian.formOfPayment} />
          <Td title="Entregue" value={romanian.delivered ? 'SIM' : 'NÂO'} />
        </tr>
        <tr>
          <Td title="Data da expedição" value={romanian.saleDateAt} />
          <Td title="Cadastro" value={romanian.createdAt} />
          <Td title="Ultima alteração" value={romanian.updatedAt} />
        </tr>
      </TableReport>
    </PrintContainer>
  );
};

export default Print;
