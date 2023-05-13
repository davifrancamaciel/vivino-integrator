import React, { useEffect, useState } from 'react';
import { Table, Divider, Col } from 'antd';
import api from 'services/api-aws-amplify';
import { apiRoutes } from 'utils/defaultValues';
import { PropTypes } from './interfaces';
import { Group } from 'utils/commonInterfaces';
import { useAppContext } from 'hooks/contextLib';
// import logo from 'assets/loading.gif';

const AccessType: React.FC<PropTypes> = ({
  groupsSelecteds,
  setGroupsSelecteds
}) => {
  const { groups, setGroups } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [selectedRowKeysLoad, setSelectedRowKeysLoad] = useState<number[]>([]);
  // const tableLoading: any = {
  //   spinning: loading,
  //   indicator: <img src={logo} />
  // };
  useEffect(() => {
    // !groups.length && 
    onLoad();
  }, []);

  useEffect(() => {
    let indexArray: number[] = [];
    groupsSelecteds.map((gu: string) => {
      const groupSelectetd = groups.find((g: Group) => g.label === gu);
      groupSelectetd && indexArray.push(Number(groupSelectetd.key));
    });
    setSelectedRowKeysLoad(indexArray);
  }, [groupsSelecteds]);

  const onLoad = async () => {
    try {
      setLoading(true);
      const resp = await api.get(apiRoutes.groups);
      const dataFormatted: Group[] = resp.data.map(
        (group: Group, index: number) => ({ ...group, key: index })
      );
      setGroups(dataFormatted);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: Group[]) => {
      const selecteds = selectedRows.map((g: Group) => g.label);
      setGroupsSelecteds(selecteds);
    },
    selectedRowKeys: selectedRowKeysLoad
  };

  return (
    <Col lg={24} md={24} sm={24} xs={24}>
      <Divider>Permissões de acesso</Divider>

      <Table
        size="small"
        scroll={{ x: 600 }}
        pagination={false}
        rowSelection={{
          type: 'checkbox',
          ...rowSelection
        }}
        loading={loading}
        columns={[
          { title: 'Permissão', dataIndex: 'label', width: 180 },
          { title: 'Descrição', dataIndex: 'description' }
        ]}
        dataSource={groups}
      />
    </Col>
  );
};

export default AccessType;
