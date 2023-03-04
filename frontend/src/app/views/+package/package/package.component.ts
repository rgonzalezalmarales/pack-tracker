import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from '@app/shared/services/message.service';
import { PackageService } from '../services/package.service';

@Component({
  selector: 'app-package',
  templateUrl: './package.component.html',
  styleUrls: ['./package.component.scss'],
})
export class PackageComponent implements OnInit {
  isLoadingResults = false;
  addFormGroup = this.fb.group({
    addresseeEmail: ['', [Validators.required, Validators.email]],
    description: ['', Validators.required],
    weight: [
      0,
      [Validators.min(0.0000000000000000000001), Validators.required],
    ],
    address: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private readonly router: Router,
    private readonly messageService: MessageService,
    private readonly packageService: PackageService
  ) {}

  ngOnInit(): void {}

  add() {
    this.isLoadingResults = true;

    this.packageService.addPackage(this.addFormGroup.value).subscribe({
      next: (_resp) => {
        this.isLoadingResults = false;
        this.comeBack();
      },
      error: (error) => {
        this.isLoadingResults = false;
        this.messageService.showErrorMessage(error);
      },
    });
  }

  comeBack = () => this.router.navigate(['package']);
}
