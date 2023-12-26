import React, { useState } from 'react';
import { DownloadOutlined } from '@ant-design/icons';

import ExportCSV from 'components/ExportCSV';

import { formatPrice } from 'utils/formatPrice';
import api from 'services/api-aws-amplify';

import { Button } from 'antd';
import { apiRoutes, systemColors } from 'utils/defaultValues';
import { Products } from '../../interfaces';
import { Filter } from '../interfaces';

const Export: React.FC<Filter> = (props) => {
  const [loading, setLoading] = useState(false);
  const [nameReport, setNameReport] = useState('');
  const [formattedData, setFormattedData] = useState<Array<any>>([]);

  const actionFilter = async (itemsArray: Products[] = []) => {
    try {
      setLoading(true);
      setNameReport(`relatorio-${props.type}-${new Date().getTime()}.csv`);
      const resp = await api.get(
        `${apiRoutes.dashboard}/graph-bar/${props.type}`,
        {
          ...props,
          pageSize: 500
        }
      );

      const rows = resp.data;

      itemsArray = [...itemsArray, ...rows];

      const newData = itemsArray.map((item: Products) => ({
        ...item,
        active: item.active ? 'SIM' : 'NÃO',
        price: formatPrice(Number(item.price))
      }));
      setFormattedData(newData);
      setLoading(false);
      const btn = document.getElementById('ghost-button');
      if (btn) {
        btn.click();
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
        documentTitle={nameReport}
        headers={[
          { label: 'Quatidade vendida', key: 'value' },
          { label: 'Código', key: 'id' },
          { label: 'Nome', key: 'label' },
          { label: 'Ativo', key: 'active' },
          { label: 'Preço atual', key: 'price' },
          { label: 'Estoque atual', key: 'inventoryCount' }
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
