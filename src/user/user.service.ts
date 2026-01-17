import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

/**
 * 用户服务
 * 处理用户相关的业务逻辑
 */
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * 查询所有用户
   * @returns 用户列表
   */
  findAll() {
    return this.userRepository.find();
  }

  /**
   * 根据用户名查询用户
   * @param username - 用户名
   * @returns 用户信息或 null
   */
  find(username: User['username']) {
    return this.userRepository.findOne({ where: { username } });
  }

  /**
   * 创建新用户
   * @param user - 用户信息
   * @returns 创建的用户
   * @throws ConflictException 用户名已存在
   */
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

  /**
   * 更新用户信息
   * @param id - 用户 ID
   * @param user - 要更新的用户信息
   * @returns 更新后的用户
   * @throws NotFoundException 用户不存在
   * @throws ConflictException 用户名已被占用
   */
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

  /**
   * 删除用户
   * @param id - 用户 ID
   * @returns 删除结果
   * @throws NotFoundException 用户不存在
   */
  async remove(id: User['id']) {
    const existingUser = await this.userRepository.findOne({ where: { id } });
    if (!existingUser) {
      throw new NotFoundException('用户不存在');
    }
    return this.userRepository.delete(id);
  }

  /**
   * 查询用户详情（包含 Profile）
   * @param id - 用户 ID
   * @returns 用户信息及其 Profile
   */
  findUserProfile(id: User['id']) {
    return this.userRepository.findOne({
      where: { id },
      relations: {
        profile: true,
      },
    });
  }
}
