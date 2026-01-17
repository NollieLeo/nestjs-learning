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
  /** 资料 ID（主键，自增） */
  @PrimaryGeneratedColumn()
  id: string;

  /** 性别（0: 未知, 1: 男, 2: 女） */
  @Column()
  gender: number;

  /** 头像 URL */
  @Column()
  photo: string;

  /** 地址 */
  @Column()
  address: string;

  /** 关联的用户（一对一） */
  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
