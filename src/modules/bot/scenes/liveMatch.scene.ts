import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { LIVE_MATCH_SCENE, PAGE_SIZE } from 'src/app.constants';
import { inlineKeyboard_LiveMatch } from 'src/keyBoardBot/inlineKeyboard';
import { P88IntegrationService } from 'src/modules/p88_integration/p88_integration.service';
import { StoreService } from 'src/store/store.service';
import { Store_LiveMatch } from 'src/store/storeLiveMatch.service';
import { paginate } from 'src/utils/paginate';

@Scene(LIVE_MATCH_SCENE)
export class LiveMatchScene {
  constructor(
    private p88IntegrationService: P88IntegrationService,
    private storeService: StoreService,
    private storeLiveMatch: Store_LiveMatch,
  ) {}

  @SceneEnter()
  async onSceneEnter(ctx) {
    const data = await this.p88IntegrationService.getLiveMatch();
    if (!data.length) {
      const message = await ctx.replyWithHTML(ctx.i18n.t('LIVE_MATCH.notie'));
      this.storeService.setMessageIds(message.message_id);
    } else {
      this.storeLiveMatch.setData(data);
      const totalPage = Math.ceil(data.length / PAGE_SIZE);
      this.storeLiveMatch.setTotalPage(totalPage);
      const currentPage = 1;
      this.storeLiveMatch.setCurrentPage(currentPage);
      const message = await inlineKeyboard_LiveMatch(
        ctx,
        data,
        false,
        totalPage,
        currentPage,
      );
      this.storeService.setMessageIds(message.message_id);
    }

    this.storeService.setMessageIds(ctx.message.message_id);
  }

  @Action('top_LIVE_MATCH')
  async onTopLIVE_MATCH(@Ctx() ctx: any) {
    const totalPage = this.storeLiveMatch.getTotalPage();
    const data = this.storeLiveMatch.getData();
    const pageNumber = this.storeLiveMatch.getCurrentPage();
    if (pageNumber === 1) {
      await ctx.answerCbQuery(`${ctx.i18n.t('text.firstPage')}`, true);
      return;
    } else {
      const pageNumber = 1;
      const currentPage = 1;
      const dataCurrent = paginate(data, pageNumber);
      this.storeLiveMatch.setCurrentPage(currentPage);
      await inlineKeyboard_LiveMatch(
        ctx,
        dataCurrent,
        true,
        totalPage,
        currentPage,
      );
    }
  }

  @Action('end_LIVE_MATCH')
  async onEndLIVE_MATCH(@Ctx() ctx: any) {
    const totalPage = this.storeLiveMatch.getTotalPage();
    const data = this.storeLiveMatch.getData();
    const pageNumber = this.storeLiveMatch.getCurrentPage();

    if (pageNumber >= totalPage) {
      await ctx.answerCbQuery(`${ctx.i18n.t('text.endPage')}`, true);
      return;
    } else {
      const pageNumber = totalPage;
      const currentPage = totalPage;
      const dataCurrent = paginate(data, pageNumber);
      this.storeLiveMatch.setCurrentPage(currentPage);
      await inlineKeyboard_LiveMatch(
        ctx,
        dataCurrent,
        true,
        totalPage,
        currentPage,
      );
    }
  }

  @Action('previous_LIVE_MATCH')
  async onPrevious_LIVE_MATCH(@Ctx() ctx: any) {
    const totalPage = this.storeLiveMatch.getTotalPage();
    const data = this.storeLiveMatch.getData();
    const pageNumber = this.storeLiveMatch.getCurrentPage();

    const dataCurrent = paginate(data, pageNumber - 1);
    const currentPage = pageNumber - 1;
    if (currentPage < 1) {
      await ctx.answerCbQuery(`${ctx.i18n.t('text.firstPage')}`, true);
      return;
    } else {
      this.storeLiveMatch.setCurrentPage(currentPage);
      await inlineKeyboard_LiveMatch(
        ctx,
        dataCurrent,
        true,
        totalPage,
        currentPage,
      );
    }
  }
  @Action('next_LIVE_MATCH')
  async onNext_LIVE_MATCH(@Ctx() ctx: any) {
    const totalPage = this.storeLiveMatch.getTotalPage();
    const data = this.storeLiveMatch.getData();
    const pageNumber = this.storeLiveMatch.getCurrentPage();

    const dataCurrent = paginate(data, pageNumber + 1);
    const currentPage = pageNumber + 1;
    if (currentPage > totalPage) {
      await ctx.answerCbQuery(`${ctx.i18n.t('text.endPage')}`, true);
      return;
    } else {
      this.storeLiveMatch.setCurrentPage(currentPage);
      await inlineKeyboard_LiveMatch(
        ctx,
        dataCurrent,
        true,
        totalPage,
        currentPage,
      );
    }
  }

  @Action(/.+/)
  async onActions(ctx) {
    const action = ctx.update.callback_query.data;
    console.log('Action', action);
    const res = await this.p88IntegrationService.getDetailEvent(action);
  }
}
