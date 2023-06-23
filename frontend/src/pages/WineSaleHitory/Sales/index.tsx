import React, { useEffect, useState } from 'react';
import { Image, Modal, Row } from 'antd';
import { EditOutlined, CloseSquareOutlined } from '@ant-design/icons';

import { systemColors } from 'utils/defaultValues';
import { WineSale } from '../interfaces';
import GridList from 'components/GridList';
import { formatDateHour } from 'utils/formatDate';

interface PropTypes {
  sales: Array<WineSale>;
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

const Sales: React.FC<PropTypes> = (props) => {
  const [loading, setLoading] = useState(false);
  const [sales, setSales] = useState<any[]>([]);

  useEffect(() => {
    const itemsFormatted = props.sales.map((histo: WineSale) => ({
      ...histo,
      userName: histo.user.alias,
      email: histo.user.email,
      image: (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Image style={{ height: '60px' }} src={histo.user.image.location} />
        </div>
      ),
      created_at: formatDateHour(histo.created_at)
    }));
    setSales(itemsFormatted);
  }, [props.sales]);

  const showHideModal = () => props.setVisible(!props.visible);

  return (
    <Modal
      width={'80%'}
      title="Vendas"
      visible={props.visible}
      onOk={() => {}}
      onCancel={showHideModal}
      okText=""
      cancelText="Fechar"
      okButtonProps={{
        icon: <EditOutlined />,
        loading,
        style: {
          border: 'hidden',
          color: '#fff',
          backgroundColor: systemColors.YELLOW
        }
      }}
      cancelButtonProps={{ icon: <CloseSquareOutlined /> }}
    >
      <GridList
        scroll={{ x: 840 }}
        columns={[
          { title: 'Código', dataIndex: 'id' },
          { title: 'Imagem', dataIndex: 'image' },
          { title: 'Cliente', dataIndex: 'userName' },
          { title: 'Email', dataIndex: 'email' },
          { title: 'Quantidade', dataIndex: 'unit_count' },

          { title: 'Criada na Vivino em', dataIndex: 'created_at' }
        ]}
        dataSource={sales}
        totalRecords={sales.length}
        pageSize={sales.length}
        loading={loading}
        routes={{}}
      />
    </Modal>
  );
};

export default Sales;
