import * as bcrypt from 'bcrypt';

import { CreateUserDto } from 'src/auth/dto';
import { ValidRoles } from 'src/auth/interfaces';

export interface SeedUser {
  email: string;
  fullName: string;
  password: string;
  roles: string[];
}

interface SeedData {
  users: CreateUserDto[];
}

export const initialData: SeedData = {
  users: [
    {
      email: 'admin@gmail.com',
      fullName: 'Root Admin',
      password: bcrypt.hashSync('Abc123', 10),
      roles: [ValidRoles.Admin.toString()],
      isActive: true,
    },
  ],
};
