import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PackageService } from '../services/package.service';
import {
  IPackAddress,
  IPackage,
  PackStatus,
} from '../interfaces/pack-status.inteface';
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatStep, MatStepper } from '@angular/material/stepper';
import { HelperService } from '../services/helper.service';

@Component({
  selector: 'app-package-status',
  templateUrl: './package-status.component.html',
  styleUrls: ['./package-status.component.scss'],
})
export class PackageStatusComponent implements OnInit, OnDestroy {
  identifier = '';
  isLink = false;
  pack?: IPackage;
  isLoadingResults = false;
  subscriptions: Subscription[] = [];

  @ViewChild(MatStepper) stepper!: MatStepper;

  @ViewChildren(MatStep)
  viewChildren!: QueryList<MatStep>;

  get getRoute(): IPackAddress[] {
    return this.pack?.route || [];
  }

  constructor(
    private readonly packageService: PackageService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private helper: HelperService,
    private rd: Renderer2
  ) {}

  getStatusIcon(addres: IPackAddress): string {
    switch (addres?.status) {
      case PackStatus.Delivered:
        return 'card-delivered';
      case PackStatus.Received:
        return 'card-recived';
      default:
        return 'card-trasit';
    }
  }

  getTitle(addres: IPackAddress): string {
    switch (addres?.status) {
      case PackStatus.Delivered:
        return this.helper.translateStatus(PackStatus.Delivered);
      default:
        return addres.description;
    }
  }

  getDescription(addres: IPackAddress): string {
    switch (addres?.status) {
      case PackStatus.Delivered:
        return 'Entregado';
      case PackStatus.Received:
        return `${addres.description}`;
      default:
        return `${this.helper.translateStatus(addres.status)}: ${
          addres.description
        }`;
    }
  }

  searchFormGroup = this._formBuilder.group({
    query: [this.identifier, Validators.required],
  });

  isSearching = false;

  ngOnInit(): void {
    // const id = '27399ff4-0e8d-4c58-900f-1865e770e3d1';
    let id = this.route.snapshot.paramMap.get('identifier') || '';



    console.log({
      id
    })

    if (id !== 'package') {
      this.identifier = id;
      this.isLink = true;
      this.loadStatus(this.identifier);
    } else {
      id = '27399ff4-0e8d-4c58-900f-1865e770e3d1';
    }

    this.searchFormGroup.setValue({
      query: id,
    });
  }

  search() {
    // if(this.isSearching) return;
    this.identifier = this.searchFormGroup.get('query')?.value || '';

    // this.isSearching = true;
    console.log(this.identifier);
    this.loadStatus(this.identifier);
  }

  loadStatus(identifier: string) {
    if (!identifier) return;

    this.isLoadingResults = true;

    this.subscriptions.push(
      this.packageService.getStatus(this.identifier).subscribe({
        next: (data) => {
          this.pack = data;
          this.isLoadingResults = false;

          setTimeout(() => {
            const documentResult = document.getElementsByClassName(
              'mat-vertical-content-container'
            );

            const lastIndex = documentResult.length - 1;
            const first = documentResult.item(0);
            const last = documentResult.item(lastIndex);

            if (last) {
              this.rd.addClass(last, 'mat-stepper-vertical-line');
            }

            if (first) {
              this.rd.removeClass(first, 'mat-stepper-vertical-line');
            }

            this.stepper.selectedIndex = lastIndex;
          }, 100);
        },
        error: () => {
          this.isLoadingResults = false;
        },
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
