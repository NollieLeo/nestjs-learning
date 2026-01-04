import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  getUsers() {
    return { code: 0, data: [], msg: 'Success' };
  }
  addUser() {
    return { code: 0, data: {}, msg: 'Success' };
  }
}
