import { Column, Entity, PrimaryColumn, Index } from 'typeorm';

/**
 * 行政区划实体
 * 对应数据库中的 region 表
 */
@Entity()
export class Region {
  /**
   * 行政区划代码（主键）
   * @example '33' (省), '3301' (市), '330106' (区)
   */
  @PrimaryColumn()
  code: string;

  /**
   * 行政区划名称
   * @example 浙江省
   */
  @Column()
  name: string;

  /**
   * 父级代码（顶级为 '0'）
   * @example 0
   */
  @Index()
  @Column()
  parentCode: string;

  /**
   * 层级（1-省/直辖市, 2-市, 3-区/县）
   * @example 1
   */
  @Column()
  level: number;
}
