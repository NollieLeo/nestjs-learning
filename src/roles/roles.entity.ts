import { User } from '../user/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

/**
 * 角色实体
 * 对应数据库中的 roles 表
 */
@Entity()
export class Roles {
  /**
   * 角色 ID
   * @example 1
   */
  @PrimaryGeneratedColumn()
  id: string;

  /**
   * 角色名称
   * @example admin
   */
  @Column()
  name: string;

  /** 拥有该角色的用户列表 */
  @ManyToMany(() => User, (user) => user.roles)
  @JoinTable()
  users: User[];
}
