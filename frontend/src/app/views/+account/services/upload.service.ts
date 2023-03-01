import { Injectable } from '@angular/core';
import { HttpClienAdapterService } from '@app/shared/adapters/http-client-adapter.service';


@Injectable({
  providedIn: 'root',
})
export class UploadService {
  constructor(private http: HttpClienAdapterService) {}

  // uploadExcelFile(file: File) {
  //   const formData = new FormData();
  //   formData.append('file', file);

  //   return this.http.post(`${env.apiRestUrl}/upload/excel`, formData, {
  //     reportProgress: true,
  //     observe: 'events',
  //   });
  // }
}
