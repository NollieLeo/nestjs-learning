import { User } from '../user/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

/**
 * 日志实体
 * 对应数据库中的 logs 表，记录用户操作日志
 */
@Entity()
export class Logs {
  /**
   * 日志 ID
   * @example 1
   */
  @PrimaryGeneratedColumn()
  id: string;

  /**
   * 请求路径
   * @example /api/v1/user
   */
  @Column()
  path: string;

  /**
   * 请求方法
   * @example POST
   */
  @Column()
  method: string;

  /**
   * 请求体（JSON 参数）
   * @example '{"username":"test"}'
   */
  @Column()
  data: string;

  /**
   * HTTP 状态码
   * @example 200
   */
  @Column()
  result: number;

  /** 操作用户 */
  @ManyToOne(() => User, (user) => user.logs)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
