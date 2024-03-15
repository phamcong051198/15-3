import { Markup } from 'telegraf';

export function inlineKeyBoard_SettingLanguages(ctx: any) {
  const message = ctx.i18n.t('settings.selectLanguage');
  const isEnglish = ctx.i18n.locale() === 'en';
  const isVietnamese = ctx.i18n.locale() === 'vi';

  const inlineKeyboard = Markup.inlineKeyboard([
    [Markup.button.callback(ctx.i18n.t('settings.goBack'), 'action_setting')],
    [
      Markup.button.callback(
        isEnglish
          ? '✅ ' + ctx.i18n.t('settings.english')
          : ctx.i18n.t('settings.english'),
        'setting_en',
      ),
      Markup.button.callback(
        isVietnamese
          ? '✅ ' + ctx.i18n.t('settings.vietnamese')
          : ctx.i18n.t('settings.vietnamese'),
        'setting_vi',
      ),
    ],
  ]);

  return ctx.editMessageText(message, inlineKeyboard);
}
