import React from 'react';
import { Button } from 'antd';

import ExportCSV from 'components/ExportCSV';
import { PropTypes } from '../interfaces';

const Export: React.FC<PropTypes> = ({ actionFilter, items, title }) => {
  return (
    <>
      <ExportCSV
        id="export-csv"
        data={items}
        documentTitle={`${title}-${new Date().getTime()}.csv`}
        headers={[
          { label: 'CÓDIGO', key: 'id' },
          { label: 'EMPRESA', key: 'companyName' },
          { label: 'TIPO', key: 'typeName' },
          { label: 'TITULO', key: 'title' },
          { label: 'PAGO', key: 'paidOut' },
          { label: 'VALOR', key: 'value' },
          { label: 'VENCIMENTO', key: 'paymentDate' },
          { label: 'CADASTRO', key: 'createdAt' },
          { label: 'ALTERAÇÃO', key: 'updatedAt' },
          { label: 'DESCRIÇÃO', key: 'description' }
        ]}
      >
        <Button id="ghost-button" style={{ display: 'none' }}></Button>
      </ExportCSV>
      <a onClick={() => actionFilter('csv')}>Exportar para CSV</a>
    </>
  );
};

export default Export;
