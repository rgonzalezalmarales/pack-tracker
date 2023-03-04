import { Injectable } from '@nestjs/common';

import { initialData } from './data/seed-data';
import { AuthService } from 'src/auth/services/auth.service';
// import { AxiosAdapterService } from 'src/common/adapters/axios-adapter.service';

@Injectable()
export class SeedService {
  constructor(
    // private readonly http: AxiosAdapterService,
    private readonly authService: AuthService,
  ) {}

  async executeSeed() {
    await this.insertUsers();
    return 'Seed excecuted';
  }

  private async insertUsers() {
    const { users } = initialData;

    await this.authService.deleteManyById();

    return this.authService.insertManny(users);
  }
}
