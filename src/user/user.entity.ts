import { Logs } from '../logs/logs.entity';
import { Roles } from '../roles/roles.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Profile } from './profile.entity';

/**
 * 用户实体
 * 对应数据库中的 user 表
 */
@Entity()
export class User {
  /** 用户 ID（主键，自增） */
  @PrimaryGeneratedColumn()
  id: number;

  /** 用户名（唯一） */
  @Column({ unique: true })
  username: string;

  /** 密码 */
  @Column()
  password: string;

  /** 用户的操作日志（一对多） */
  @OneToMany(() => Logs, (logs) => logs.user)
  logs: Logs[];

  /** 用户的角色（多对多） */
  @ManyToMany(() => Roles, (role) => role.users)
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Roles[];

  /** 用户的个人资料（一对一） */
  @OneToOne(() => Profile, (profile) => profile.user)
  profile: Profile;
}
