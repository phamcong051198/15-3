import { Markup } from 'telegraf';

export function inlineKeyBoard_SettingTimezone(
  ctx: any,
  timeZoneStore: string,
) {
  const { i18n } = ctx;
  const formats = ['UTC', 'GMT'];
  const oddsFormat = formats.includes(timeZoneStore) ? timeZoneStore : 'GMT';

  const message = i18n.t('settings.selectTimezone');

  const createButton = (format: string) =>
    Markup.button.callback(
      `${oddsFormat === format ? '✅ ' : ''}${i18n.t(`settings.${format}`)}`,
      `${format}`,
    );

  const inlineKeyboard = Markup.inlineKeyboard([
    [Markup.button.callback(i18n.t('settings.goBack'), 'action_setting')],
    [createButton('UTC'), createButton('GMT')],
  ]);

  return ctx.editMessageText(message, inlineKeyboard);
}
