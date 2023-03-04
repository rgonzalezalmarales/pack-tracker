export enum Role {
  Admin = 'Admin',
  OperationsManager = 'OperationsManager',
  DeliviryMan = 'DeliviryMan',
  Receiver = 'Receiver',
}

export interface IFilterResul {
  total: number;
  items: IAccount[];
}

export interface IAccount {
  _id?: string;
  email: string;
  fullName: string;
  isActive: boolean;
  roles: Role[];
  refreshToken?: string;
  createdAt?: string;
}

export interface IFilters {
  offset: number;
  limit: number;
  sort?: string;
  email?: string;
  fullName?: string;
  role?: Role;
  active?: boolean;
}
