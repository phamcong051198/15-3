import { Inject, UseFilters, UseGuards } from '@nestjs/common';
import { AxiosInstance } from 'axios';
import {
  Update,
  Ctx,
  Start,
  InjectBot,
  Action,
  Hears,
  On,
} from 'nestjs-telegraf';
import {
  BotName,
  LEAGUE_INFO_SCENE,
  LIVE_MATCH_SCENE,
  MATCH_INFORMATION_SCENE,
  MATCH_UPCOMING_SCENE,
  MONTH_MATCH_SCENE,
  NEXT_MONTH_MATCH_SCENE,
  TODAY_MATCH_SCENE,
  WEEK_MATCH_SCENE,
  WIZARD_SCENE_LOGIN,
} from 'src/app.constants';
import { StoreService } from 'src/store/store.service';
import { Telegraf } from 'telegraf';
import { deleteMessages } from '../../apiTelegram_deleteMessages/deleteMessages';
import { inlineKeyBoard_SelectLanguages } from 'src/keyBoardBot/inlineKeyboard/selectLanguages';
import { inlineKeyBoard_Login } from 'src/keyBoardBot/inlineKeyboard/login';
import { inlineKeyBoard_SettingLanguages } from 'src/keyBoardBot/inlineKeyboard/settingLanguage';
import { inlineKeyBoard_SettingOddFormat } from 'src/keyBoardBot/inlineKeyboard/settingOddFormat';
import { inlineKeyBoard_SettingTimezone } from 'src/keyBoardBot/inlineKeyboard/settingTimezone';
import { inlineKeyBoard_BetHistory_PendingBetCode } from 'src/keyBoardBot/inlineKeyboard/pendingBetCode';
import { BetList, BotService } from './bot.service';
import { inlineKeyBoard_BetHistory_SettledBet } from 'src/keyBoardBot/inlineKeyboard/settledBet';
import { keyBoard_AccountInfo } from 'src/keyBoardBot/keyboard/accountInfo';
import { keyboard_BackMainMenu } from 'src/keyBoardBot/keyboard/keyboard_MainMenu';
import { keyBoard_BetHistory } from 'src/keyBoardBot/keyboard/betHistory/betHistory';
import { keyBoard_BetHistory_SettledBet_Result } from 'src/keyBoardBot/keyboard/betHistory/settledBetResult';
import { keyBoard_BetHistory_PendingBetCode_Result } from 'src/keyBoardBot/keyboard/betHistory/pendingBetCodeResult';
import { inlineKeyBoard_Settings } from 'src/keyBoardBot/inlineKeyboard/setting';
import { AiIntegrationService } from '../ai_integration/ai_integration.service';
import { P88IntegrationService } from '../p88_integration/p88_integration.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { TelegrafExceptionFilter } from 'src/common/filters/telegraf-exception.filter';

@Update()
@UseFilters(TelegrafExceptionFilter)
export class BotUpdate {
  constructor(
    @Inject('TELEGRAM_INSTANCE')
    private readonly apiTelegram: AxiosInstance,
    @Inject('P88_INSTANCE')
    private readonly apiP88: AxiosInstance,
    @InjectBot(BotName)
    private readonly bot: Telegraf,
    private storeService: StoreService,
    private botService: BotService,
    private aiIntegrationService: AiIntegrationService,
    private p88IntegrationService: P88IntegrationService,
  ) {}

  @Start()
  async onStart(@Ctx() ctx: any) {
    const locale = this.storeService.getLocale();
    await ctx.i18n.locale(locale);
    ctx.message?.message_id &&
      this.storeService.setMessageIds(ctx.message.message_id);

    const messageWelcome = await inlineKeyBoard_SelectLanguages(ctx);

    const chat_id = ctx.chat.id;
    const message_ids = this.storeService.getMessageIds();
    if (message_ids.length) {
      await deleteMessages(this.apiTelegram, chat_id, message_ids);
      this.storeService.deleteMessageIds();
    }
    this.storeService.setMessageIds(messageWelcome.message_id);
  }

