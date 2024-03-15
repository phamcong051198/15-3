import { Markup } from 'telegraf';

export function keyBoard_AccountInfo(ctx: any, accountInfo: any, username) {

  const account_Info = 'accountInfo';
  const message =
    ctx.i18n.t(`${account_Info}.title`) +
    '\n' +
    ctx.i18n.t(`${account_Info}.username`) +
    `${username.toUpperCase()}` +
    '\n' +
    ctx.i18n.t(`${account_Info}.currency`) +
    '\n' +
    ctx.i18n.t(`${account_Info}.available`) +
    `${accountInfo.availableBalance}` +
    '\n' +
    ctx.i18n.t(`${account_Info}.credit`) +
    `${accountInfo.givenCredit}`;

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
