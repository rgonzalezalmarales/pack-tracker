import {
  Component,
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
import { MessageService } from '@app/shared/services/message.service';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-package-status',
  templateUrl: './package-status.component.html',
  styleUrls: ['./package-status.component.scss'],
})
export class PackageStatusComponent implements OnInit, OnDestroy {
  identifier = '';
  isLink = false;
  notFound = false;
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
    private rd: Renderer2,
    private mesaggeService: MessageService,
    private transloco: TranslocoService
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
    const { status } = addres;
    switch (addres?.status) {
      case PackStatus.Delivered:
        return this.transloco.translate(`entities.Package.status.${status}`);
      default:
        return addres.description;
    }
  }

  getDescription(addres: IPackAddress): string {
    const st = this.transloco.translate(
      `entities.Package.status.${addres?.status}`
    );
    switch (addres?.status) {
      case PackStatus.Delivered:
        return 'Entregado';
      case PackStatus.Received:
        return `${addres.description}`;
      default:
        return `${st}: ${addres.description}`;
    }
  }

  searchFormGroup = this._formBuilder.group({
    query: [this.identifier, Validators.required],
  });

  isSearching = false;

  ngOnInit(): void {
    let id = this.route.snapshot.paramMap.get('identifier') || '';
    if (id) {
      this.identifier = id;
      this.isLink = true;

      this.searchFormGroup.setValue({
        query: id,
      });

      this.searchFormGroup.disable();

      this.loadStatus(this.identifier);
    }
  }

  search() {
    this.identifier = this.searchFormGroup.get('query')?.value || '';
    this.loadStatus(this.identifier);
  }

  loadStatus(identifier: string) {
    if (!identifier) return;

    this.notFound = false;
    this.isLoadingResults = true;

    console.log('stat');

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
        error: (error: any) => {
          this.isLoadingResults = false;
          if (error?.includes('not found')) {
            this.notFound = true;
          } else {
            this.mesaggeService.showErrorMessage(error);
          }
        },
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
