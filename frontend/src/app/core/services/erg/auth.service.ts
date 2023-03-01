// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Router } from '@angular/router';
// import { environment as env } from '@env/environment';
// import { BehaviorSubject, map, Observable } from 'rxjs';
// import { User } from '../_models';
// import { LocalStorageService } from './local-storage.service';

// export type UserSchema = User | null;

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthService {
//   private userSubject: BehaviorSubject<UserSchema>;
//   public user: Observable<UserSchema>;
//   private isAuthenticated$: BehaviorSubject<boolean>;

//   constructor(
//     private readonly router: Router,
//     private readonly http: HttpClient,
//     private readonly storage: LocalStorageService
//   ) {

  

//     this.userSubject = new BehaviorSubject<UserSchema>(null);
//     this.user = this.userSubject.asObservable();

//     this.isAuthenticated$ = new BehaviorSubject(!!this.userValue);
//   }

//   public get userValue(): UserSchema {
//     return this.userSubject.value;
//   }

//   login(email: string, password: string) {
//     const authUrl = `${env.apiUrl}/auth/login`;
//     return this.http.post<any>(authUrl, { email, password }).pipe(
//       map((user: UserSchema) => {
//         this.userSubject.next(user);
//         this.isAuthenticated$.next(true);
//         // this.startRefreshTokenTimer();
//         return user;
//       })
//     );
//   }

//   public isAuthenticated(): Observable<boolean> {
//     return this.isAuthenticated$.asObservable();
//   }

//   logout() {
//     // this.http
//     //   .post<any>(
//     //     `${env.apiUrl}/auth/revoke-token`,
//     //     {}
//     //   )
//     //   .subscribe();
//     this.isAuthenticated$.next(false);
//     this.stopRefreshTokenTimer();
//     this.userSubject.next(null);
//     this.router.navigate(['auth/login']);
//   }

//   refreshToken() {
//     // console.log(`${env.apiUrl}/api/auth/refresh-token`)

//     console.log('user   ', this.userValue);
//     return this.http
//       .post<any>(`${env.apiUrl}/api/auth/refresh-token`, {
//         user: this.user,
//       })
//       .pipe(
//         map((user) => {
//           console.log('refresh_token', user);
//           this.userSubject.next(user);
//           this.startRefreshTokenTimer();
//           return user;
//         })
//       );
//   }

//   // helper methods
//   private refreshTokenTimeout: string | number | NodeJS.Timeout | undefined;

//   private startRefreshTokenTimer() {
//     const toDecode = this?.userValue?.token || '';
//     // parse json object from base64 encoded jwt token
//     const jwtToken = JSON.parse(window.atob(toDecode.split('.')[1]));

//     // set a timeout to refresh the token a minute before it expires
//     const expires = new Date(jwtToken.exp * 1000);
//     const timeout = expires.getTime() - Date.now() - 60 * 1000;
//     this.refreshTokenTimeout = setTimeout(
//       () => this.refreshToken().subscribe(),
//       timeout
//     );
//   }

//   private stopRefreshTokenTimer() {
//     clearTimeout(this.refreshTokenTimeout);
//   }
// }
