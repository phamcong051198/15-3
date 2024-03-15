import { Module } from '@nestjs/common';
import { TournamentController } from './tournament.controller';
import { TournamentService } from './tournament.service';
import { SharedModule } from 'src/shared/shared.module';
import { ApiModule } from 'src/apiConfigAxios/api.module';

@Module({
  imports: [SharedModule, ApiModule],
  controllers: [TournamentController],
  providers: [TournamentService],
})
export class TournamentModule {}