  @Action(/action_en|action_vi/)
  async onLanguage(@Ctx() ctx: any) {
    const cbQuery = ctx.update.callback_query;
    const userAnswer = 'data' in cbQuery ? cbQuery.data : null;

    if (userAnswer === 'action_en') {
      await ctx.i18n.locale('en');
      this.storeService.setLocale('en');
    }
    if (userAnswer === 'action_vi') {
      await ctx.i18n.locale('vi');
      this.storeService.setLocale('vi');
    }

    await inlineKeyBoard_Login(ctx);
    await ctx.deleteMessage();
  }

  @Action('action_login')
  async onLogin(@Ctx() ctx: any) {
    await ctx.scene.enter(WIZARD_SCENE_LOGIN);
  }

  @Action('action_cancel')
  async onCancelLogin(@Ctx() ctx: any) {
    await ctx.scene.leave();

    const chat_id = ctx.chat.id;
    const message_ids = this.storeService.getMessageIds();
    if (message_ids.length) {
      await deleteMessages(this.apiTelegram, chat_id, message_ids);
      this.storeService.deleteMessageIds();
    }
    this.onStart(ctx);
  }
  /******************************************************************* */
  /******************************************************************* */
  /******************************************************************* */

  @Hears(['MENU', 'menu', 'Menu', 'Quay lại', 'Back'])
  @UseGuards(AuthGuard)
  async onMainMenu(@Ctx() ctx: any) {
    const message = await keyboard_BackMainMenu(
      ctx,
      this.storeService.getUserName(),
    );
    this.storeService.setMessageIds(ctx.message.message_id);
    this.storeService.setMessageIds(message.message_id);
  }

  @Hears(['Thông tin tài khoản', 'Account information'])
  @UseGuards(AuthGuard)
  async onAccountInfo(@Ctx() ctx: any) {
    const accountInfo = await this.apiP88.get('/v1/client/balance');
    const message = await keyBoard_AccountInfo(
      ctx,
      accountInfo.data,
      this.storeService.getUserName(),
    );
    this.storeService.setMessageIds(ctx.message.message_id);
    this.storeService.setMessageIds(message.message_id);
  }

  @Hears(['Thông tin trận đấu', 'q', 'Match information'])
  // @UseGuards(AuthGuard)
  async onMatchInformation(@Ctx() ctx): Promise<void> {
    await ctx.scene.enter(MATCH_INFORMATION_SCENE);
  }
  @Hears(['Trận đấu trực tiếp', 'Live match'])
  // @UseGuards(AuthGuard)
  async onLiveMatch(@Ctx() ctx) {
    await ctx.scene.enter(LIVE_MATCH_SCENE);
  }

  @Hears(['Hôm nay', 'Today'])
  // @UseGuards(AuthGuard)
  async onTodayMatch(@Ctx() ctx) {
    console.log('á');
    await ctx.scene.enter(TODAY_MATCH_SCENE);
  }
  @Hears(['Tuần này', 'This week'])
  // @UseGuards(AuthGuard)
  async onWeekMatch(@Ctx() ctx) {
    await ctx.scene.enter(WEEK_MATCH_SCENE);
  }
  @Hears(['Tháng này', 'This month'])
  // @UseGuards(AuthGuard)
  async onMonthMatch(@Ctx() ctx) {
    await ctx.scene.enter(MONTH_MATCH_SCENE);
  }
  @Hears(['Tháng sau', 'Next month'])
  // @UseGuards(AuthGuard)
  async onNextMonthMatch(@Ctx() ctx) {
    await ctx.scene.enter(NEXT_MONTH_MATCH_SCENE);
  }
  @Hears(['Thông tin giải đấu', 'Tournament information'])
  //@UseGuards(AuthGuard)
  async onTournamentInfo(@Ctx() ctx) {
    await ctx.scene.enter(LEAGUE_INFO_SCENE);
  }
  @Hears(['Trận đấu sắp diễn ra', 'The match is about to take place'])
  // @UseGuards(AuthGuard)
  async onMatchUpcoming(@Ctx() ctx) {
    await ctx.scene.enter(MATCH_UPCOMING_SCENE);
  }

