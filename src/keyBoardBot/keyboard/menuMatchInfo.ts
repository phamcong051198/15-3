import { Markup } from 'telegraf';

const keyboard_menuMatchInfo = (ctx: any) => {
  const message = ctx.i18n.t('matchInfo.header');
  const keyboard = Markup.keyboard([
    [ctx.i18n.t('matchInfo.liveMatch')],
    [ctx.i18n.t('matchInfo.matchUpcoming')],
    [ctx.i18n.t('matchInfo.leagueInfo')],
    [ctx.i18n.t('matchInfo.betInfo')],
    [ctx.i18n.t('matchInfo.back')],
  ])
    .resize(true)
    .oneTime(true);

  return ctx.replyWithHTML(message, keyboard);
};

export default keyboard_menuMatchInfo;
