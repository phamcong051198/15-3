import { Markup } from 'telegraf';

export function inlineKeyBoard_SettingOddFormat(
  ctx: any,
  oddsFormatStore: string,
) {
  const { i18n } = ctx;
  const formats = ['DECIMAL', 'HONGKONG', 'MALAY', 'INDONESIAN', 'AMERICAN'];
  const oddsFormat = formats.includes(oddsFormatStore)
    ? oddsFormatStore
    : 'HONGKONG';

  const message = i18n.t('settings.selectOddFormat');

  const createButton = (format: string) =>
    Markup.button.callback(
      `${oddsFormat === format ? '✅ ' : ''}${i18n.t(`settings.${format.toLowerCase()}`)}`,
      `${format}`,
    );

  const inlineKeyboard = Markup.inlineKeyboard([
    [Markup.button.callback(i18n.t('settings.goBack'), 'action_setting')],
    [createButton('DECIMAL'), createButton('HONGKONG')],
    [createButton('MALAY'), createButton('INDONESIAN')],
    [createButton('AMERICAN')],
  ]);

  return ctx.editMessageText(message, inlineKeyboard);
}
