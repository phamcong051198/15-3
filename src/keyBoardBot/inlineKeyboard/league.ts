import { PAGE_SIZE } from 'src/app.constants';
import { Markup } from 'telegraf';

const inlineKeyboard_League = (
  ctx: any,
  data: any,
  edit: boolean,
  totalPage: number,
  currentPage: number,
) => {
  const message = `${ctx.i18n.t('LEAGUES.header')}\n\n<i>${ctx.i18n.t('text.currentPage')} ${currentPage}/${totalPage}</i>`;
  let buttons: any[] = [];
  const numberView = PAGE_SIZE;

  const matchesToShow = data.slice(0, numberView);
  const matchButtons = matchesToShow.map((match: any) => [
    Markup.button.callback(`${match.name}`, `${match.id}`),
  ]);

  if (edit) {
    buttons = matchButtons.concat([
      [
        Markup.button.callback('◀️', 'previous_LEAGUES'),
        Markup.button.callback('⏪', 'top_LEAGUES'),
        Markup.button.callback('⏩', 'end_LEAGUES'),
        Markup.button.callback('▶️', 'next_LEAGUES'),
      ],
      [
        Markup.button.webApp(
          ctx.i18n.t('LEAGUES.allMatch'),
          'https://www.w3schools.com/jsref/jsref_tostring_number.asp',
        ),
      ],
    ]);
    const inlineKeyboard = Markup.inlineKeyboard(buttons);
    return ctx.editMessageText(
      { text: message, parse_mode: 'HTML' },
      inlineKeyboard,
    );
  }

  if (data.length > numberView) {
    buttons = matchButtons.concat([
      [
        Markup.button.callback('◀️', 'previous_LEAGUES'),
        Markup.button.callback('⏪', 'top_LEAGUES'),
        Markup.button.callback('⏩', 'end_LEAGUES'),
        Markup.button.callback('▶️', 'next_LEAGUES'),
      ],
      [
        Markup.button.webApp(
          ctx.i18n.t('LEAGUES.allMatch'),
          'https://www.w3schools.com/jsref/jsref_tostring_number.asp',
        ),
      ],
    ]);
  } else {
    buttons = matchButtons;
  }

  const inlineKeyboard = Markup.inlineKeyboard(buttons);
  return ctx.replyWithHTML(message, inlineKeyboard);
};

export default inlineKeyboard_League;
