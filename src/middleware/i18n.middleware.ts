const TelegrafI18n = require('telegraf-i18n');
import * as path from 'path';

export const i18n = new TelegrafI18n({
  defaultLanguage: 'vi',
  useSession: true,
  defaultLanguageOnMissing: true,
  allowMissing: false,
  directory: path.resolve(__dirname, '..', 'src', 'locales'),
});
