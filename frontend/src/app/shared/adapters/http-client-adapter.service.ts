import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IHttpAdpater } from '../interfaces/http-adapter.interface';

@Injectable({
  providedIn: 'root',
})
export class HttpClienAdapterService implements IHttpAdpater {
  constructor(private readonly http: HttpClient) {}
  
  get<T>(url: string, options?: object): Observable<T> {
    return this.http.get<T>(url, options);
  }
 
  pos<T>(url: string, body: any, options?: object): Observable<T> {
    return this.http.post<T>(url, body, options);
  }

  patch<T>(url: string, body: any, options?: object): Observable<T> {
    return this.http.patch<T>(url, body, options);
  }
}
