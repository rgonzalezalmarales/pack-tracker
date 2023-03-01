import { Injectable } from '@angular/core';
import { HttpClienAdapterService } from '@app/shared/adapters/http-client-adapter.service';
import { environment as env } from '@env/environment';
import { map, Observable } from 'rxjs';
import { IFilters } from '../interfaces';
import { IPackage, IPagPacks } from '../interfaces/pack-status.inteface';

@Injectable({
  providedIn: 'root',
})
export class PackageService {
  constructor(private readonly http: HttpClienAdapterService) {}

  addPackage(pack: any): Observable<any> {
    return this.http.pos(`${env.apiUrl}/package`, pack);
  }

  getPackage(id: string): Observable<IPackage> {
    return this.http.get<IPackage>(`${env.apiUrl}/package/${id}`);
  }

  getPackages(filters: IFilters): Observable<IPagPacks> {
    return this.http.get<IPagPacks>(`${env.apiUrl}/package`, {
      params: {
        ...filters,
      },
    });

    // .pipe(
    //   map((data: any) => {
    //     if (!data?.length) return [];
    //     return data;
    //   })
    // );
  }

  getStatus(identifier: string): Observable<IPackage> {
    return this.http.get(`${env.apiUrl}/package/${identifier}/status`);
  }

  updateStatus(id: string, data: any): Observable<any> {
    return this.http.patch<IPackage>(`${env.apiUrl}/package/${id}`, data);
  }
}
