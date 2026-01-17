import { User } from '../user/user.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

/**
 * 角色实体
 * 对应数据库中的 roles 表
 */
@Entity()
export class Roles {
  /** 角色 ID（主键，自增） */
  @PrimaryGeneratedColumn()
  id: string;

  /** 角色名称 */
  @Column()
  name: string;

  /** 拥有该角色的用户列表（多对多） */
  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}
