// config-singleton.ts
import { ConfigService } from '@nestjs/config';

let configServiceInstance: ConfigService;

export function setConfigService(configService: ConfigService) {
  configServiceInstance = configService;
}

export function getConfigService(): ConfigService {
  if (!configServiceInstance) {
    throw new Error('ConfigService has not been initialized');
  }
  return configServiceInstance;
}
