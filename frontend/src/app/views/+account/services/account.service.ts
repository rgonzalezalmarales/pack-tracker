import { Injectable } from '@angular/core';
import { HttpClienAdapterService } from '@app/shared/adapters/http-client-adapter.service';
import { Observable } from 'rxjs';
import { environment as env } from '@env/environment';
import {
  IAccount,
  IFilterResul,
  IFilters,
} from '../interfaces/acount.interface';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  constructor(private readonly http: HttpClienAdapterService) {}

  getUserById(id: string): Observable<IAccount> {
    return this.http.get<IAccount>(`${env.apiUrl}/user/${id}`);
  }

  getUsers(filters: IFilters): Observable<IFilterResul> {
    return this.http.get<IFilterResul>(`${env.apiUrl}/user`, {
      params: {
        ...filters,
      },
    });
  }

  addUser(user: any): Observable<any> {
    return this.http.pos(`${env.apiUrl}/user/register`, user);
  }

  updateUser(id: string, user: any): Observable<any> {    
    return this.http.patch(`${env.apiUrl}/user/${id}`, user);
  }

  deleteUser(id: string): Observable<any> {    
    return this.http.delete(`${env.apiUrl}/user/${id}`);
  }
}
