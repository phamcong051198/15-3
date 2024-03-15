import { Markup } from 'telegraf';
import { StoreService } from '../../../store/store.service';

export function keyBoard_BetHistory(ctx: any) {
  const message = ctx.i18n.t('betHistory.headerBetHistory');

  const keyboard = Markup.keyboard([
    [ctx.i18n.t('betHistory.pendingBetCode_title')],
    [ctx.i18n.t('betHistory.betConclusion_title')],
    [ctx.i18n.t('menu')],
  ])
    .resize(true)
    .oneTime(true);

  return ctx.replyWithHTML(message, keyboard);
}
