import { Injectable } from '@angular/core';
import { PackStatus } from '../interfaces/pack-status.inteface';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() { }

  translateStatus(status: PackStatus): string {
    switch (status) {
      case PackStatus.Delivered:
        return 'Entregado';
      case PackStatus.Received:
        return 'Recibido';
      default:
        return 'Tránsito';
    }
  }
}
