import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { setConfigService } from './lib/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  setConfigService(configService);
  await app.listen(process.env.PORT ?? 3030);
}
bootstrap().catch(console.error);
