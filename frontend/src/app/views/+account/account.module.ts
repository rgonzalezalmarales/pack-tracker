import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '@app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { UpdateComponent } from './update/update.component';
import { UploadComponent } from './upload/upload.component';
import { AuthGuard } from '@app/core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: ListComponent,
    title: 'Usuarios',
    data: {
      expectedRole: ['Admin'],
    },
    canActivate: [AuthGuard],
  },
  // {
  //   path: 'account/:id/update',
  //   component: UpdateComponent,
  //   title: 'Update account',
  //   data: {
  //     expectedRole: ['Admin'],
  //   },
  //   canActivate: [AuthGuard],
  // },
  // {
  //   path: 'account/upload',
  //   component: UploadComponent,
  //   title: 'Upload excel',
  //   data: {
  //     expectedRole: ['Admin'],
  //   },
  //   canActivate: [AuthGuard],
  // },
];

@NgModule({
  declarations: [ListComponent, UpdateComponent, UploadComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    SharedModule.forRoot(),
  ],
})
export class AccountModule {}
