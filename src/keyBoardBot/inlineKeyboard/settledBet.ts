import { Markup } from 'telegraf';

export function inlineKeyBoard_BetHistory_SettledBet(ctx: any) {
  const message = ctx.i18n.t('betHistory.betConclusion.title');

  const createCallBack = (
    actionName: string,
    keyText: string,
    mainKey?: string,
  ) =>
    Markup.button.callback(
      ctx.i18n.t((mainKey ? mainKey + '.' : '') + keyText),
      actionName,
    );

  const betHistory_betConclusion = 'betHistory.betConclusion';

  const inlineKeyboard = Markup.inlineKeyboard([
    [
      createCallBack(
        'action_betHistory_betConclusion_today',
        'today',
        betHistory_betConclusion,
      ),
      createCallBack(
        'action_betHistory_betConclusion_yesterday',
        'yesterday',
        betHistory_betConclusion,
      ),
    ],
    [
      createCallBack(
        'action_betHistory_betConclusion_thisWeek',
        'thisWeek',
        betHistory_betConclusion,
      ),
      createCallBack(
        'action_betHistory_betConclusion_lastWeek',
        'lastWeek',
        betHistory_betConclusion,
      ),
    ],
    [
      createCallBack(
        'action_betHistory_betConclusion_within14Days',
        'within14Days',
        betHistory_betConclusion,
      ),
    ],
    // [
    //   createCallBack('action_backBetHistory', 'back'),
    //   createCallBack('action_backMain', 'menu'),
    // ],
  ]);

  return ctx.replyWithHTML(message, inlineKeyboard);
}