  @Hears(['Cài đặt', 'Settings'])
  @UseGuards(AuthGuard)
  async onSetting(@Ctx() ctx: any) {
    const message = await inlineKeyBoard_Settings(ctx);
    this.storeService.setMessageIds(ctx.message.message_id);
    this.storeService.setMessageIds(message.message_id);
  }

  @Hears(['Đăng xuất', 'Log out'])
  @UseGuards(AuthGuard)
  async onLogout(@Ctx() ctx: any) {
    this.storeService.setUserName(null);
    this.storeService.setPassWord(null);
    this.storeService.setStatusLogin();

    await ctx.scene.leave();

    const chat_id = ctx.chat.id;
    const message_ids = this.storeService.getMessageIds();
    if (message_ids.length) {
      await deleteMessages(this.apiTelegram, chat_id, message_ids);
      this.storeService.deleteMessageIds();
    }
    this.onStart(ctx);
  }

  // Bet history
  @Hears(['Lịch sử cược', 'Betting history'])
  @UseGuards(AuthGuard)
  async onGetBetHistory(@Ctx() ctx: any) {
    const message = await keyBoard_BetHistory(ctx);
    this.storeService.setMessageIds(ctx.message.message_id);
    this.storeService.setMessageIds(message.message_id);
  }

  @Hears(['Mã cược chờ', 'Pending bet code'])
  @UseGuards(AuthGuard)
  async onBetHistoryPendingBetCode(@Ctx() ctx: any) {
    const message = await inlineKeyBoard_BetHistory_PendingBetCode(ctx);
    this.storeService.setMessageIds(ctx.message.message_id);
    this.storeService.setMessageIds(message.message_id);
  }

  @Hears(['Cược đã kết thúc', 'Bet conclusion'])
  @UseGuards(AuthGuard)
  async onBetHistorySettledBet(@Ctx() ctx: any) {
    const message = await inlineKeyBoard_BetHistory_SettledBet(ctx);
    this.storeService.setMessageIds(ctx.message.message_id);
    this.storeService.setMessageIds(message.message_id);
  }

  @On('message')
  @UseGuards(AuthGuard)
  async onMessage(@Ctx() ctx: any) {
    // const message = ctx.message.text;
    // console.log(message);
    // const resAi = await this.aiIntegrationService.postMessageAi(message);
    // if (typeof resAi === 'string') {
    //   await ctx.replyWithHTML(resAi);
    // }
  }

  /******************************************************************* */
  /******************************************************************* */
  /******************************************************************* */

  // @Action('action_accountInformation')
  // async onAccountInfo(@Ctx() ctx: any) {
  //   const accountInfo = await this.apiP88.get('/v1/client/balance');
  //   await inlineKeyBoard_AccountInfo(ctx, accountInfo.data, this.storeService.getUserName());
  // }

  // @Action('action_backMain')
  // async onBackMain(@Ctx() ctx: any) {
  //   const username = this.storeService.getUserName();
  //   await inlineKeyboard_BackMainMenu(ctx, username);
  // }

  @Action('action_setting')
  async onBackSetting(@Ctx() ctx: any) {
    await inlineKeyBoard_Settings(ctx, true);
  }

