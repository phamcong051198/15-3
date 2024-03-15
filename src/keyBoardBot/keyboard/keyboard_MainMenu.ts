import { Markup } from 'telegraf';


export function keyboard_MainMenu(ctx: any) {
  const message =
    ctx.i18n.t('mainMenu.headerHeadMainMenu') +
    `<b>${ctx.wizard.state['name'].toUpperCase()} </b>` +
    ctx.i18n.t('mainMenu.headerEndMainMenu');
  const keyboard = Markup.keyboard([
    [ctx.i18n.t('mainMenu.accountInformation')],
    [ctx.i18n.t('mainMenu.matchInformation')],
    [ctx.i18n.t('mainMenu.betHistory')],
    [ctx.i18n.t('mainMenu.setting')],
    [ctx.i18n.t('mainMenu.logout')],
  ])
    .resize(true)
    .oneTime(true);

  return ctx.replyWithHTML(message, keyboard);
}

export function keyboard_BackMainMenu(ctx: any, userName) {
  const message =
    ctx.i18n.t('mainMenu.headerHeadMainMenu') +
    `<b>${userName.toUpperCase()} </b>` +
    ctx.i18n.t('mainMenu.headerEndMainMenu');
  const keyboard = Markup.keyboard([
    [ctx.i18n.t('mainMenu.accountInformation')],
    [ctx.i18n.t('mainMenu.matchInformation')],
    [ctx.i18n.t('mainMenu.betHistory')],
    [ctx.i18n.t('mainMenu.setting')],
    [ctx.i18n.t('mainMenu.logout')],
  ])
    .resize(true)
    .oneTime(true);

  return ctx.replyWithHTML(message, keyboard);
}

export function update_BackMainMenu(ctx: any) {
  const keyboard = Markup.keyboard([
    [ctx.i18n.t('mainMenu.accountInformation')],
    [ctx.i18n.t('mainMenu.matchInformation')],
    [ctx.i18n.t('mainMenu.betHistory')],
    [ctx.i18n.t('mainMenu.setting')],
    [ctx.i18n.t('mainMenu.logout')],
  ])
    .resize(true)
    .oneTime(true);

  return ctx.replyWithHTML(keyboard);
}
