import { convertTime } from 'src/constants/constant';
import { StraightBet } from 'src/models';
import { Markup } from 'telegraf';
import { inlineKeyboard_BackMainMenu } from './backMain';
import { StoreService } from 'src/store/store.service';
import { BetList } from 'src/modules/bot/bot.service';

const storeService: StoreService = new StoreService();

export function inlineKeyBoard_BetHistory_PendingBetCode_Result(
  ctx: any,
  betHistory: StraightBet[],
  fromDate: string,
  toDate: string,
) {
  const baseUrl = storeService.getBaseUrl();

  if (!betHistory || betHistory.length === 0) {
    const message = ctx.i18n.t('betHistory.pendingBetCode.result.noData');
    const username = storeService.getUserName();
    ctx.replyWithHTML(message);
    inlineKeyboard_BackMainMenu(ctx, username);
    return;
  }

  const betHistory_pendingBetCode_result = 'betHistory.pendingBetCode.result';
  const message =
    ctx.i18n.t(`${betHistory_pendingBetCode_result}.title`) +
    '\n' +
    ctx.i18n.t(`${betHistory_pendingBetCode_result}.league`) +
    `${betHistory[0].leagueName.toUpperCase()}` +
    '\n' +
    ctx.i18n.t(`${betHistory_pendingBetCode_result}.match`) +
    `${betHistory[0].team1}` +
    ctx.i18n.t(`${betHistory_pendingBetCode_result}.vs`) +
    `${betHistory[0].team2}` +
    '\n' +
    ctx.i18n.t(`${betHistory_pendingBetCode_result}.start`) +
    `${convertTime(betHistory[0].eventStartTime)}` +
    '\n' +
    ctx.i18n.t(`${betHistory_pendingBetCode_result}.time`) +
    ctx.i18n.t(
      `${betHistory_pendingBetCode_result + '.' + betHistory[0].periodNumber}`,
    ) +
    '\n' +
    ctx.i18n.t(`${betHistory_pendingBetCode_result}.oddsFormat`) +
    `${betHistory[0].oddsFormat}` +
    '\n' +
    ctx.i18n.t(`${betHistory_pendingBetCode_result}.betType`) +
    ctx.i18n.t(
      `${betHistory_pendingBetCode_result + '.' + (betHistory[0].betType === 'SPREAD' ? betHistory[0].betType : 'TOTAL_POINTS')}`,
    ) +
    '\n' +
    ctx.i18n.t(`${betHistory_pendingBetCode_result}.bettingOdds`) +
    `${betHistory[0].teamName}, HDP ${betHistory[0].handicap > 0 ? '+' + betHistory[0].handicap : betHistory[0].handicap}, ` +
    ctx.i18n.t(`${betHistory_pendingBetCode_result}.price`) +
    `${betHistory[0].price}` +
    '\n' +
    ctx.i18n.t(`${betHistory_pendingBetCode_result}.risk`) +
    `${betHistory[0].risk}` +
    '\n' +
    ctx.i18n.t(`${betHistory_pendingBetCode_result}.win`) +
    `${betHistory[0].win}` +
    '\n' +
    ctx.i18n.t(`${betHistory_pendingBetCode_result}.betCode`) +
    `${betHistory[0].betId}` +
    '\n' +
    ctx.i18n.t(`${betHistory_pendingBetCode_result}.bettingTime`) +
    `${convertTime(betHistory[0].placedAt)}`;

  const queryParams = {
    betlist: BetList.RUNNING,
    fromDate,
    toDate,
    clang: storeService.getLocale(),
  };

  const queryString = new URLSearchParams(queryParams).toString();
  const inlineKeyboard = Markup.inlineKeyboard([
    [
      Markup.button.url(
        ctx.i18n.t(`${betHistory_pendingBetCode_result}.more`),
        `${baseUrl}/betHistory?${queryString}`,
      ),
    ],
  ]);

  return ctx.replyWithHTML(
    message,
    betHistory.length > 1 ? inlineKeyboard : undefined,
  );
}
