import { Component, Input } from '@angular/core';
import { IMenu, ISubMenu } from '@app/core/interfaces/menu.interface';
import { Role } from 'src/app/views/+account/interfaces/acount.interface';
import { Menu } from './common.interface';

@Component({
  selector: 'app-menu-sidenav',
  templateUrl: './menu-sidenav.component.html',
  styleUrls: ['./menu-sidenav.component.scss'],
})
export class MenuSidenavComponent {
  @Input() list: Menu[] = [];
  @Input() accountRoles: Role[] = [];

  hasPermision = (roles: Role[]) => {
    for (const r of roles) {
      if (r == Role.Receiver && !this.accountRoles?.length) {
        return true;
      } else if (this.accountRoles?.length) {
        const has = this.accountRoles?.find((x) => x === r);
        if (has) return true;
      }
    }

    return false;
  };

  getItems(menu?: ISubMenu[]) {
    if (!Array.isArray(menu)) return;

    // console.log(menu)
    const menuOut: ISubMenu[] = [];
    for (const item of menu) {
      if (!item?.roles?.length) {
        menuOut.push(item);
      } else {
        if (this.hasPermision(item?.roles)) {
          menuOut.push(item);
        }
      }
    }

    return menuOut?.length ? menuOut : undefined;
  }

  getMenus(menu?: IMenu[]) {
    if (!Array.isArray(menu)) return;

    const menuOut: IMenu[] = [];
    for (const item of menu) {
      if (!item?.roles) {
        menuOut.push(item);
      } else {
        if (this.hasPermision(item?.roles)) {
          menuOut.push(item);
        }
      }
    }

    return menuOut?.length ? menuOut : undefined;
  }
}
