import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
// import { AccountsGQL } from '@app/graphql/types';
import {
  BehaviorSubject,
  Subscription,
  merge,
  startWith,
  switchMap,
  catchError,
  map,
  of as observableOf,
} from 'rxjs';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit, AfterViewInit, OnDestroy {
  filterForm: FormGroup | any;

  displayedColumns: string[] = [
    'account',
    'description',
    'departament',
    'typicalBalance',
    'activeType',
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

  subscriptions: Subscription[] = [];

  constructor(
    // private accountsGQL: AccountsGQL,
    public dialog: MatDialog,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.filterForm = this.formBuilder.group({
      description: [],
      account: [],
      departament: [],
      typicalBalance: [],
      activeType: [],
    });
  }

  filter(): void {
    this.filter$.next(true);
  }

  clear(): void {
    this.filterForm.reset();
    this.filter$.next(true);
  }

  ngAfterViewInit() {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    this.filter$.subscribe(() => (this.paginator.pageIndex = 0));

    // this.subscriptions.push(
    //   merge(this.sort.sortChange, this.paginator.page, this.filter$)
    //     .pipe(
    //       startWith({}),
    //       switchMap(() => {
    //         this.isLoadingResults = true;
    //         this.selection.clear();

    //         let sort = '';
    //         if (this.sort.direction === 'asc') {
    //           sort = '-';
    //         }

    //         // return this.accountsGQL
    //         //   .fetch(
    //         //     {
    //         //       limit: this.pageSize,
    //         //       skip: this.paginator.pageIndex * this.pageSize,
    //         //       sorts: `${sort}${this.sort.active}`,
    //         //       filters: this.buildFilter(),
    //         //     },
    //         //     {
    //         //       fetchPolicy: 'network-only',
    //         //     }
    //         //   )
    //         //   .pipe(catchError(() => observableOf(null)));
    //       }),
    //       map((data) => {
    //         // Flip flag to show that loading has finished.
    //         this.isLoadingResults = false;
    //         this.isRateLimitReached = data === null;

    //         if (data === null) {
    //           return [];
    //         }

    //         // Only refresh the result length if there is new data. In case of rate
    //         // limit errors, we do not want to reset the paginator to zero, as that
    //         // would prevent users from re-triggering requests.
    //         this.resultsLength = data.data.Accounts.total;
    //         return data.data.Accounts.items;
    //       })
    //     )
    //     .subscribe((data) => (this.data = data))
    // );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((x) => {
      x.unsubscribe();
    });
  }

  private buildFilter(): any {
    const filters: any = {
      contains: [],
    };

    if (this.filterForm.get('account').value) {
      filters['contains'].push({
        field: 'account',
        value: this.filterForm.get('account').value,
      });
    }

    if (this.filterForm.get('description').value) {
      filters['contains'].push({
        field: 'description',
        value: this.filterForm.get('description').value,
      });
    }

    if (this.filterForm.get('departament').value) {
      filters['contains'].push({
        field: 'departament',
        value: this.filterForm.get('departament').value,
      });
    }

    if (this.filterForm.get('typicalBalance').value) {
      filters['contains'].push({
        field: 'typicalBalance',
        value: this.filterForm.get('typicalBalance').value,
      });
    }

    if (this.filterForm.get('activeType').value) {
      filters['contains'].push({
        field: 'activeType',
        value: this.filterForm.get('activeType').value,
      });
    }

    return filters;
  }
}
