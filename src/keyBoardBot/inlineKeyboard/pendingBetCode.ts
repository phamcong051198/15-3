import { Markup } from 'telegraf';

export function inlineKeyBoard_BetHistory_PendingBetCode(ctx: any) {
  const message = ctx.i18n.t('betHistory.pendingBetCode.title');

  const createCallBack = (
    actionName: string,
    keyText: string,
    mainKey?: string,
  ) =>
    Markup.button.callback(
      ctx.i18n.t((mainKey ? mainKey + '.' : '') + keyText),
      actionName,
    );

  const betHistory_pendingBetCode = 'betHistory.pendingBetCode';

  const inlineKeyboard = Markup.inlineKeyboard([
    [
      createCallBack(
        'action_betHistory_pendingBetCode_today',
        'today',
        betHistory_pendingBetCode,
      ),
      createCallBack(
        'action_betHistory_pendingBetCode_yesterday',
        'yesterday',
        betHistory_pendingBetCode,
      ),
    ],
    [
      createCallBack(
        'action_betHistory_pendingBetCode_thisWeek',
        'thisWeek',
        betHistory_pendingBetCode,
      ),
      createCallBack(
        'action_betHistory_pendingBetCode_lastWeek',
        'lastWeek',
        betHistory_pendingBetCode,
      ),
    ],
    [
      createCallBack(
        'action_betHistory_pendingBetCode_within14Days',
        'within14Days',
        betHistory_pendingBetCode,
      ),
    ],
    // [
    //   createCallBack('action_backBetHistory', 'back'),
    //   createCallBack('action_backMain', 'menu'),
    // ],
  ]);

  return ctx.replyWithHTML(message, inlineKeyboard);
}
