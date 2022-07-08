export interface PropTypes {
  title?: string;
  type: 'create' | 'update' | 'view';
  onClickActionButton?: () => void;
  loadingBtnAction: boolean;
  loadingPanel: boolean;
  textBtnAction?: string;
}
