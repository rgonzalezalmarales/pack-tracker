import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { routerTransition } from 'src/app/core/animations/animations';
import { AuthService } from '@app/core/services/auth.service';
import { Role } from 'src/app/views/+account/interfaces/acount.interface';
import { IMenu } from '@app/core/interfaces/menu.interface';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  animations: [routerTransition],
})
export class LayoutComponent implements OnInit, OnDestroy {
  appName = 'Pack Tracker';
  year = new Date().getFullYear();
  isLoggedIn$: Observable<boolean>;
  userName = '';

  subscriptions: Subscription[] = [];

  userRoles: Role[] = [];

  menu: IMenu[] = [];

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private readonly authService: AuthService
  ) {
    this.isLoggedIn$ = authService.isAuthenticated();
  }

  logout = () => {
    this.authService.logout();
  };

  initMenu() {
    this.menu = [
      {
        link: '',
        title: 'Gestión',
        roles: [Role.Admin],
        subMenu: [
          {
            link: 'account/',
            title: 'Usuarios',
            roles: [Role.Admin],
          },
        ],
      },
      {
        link: '',
        title: 'Paquetes',
        subMenu: [
          {
            link: 'package',
            title: 'Reporte',
            roles: [Role.OperationsManager, Role.DeliviryMan],
          },
          {
            link: 'package/status',
            title: 'Estatus',
            // roles: [Role.Receiver],
          },
        ],
        // roles: [Role.OperationsManager, Role.DeliviryMan, Role.Receiver],
      },
    ];
  }

  ngOnInit() {
    this.subscriptions.push(
      this.authService.user.subscribe({
        next: (user) => {
          this.userName = user?.fullName || '';
          this.userRoles = user?.roles || [];

          this.initMenu();

          console.log('userRoles', this.userRoles);
        },
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => {
      s.unsubscribe();
    });
  }
}
