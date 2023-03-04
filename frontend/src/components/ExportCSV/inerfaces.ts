export interface ColumnTypeCSV {
  label: string;
  key: string;
}

export interface PropTypes {
  data: Array<object>;
  headers: Array<ColumnTypeCSV>;
  style?: React.CSSProperties;
  documentTitle?: string;
  id?: string
}
