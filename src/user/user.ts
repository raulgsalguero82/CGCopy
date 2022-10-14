export class User {
  id: number;
  username: string;
  password: string;
  roles: RoleType[];

  constructor(
    id: number,
    username: string,
    password: string,
    roles: RoleType[],
  ) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.roles = roles;
  }
}

export enum RoleType {
  READ = 2,
  WRITE = 3,
  DELETE = 4,
  READONLY_CULTURA_GASTRONOMICA = 5,
}
