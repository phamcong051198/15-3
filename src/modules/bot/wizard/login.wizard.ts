import { Inject } from '@nestjs/common';
import { AxiosInstance } from 'axios';
import { Ctx, Message, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { WIZARD_SCENE_LOGIN } from 'src/app.constants';
import { StoreService } from 'src/store/store.service';
import { regexLogin } from 'src/utils/regexLogin';
import { deleteMessages } from '../../../apiTelegram_deleteMessages/deleteMessages';
import { inlineKeyBoard_LoginUserName } from 'src/keyBoardBot/inlineKeyboard/loginUserName';
import { inlineKeyBoard_LoginUserNameFail } from 'src/keyBoardBot/inlineKeyboard/loginUserNameFail';
import { inlineKeyBoard_LoginPassWord } from 'src/keyBoardBot/inlineKeyboard/loginPassWord';
import { keyboard_MainMenu } from 'src/keyBoardBot/keyboard/keyboard_MainMenu';

@Wizard(WIZARD_SCENE_LOGIN)
export class LoginWizard {
  constructor(
    @Inject('P88_INSTANCE')
    private readonly apiP88: AxiosInstance,
    @Inject('TELEGRAM_INSTANCE')
    private readonly apiTelegram: AxiosInstance,
    private storeService: StoreService,
  ) {}

  @WizardStep(1)
  async onSceneEnter(@Ctx() ctx: any) {
    const sentMessage = await inlineKeyBoard_LoginUserName(ctx);

    if (ctx.callbackQuery?.message?.message_id) {
      this.storeService.setMessageIds(ctx.callbackQuery.message.message_id);
    }

    const chat_id = ctx.chat.id;
    const message_ids = this.storeService.getMessageIds();

    if (message_ids.length) {
      await deleteMessages(this.apiTelegram, chat_id, message_ids);
      this.storeService.deleteMessageIds();
    }

    this.storeService.setMessageIds(sentMessage.message_id);
    await ctx.wizard.next();
  }

  @On('text')
  @WizardStep(2)
  async onName(@Ctx() ctx, @Message() msg: { text: string }) {
    const chat_id = ctx.chat.id;
    this.storeService.setMessageIds(ctx.message.message_id);
    const checkUserName = regexLogin(msg.text);
    if (checkUserName) {
      ctx.wizard.state['name'] = msg.text;
      this.storeService.setUserName(msg.text);

      const sentMessage = await inlineKeyBoard_LoginPassWord(ctx);
      this.storeService.setMessageIds(sentMessage.message_id);

      await ctx.wizard.next();
    } else {
      const sentMessage = await inlineKeyBoard_LoginUserNameFail(ctx);

      const message_ids = await this.storeService.getMessageIds();
      await deleteMessages(this.apiTelegram, chat_id, message_ids);
      this.storeService.deleteMessageIds();

      this.storeService.setMessageIds(sentMessage.message_id);
    }
  }

  @On('text')
  @WizardStep(3)
  async onResult(
    @Ctx() ctx: any & { wizard: { state: { name: string } } },
    @Message() msg: { text: string },
  ) {
    const chat_id = ctx.chat.id;
    this.storeService.setPassWord(msg.text);
    this.storeService.setMessageIds(ctx.message.message_id);

    try {
      await this.apiP88.get('/v1/client/balance');

      const messageSuccess =
        (await ctx.i18n.t('login.loginSuccess')) +
        (await ctx.i18n.t('login.subtextLoginSuccess')) +
        `<b>${ctx.wizard.state['name'].toUpperCase()}</b> `;

      const resMessageSuccess = await ctx.replyWithHTML(messageSuccess);
      this.storeService.setMessageIds(resMessageSuccess.message_id);

      const messageMainMenu = await keyboard_MainMenu(ctx);

      const message_ids = this.storeService.getMessageIds();
      await deleteMessages(this.apiTelegram, chat_id, message_ids);
      this.storeService.deleteMessageIds();

      this.storeService.setMessageIds(messageMainMenu.message_id);
      this.storeService.setStatusLogin();

      await ctx.scene.leave();
    } catch (error) {
      this.storeService.setPassWord(null);
      this.storeService.setUserName(null);

      const messageLoginFail =
        (await ctx.i18n.t('login.loginFail')) +
        (await ctx.i18n.t('login.subtextLoginFail'));
      const messageRes = await ctx.replyWithHTML(messageLoginFail);

      const message_ids = this.storeService.getMessageIds();
      if (message_ids.length) {
        await deleteMessages(this.apiTelegram, chat_id, message_ids);
        this.storeService.deleteMessageIds();
      }

      this.storeService.setMessageIds(messageRes.message_id);

      await ctx.scene.reenter();
    }
  }
}