  @Action('action_oddsFormat')
  async onSettingOddsFormat(@Ctx() ctx: any) {
    const oddsFormatStore = this.storeService.getOddsFormat();
    await inlineKeyBoard_SettingOddFormat(ctx, oddsFormatStore);
  }
  @Action(/DECIMAL|HONGKONG|MALAY|INDONESIAN|AMERICAN/)
  async onSettingChangeOddsFormat(@Ctx() ctx: any) {
    const oddsFormat = this.storeService.getOddsFormat();
    const cbQuery = ctx.update.callback_query;
    const userAnswer = 'data' in cbQuery ? cbQuery.data : null;

    if (userAnswer !== oddsFormat) {
      this.storeService.setOddsFormat(userAnswer);
      await inlineKeyBoard_SettingOddFormat(ctx, userAnswer);
    } else {
      await ctx.answerCbQuery(ctx.i18n.t('settings.alertOddsFormat'), true);
    }
  }

  @Action('action_timezone')
  async onSettingTimezone(@Ctx() ctx: any) {
    const timeZoneStore = this.storeService.getTimezone();
    await inlineKeyBoard_SettingTimezone(ctx, timeZoneStore);
  }

  @Action(/UTC|GMT/)
  async onSettingChangeTimezone(@Ctx() ctx: any) {
    const timeZone = this.storeService.getTimezone();
    const cbQuery = ctx.update.callback_query;
    const userAnswer = 'data' in cbQuery ? cbQuery.data : null;

    if (userAnswer !== timeZone) {
      this.storeService.setTimezone(userAnswer);
      await inlineKeyBoard_SettingTimezone(ctx, userAnswer);
      await keyboard_BackMainMenu(ctx, this.storeService.getUserName());
    } else {
      await ctx.answerCbQuery(ctx.i18n.t('settings.alertTimezone'), true);
    }
  }

  @Action('action_language')
  async onSettingLanguage(@Ctx() ctx: any) {
    await inlineKeyBoard_SettingLanguages(ctx);
  }
  @Action(/setting_en|setting_vi/)
  async onSettingSelectLanguage(@Ctx() ctx: any) {
    const locale = ctx.i18n.locale();
    const cbQuery = ctx.update.callback_query;
    const userAnswer = 'data' in cbQuery ? cbQuery.data : null;
    if (
      (userAnswer === 'setting_en' && locale === 'vi') ||
      (userAnswer === 'setting_vi' && locale === 'en')
    ) {
      const newLocale = userAnswer === 'setting_en' ? 'en' : 'vi';
      await ctx.i18n.locale(newLocale);
      this.storeService.setLocale(newLocale);
      await inlineKeyBoard_SettingLanguages(ctx);
    } else {
      await ctx.answerCbQuery(ctx.i18n.t('settings.alertLanguage'), true);
    }
  }

  @Action('action_changePassword')
  async onSettingChangePassword(@Ctx() ctx: any) {
    await ctx.answerCbQuery('This is an alert: action_changePassword !', true);
  }

  // @Action('action_logout')
  // async onLogout(@Ctx() ctx: any) {
  //   this.storeService.setUserName(null);
  //   this.storeService.setPassWord(null);
  //   await ctx.scene.leave();

  //   const chat_id = ctx.chat.id;
  //   const message_ids = this.storeService.getMessageIds();
  //   if (message_ids.length) {
  //     await deleteMessages(this.apiTelegram, chat_id, message_ids);
  //     this.storeService.deleteMessageIds();
  //   }
  //   this.onStart(ctx);
  // }

  // @Action('action_betHistory')
  // @Action('action_backBetHistory')
  // async onGetBetHistory(@Ctx() ctx: any) {
  //   await inlineKeyBoard_BetHistory(ctx);
  // }

  // @Action('action_betHistory_pendingBetCode')
  // async onBetHistoryPendingBetCode(@Ctx() ctx: any) {
  //   await inlineKeyBoard_BetHistory_PendingBetCode(ctx);
  // }

  @Action('action_betHistory_pendingBetCode_today')
  async onBetHistoryPendingBetCodeToday(@Ctx() ctx: any) {
    const toDate = new Date();

    const fromDate = new Date();
    fromDate.setHours(0, 0, 0, 0);

    const result = await this.botService.getBetHistory(
      BetList.RUNNING,
      fromDate.toISOString(),
      toDate.toISOString(),
    );

    const message = await keyBoard_BetHistory_PendingBetCode_Result(
      ctx,
      result,
      fromDate.toISOString(),
      toDate.toISOString(),
    );
    this.storeService.setMessageIds(message.message_id);
  }

