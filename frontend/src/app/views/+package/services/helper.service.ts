import { Injectable } from '@angular/core';
import { PackStatus } from '../interfaces/pack-status.inteface';

@Injectable({
  providedIn: 'root',
})
export class HelperService {
  constructor() {}

  getAllStatus(): PackStatus[] {
    return [PackStatus.Delivered, PackStatus.Received, PackStatus.Transit];
  }
}
