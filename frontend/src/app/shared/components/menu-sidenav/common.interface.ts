
export interface Menu {
  title: string;
  link: string;
  subMenu?: Submenu[];
}

export interface Submenu {
  title: string;
  link: string;
}
