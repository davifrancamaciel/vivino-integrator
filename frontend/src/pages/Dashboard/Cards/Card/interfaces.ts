export interface CardPropTypes {
  text: string;
  loading: boolean;
  url: string;
  value: string;
  color?: string;
  icon?: any;  
}
export interface CardsReuslt {
  winesActive: { count: number };
  winesNotActive: { count: number };
  winesSalesDay: { count: number };
  winesSalesMonth: { count: number };
  winesSalesMonthValue: { total: number };
  sales: {
    count: number;
    commissionMonth: number;
    totalValueMonth: number;
    commissionUser: number;
  };
  expenses: {
    count: number;
    totalValueMonth: number;
  };
}

export const initialStateCards: CardsReuslt = {
  winesActive: { count: 0 },
  winesNotActive: { count: 0 },
  winesSalesDay: { count: 0 },
  winesSalesMonth: { count: 0 },
  winesSalesMonthValue: { total: 0 },
  sales: {
    count: 0,
    commissionMonth: 0,
    totalValueMonth: 0,
    commissionUser: 0
  },
  expenses: {
    count: 0,
    totalValueMonth: 0
  }
};
