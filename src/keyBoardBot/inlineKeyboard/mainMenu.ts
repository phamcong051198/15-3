import { Markup } from 'telegraf';

export function inlineKeyboard_MainMenu(ctx: any) {
  const message =
    ctx.i18n.t('mainMenu.headerHeadMainMenu') +
    `<b>${ctx.wizard.state['name'].toUpperCase()} </b>` +
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

  return ctx.replyWithHTML(message, inlineKeyboard);
}
