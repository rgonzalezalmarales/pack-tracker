import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MessageService } from '@app/shared/services/message.service';
import { Subscription } from 'rxjs';
import { Role } from '../interfaces/acount.interface';
import { AccountService } from '../services/account.service';
import { HelperService } from '../services/helper.service';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss'],
})
export class UpdateComponent implements OnInit, OnDestroy {
  loading = false;

  confirmHide: boolean = true;
  hide: boolean = true;
  isPasswordChanging = false;
  formReady = false;

  subscriptions: Subscription[] = [];

  id!: string;
  roles: string[] = [];
  oldRoles: string[] = [];

  toppings = new FormControl('');

  getRoles = (): Role[] => this.helper.getRoles();

  entityForm: FormGroup | any;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly accountService: AccountService,
    private readonly messageService: MessageService,
    private readonly helper: HelperService
  ) {}

  ngOnInit() {
    this.entityForm = this.formBuilder.group({
      fullName: ['', Validators.required],
      isActive: [true, Validators.required],
      email: ['', [Validators.required, Validators.email]],
      roles: [[], Validators.required],
      password: [
        '',
        [
          Validators.minLength(6),
          Validators.pattern(
            /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/
          ),
        ],
      ],
      confirmPassword: [
        '',
        [
          Validators.minLength(6),
          Validators.pattern(
            /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/
          ),
        ],
      ],
    });

    const form = this.entityForm as FormGroup;

    this.id = this.activatedRoute.snapshot.params['id'];
    if (this.id) {
      this.subscriptions.push(
        this.accountService.getUserById(this.id).subscribe({
          next: (user) => {
            form.patchValue({
              email: user?.email,
              fullName: user?.fullName,
              isActive: user?.isActive,
              roles: user?.roles,
            });

            this.formReady = true;
          },
          error: (error) => {
            this.messageService.showErrorMessage(error);
          },
        })
      );
    }
  }

  activePasswords() {
    this.isPasswordChanging = !this.isPasswordChanging;
    const form = <FormGroup>this.entityForm;
    if (this.isPasswordChanging) {
      form.get('password')?.enable();
      form.get('password')?.addValidators(Validators.required);

      form.get('confirmPassword')?.enable();
      form.get('confirmPassword')?.addValidators(Validators.required);
    } else {
      form.get('password')?.disable();
      form.get('password')?.removeValidators(Validators.required);
      form.get('confirmPassword')?.disable();
      form.get('confirmPassword')?.removeValidators(Validators.required);
    }
  }

  get hasPatterErrorPass() {
    const crtl = this.entityForm.get('password') as FormControl;
    return crtl.hasError('pattern') && crtl.touched;
  }

  get hasPatterErrorconfirmPass() {
    const crtl = this.entityForm.get('confirmPassword') as FormControl;
    return crtl.hasError('pattern') && crtl.touched;
  }

  get matchPasswords() {
    const passwordValue = this.entityForm.get('password').value;
    const confirmPasswordValue = this.entityForm.get('confirmPassword').value;
    return passwordValue === confirmPasswordValue && passwordValue?.length;
  }

  get validPasswords() {
    const passwordCtrl = this.entityForm.get('password');
    const confirmPasswordCtrl = this.entityForm.get('confirmPassword');
    return passwordCtrl.valid && confirmPasswordCtrl.valid;
  }

  remove(): void {
    if (!this.id) return;

    this.loading = true;

    this.subscriptions.push(
      this.accountService.deleteUser(this.id).subscribe({
        next: () => {
          this.loading = false;
          this.messageService.showMessage(
            `Usuario con id: ${this.id}, aliminado`
          );
          this.router.navigate(['account']);
        },
        error: (error) => {
          this.loading = false;
          this.messageService.showErrorMessage(error);
        },
      })
    );
  }

  getDirtyValue() {
    const result: any = {};
    const form = this.entityForm as FormGroup;

    if (form.get('email')?.dirty) {
      result['email'] = form.get('email')?.value;
    }

    if (form.get('fullName')?.dirty) {
      result['fullName'] = form.get('fullName')?.value;
    }

    if (form.get('roles')?.dirty) {
      result['roles'] = form.get('roles')?.value;
    }

    if (form.get('isActive')?.dirty) {
      result['isActive'] = form.get('isActive')?.value;
    }

    if (form.get('password')?.dirty) {
      result['password'] = form.get('password')?.value;
    }

    return result;
  }

  onSubmit(): void {
    console.log(this.entityForm.valid && this.entityForm.dirty && this.id);

    if (this.entityForm.valid && this.entityForm.dirty && this.id) {
      this.loading = true;
      this.entityForm.disable();

      const value = this.getDirtyValue();

      console.log(value);
      this.loading = true;
      this.subscriptions.push(
        this.accountService.updateUser(this.id, value).subscribe({
          next: () => {
            this.loading = false;
            this.messageService.showMessage(
              'Usuario actualizado satisfactoriamente'
            );
            this.router.navigate(['account']);
          },
          error: (error) => {
            this.loading = false;
            this.messageService.showErrorMessage(error);
            this.entityForm.enable();
          },
        })
      );
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
