import { SelectionModel } from '@angular/cdk/collections';
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  BehaviorSubject,
  map,
  merge,
  startWith,
  Subscription,
  switchMap,
} from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { Role } from '../interfaces/acount.interface';
import { AccountService } from '../services/account.service';
import { MessageService } from '@app/shared/services/message.service';
import { HelperService } from '../services/helper.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit, AfterViewInit, OnDestroy {
  filterForm: FormGroup | any;

  displayedColumns: string[] = ['fullName', 'email', 'roles', 'edit'];

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
    private accountService: AccountService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private helper: HelperService
  ) {}

  ngOnInit(): void {
    this.filterForm = this.formBuilder.group({
      fullName: [],
      role: [],
      email: ['', [Validators.email]],
    });
  }

  filter(): void {
    this.filter$.next(true);
  }

  clear(): void {
    this.filterForm.reset();
    this.filter$.next(true);
  }

  get getAllRoles(): Role[] {
    return this.helper.getRoles();
  }

  getDisplayRoles(roles: Role[]) {
    if (roles.length > 2) {
      const [first, second] = roles;
      return [first, second, 'more'];
    }

    return roles || [];
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

            let sort = this.sort.direction === 'asc' ? '-' : '';
            sort += this.sort.active;

            const filters = this.buildFilter();

            return this.accountService.getUsers({
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

    const { fullName, email, role } = this.filterForm.value;

    if (fullName) {
      filters['fullName'] = fullName;
    }

    if (email) {
      filters['email'] = email;
    }

    if (role) {
      filters['role'] = role;
    }

    return filters;
  }
}