  @Action('action_betHistory_pendingBetCode_yesterday')
  async onBetHistoryPendingBetCodeYesterday(@Ctx() ctx: any) {
    const toDate = new Date();
    toDate.setDate(toDate.getDate() - 1);
    toDate.setHours(23, 59, 59, 999);

    const fromDate = new Date(toDate);
    fromDate.setHours(0, 0, 0, 0);

    const result = await this.botService.getBetHistory(
      BetList.RUNNING,
      fromDate.toISOString(),
      toDate.toISOString(),
    );

    const message = await keyBoard_BetHistory_PendingBetCode_Result(
      ctx,
      result,
      fromDate.toISOString(),
      toDate.toISOString(),
    );
    this.storeService.setMessageIds(message.message_id);
  }

  @Action('action_betHistory_pendingBetCode_thisWeek')
  async onBetHistoryPendingBetCodeThisWeek(@Ctx() ctx: any) {
    const toDate = new Date();

    const dayOfWeek = toDate.getDay() - 1 >= 0 ? toDate.getDay() - 1 : 6; // start at monday: 0 1 2 3 4 5 6 7

    const fromDate = new Date(toDate);
    fromDate.setDate(toDate.getDate() - dayOfWeek);
    fromDate.setHours(0, 0, 0, 0);

    const result = await this.botService.getBetHistory(
      BetList.RUNNING,
      fromDate.toISOString(),
      toDate.toISOString(),
    );

    const message = await keyBoard_BetHistory_PendingBetCode_Result(
      ctx,
      result,
      fromDate.toISOString(),
      toDate.toISOString(),
    );
    this.storeService.setMessageIds(message.message_id);
  }

  @Action('action_betHistory_pendingBetCode_lastWeek')
  async onBetHistoryPendingBetCodeLastWeek(@Ctx() ctx: any) {
    const toDate = new Date();
    toDate.setHours(23, 59, 59, 999);
    const dayOfWeek = toDate.getDay() - 1 >= 0 ? toDate.getDay() - 1 : 6; // start at monday: 0 1 2 3 4 5 6
    toDate.setDate(toDate.getDate() - dayOfWeek - 1);

    const fromDate = new Date(toDate);
    fromDate.setDate(toDate.getDate() - 6);
    fromDate.setHours(0, 0, 0, 0);

    const result = await this.botService.getBetHistory(
      BetList.RUNNING,
      fromDate.toISOString(),
      toDate.toISOString(),
    );

    const message = await keyBoard_BetHistory_PendingBetCode_Result(
      ctx,
      result,
      fromDate.toISOString(),
      toDate.toISOString(),
    );
    this.storeService.setMessageIds(message.message_id);
  }

  @Action('action_betHistory_pendingBetCode_within14Days')
  async onBetHistoryPendingBetCodeWithin14Days(@Ctx() ctx: any) {
    const toDate = new Date();

    const fromDate = new Date();
    fromDate.setDate(toDate.getDate() - 13);
    fromDate.setHours(0, 0, 0, 0);

    const result = await this.botService.getBetHistory(
      BetList.RUNNING,
      fromDate.toISOString(),
      toDate.toISOString(),
    );

    const message = await keyBoard_BetHistory_PendingBetCode_Result(
      ctx,
      result,
      fromDate.toISOString(),
      toDate.toISOString(),
    );
    this.storeService.setMessageIds(message.message_id);
  }

  // // Settled bets

  // @Action('action_betHistory_betConclusion')
  // async onBetHistorySettledBet(@Ctx() ctx: any) {
  //   await inlineKeyBoard_BetHistory_SettledBet(ctx);
  // }

