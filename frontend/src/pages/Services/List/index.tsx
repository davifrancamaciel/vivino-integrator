import React, { useEffect, useState } from 'react';
import { Card, Tag, Typography } from 'antd';
import GridList from 'components/GridList';
import api from 'services/api-aws-amplify';
import { apiRoutes, systemColors } from 'utils/defaultValues';
import { Services, ServicesFormatted } from '../interfaces';
import { formatName } from '../utils';
import CreateEdit from '../CreateEdit';
import GoBack from 'components/GoBack';
import { Header } from 'components/PanelCrud/styles';
import BooleanTag from 'components/BooleanTag';

const { Title } = Typography;

const List: React.FC = () => {
  const [items, setItems] = useState<ServicesFormatted[]>([]);
  const [item, setItem] = useState<ServicesFormatted>();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    actionFilter();
  }, []);

  const actionFilter = async (pageNumber: number = 1) => {
    try {
      setLoading(true);
      const resp = await api.get(`${apiRoutes.services}`);
      setLoading(false);

      const { Rules } = resp.data;
      const itemsFormatted: ServicesFormatted[] = Rules.map((i: Services) => ({
        ...i,
        id: i.Name,
        active: i.State === 'ENABLED',
        nameFormatted: formatName(i.Name).name,
        route: formatName(i.Name).route,
        statusText: itemTag(i)
      }));

      setItems(itemsFormatted);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleUpdate = (id: string) => {
    setVisible(true);
    setItem(items.find((i: ServicesFormatted) => i.id === id));
  };

  const handleUpdateList = (item: ServicesFormatted) => {
    console.log(item);
    const list = items.map((i: ServicesFormatted) =>
      i.Name === item.Name
        ? {
            ...i,
            ScheduleExpression: item.ScheduleExpression,
            active: item.active,
            State: item.active ? 'ENABLED' : 'DISABLED',
            statusText: itemTag(item)
          }
        : i
    );
    setItems(list);
  };
  const itemTag = (item: Services) => (
    <BooleanTag value={item.State === 'ENABLED'} yes={'Ativo'} no={'Inativo'} />
  );

  const handleRun = async (item: any) => {
    setLoading(true);
    await api.get(item.route, null, true);
    setLoading(false);
  };

  return (
    <div>
      <CreateEdit
        visible={visible}
        setVisible={setVisible}
        item={item}
        onComplete={handleUpdateList}
      />
      <Card
        loading={false}
        title={
          <Header>
            <span>
              <Title level={5}>Serviços</Title>
            </span>
            <span>
              <GoBack />
            </span>
          </Header>
        }
        bodyStyle={{ border: 'solid 1px #d9d9d9' }}
        headStyle={{
          textAlign: 'right',
          backgroundColor: '#fafafa',
          border: 'solid 1px #d9d9d9'
        }}
      >
        <GridList
          scroll={{ x: 600 }}
          columns={[
            { title: 'Nome', dataIndex: 'nameFormatted' },
            { title: 'Expressão', dataIndex: 'ScheduleExpression' },
            { title: 'Status', dataIndex: 'statusText' }
          ]}
          dataSource={items}
          totalRecords={items.length}
          pageSize={50}
          loading={loading}
          hidePagination={true}
          onClickRun={(item: any) => handleRun(item)}
          routes={{ routeUpdate: handleUpdate }}
        />
      </Card>
    </div>
  );
};

export default List;
