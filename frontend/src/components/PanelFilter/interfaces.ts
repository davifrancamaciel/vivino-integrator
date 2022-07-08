import { ReactNode } from 'react';

export interface PropTypes {
  title?: string;
  loading?: boolean;
  actionButton?: () => void;
  disableButton?: boolean;
  footerChildren?: ReactNode;
  htmlTypeButton?: 'submit' | 'button';
}
