import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { routerTransition } from 'src/app/core/animations/animations';
import { AuthService } from '@app/core/services/auth.service';

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

  menu: any[] = [
    {
      link: '',
      title: 'Usuarios',
      subMenu: [
        {
          link: 'account/',
          title: 'Listado',
        },
        // {
        //   link: 'auth/login',
        //   title: 'login',
        // },
      ],
    },
    {
      link: '',
      title: 'Paquetes',
      subMenu: [
        {
          link: 'package',
          title: 'Reporte',
        },
        {
          link: 'package/status',
          title: 'Estatus',
        },
      ],
    },
  ];

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

  ngOnInit() {
    this.userName = this.authService.userValue?.fullName || '';
  }

  // ===============Literata============
  // ngOnInit() {
  //   this.isLoggedIn$ = this.authService.isAuthenticated();
  //   this.firstname$ = this.authService.getFirstname();

  //   this.subscriptions.push(
  //     this.authService.getRoles().subscribe((roles) => {

  //       this.initMenu();
  //       this.userRoles = roles;

  //     })
  //   );

  //   this.subscriptions.push(
  //     this.router.events
  //       .pipe(filter((event) => event instanceof ActivationEnd))
  //       .subscribe((event: ActivationEnd) => {
  //         let lastChild = event.snapshot;
  //         while (lastChild.children.length) {
  //           lastChild = lastChild.children[0];
  //         }

  //         const { title, pageTitle, module } = lastChild.data;
  //         this.title = pageTitle ? pageTitle : title;
  //         this.module = module;
  //       })
  //   );

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => {
      s.unsubscribe();
    });
  }
}
