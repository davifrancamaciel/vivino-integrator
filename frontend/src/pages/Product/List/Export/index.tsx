import React, { useState } from 'react';
import { DownloadOutlined } from '@ant-design/icons';

import ExportCSV from 'components/ExportCSV';

import { formatDateHour } from 'utils/formatDate';
import api from 'services/api-aws-amplify';
import { Filter, Product } from '../../interfaces';

import { Button } from 'antd';
import { apiRoutes, systemColors } from 'utils/defaultValues';

const Export: React.FC<Filter> = (props) => {
  const [loading, setLoading] = useState(false);
  const [formattedData, setFormattedData] = useState<Array<any>>([]);

  const actionFilter = async (
    pageNumber: number = 1,
    itemsArray: Product[] = []
  ) => {
    try {
      setLoading(true);

      const resp = await api.get(apiRoutes.products, {
        ...props,
        pageNumber,
        pageSize: 500
      });

      const { count, rows } = resp.data;

      itemsArray = [...itemsArray, ...rows];

      if (count > itemsArray.length) {
        const nextPage = pageNumber + 1;
        await actionFilter(nextPage, itemsArray);
      } else {
        const newData = itemsArray.map((item: Product) => ({
          ...item,
          active: item.active ? 'SIM' : 'NÃO',
          createdAt: formatDateHour(item.createdAt),
          updatedAt: formatDateHour(item.updatedAt)
        }));
        setFormattedData(newData);
        setLoading(false);
        const btn = document.getElementById('ghost-button');
        if (btn) {
          btn.click();
        }
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <>
      <ExportCSV
        id="export-csv"
        data={formattedData}
        documentTitle={`relatorio-de-produtos-${new Date().getTime()}.csv`}
        headers={[
          { label: 'Código do produto', key: 'id' },
          { label: 'Nome do produto', key: 'name' },
          { label: 'Preço', key: 'price' },
          { label: 'Ativo', key: 'active' },
          { label: 'Data de cadastro', key: 'createdAt' },
          { label: 'Data de alteração', key: 'updatedAt' },
          { label: 'Tamanho', key: 'size' },        
          { label: 'Estoque', key: 'inventoryCount' },
          { label: 'Cor', key: 'color' },
          { label: 'Código de barras', key: 'ean' },
          { label: 'Descrição', key: 'description' }
        ]}
      >
        <Button
          id="ghost-button"
          style={{ display: 'none' }}
          loading={loading}
        ></Button>
      </ExportCSV>

      <Button
        type="link"
        icon={<DownloadOutlined />}
        onClick={() => actionFilter()}
        loading={loading}
        style={{ backgroundColor: systemColors.YELLOW, color: '#fff' }}
      >
        Exportar para CSV
      </Button>
    </>
  );
};

export default Export;
