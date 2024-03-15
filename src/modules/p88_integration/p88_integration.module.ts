import { Module } from '@nestjs/common';
import { P88IntegrationService } from './p88_integration.service';
import { ApiModule } from 'src/apiConfigAxios/api.module';
import { SharedModule } from '@app/shared';

@Module({
  imports: [SharedModule, ApiModule],
  providers: [P88IntegrationService],
})
export class P88IntegrationModule {}
