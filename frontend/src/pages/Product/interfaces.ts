export interface MessageGroup {
  id?: string;
  name: string;
  objective: string;
  briefing: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
  requester?: string;
}

export const initialStateForm: MessageGroup = {
  id: undefined,
  name: '',
  objective: '',
  briefing: '',
  active: true,
  createdAt: '',
  updatedAt: ''
};

export interface Filter {
  id?: string;
  name: string;
  objective: string;
  briefing: string;
  pageNumber: number;
  pageSize: number;
}

export const initialStateFilter: Filter = {
  id: '',
  name: '',
  objective: '',
  briefing: '',
  pageNumber: 1,
  pageSize: 10
};
