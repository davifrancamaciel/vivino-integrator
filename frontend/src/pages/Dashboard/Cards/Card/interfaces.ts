export interface CardPropTypes {
  text: string;
  isPermission: boolean;
  loading: boolean;
  url: string;
  value: string;
  color?: string;
  icon?: any;
  total?: Number;
}
export interface CardsReuslt {
  productsActive: {
    count: number;
  };

  productsNotActive: {
    count: number;
  };

  sales: {
    count: number;
    commissionMonth: number;
    totalValueMonth: number;
  };
}
