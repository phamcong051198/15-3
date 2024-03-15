import { Markup } from 'telegraf';

export function inlineKeyBoard_AccountInfo(
  ctx: any,
  accountInfo: any,
  username,
) {
  const createCallBack = (
    actionName: string,
    keyText: string,
    mainKey?: string,
  ) =>
    Markup.button.callback(
      ctx.i18n.t((mainKey ? mainKey + '.' : '') + keyText),
      actionName,
    );

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

  const inlineKeyboard = Markup.inlineKeyboard([
    [createCallBack('action_backMain', 'menu')],
  ]);

  return ctx.replyWithHTML(message, inlineKeyboard);
}
