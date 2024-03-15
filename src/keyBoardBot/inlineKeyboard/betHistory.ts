import { Markup } from 'telegraf';

export function inlineKeyBoard_BetHistory(ctx: any) {
  const message = ctx.i18n.t('betHistory.headerBetHistory');

  const inlineKeyboard = Markup.inlineKeyboard([
    [
      Markup.button.callback(
        ctx.i18n.t('betHistory.pendingBetCode_title'),
        'action_betHistory_pendingBetCode',
      ),
    ],
    [
      Markup.button.callback(
        ctx.i18n.t('betHistory.betConclusion_title'),
        'action_betHistory_betConclusion',
      ),
    ],
    [Markup.button.callback(ctx.i18n.t('back'), 'action_backMain')],
  ]);

  return ctx.editMessageText(message, inlineKeyboard);
}
