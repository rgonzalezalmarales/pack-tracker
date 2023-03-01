import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    // console.log('AuthGuard');
    const user = this.authService.userValue;
    const expectedRole: any[] = route.data['expectedRole'];
    // return true;
    if (user) {
      if (!expectedRole.length) return true;

      const roles: string[] = user.roles || [];

      if (!roles.some((role) => expectedRole.some((p) => p === role)))
        return false;

      // logged in so return true
      return true;
    } else {
      // not logged in so redirect to login page with the return url
      console.log('navigate AuthGuard')
      this.router.navigate(['auth/login'], {
        queryParams: { returnUrl: state.url },
      });
      return false;
    }
  }
}
