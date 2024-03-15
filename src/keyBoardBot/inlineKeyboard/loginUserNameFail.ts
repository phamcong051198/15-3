import { Markup } from 'telegraf';

export function inlineKeyBoard_LoginUserNameFail(ctx: any) {
  const message = ctx.i18n.t('login.userNameFail');
  const textKey = ctx.i18n.t('cancel.cancel');

  const inlineKeyboard = Markup.inlineKeyboard([
    Markup.button.callback(textKey, 'action_cancel'),
  ]);

  return ctx.replyWithHTML(message, inlineKeyboard);
}
