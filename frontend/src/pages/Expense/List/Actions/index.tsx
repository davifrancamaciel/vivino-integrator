import React, { useState } from 'react';
import { Button, Dropdown, Menu } from 'antd';
import api from 'services/api-aws-amplify';
import {
  DownloadOutlined,
  DownOutlined,
  PrinterOutlined,
  DeleteOutlined
} from '@ant-design/icons';

import { formatDate, formatDateHour } from 'utils/formatDate';
import { useAppContext } from 'hooks/contextLib';
import { systemColors, apiRoutes } from 'utils/defaultValues';
import { formatPrice } from 'utils/formatPrice';

import Export from './Export';
import PrintAll from './PrintAll';
import { Expense } from '../../interfaces';
import Delete from './Delete';

interface PropTypes {
  state: any;
  title: string;
  selectedItems?: Expense[];
  onComplete?: () => void;
}

const Actions: React.FC<PropTypes> = ({
  state,
  title,
  selectedItems,
  onComplete
}) => {
  const { loading, setLoading } = useAppContext();

  const [print, setPrint] = useState(false);
  const [items, setItems] = useState<Expense[]>([]);

  const actionFilter = async (
    type: string,
    pageNumber: number = 1,
    itemsArray: Expense[] = []
  ) => {
    try {
      setLoading(true);
      setPrint(false);

      const resp = await api.get(apiRoutes.expenses, {
        ...state,
        pageNumber,
        pageSize: 500
      });

      const { count, rows } = resp.data;
      const itemsFormatted = rows.map((item: Expense) => ({
        ...item,
        companyName: item.company?.name,
        typeName: item.expenseType?.name,
        paidOut: item.paidOut ? 'SIM' : 'NÃO',
        valueFormatted: formatPrice(Number(item.value) || 0),
        paymentDate: formatDate(item.paymentDate || ''),
        createdAt: formatDateHour(item.createdAt),
        updatedAt: formatDateHour(item.updatedAt)
      }));

      itemsArray = [...itemsArray, ...itemsFormatted];

      if (count > itemsArray.length) {
        const nextPage = pageNumber + 1;
        await actionFilter(type, nextPage, itemsArray);
      } else {
        setItems(itemsArray);
        setLoading(false);
        type === 'pdf' ? onCompletePrint() : onCompleteCsv();
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      setPrint(false);
    }
  };

  const onCompletePrint = () => setPrint(true);

  const onCompleteCsv = () => {
    const btn = document.getElementById('ghost-button');
    if (btn) {
      btn.click();
    }
  };
  const menu = (
    <Menu>
      <Menu.Item key="1" icon={<PrinterOutlined />}>
        <PrintAll
          actionFilter={actionFilter}
          items={items}
          print={print}
          title={title}
        />
      </Menu.Item>

      <Menu.Item key="2" icon={<DownloadOutlined />}>
        <Export actionFilter={actionFilter} items={items} title={title} />
      </Menu.Item>
      <Menu.Item key="3" icon={<DeleteOutlined />}>
        <Delete onComplete={onComplete} selectedItems={selectedItems} state={state} />
      </Menu.Item>
    </Menu>
  );
  return (
    <Dropdown overlay={menu} placement="bottomRight" arrow>
      <Button
        style={{ background: systemColors.YELLOW, color: '#fff' }}
        loading={loading}
      >
        Ações <DownOutlined />
      </Button>
    </Dropdown>
  );
};

export default Actions;
