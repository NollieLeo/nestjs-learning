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
  /** 日志 ID（主键，自增） */
  @PrimaryGeneratedColumn()
  id: string;

  /** 请求路径 */
  @Column()
  path: string;

  /** 请求方法（GET、POST、PUT、DELETE 等） */
  @Column()
  method: string;

  /** 请求数据（JSON 字符串） */
  @Column()
  data: string;

  /** HTTP 响应状态码（< 400 成功，>= 400 失败） */
  @Column()
  result: number;

  /** 操作用户（多对一） */
  @ManyToOne(() => User, (user) => user.logs)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
