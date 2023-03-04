import { Role } from 'src/app/views/+account/interfaces/acount.interface';

export interface IMenu {
  link: string;
  title: string;
  roles?: Role[];
  subMenu?: ISubMenu[];
}

export interface ISubMenu {
  title: string;
  link: string;
  roles?: Role[];
}
