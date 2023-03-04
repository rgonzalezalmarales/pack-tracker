import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PackageListComponent } from './package-list/package-list.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '@app/shared/shared.module';
import { PackageStatusComponent } from './package-status/package-status.component';
import { AuthGuard } from '@app/core/guards/auth.guard';
import { DateEsPipe } from '@app/shared/pipes/date-es.pipe';
import { PackageComponent } from './package/package.component';
import { Role } from '../+account/interfaces/acount.interface';
import { PackageEditComponent } from './package-edit/package-edit.component';
import { TranslocoRootModule } from 'src/app/transloco/transloco-root.module';
import { TranslocoModule } from '@ngneat/transloco';

const routes: Routes = [
  {
    path: '',
    component: PackageListComponent,
    title: 'Paquetes',
    data: {
      expectedRole: [Role.OperationsManager, Role.DeliviryMan],
    },
    canActivate: [AuthGuard],
  },
  {
    path: 'package/:identifier/status',
    component: PackageStatusComponent,
    title: 'Estatus envío',
    // data: {
    //   expectedRole: [],
    // },
    // canActivate: [AuthGuard],
  },
  {
    path: 'status',
    component: PackageStatusComponent,
    title: 'Estatus envío',
    // data: {
    //   expectedRole: [],
    // },
    // canActivate: [AuthGuard],
  },
  {
    path: 'add',
    component: PackageComponent,
    title: 'Crear Envío',
    data: {
      expectedRole: [Role.DeliviryMan],
    },
    canActivate: [AuthGuard],
  },
  {
    path: 'package/:id/update',
    component: PackageEditComponent,
    title: 'Actualizar Paquete',
    data: {
      expectedRole: [Role.DeliviryMan],
    },
    canActivate: [AuthGuard],
  },
];

@NgModule({
  declarations: [
    PackageListComponent,
    PackageStatusComponent,
    PackageComponent,
    PackageEditComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule.forRoot(),
  ],
  providers: [DateEsPipe],
})
export class PackageModule {}
