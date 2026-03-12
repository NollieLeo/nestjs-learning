import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Region } from '../region/entities/region.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

interface RegionNode {
  code: string;
  name: string;
  children?: RegionNode[];
}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const regionRepo = app.get<Repository<Region>>(getRepositoryToken(Region));

  console.log('开始解析省级市区数据...');
  const jsonPath = path.join(__dirname, '../region/data/pca-code.json');
  const rawData = fs.readFileSync(jsonPath, 'utf8');
  const treeData = JSON.parse(rawData) as RegionNode[];

  const regionsToInsert: Partial<Region>[] = [];

  const traverse = (nodes: RegionNode[], parentCode: string, level: number) => {
    for (const node of nodes) {
      regionsToInsert.push({
        code: node.code,
        name: node.name,
        parentCode,
        level,
      });
      if (node.children && node.children.length > 0) {
        traverse(node.children, node.code, level + 1);
      }
    }
  };

  traverse(treeData, '0', 1);

  console.log(
    `总共提取出 ${regionsToInsert.length} 条行政区划数据，准备执行插入...`,
  );

  // 由于存在外键等问题可以忽略，这里我们直接清空表数据
  await regionRepo.clear();

  const chunkSize = 1000;
  for (let i = 0; i < regionsToInsert.length; i += chunkSize) {
    const chunk = regionsToInsert.slice(i, i + chunkSize);
    await regionRepo.save(chunk);
    console.log(
      `已插入 ${Math.min(i + chunkSize, regionsToInsert.length)} / ${regionsToInsert.length} 条...`,
    );
  }

  console.log('数据导入成功！');
  await app.close();
  process.exit(0);
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
