import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 使 ConfigModule 全局可用，无需在每个模块中单独导入
      envFilePath: '.env', // 指定 .env 文件路径
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
