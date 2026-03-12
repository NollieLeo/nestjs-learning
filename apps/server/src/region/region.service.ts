import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Region } from './entities/region.entity';

@Injectable()
export class RegionService {
  constructor(
    @InjectRepository(Region)
    private readonly regionRepository: Repository<Region>,
  ) {}

  /**
   * 获取省级列表
   */
  async getProvinces() {
    return this.regionRepository.find({
      where: { parentCode: '0' },
      order: { code: 'ASC' },
    });
  }

  /**
   * 根据父级编码获取下级列表
   * @param parentCode 父级编码
   */
  async getChildrenByParentCode(parentCode: string) {
    return this.regionRepository.find({
      where: { parentCode },
      order: { code: 'ASC' },
    });
  }

  /**
   * 根据 code 列表获取行政区划 (用于回显)
   */
  async getRegionsByCodes(codes: string[]) {
    if (!codes || codes.length === 0) return [];

    // TypeORM 的 In 查询可以直接用 array
    const qb = this.regionRepository
      .createQueryBuilder('region')
      .where('region.code IN (:...codes)', { codes });

    return qb.getMany();
  }
}
