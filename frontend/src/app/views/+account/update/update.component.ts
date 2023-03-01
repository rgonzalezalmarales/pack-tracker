import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// import {
//   AccountGQL,
//   DeleteAccountGQL,
//   UpdateAccountGQL,
// } from '@app/graphql/types';
import { MessageService } from '@app/shared/services/message.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss'],
})
export class UpdateComponent implements OnInit {
  entityForm: FormGroup | any;
  loading = false;

  subscriptions: Subscription[] = [];

  id!: string;
  roles: string[] = [];
  oldRoles: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    // private updateAccountGQL: UpdateAccountGQL,
    // private deleteAccountGQL: DeleteAccountGQL,
    // private accountGQL: AccountGQL,
    // private messageService: MessageService
  ) {}

  ngOnInit() {
    this.entityForm = this.formBuilder.group({
      account: ['', Validators.required],
      description: ['', Validators.required],
      departament: ['', Validators.required],
      typicalBalance: ['', Validators.required],
      activeType: ['', Validators.required],
    });

    this.id = this.activatedRoute.snapshot.params['id'];
    this.loading = true;

    // this.subscriptions.push(
    //   this.accountGQL
    //     .fetch({
    //       id: this.id,
    //     })
    //     .subscribe({
    //       next: (d) => {
    //         this.loading = false;

    //         this.entityForm.setValue({
    //           account: d.data.Account.account,
    //           description: d.data.Account.description,
    //           departament: d.data.Account.departament,
    //           typicalBalance: d.data.Account.typicalBalance,
    //           activeType: d.data.Account.activeType,
    //         });
    //       },
    //       error: (e) => {
    //         this.loading = false;
    //         this.messageService.showMessage(
    //           `Item with id ${this.id} not found`
    //         );
    //       },
    //     })
    // );
  }

  remove(): void {
    // this.subscriptions.push(
    //   this.deleteAccountGQL
    //     .mutate({
    //       id: this.id,
    //     })
    //     .subscribe({
    //       next: (_) => {
    //         this.loading = false;
    //         this.messageService.showMessage(`Item with id ${this.id} removed`);
    //         this.router.navigate(['']);
    //       },
    //       error: (_) => {
    //         this.loading = false;
    //         this.messageService.showMessage(
    //           `Error removing item with id ${this.id}`
    //         );
    //       },
    //     })
    // );
  }

  onSubmit(): void {
    this.loading = true;

    if (this.entityForm.valid) {
      this.entityForm.disable();

      // this.subscriptions.push(
      //   this.updateAccountGQL
      //     .mutate({
      //       id: this.id,
      //       item: {
      //         account: this.entityForm.value.account,
      //         description: this.entityForm.value.description,
      //         departament: this.entityForm.value.departament,
      //         typicalBalance: this.entityForm.value.typicalBalance,
      //         activeType: this.entityForm.value.activeType,
      //       },
      //     })
      //     .subscribe({
      //       next: (_) => {
      //         this.loading = false;
      //         this.messageService.showMessage('Item updated');
      //         this.router.navigate(['']);
      //       },
      //       error: (e) => {
      //         this.loading = false;

      //         this.messageService.showMessage('Error updating account');
      //         this.entityForm.enable();
      //       },
      //     })
      // );
    } else {
      this.loading = false;
    }
  }
}
