import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { SharedModule } from '@app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoRootModule } from 'src/app/transloco/transloco-root.module';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    title: 'Login',
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login',
  },
];

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    SharedModule.forRoot(),
  ],
})
export class authModule {}
