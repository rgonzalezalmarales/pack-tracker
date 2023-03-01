import { Observable } from 'rxjs';

export interface IHttpAdpater {
  get<T>(url: string, options: object): Observable<T>;

  pos<T>(url: string, body: any, options?: object): Observable<T>;

  patch<T>(url: string, body: any, options?: object): Observable<T>;
}
