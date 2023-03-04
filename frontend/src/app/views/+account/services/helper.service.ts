import { Injectable } from '@angular/core';
import { Role } from '../interfaces/acount.interface';

@Injectable({
  providedIn: 'root',
})
export class HelperService {
  constructor() {}

  getRoles = (): Role[] => [
    Role.Admin,
    Role.DeliviryMan,
    Role.OperationsManager,
    // Role.Receiver,
  ];
}
