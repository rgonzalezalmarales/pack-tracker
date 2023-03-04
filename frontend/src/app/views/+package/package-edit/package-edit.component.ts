import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '@app/shared/services/message.service';
import { PackageService } from '../services/package.service';

@Component({
  selector: 'app-package-edit',
  templateUrl: './package-edit.component.html',
  styleUrls: ['./package-edit.component.scss'],
})
export class PackageEditComponent implements OnInit {
  isLoadingResults = false;
  id: string | null = null;

  editFormGroup = this.fb.group({
    addresseeEmail: [''],
    descriptionPack: [''],
    weight: [0],
    description: ['', Validators.required],
    address: ['', Validators.required],
    finished: [false],
  });

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private readonly packageService: PackageService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.packageService.getPackage(this.id).subscribe({
        next: (resp) => {
          this.editFormGroup.patchValue({
            addresseeEmail: resp?.addresseeEmail,
            descriptionPack: resp?.description,
            weight: resp?.weight
          });

          this.disableControls(['addresseeEmail', 'descriptionPack', 'weight']);
        },
        error: (error) => {
          this.messageService.showErrorMessage(error);
        },
      });
    }
  }

  disableControls(names: string[]) {
    names.forEach((name) => {
      this.disableControl(name);
    });
  }

  disableControl(name: string) {
    this.editFormGroup.get(name)?.disable();
  }

  edit() {
    if (!this.id) return;

    this.isLoadingResults = true;

    const data = this.editFormGroup.value;
    this.packageService.updateStatus(this.id, data).subscribe({
      next: (_data: any) => {
        this.isLoadingResults = false;
        this.comeBack();
      },
      error: (err: any) => {
        this.isLoadingResults = false;
        this.messageService.showErrorMessage(err);
      },
    });
  }

  comeBack = () => this.router.navigate(['package']);
}
