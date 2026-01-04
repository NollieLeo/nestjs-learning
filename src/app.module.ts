import { Module } from '@nestjs/common';
import { RangeModule } from './range/range.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule, RangeModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
