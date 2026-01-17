import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findAll() {
    return this.userRepository.find();
  }

  find(username: User['username']) {
    return this.userRepository.findOne({ where: { username } });
  }

  async create(user: Partial<Pick<User, 'username' | 'password'>>) {
    const existingUser = await this.userRepository.findOne({
      where: { username: user.username },
    });
    if (existingUser) {
      throw new ConflictException('用户名已存在');
    }
    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  async update(
    id: User['id'],
    user: Partial<Pick<User, 'username' | 'password'>>,
  ) {
    const existingUser = await this.userRepository.findOne({ where: { id } });
    if (!existingUser) {
      throw new NotFoundException('用户不存在');
    }

    // 如果要更新用户名，检查新用户名是否已被占用
    if (user.username && user.username !== existingUser.username) {
      const duplicateUser = await this.userRepository.findOne({
        where: { username: user.username },
      });
      if (duplicateUser) {
        throw new ConflictException('用户名已存在');
      }
    }

    await this.userRepository.update(id, user);
    return this.userRepository.findOne({ where: { id } });
  }

  async remove(id: User['id']) {
    const existingUser = await this.userRepository.findOne({ where: { id } });
    if (!existingUser) {
      throw new NotFoundException('用户不存在');
    }
    return this.userRepository.delete(id);
  }
}
