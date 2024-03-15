import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { WEEK_MATCH_SCENE, PAGE_SIZE } from 'src/app.constants';
import { inlineKeyboard_WeekMatch } from 'src/keyBoardBot/inlineKeyboard';
import { P88IntegrationService } from 'src/modules/p88_integration/p88_integration.service';
import { StoreService } from 'src/store/store.service';
import { Store_WeekMatch } from 'src/store/storeWeekMatch.service';
import { paginate } from 'src/utils/paginate';

@Scene(WEEK_MATCH_SCENE)
export class WeekMatchScene {
  constructor(
    private p88IntegrationService: P88IntegrationService,
    private storeService: StoreService,
    private storeWeekMatch: Store_WeekMatch,
  ) {}

  @SceneEnter()
  async onSceneEnter(ctx) {
    const data = await this.p88IntegrationService.getWeekMatch();
    if (!data.length) {
      const message = await ctx.replyWithHTML(ctx.i18n.t('WEEK_MATCH.notie'));
      this.storeService.setMessageIds(message.message_id);
    } else {
      this.storeWeekMatch.setData(data);
      const totalPage = Math.ceil(data.length / PAGE_SIZE);
      this.storeWeekMatch.setTotalPage(totalPage);
      const currentPage = 1;
      this.storeWeekMatch.setCurrentPage(currentPage);
      const message = await inlineKeyboard_WeekMatch(
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
  @Action('top_WEEK_MATCH')
  async onTopWeekMatch(@Ctx() ctx: any) {
    const totalPage = this.storeWeekMatch.getTotalPage();
    const data = this.storeWeekMatch.getData();
    const pageNumber = this.storeWeekMatch.getCurrentPage();
    if (pageNumber === 1) {
      await ctx.answerCbQuery(`${ctx.i18n.t('text.firstPage')}`, true);
      return;
    } else {
      const pageNumber = 1;
      const currentPage = 1;
      const dataCurrent = paginate(data, pageNumber);
      this.storeWeekMatch.setCurrentPage(currentPage);
      await inlineKeyboard_WeekMatch(
        ctx,
        dataCurrent,
        true,
        totalPage,
        currentPage,
      );
    }
  }
  @Action('end_WEEK_MATCH')
  async onEndWeekMatch(@Ctx() ctx: any) {
    const totalPage = this.storeWeekMatch.getTotalPage();
    const data = this.storeWeekMatch.getData();
    const pageNumber = this.storeWeekMatch.getCurrentPage();

    if (pageNumber >= totalPage) {
      await ctx.answerCbQuery(`${ctx.i18n.t('text.endPage')}`, true);
      return;
    } else {
      const pageNumber = totalPage;
      const currentPage = totalPage;
      const dataCurrent = paginate(data, pageNumber);
      this.storeWeekMatch.setCurrentPage(currentPage);
      await inlineKeyboard_WeekMatch(
        ctx,
        dataCurrent,
        true,
        totalPage,
        currentPage,
      );
    }
  }
  @Action('previous_WEEK_MATCH')
  async onPreviousPageWeekMatch(@Ctx() ctx: any) {
    const totalPage = this.storeWeekMatch.getTotalPage();
    const data = this.storeWeekMatch.getData();
    const pageNumber = this.storeWeekMatch.getCurrentPage();

    const dataCurrent = paginate(data, pageNumber - 1);
    const currentPage = pageNumber - 1;
    if (currentPage < 1) {
      await ctx.answerCbQuery(`${ctx.i18n.t('text.firstPage')}`, true);
      return;
    } else {
      this.storeWeekMatch.setCurrentPage(currentPage);
      await inlineKeyboard_WeekMatch(
        ctx,
        dataCurrent,
        true,
        totalPage,
        currentPage,
      );
    }
  }
  @Action('next_WEEK_MATCH')
  async onNextPageWeekMatch(@Ctx() ctx: any) {
    const totalPage = this.storeWeekMatch.getTotalPage();
    const data = this.storeWeekMatch.getData();
    const pageNumber = this.storeWeekMatch.getCurrentPage();

    const dataCurrent = paginate(data, pageNumber + 1);
    const currentPage = pageNumber + 1;
    if (currentPage > totalPage) {
      await ctx.answerCbQuery(`${ctx.i18n.t('text.endPage')}`, true);
      return;
    } else {
      this.storeWeekMatch.setCurrentPage(currentPage);
      await inlineKeyboard_WeekMatch(
        ctx,
        dataCurrent,
        true,
        totalPage,
        currentPage,
      );
    }
  }
}
