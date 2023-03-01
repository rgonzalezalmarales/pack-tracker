export interface User {
  _id: number;
  email: string;
  password: string;
  fullName: string;
  token?: string;
  roles?: string[];
}
