import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Pagination, Table } from 'antd';
import { PlusSquareOutlined } from '@ant-design/icons';

import ActionDelete from './actionDelete';
import ActionUpdate from './actionUpdate';
import ActionView from './actionView';
import ActionSelect from './actionSelect';
import { systemColors } from 'utils/defaultValues';

import { PropTypes } from './interfaces';

import { Container, Footer, Header, HeaderButtom } from './styles';
import { numberWithDots } from 'utils';

const Index: React.FC<PropTypes> = (props) => {

  const header = !props.routes.routeCreate ? null : (
    <Header>
      <span>Total {numberWithDots(props.totalRecords || 0)}</span>
      <HeaderButtom>
        {props.headerChildren}
        <Link to={props.routes.routeCreate}>
          <Button
            style={{ backgroundColor: systemColors.GREEN, color: '#fff' }}
            icon={<PlusSquareOutlined />}
          >
            {props.textBtnCreate ? props.textBtnCreate : 'Novo'}
          </Button>
        </Link>
      </HeaderButtom>
    </Header>
  );

  return (
    <Container>
      <Table
        {...props}
        columns={[
          ...props.columns,
          props.routes.routeView ||
          props.routes.routeCreate ||
          props.routes.routeUpdate ||
          props.routes.routeDelete ||
          props.onClickSelect
            ? { title: 'Ações', dataIndex: 'actions', width: 150 }
            : {}
        ]}
        dataSource={props.dataSource.map((item, key) => {
          return {
            ...item,
            key: item.id ? item.id : key,
            actions: [
              !props.routes.routeView ? null : (
                <ActionView
                  key={key + 0}
                  router={props.routes.routeView}
                  id={item.id}
                />
              ),
              !props.routes.routeUpdate ? null : (
                <ActionUpdate
                  key={key + 1}
                  router={props.routes.routeUpdate}
                  id={item.id}
                />
              ),
              !props.routes.routeDelete ? null : (
                <ActionDelete
                  key={key + 2}
                  router={props.routes.routeDelete}
                  id={item.id}
                  item={item}
                  onDelete={props.onDelete}
                  propTexObjOndelete={props.propTexObjOndelete}
                />
              ),
              !props.onClickSelect ? null : (
                <ActionSelect
                  key={key + 3}
                  onClick={() => props.onClickSelect(item)}
                  item={item}
                />
              )
            ]
          };
        })}
        title={() => header}
        footer={() => (
          <Footer>
            {!props.hidePagination && (
              <Pagination
                defaultCurrent={1}
                pageSize={props.pageSize}
                total={props.totalRecords}
                onChange={props.onPagination}
                hideOnSinglePage={true}
                showSizeChanger={false}
              />
            )}
          </Footer>
        )}
        pagination={false}
      />
    </Container>
  );
};

export default Index;
