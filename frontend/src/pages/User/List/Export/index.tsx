import React, { useState } from 'react';
import { DownloadOutlined } from '@ant-design/icons';

import ExportCSV from 'components/ExportCSV';

import { formatDateHour } from 'utils/formatDate';
import api from 'services/api-aws-amplify';
import { Filter, Users } from '../../interfaces';

import { Button } from 'antd';
import {
  apiRoutes,
  appRoutes,
  systemColors,
  userType
} from 'utils/defaultValues';

const Export: React.FC<Filter> = (props) => {
  const [loading, setLoading] = useState(false);
  const [nameReport, setNameReport] = useState('');
  const [formattedData, setFormattedData] = useState<Array<any>>([]);

  const actionFilter = async (
    pageNumber: number = 1,
    itemsArray: Users[] = []
  ) => {
    try {
      setLoading(true);
      const type = window.location.pathname.includes(appRoutes.clients)
        ? userType.CLIENT
        : userType.USER;
      setNameReport(
        `report-${type.toLocaleLowerCase()}-${new Date().getTime()}.csv`
      );
      const resp = await api.get(apiRoutes.users, {
        ...props,
        pageNumber,
        type,
        pageSize: 500
      });

      const { count, rows } = resp.data;

      itemsArray = [...itemsArray, ...rows];

      if (count > itemsArray.length) {
        const nextPage = pageNumber + 1;
        await actionFilter(nextPage, itemsArray);
      } else {
        const newData = itemsArray.map((item: Users) => ({
          ...item,
          active: item.active ? 'SIM' : 'NÃO',
          type: item.type == userType.CLIENT ? 'Cliente' : 'Usuário',
          createdAt: formatDateHour(item.createdAt),
          updatedAt: formatDateHour(item.updatedAt),
          sales: item.wineSaleUsers?.length,
          salesCodes: item.wineSaleUsers?.map((x) => x.code).join(' - ')
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
        documentTitle={nameReport}
        headers={[
          { label: 'Código', key: 'id' },
          { label: 'Nome', key: 'name' },
          { label: 'Telefone', key: 'phone' },
          { label: 'Email', key: 'email' },
          { label: 'Ativo', key: 'active' },
          { label: 'Data de cadastro', key: 'createdAt' },
          { label: 'Data de alteração', key: 'updatedAt' },
          { label: 'Tipo', key: 'type' },
          { label: 'Quatidade de vendas', key: 'sales' },
          { label: 'Código de vendas', key: 'salesCodes' }
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
