import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {
  BehaviorSubject,
  map,
  merge,
  startWith,
  Subscription,
  switchMap,
} from 'rxjs';

import { saveAs } from 'file-saver';

import { JsonToCsvService } from '@app/shared/services/json-to-csv.service';
import { PackageService } from '../services/package.service';
import { HelperService } from '../services/helper.service';
import { MessageService } from '@app/shared/services/message.service';
import { AuthService } from '@app/core/services/auth.service';
import { Role } from '../../+account/interfaces/acount.interface';

@Component({
  selector: 'app-package-list',
  templateUrl: './package-list.component.html',
  styleUrls: ['./package-list.component.scss'],
})
export class PackageListComponent implements OnInit {
  displayedColumns: string[] = [
    'description',
    'weight',
    'status',
    'createdAt',
    'addresseeEmail',
    'edit',
  ];

  data: any[] = [];
  pageSize = 10;

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  filter$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  selection = new SelectionModel<any>(true, []);

  filterForm: FormGroup = this.formBuilder.group({
    description: [],
    dateGte: [],
    dateLte: [],
    status: [],
  });

  get getStatus() {
    return this.helper.getAllStatus();
  }

  get isDisabledEdit() {
    const roles = this.auth.userValue?.roles || [];

    if(roles.includes(Role.DeliviryMan)) return false;

    return true;
  }

  get isDisabledCsv() {
    const roles = this.auth.userValue?.roles || [];

    if(roles.includes(Role.OperationsManager)) return false;

    return true;
  }

  subscriptions: Subscription[] = [];

  constructor(
    public readonly dialog: MatDialog,
    private readonly formBuilder: FormBuilder,
    private readonly packageService: PackageService,
    private readonly jsonToCsvService: JsonToCsvService,
    private readonly helper: HelperService,
    private readonly messageService: MessageService,
    private readonly auth: AuthService
  ) {}

  ngOnInit(): void {}

  filter(): void {
    this.filter$.next(true);
  }

  download() {
    this.isLoadingResults = true;

    const excel = this.jsonToCsvService.convert(this.data, [
      'description',
      'status',
    ]);
    const blob = new Blob([excel], {
      type: 'text/csv;charset=utf-8',
    });
    saveAs.saveAs(blob, 'packages.csv');
    this.isLoadingResults = false;
  }

  clear(): void {
    this.filterForm.reset();
    this.filter$.next(true);
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    this.filter$.subscribe(() => (this.paginator.pageIndex = 0));
    this.subscriptions.push(
      merge(this.sort.sortChange, this.paginator.page, this.filter$)
        .pipe(
          startWith({}),
          switchMap(() => {
            this.isLoadingResults = true;
            this.selection.clear();

            let sort = this.sort.direction === 'asc' ? '-' : '';
            sort += this.sort.active;

            const filters = this.buildFilter();

            return this.packageService.getPackages({
              sort,
              limit: this.paginator.pageSize,
              offset: this.paginator.pageIndex * this.paginator.pageSize,
              ...filters,
            });
          })
        )
        .pipe(
          map((data) => {
            this.resultsLength = data?.total || 0;
            this.isLoadingResults = false;

            return data?.items || [];
          })
        )
        .subscribe({
          next: (data) => {
            this.data = data;
          },
          error: (error) => {
            this.isLoadingResults = false;
            this.messageService.showErrorMessage(error);
          },
        })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((x) => {
      x.unsubscribe();
    });
  }

  private buildFilter(): any {
    const filters: any = {};

    const { dateGte, dateLte, status, description } = this.filterForm.value;

    if (dateGte) {
      filters['dateGte'] = dateGte;
      filters['dateLte'] = dateLte || dateGte;
    }

    if (status) {
      filters['status'] = status;
    }

    if (description) {
      filters['description'] = description;
    }

    return filters;
  }
}
