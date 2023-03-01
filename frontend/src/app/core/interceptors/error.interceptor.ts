import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private readonly authService: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    console.log('ErrorInterceptor');

    // return next.handle(request);

    const errors = [403];

    if (this.authService.userValue?._id) {
      errors.push(401);
    }

    return next.handle(request).pipe(
      catchError((err) => {
        if (errors.includes(err.status) && this.authService.userValue) {
          // auto logout if 401 or 403 response returned from api
          this.authService.logout();
        }

        const error = (err && err.error && err.error.message) || err.statusText;
        console.error(err);
        return throwError(() => error);
      })
    );
  }
}
