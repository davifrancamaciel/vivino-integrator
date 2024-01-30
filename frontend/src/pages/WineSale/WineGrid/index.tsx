import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Image } from 'antd';

import GridList from 'components/GridList';
import { formatPrice } from 'utils/formatPrice';
import { SaleVivino } from '../interfaces';

interface PropTypes {
  sale: SaleVivino;
  hidetotalRecords?: boolean;
}

const WineGrid: React.FC<PropTypes> = ({ sale, hidetotalRecords }) => {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    if (sale?.items?.length) {
      const itemsFormmated = sale?.items.map((x: any) => ({
        ...x,
        id: x?.sku,
        sku: <Link to={getPath(x.sku)}>{x.sku}</Link>,
        image: (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Image style={{ height: '30px' }} src={x?.image?.location} />
          </div>
        ),
        unit_price: formatPrice(x.unit_price),
        total_amount: formatPrice(x.total_amount)
      }));
      setItems(itemsFormmated);
    }
    console.log(sale);
  }, [sale]);

  const getPath = (sku: string) => {
    return sku?.includes('VD')
      ? `/wines?skuVivino=${sku}`
      : `/wines/details/${sku}`;
  };

  return items && items.length ? (
    <GridList
      scroll={{ x: 840 }}
      size="small"
      columns={[
        { title: 'Imagem', dataIndex: 'image' },
        { title: 'Código', dataIndex: 'sku' },
        { title: 'Vinho', dataIndex: 'description' },
        { title: 'Preço unitário', dataIndex: 'unit_price' },
        { title: 'Quantidade', dataIndex: 'unit_count' },
        { title: 'Preço total', dataIndex: 'total_amount' }
      ]}
      dataSource={items}
      totalRecords={items.length}
      hidetotalRecords={hidetotalRecords}
      pageSize={items.length}
      loading={false}
      routes={{}}
    />
  ) : (
    <p>&nbsp;</p>
  );
};

export default WineGrid;