  @Action('action_betHistory_betConclusion_today')
  async onBetHistorySettledBetToday(@Ctx() ctx: any) {
    const toDate = new Date();

    const fromDate = new Date();
    fromDate.setHours(0, 0, 0, 0);

    const result = await this.botService.getBetHistory(
      BetList.SETTLED,
      fromDate.toISOString(),
      toDate.toISOString(),
    );

    const message = await keyBoard_BetHistory_SettledBet_Result(
      ctx,
      result,
      fromDate.toISOString(),
      toDate.toISOString(),
    );
    this.storeService.setMessageIds(message.message_id);
  }

  @Action('action_betHistory_betConclusion_yesterday')
  async onBetHistorySettledBetYesterday(@Ctx() ctx: any) {
    const toDate = new Date();
    toDate.setDate(toDate.getDate() - 1);
    toDate.setHours(23, 59, 59, 999);

    const fromDate = new Date(toDate);
    fromDate.setHours(0, 0, 0, 0);

    const result = await this.botService.getBetHistory(
      BetList.SETTLED,
      fromDate.toISOString(),
      toDate.toISOString(),
    );

    const message = await keyBoard_BetHistory_SettledBet_Result(
      ctx,
      result,
      fromDate.toISOString(),
      toDate.toISOString(),
    );
    this.storeService.setMessageIds(message.message_id);
  }

  @Action('action_betHistory_betConclusion_thisWeek')
  async onBetHistorySettledBetThisWeek(@Ctx() ctx: any) {
    const toDate = new Date();

    const dayOfWeek = toDate.getDay() - 1 >= 0 ? toDate.getDay() - 1 : 6; // start at monday: 0 1 2 3 4 5 6 7

    const fromDate = new Date(toDate);
    fromDate.setDate(toDate.getDate() - dayOfWeek);
    fromDate.setHours(0, 0, 0, 0);

    const result = await this.botService.getBetHistory(
      BetList.SETTLED,
      fromDate.toISOString(),
      toDate.toISOString(),
    );

    const message = await keyBoard_BetHistory_SettledBet_Result(
      ctx,
      result,
      fromDate.toISOString(),
      toDate.toISOString(),
    );
    this.storeService.setMessageIds(message.message_id);
  }

  @Action('action_betHistory_betConclusion_lastWeek')
  async onBetHistorySettledBetLastWeek(@Ctx() ctx: any) {
    const toDate = new Date();
    toDate.setHours(23, 59, 59, 999);
    const dayOfWeek = toDate.getDay() - 1 >= 0 ? toDate.getDay() - 1 : 6; // start at monday: 0 1 2 3 4 5 6
    toDate.setDate(toDate.getDate() - dayOfWeek - 1);

    const fromDate = new Date(toDate);
    fromDate.setDate(toDate.getDate() - 6);
    fromDate.setHours(0, 0, 0, 0);

    const result = await this.botService.getBetHistory(
      BetList.SETTLED,
      fromDate.toISOString(),
      toDate.toISOString(),
    );

    const message = await keyBoard_BetHistory_SettledBet_Result(
      ctx,
      result,
      fromDate.toISOString(),
      toDate.toISOString(),
    );
    this.storeService.setMessageIds(message.message_id);
  }

  @Action('action_betHistory_betConclusion_within14Days')
  async onBetHistorySettledBetWithin14Days(@Ctx() ctx: any) {
    const toDate = new Date();

    const fromDate = new Date();
    fromDate.setDate(toDate.getDate() - 13);
    fromDate.setHours(0, 0, 0, 0);

    const result = await this.botService.getBetHistory(
      BetList.SETTLED,
      fromDate.toISOString(),
      toDate.toISOString(),
    );

    const message = await keyBoard_BetHistory_SettledBet_Result(
      ctx,
      result,
      fromDate.toISOString(),
      toDate.toISOString(),
    );
    this.storeService.setMessageIds(message.message_id);
  }
}
