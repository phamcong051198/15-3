import { Markup } from 'telegraf';

export function inlineKeyBoard_Login(ctx: any) {
  const message = ctx.i18n.t('login.headerLogin');
  const textKey = ctx.i18n.t('login.login');

  const inlineKeyboard = Markup.inlineKeyboard([
    Markup.button.callback(textKey, 'action_login'),
  ]);

  return ctx.replyWithHTML(message, inlineKeyboard);
}
