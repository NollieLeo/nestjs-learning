import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import { Repository, DeepPartial } from 'typeorm';
import { UserQueryDto } from './dto/user-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

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
   * 查询全量或筛选分页用户列表
   */
  async findAll(query: UserQueryDto = {}) {
    const {
      keyword,
      role,
      orderBy = 'id',
      order = 'DESC',
      page = 1,
      limit = 10,
    } = query;

    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .leftJoinAndSelect('user.roles', 'roles');

    if (role) {
      // ⚠️ 不要使用 .andWhere('roles.id = :roleId')！
      // 若直接使用 where 过滤 roles 别名，会导致该用户其他未被匹配的 role 被过滤掉，导致返回数据不完整。
      // 正确做法：新建一个无副作用的 innerJoin 替身 'roleFilter' 专门用来筛选主表，而不影响 SELECT 的 'roles' 数据。
      queryBuilder.innerJoin(
        'user.roles',
        'roleFilter',
        'roleFilter.id = :roleId',
        { roleId: role },
      );
    }

    if (keyword) {
      // 尝试将 keyword 转换为数字，以便后续匹配 ID
      const asNumber = Number(keyword);
      if (!isNaN(asNumber)) {
        // 如果能转成数字，则同时匹配 ID 或 用户名
        queryBuilder.where('(user.username LIKE :keyword OR user.id = :id)', {
          keyword: `%${keyword}%`,
          id: asNumber,
        });
      } else {
        // 否则只匹配用户名
        queryBuilder.where('user.username LIKE :keyword', {
          keyword: `%${keyword}%`,
        });
      }
    }

    queryBuilder.orderBy(`user.${orderBy}`, order);
    queryBuilder.skip((page - 1) * limit).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
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
   * 根据用户名查询用户（支持查询密码字段用于登录校验）
   * @param username - 用户名
   * @param selectPassword - 是否查询密码字段
   */
  findByUsername(username: string, selectPassword = false) {
    const qb = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'roles')
      .where('user.username = :username', { username });

    if (selectPassword) {
      qb.addSelect('user.password');
    }

    return qb.getOne();
  }

  /**
   * 根据 ID 查询用户
   * @param id - 用户 ID
   * @returns 用户信息或 null
   */
  findUserById(id: User['id']) {
    return this.userRepository.findOne({ where: { id } });
  }

  /**
   * 根据 ID 查询用户并带出密码
   * @param id - 用户 ID
   */
  findUserByIdWithPassword(id: User['id']) {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.id = :id', { id })
      .getOne();
  }

  /**
   * 直接更新密码 (供 AuthService 使用)
   */
  async updatePasswordRaw(id: number, hashedPassword: string) {
    return this.userRepository.update(id, { password: hashedPassword });
  }

  /**
   * 创建新用户
   * @param user - 用户信息
   * @returns 创建的用户（安全返回）
   * @throws ConflictException 用户名已存在
   */
  async create(user: CreateUserDto) {
    // 确保直接创建的用户密码被正确 hash 加密
    if (user.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }

    const newUser = this.userRepository.create(user);
    const savedUser = await this.userRepository.save(newUser);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = savedUser;
    return safeUser;
  }

  /**
   * 更新用户信息
   * @param id - 用户 ID
   * @param user - 要更新的用户信息
   * @returns 更新后的用户
   */
  async update(id: User['id'], user: UpdateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: { id },
      relations: ['profile'],
    });

    if (!existingUser) {
      throw new Error('User not found');
    }

    const updatedUser = this.userRepository.merge(
      existingUser,
      user as DeepPartial<User>,
    );
    await this.userRepository.save(updatedUser);

    return this.userRepository.findOne({
      where: { id },
      relations: ['profile', 'roles'],
    });
  }

  /**
   * 删除用户
   * @param id - 用户 ID
   * @returns 删除结果
   * @throws NotFoundException 用户不存在
   */
  async remove(id: User['id']) {
    const user = await this.userRepository.findOneByOrFail({ id });
    return this.userRepository.remove(user);
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
        roles: true,
      },
    });
  }
}
