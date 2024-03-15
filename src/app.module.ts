import { AppService } from './app.service';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import * as path from 'path';
import { BotModule } from './modules/bot/bot.module';
import { P88IntegrationModule } from './modules/p88_integration/p88_integration.module';
import { AiIntegrationModule } from './modules/ai_integration/ai_integration.module';
import { Module } from '@nestjs/common';
import { SharedModule } from './shared/shared.module';
import configs from '../config';
import { BotName } from './app.constants';
import { sessionMiddleware } from './middleware/session.middleware';
import { ApiModule } from './apiConfigAxios/api.module';
import { i18n } from './middleware/i18n.middleware';
import { AppController } from './app.controller';
import { TournamentModule } from './tournament/tournament.module';
import { BotService } from './modules/bot/bot.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: configs,
      isGlobal: true,
      cache: true,
      envFilePath: ['.env'],
      expandVariables: true,
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang']),
      ],
    }),
    TelegrafModule.forRootAsync({
      botName: BotName,
      useFactory: async (configService: ConfigService) => ({
        token: configService.get<string>('app.telegram.botToken'),
        middlewares: [sessionMiddleware, i18n.middleware()],
        include: [BotModule],
      }),

      inject: [ConfigService],
    }),
    BotModule,
    P88IntegrationModule,
    AiIntegrationModule,
    SharedModule,
    ApiModule,
    TournamentModule,
  ],
  controllers: [AppController],
  providers: [AppService, BotService],
})
export class AppModule {}
