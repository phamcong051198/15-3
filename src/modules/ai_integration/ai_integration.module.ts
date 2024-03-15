import { Module } from '@nestjs/common';
import { AiIntegrationService } from './ai_integration.service';
import { ApiModule } from 'src/apiConfigAxios/api.module';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [SharedModule, ApiModule],
  providers: [AiIntegrationService],
})
export class AiIntegrationModule {}
