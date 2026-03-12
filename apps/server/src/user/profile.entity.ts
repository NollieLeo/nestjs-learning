import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

/**
 * 地址信息值对象 (Embedded Entity)
 */
export class AddressInfo {
  @Column({ name: 'province_code', default: '', nullable: true })
  provinceCode: string;

  @Column({ name: 'province_name', default: '', nullable: true })
  provinceName: string;

  @Column({ name: 'city_code', default: '', nullable: true })
  cityCode: string;

  @Column({ name: 'city_name', default: '', nullable: true })
  cityName: string;

  @Column({ name: 'district_code', default: '', nullable: true })
  districtCode: string;

  @Column({ name: 'district_name', default: '', nullable: true })
  districtName: string;

  @Column({ name: 'detail_address', default: '', nullable: true })
  detailAddress: string;
}

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
   * 嵌套地址信息
   * TypeORM 自动展开为前缀无关的多个字段
   */
  @Column(() => AddressInfo, { prefix: false })
  addressInfo: AddressInfo;

  /**
   * 关联的用户
   */
  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
