import { convertTime } from 'src/constants/constant';
import { StraightBet } from 'src/models';
import { Markup } from 'telegraf';
import { StoreService } from 'src/store/store.service';
import { BetList } from 'src/modules/bot/bot.service';

const storeService: StoreService = new StoreService();

export function keyBoard_BetHistory_SettledBet_Result(
  ctx: any,
  betHistory: StraightBet[],
  fromDate: string,
  toDate: string,
) {
  const baseUrl = storeService.getBaseUrl();

  if (!betHistory || betHistory.length === 0) {
    const message = ctx.i18n.t('betHistory.betConclusion.result.noData');
    const keyBoard = Markup.keyboard([ctx.i18n.t('menu')])
      .resize(true)
      .oneTime(true);
    return ctx.replyWithHTML(message, keyBoard);
  }

  const betHistory_betConclusion_result = 'betHistory.betConclusion.result';
  const message =
    ctx.i18n.t(`${betHistory_betConclusion_result}.title`) +
    '\n' +
    ctx.i18n.t(`${betHistory_betConclusion_result}.league`) +
    `${betHistory[0].leagueName.toUpperCase()}` +
    '\n' +
    ctx.i18n.t(`${betHistory_betConclusion_result}.match`) +
    `${betHistory[0].team1}` +
    ctx.i18n.t(`${betHistory_betConclusion_result}.vs`) +
    `${betHistory[0].team2}` +
    '\n' +
    ctx.i18n.t(`${betHistory_betConclusion_result}.start`) +
    `${convertTime(betHistory[0].eventStartTime)}` +
    '\n' +
    ctx.i18n.t(`${betHistory_betConclusion_result}.time`) +
    ctx.i18n.t(
      `${betHistory_betConclusion_result + '.' + betHistory[0].periodNumber}`,
    ) +
    '\n' +
    ctx.i18n.t(`${betHistory_betConclusion_result}.oddsFormat`) +
    `${betHistory[0].oddsFormat}` +
    '\n' +
    ctx.i18n.t(`${betHistory_betConclusion_result}.betType`) +
    ctx.i18n.t(
      `${betHistory_betConclusion_result + '.' + (betHistory[0].betType === 'SPREAD' ? betHistory[0].betType : 'TOTAL_POINTS')}`,
    ) +
    '\n' +
    ctx.i18n.t(`${betHistory_betConclusion_result}.bettingOdds`) +
    `${betHistory[0].teamName}, HDP ${betHistory[0].handicap > 0 ? '+' + betHistory[0].handicap : betHistory[0].handicap}, ` +
    ctx.i18n.t(`${betHistory_betConclusion_result}.price`) +
    `${betHistory[0].price}` +
    '\n' +
    ctx.i18n.t(`${betHistory_betConclusion_result}.risk`) +
    `${betHistory[0].risk}` +
    '\n' +
    ctx.i18n.t(`${betHistory_betConclusion_result}.win`) +
    `${betHistory[0].win}` +
    '\n' +
    ctx.i18n.t(`${betHistory_betConclusion_result}.betCode`) +
    `${betHistory[0].betId}` +
    '\n' +
    ctx.i18n.t(`${betHistory_betConclusion_result}.bettingTime`) +
    `${convertTime(betHistory[0].placedAt)}` +
    '\n' +
    ctx.i18n.t(`${betHistory_betConclusion_result}.result`) +
    '\n' +
    `${
      betHistory[0]?.team1Score !== undefined &&
      betHistory[0]?.team2Score !== undefined
        ? ctx.i18n.t(`${betHistory_betConclusion_result}.firstHalf`) +
          betHistory[0].team1Score +
          '-' +
          betHistory[0].team2Score +
          '\n'
        : ''
    }` +
    ctx.i18n.t(`${betHistory_betConclusion_result}.fullTime`) +
    `${betHistory[0].ftTeam1Score} - ${betHistory[0].ftTeam2Score}` +
    '\n' +
    ctx.i18n.t(`${betHistory_betConclusion_result}.bettingResult`) +
    '\n' +
    ctx.i18n.t(`${betHistory_betConclusion_result}.win/loss`) +
    `${betHistory[0].winLoss}` +
    '\n' +
    ctx.i18n.t(`${betHistory_betConclusion_result}.commission`) +
    `${betHistory[0].customerCommission}`;

  const queryParams = {
    betlist: BetList.SETTLED,
    fromDate,
    toDate,
    clang: ctx.i18n.locale(),
  };

  const queryString = new URLSearchParams(queryParams).toString();

  const inlineKeyboard = Markup.inlineKeyboard([
    [
      Markup.button.url(
        ctx.i18n.t(`${betHistory_betConclusion_result}.more`),
        `${baseUrl}/betHistory?${queryString}`,
      ),
    ],
  ]);

  return ctx.replyWithHTML(
    message,
    betHistory.length > 1 ? inlineKeyboard : undefined,
  );
}
