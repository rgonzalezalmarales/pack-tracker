import { Component, Input } from '@angular/core';
import { Menu } from './common.interface';

@Component({
  selector: 'clarivia-menu-sidenav',
  templateUrl: './menu-sidenav.component.html',
  styleUrls: ['./menu-sidenav.component.scss'],
})
export class MenuSidenavComponent {
  @Input() list: Menu[] = [];
}
