import { ReactNode } from 'react';
import { TableProps, TableColumnType } from 'antd';

export interface Routes {
  routeCreate?: string;
  routeUpdate?: any;
  routeView?: string;
  routeDelete?: string;
}

export interface PropTypes extends TableProps<any> {
  routes: Routes;
  columns: Array<TableColumnType<any>>;
  dataSource: Array<any>;
  onPagination?: (pageNumber: number) => void;
  onDelete?: (id?: string | number) => void;
  pageSize: number;
  totalRecords?: number;
  onClickSelect?: any;
  textBtnCreate?: string;
  propTexObjOndelete?: string;
  hidePagination?: boolean;
  headerChildren?: ReactNode;
}
