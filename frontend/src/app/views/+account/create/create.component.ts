import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from '@app/shared/services/message.service';
import { Subscription } from 'rxjs';
import { Role } from '../interfaces/acount.interface';
import { AccountService } from '../services/account.service';
import { HelperService } from '../services/helper.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
  loading = false;
  confirmHide: boolean = true;
  hide: boolean = true;

  subscriptions: Subscription[] = [];

  id!: string;
  roles: string[] = [];

 getAllRoles = () => this.helper.getRoles();

  entityForm: FormGroup | any;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
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
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(
            /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/
          ),
        ],
      ],
      confirmPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(
            /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/
          ),
        ],
      ],
    });
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

  onSubmit(): void {
    if (this.entityForm.valid && this.entityForm.dirty) {
      this.loading = true;
      this.entityForm.disable();

      const value = this.entityForm.value;
      this.loading = true;
      this.accountService
        .addUser({
          email: value?.email,
          fullName: value?.fullName,
          isActive: value?.isActive,
          roles: value?.roles,
          password: value?.password
        })
        .subscribe({
          next: () => {
            this.loading = false;
            this.messageService.showMessage(
              'Usuario creado satisfactoriamente'
            );
            this.router.navigate(['account']);
          },
          error: (error: any) => {
            this.loading = false;
            this.messageService.showErrorMessage(error);
            this.entityForm.enable();
          },
        });
    }
  }
}
