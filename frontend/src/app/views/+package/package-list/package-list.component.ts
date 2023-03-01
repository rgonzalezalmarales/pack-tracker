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
// import * as FileSaver from 'file-saver';

import { JsonToCsvService } from '@app/shared/services/json-to-csv.service';
import { PackageService } from '../services/package.service';
import { PackStatus } from '../interfaces';
import { HelperService } from '../services/helper.service';

// const today = new Date();
// const month = today.getMonth();
// const year = today.getFullYear();

@Component({
  selector: 'app-package-list',
  templateUrl: './package-list.component.html',
  styleUrls: ['./package-list.component.scss'],
})
export class PackageListComponent implements OnInit {
  displayedColumns: string[] = [
    // 'account',
    'description',
    'status',
    // 'typicalBalance',
    // 'activeType',
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

  translateSt = (status: PackStatus) => this.helper.translateStatus(status);

  getStatus = [
    {
      value: PackStatus.Delivered,
      label: this.translateSt(PackStatus.Delivered),
    },
    {
      value: PackStatus.Received,
      label: this.translateSt(PackStatus.Received),
    },
    {
      value: PackStatus.Transit,
      label: this.translateSt(PackStatus.Transit),
    },
  ];

  subscriptions: Subscription[] = [];

  constructor(
    public readonly dialog: MatDialog,
    private readonly formBuilder: FormBuilder,
    private readonly packageService: PackageService,
    private readonly jsonToCsvService: JsonToCsvService,
    private readonly helper: HelperService
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
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    this.filter$.subscribe(() => (this.paginator.pageIndex = 0));

    this.subscriptions.push(
      merge(this.sort.sortChange, this.paginator.page, this.filter$)
        .pipe(
          startWith({}),
          switchMap(() => {
            this.isLoadingResults = true;
            this.selection.clear();

            let sort = '';
            if (this.sort.direction === 'asc') {
              sort = '-';
            }

            const filters = this.buildFilter();

            return this.packageService.getPackages({
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
        .subscribe((data) => {
          this.data = data;
        })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((x) => {
      x.unsubscribe();
    });
  }

  private buildFilter(): any {
    const filters: any = {
      // contains: [],
    };

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

    // if (this.filterForm.get('account').value) {
    //   filters['contains'].push({
    //     field: 'account',
    //     value: this.filterForm.get('account').value,
    //   });
    // }

    return filters;
  }
}
