import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

/**
 * 用户资料实体
 * 对应数据库中的 profile 表
 */
@Entity()
export class Profile {
  /**
   * 资料 ID
   * @example 1
   */
  @PrimaryGeneratedColumn()
  id: string;

  /**
   * 性别 (0: 未知, 1: 男, 2: 女)
   * @example 1
   */
  @Column({ default: 0 })
  gender: number;

  /**
   * 头像 URL
   * @example https://example.com/avatar.png
   */
  @Column({ default: '' })
  avatar: string;

  /**
   * 详细地址
   * @example 浙江省杭州市西湖区
   */
  @Column({ default: '' })
  address: string;

  /**
   * 关联的用户
   */
  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
