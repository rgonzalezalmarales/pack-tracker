import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment as env } from '@env/environment';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { TOKEN_PREFIX } from '../interfaces/project-conts';
import { User } from '../_models';
import { JWTService } from './jwt.service';
import { LocalStorageService } from './local-storage.service';

export type UserSchema = User | null;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject: BehaviorSubject<UserSchema>;
  public user: Observable<UserSchema>;
  private isAuthenticated$: BehaviorSubject<boolean>;

  private keyUser = `${TOKEN_PREFIX}_USER`;

  constructor(
    private readonly router: Router,
    private readonly http: HttpClient,
    private readonly jwtService: JWTService,
    private readonly storage: LocalStorageService
  ) {
    const _user = JSON.parse(storage.getItem(this.keyUser));

    this.userSubject = new BehaviorSubject<UserSchema>(_user || null);
    this.user = this.userSubject.asObservable();

    this.isAuthenticated$ = new BehaviorSubject(!!this.userValue);
  }

  public get userValue(): UserSchema {
    return this.userSubject.value;
  }

  login(email: string, password: string) {
    const authUrl = `${env.apiUrl}/auth/login`;
    return this.http.post<any>(authUrl, { email, password }).pipe(
      map((user: UserSchema) => {

        console.log(user)

        this.userSubject.next(user);
        this.isAuthenticated$.next(true);
        this.storage.setItem(this.keyUser, JSON.stringify(user));
        this.startRefreshTokenTimer();
        return user;
      }),
    
    );
  }

  public isAuthenticated(): Observable<boolean> {
    return this.isAuthenticated$.asObservable();
  }

  logout() {

    if(!this.userValue?._id) return;
    
    return this.http
      .get<any>(`${env.apiUrl}/auth/${this.userValue?._id}/logout`)
      .pipe(
        map(() => {
          this.stopRefreshTokenTimer();
          this.storage.removeItem(this.keyUser);
          this.isAuthenticated$.next(false);
          this.userSubject.next(null);
          console.log('navigate logout')
          this.router.navigate(['auth/login']);

          return true;
        })
      )
      .subscribe();
  }

  refreshToken() {
    return this.http
      .post<any>(`${env.apiUrl}/auth/refresh-token`, {
        token: this.userValue?.token,
      })
      .pipe(
        map((user) => {
          this.userSubject.next(user);
          this.startRefreshTokenTimer();
          return user;
        })
      );
  }

  // helper methods
  private refreshTokenTimeout: any;
  private isRefreshing = false;

  startRefreshTokenTimer() {
    const toDecode = this?.userValue?.token || '';
    const date = this.jwtService.getTokenExpirationDate(toDecode);
    const exp = this.jwtService.getTokenSecondosToExp(toDecode);

    console.log(
      `Su token expira a las: ${date}, faltan ${exp} milisegundos, refresh: ${
        exp * 0.6
      }, segundos`
    );

    if (exp > 0) {
      const timeout = exp * 0.6;
      this.refreshTokenTimeout = setTimeout(() => {
        console.log(`Is time to refresh token ${new Date(Date.now())}`);
        this.refreshToken().subscribe();
      }, timeout);
    }
  }

  private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
  }
}
