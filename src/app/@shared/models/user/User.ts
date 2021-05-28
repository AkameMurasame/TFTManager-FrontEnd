import { Role } from "./Role";

export class User {
  id!: number;
  username!: string;
  password!: string;
  role!: Role;
}
