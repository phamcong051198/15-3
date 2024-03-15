import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { TODAY_MATCH_SCENE, PAGE_SIZE } from 'src/app.constants';
import { inlineKeyboard_TodayMatch } from 'src/keyBoardBot/inlineKeyboard';
import { P88IntegrationService } from 'src/modules/p88_integration/p88_integration.service';
import { StoreService } from 'src/store/store.service';
import { Store_TodayMatch } from 'src/store/storeTodayMatch.service';
import { paginate } from 'src/utils/paginate';

@Scene(TODAY_MATCH_SCENE)
export class TodayMatchScene {
  constructor(
    private p88IntegrationService: P88IntegrationService,
    private storeService: StoreService,
    private storeTodayMatch: Store_TodayMatch,
  ) {}

  @SceneEnter()
  async onSceneEnter(ctx) {
    const data = await this.p88IntegrationService.getTodayMatch();
    if (!data.length) {
      const message = await ctx.replyWithHTML(ctx.i18n.t('TODAY_MATCH.notie'));
      this.storeService.setMessageIds(message.message_id);
    } else {
      this.storeTodayMatch.setData(data);
      const totalPage = Math.ceil(data.length / PAGE_SIZE);
      this.storeTodayMatch.setTotalPage(totalPage);
      const currentPage = 1;
      this.storeTodayMatch.setCurrentPage(currentPage);
      const message = await inlineKeyboard_TodayMatch(
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
  @Action('top_TODAY_MATCH')
  async onTopTodayMatch(ctx) {
    const totalPage = this.storeTodayMatch.getTotalPage();
    const data = this.storeTodayMatch.getData();
    const pageNumber = this.storeTodayMatch.getCurrentPage();
    if (pageNumber === 1) {
      await ctx.answerCbQuery(`${ctx.i18n.t('text.firstPage')}`, true);
      return;
    } else {
      const pageNumber = 1;
      const currentPage = 1;
      const dataCurrent = paginate(data, pageNumber);
      this.storeTodayMatch.setCurrentPage(currentPage);
      await inlineKeyboard_TodayMatch(
        ctx,
        dataCurrent,
        true,
        totalPage,
        currentPage,
      );
    }
  }
  @Action('end_TODAY_MATCH')
  async onEndTodayMatch(ctx) {
    const totalPage = this.storeTodayMatch.getTotalPage();
    const data = this.storeTodayMatch.getData();
    const pageNumber = this.storeTodayMatch.getCurrentPage();

    if (pageNumber >= totalPage) {
      await ctx.answerCbQuery(`${ctx.i18n.t('text.endPage')}`, true);
      return;
    } else {
      const pageNumber = totalPage;
      const currentPage = totalPage;
      const dataCurrent = paginate(data, pageNumber);
      this.storeTodayMatch.setCurrentPage(currentPage);
      await inlineKeyboard_TodayMatch(
        ctx,
        dataCurrent,
        true,
        totalPage,
        currentPage,
      );
    }
  }
  @Action('previous_TODAY_MATCH')
  async onPreviousPageTodayMatch(@Ctx() ctx: any) {
    const totalPage = this.storeTodayMatch.getTotalPage();
    const data = this.storeTodayMatch.getData();
    const pageNumber = this.storeTodayMatch.getCurrentPage();

    const dataCurrent = paginate(data, pageNumber - 1);
    const currentPage = pageNumber - 1;
    if (currentPage < 1) {
      await ctx.answerCbQuery(`${ctx.i18n.t('text.firstPage')}`, true);
      return;
    } else {
      this.storeTodayMatch.setCurrentPage(currentPage);
      await inlineKeyboard_TodayMatch(
        ctx,
        dataCurrent,
        true,
        totalPage,
        currentPage,
      );
    }
  }
  @Action('next_TODAY_MATCH')
  async onNextPageTodayMatch(@Ctx() ctx: any) {
    const totalPage = this.storeTodayMatch.getTotalPage();
    const data = this.storeTodayMatch.getData();
    const pageNumber = this.storeTodayMatch.getCurrentPage();

    const dataCurrent = paginate(data, pageNumber + 1);
    const currentPage = pageNumber + 1;
    if (currentPage > totalPage) {
      await ctx.answerCbQuery(`${ctx.i18n.t('text.endPage')}`, true);
      return;
    } else {
      this.storeTodayMatch.setCurrentPage(currentPage);
      await inlineKeyboard_TodayMatch(
        ctx,
        dataCurrent,
        true,
        totalPage,
        currentPage,
      );
    }
  }
}
