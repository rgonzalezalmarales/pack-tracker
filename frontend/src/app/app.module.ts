import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '@app/shared/shared.module';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CoreModule } from '@angular/flex-layout';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './core/interceptors/jwt.interceptor';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./views/+package/package.module').then((m) => m.PackageModule),
  },
  {
    path: 'package',
    loadChildren: () =>
      import('./views/+package/package.module').then((m) => m.PackageModule),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./views/+auth/auth.module').then((m) => m.authModule),
  },
  {
    path: 'account',
    loadChildren: () =>
      import('./views/+account/account.module').then((m) => m.AccountModule),
  },
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    SharedModule.forRoot(),
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabledBlocking',
      preloadingStrategy: PreloadAllModules,
      scrollPositionRestoration: 'top',
    }),
    HttpClientModule,
  ],
  providers: [
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: appInitializer,
    //   multi: true,
    //   deps: [AuthService],
    // },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
