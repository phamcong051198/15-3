import { Markup } from 'telegraf';

export function inlineKeyBoard_SelectLanguages(ctx: any) {
  const message = ctx.i18n.t('start.welcome');

  const inlineKeyboard = Markup.inlineKeyboard([
    [
      Markup.button.callback(`English`, 'action_en'),
      Markup.button.callback(`Vietnamese`, 'action_vi'),
    ],
  ]);

  return ctx.replyWithHTML(message, inlineKeyboard);
}
