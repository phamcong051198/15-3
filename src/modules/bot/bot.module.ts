import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { BotUpdate } from './bot.update';
import { SharedModule } from 'src/shared/shared.module';
import { LoginWizard } from './wizard/login.wizard';
import { ApiModule } from 'src/apiConfigAxios/api.module';
import { AiIntegrationService } from '../ai_integration/ai_integration.service';
import { P88IntegrationService } from '../p88_integration/p88_integration.service';
import { MatchInformationScene } from './scenes/matchInfo.scene';
import { LiveMatchScene } from './scenes/liveMatch.scene';
import { LeagueInfoScene } from './scenes/leagueInfo.scene';
import { MatchUpcomingScene } from './scenes/matchUpcoming.scene';
import { TodayMatchScene } from './scenes/todayMatch.scene';
import { WeekMatchScene } from './scenes/weekMatch.scene';
import { MonthMatchScene } from './scenes/monthMatch.scene';
import { NextMonthMatchScene } from './scenes/nextMonthMatch.scene';

@Module({
  imports: [SharedModule, ApiModule],
  providers: [
    BotUpdate,
    LoginWizard,
    LiveMatchScene,
    MatchUpcomingScene,
    MatchInformationScene,
    WeekMatchScene,
    TodayMatchScene,
    MonthMatchScene,
    NextMonthMatchScene,
    LeagueInfoScene,
    BotService,
    AiIntegrationService,
    P88IntegrationService,
  ],
})
export class BotModule {}
