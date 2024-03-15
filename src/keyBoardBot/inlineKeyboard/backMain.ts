import { Markup } from 'telegraf';

export function inlineKeyboard_BackMainMenu(ctx: any, username: string) {
  const message =
    ctx.i18n.t('mainMenu.headerHeadMainMenu') +
    `<b>${username.toUpperCase()} </b>` +
    ctx.i18n.t('mainMenu.headerEndMainMenu');
  const inlineKeyboard = Markup.inlineKeyboard([
    [
      Markup.button.callback(
        ctx.i18n.t('mainMenu.accountInformation'),
        'action_accountInformation',
      ),
    ],
    [
      Markup.button.callback(
        ctx.i18n.t('mainMenu.betHistory'),
        'action_betHistory',
      ),
    ],
    [Markup.button.callback(ctx.i18n.t('mainMenu.setting'), 'action_setting')],
    [Markup.button.callback(ctx.i18n.t('mainMenu.logout'), 'action_logout')],
  ]);

  return ctx.editMessageText(
    { text: message, parse_mode: 'HTML' },
    inlineKeyboard,
  );
}
