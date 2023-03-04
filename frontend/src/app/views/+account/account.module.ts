import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '@app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { UpdateComponent } from './update/update.component';
import { UploadComponent } from './upload/upload.component';
import { AuthGuard } from '@app/core/guards/auth.guard';
import { CreateComponent } from './create/create.component';
import { Role } from './interfaces/acount.interface';

const routes: Routes = [
  {
    path: '',
    component: ListComponent,
    title: 'Usuarios',
    data: {
      expectedRole: [Role.Admin],
    },
    canActivate: [AuthGuard],
  },
  {
    path: 'account/:id/update',
    component: UpdateComponent,
    title: 'Update account',
    data: {
      expectedRole: [Role.Admin],
    },
    canActivate: [AuthGuard],
  },
  {
    path: 'account/add',
    component: CreateComponent,
    title: 'Create account',
    data: {
      expectedRole: [Role.Admin],
    },
    canActivate: [AuthGuard],
  },
];

@NgModule({
  declarations: [ListComponent, UpdateComponent, UploadComponent, CreateComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    SharedModule.forRoot(),
  ],
})
export class AccountModule {}
