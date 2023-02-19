import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { routerTransition } from 'src/app/core/animations/animations';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  animations: [routerTransition],
})
export class LayoutComponent implements OnInit, OnDestroy {
  appName = 'TEST';
  year = new Date().getFullYear();

  subscriptions: Subscription[] = [];

  menu: any[] = [
    {
      link: '',
      title: 'Accounts',
      subMenu: [
        {
          link: 'account/upload',
          title: 'Upload excel',
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

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit() {}

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => {
      s.unsubscribe();
    });
  }
}
