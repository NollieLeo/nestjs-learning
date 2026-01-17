import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Logs } from './logs.entity';
import { Repository } from 'typeorm';

export interface LogQueryOptions {
  userId?: number;
  status?: 'success' | 'fail'; // success: result < 400, fail: result >= 400
  orderBy?: 'id' | 'result' | 'method' | 'path';
  order?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}

export interface LogStats {
  total: number;
  success: number;
  fail: number;
}

@Injectable()
export class LogsService {
  constructor(
    @InjectRepository(Logs)
    private logsRepository: Repository<Logs>,
  ) {}

  /**
   * 查询日志（支持筛选、排序、分页）
   */
  async findAll(options: LogQueryOptions = {}) {
    const {
      userId,
      status,
      orderBy = 'id',
      order = 'DESC',
      page = 1,
      limit = 10,
    } = options;

    const queryBuilder = this.logsRepository
      .createQueryBuilder('logs')
      .leftJoin('logs.user', 'user');

    // 按用户 ID 筛选
    if (userId) {
      queryBuilder.andWhere('user.id = :userId', { userId });
    }

    // 按成功/失败状态筛选
    if (status === 'success') {
      queryBuilder.andWhere('logs.result < 400');
    } else if (status === 'fail') {
      queryBuilder.andWhere('logs.result >= 400');
    }

    // 排序
    queryBuilder.orderBy(`logs.${orderBy}`, order);

    // 分页
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
   * 统计日志成功/失败数量
   */
  async getStats(userId?: number): Promise<LogStats> {
    const queryBuilder = this.logsRepository
      .createQueryBuilder('logs')
      .leftJoin('logs.user', 'user');

    if (userId) {
      queryBuilder.andWhere('user.id = :userId', { userId });
    }

    const total = await queryBuilder.getCount();

    const successCount = await queryBuilder
      .clone()
      .andWhere('logs.result < 400')
      .getCount();

    const failCount = await queryBuilder
      .clone()
      .andWhere('logs.result >= 400')
      .getCount();

    return {
      total,
      success: successCount,
      fail: failCount,
    };
  }

  /**
   * 按用户分组统计日志数量
   */
  async getStatsByUser() {
    return this.logsRepository
      .createQueryBuilder('logs')
      .leftJoin('logs.user', 'user')
      .select('user.id', 'userId')
      .addSelect('user.username', 'username')
      .addSelect('COUNT(*)', 'total')
      .addSelect(
        'SUM(CASE WHEN logs.result < 400 THEN 1 ELSE 0 END)',
        'success',
      )
      .addSelect('SUM(CASE WHEN logs.result >= 400 THEN 1 ELSE 0 END)', 'fail')
      .groupBy('user.id')
      .addGroupBy('user.username')
      .orderBy('total', 'DESC')
      .getRawMany();
  }

  /**
   * 根据用户 ID 查询日志
   */
  findByUserId(userId: number) {
    return this.logsRepository.find({
      where: { user: { id: userId } },
      relations: { user: true },
    });
  }

  /**
   * 根据日志 ID 查询单条日志
   */
  findOne(id: string) {
    return this.logsRepository.findOne({
      where: { id },
      relations: { user: true },
    });
  }

  /**
   * 创建日志
   */
  create(log: Partial<Logs>) {
    const newLog = this.logsRepository.create(log);
    return this.logsRepository.save(newLog);
  }

  /**
   * 删除日志
   */
  remove(id: string) {
    return this.logsRepository.delete(id);
  }
}
