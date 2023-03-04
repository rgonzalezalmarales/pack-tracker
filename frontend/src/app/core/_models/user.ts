import { Role } from "src/app/views/+account/interfaces/acount.interface";

export interface User {
  _id: number;
  email: string;
  password: string;
  fullName: string;
  token?: string;
  roles?: Role[];
}
