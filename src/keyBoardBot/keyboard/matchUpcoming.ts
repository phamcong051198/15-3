import { Markup } from 'telegraf';

const keyboard_matchUpcoming = (ctx: any) => {
  const message = ctx.i18n.t('matchUpcoming.header');
  const keyboard = Markup.keyboard([
    [ctx.i18n.t('matchUpcoming.today'), ctx.i18n.t('matchUpcoming.thisWeek')],
    [
      ctx.i18n.t('matchUpcoming.thisMonth'),
      ctx.i18n.t('matchUpcoming.nextMonth'),
    ],
    [ctx.i18n.t('matchUpcoming.menu')],
  ])
    .resize(true)
    .oneTime(true);

  return ctx.replyWithHTML(message, keyboard);
};

export default keyboard_matchUpcoming;
