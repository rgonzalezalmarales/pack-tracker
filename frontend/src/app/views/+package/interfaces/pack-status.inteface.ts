export interface IPagPacks {
  items: IPackage[];
  total: number;
}


export interface IPackage {
  identifier: string;
  addresseeEmail: string;
  description: string;
  status: string;
  route: IPackAddress[];
}

export interface IPackAddress {
  address: string;
  description: string;
  status: PackStatus;
  createdAt: string;
}

export enum PackStatus {
  Received = 'Received',
  Transit = 'Transit',
  Delivered = 'Delivered',
}
