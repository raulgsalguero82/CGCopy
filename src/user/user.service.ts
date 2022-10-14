import { Injectable } from '@nestjs/common';
import { RoleType, User } from './user';

@Injectable()
export class UserService {
  private users: User[] = [
    new User(1, 'admin', 'admin', [
      RoleType.READ,
      RoleType.WRITE,
      RoleType.DELETE,
    ]),
    new User(2, 'ReadOnlyUser', 'ReadOnlyUser', [RoleType.READ]),
    new User(3, 'ReadOnlyCG', 'ReadOnlyCG', [
      RoleType.READONLY_CULTURA_GASTRONOMICA,
    ]),
    new User(4, 'WriteOnly', 'WriteOnly', [RoleType.WRITE]),
    new User(5, 'DeleteOnly', 'DeleteOnly', [RoleType.DELETE]),
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }
}
