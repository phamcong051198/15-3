import { Markup } from 'telegraf';

export function inlineKeyBoard_Settings(ctx: any, edit?: boolean) {
  const message = ctx.i18n.t('mainMenu.setting');

  const inlineKeyboard = Markup.inlineKeyboard([
    [
      Markup.button.callback(
        ctx.i18n.t('settings.oddsFormat'),
        'action_oddsFormat',
      ),
    ],
    [
      Markup.button.callback(
        ctx.i18n.t('settings.timezone'),
        'action_timezone',
      ),
    ],
    [
      Markup.button.callback(
        ctx.i18n.t('settings.language'),
        'action_language',
      ),
    ],
    [
      Markup.button.callback(
        ctx.i18n.t('settings.password'),
        'action_changePassword',
      ),
    ],
  ]);

  if (edit) {
    return ctx.editMessageText(message, inlineKeyboard);
  }

  return ctx.replyWithHTML(message, inlineKeyboard);
}
