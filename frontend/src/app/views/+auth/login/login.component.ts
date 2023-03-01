import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';
import { MessageService } from '@app/shared/services/message.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  submitted = false;
  returnUrl = 'package';
  error = '';
  hide = true;
  loading = false;

  loginForm!: FormGroup;
  private subscriptions: Subscription[] = [];

  get f() {
    return this.loginForm.controls;
  }

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    if (this.authService.userValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit() {
    const { email, password } = this.loginForm.value;

    this.submitted = true;
    this.loading = true;

    this.subscriptions.push(
      this.authService.login(email, password).subscribe({
        next: (data) => {
          // console.log('data, ', data);
          console.log('navigate login', this.returnUrl);
          this.router.navigate([this.returnUrl]);
        },
        error: (error) => {
          this.error = error;

          this.messageService.showErrorMessage(error);

          this.loading = false;
        },
      })
    );
  }

  // onLogin(): void {
  //   // this.loading = true;
  //   // this.apollo.client.resetStore();
  //   // if (this.loginForm.valid) {
  //   //   this.loginForm.disable();
  //   //   this.subscriptions.push(
  //   //     this.loginGQL
  //   //       .mutate({
  //   //         emailOrUsername: this.loginForm.value.emailOrUsername,
  //   //         password: this.loginForm.value.password,
  //   //       })
  //   //       .subscribe(
  //   //         {
  //   //           next: (data: any) => {
  //   //             this.loading = false;
  //   //             this.loginForm.enable();
  //   //             this.authService.login(
  //   //               data.data.login.accessToken,
  //   //               data.data.login.refreshToken
  //   //             );
  //   //             this.authService.redirect(PATHS);
  //   //           },
  //   //           error: (error: Error) => {
  //   //             this.loading = false;
  //   //             this.messageService.showError(error);
  //   //             this.loginForm.enable();
  //   //           },
  //   //         }
  //   //       )
  //   //   );
  //   // } else {
  //   //   this.loading = false;
  //   //   console.log('Form not valid');
  //   // }
  // }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => {
      s.unsubscribe();
    });
  }
}
