import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { NEXT_MONTH_MATCH_SCENE, PAGE_SIZE } from 'src/app.constants';
import { inlineKeyboard_NextMonth } from 'src/keyBoardBot/inlineKeyboard';
import { P88IntegrationService } from 'src/modules/p88_integration/p88_integration.service';
import { StoreService } from 'src/store/store.service';
import { Store_NextMonthMatch } from 'src/store/storeNextMonthMatch';

import { paginate } from 'src/utils/paginate';

@Scene(NEXT_MONTH_MATCH_SCENE)
export class NextMonthMatchScene {
  constructor(
    private p88IntegrationService: P88IntegrationService,
    private storeService: StoreService,
    private storeNextMonthMatch: Store_NextMonthMatch,
  ) {}

  @SceneEnter()
  async onSceneEnter(ctx) {
    const data = await this.p88IntegrationService.getNextMonthMatch();
    console.log(data);
    if (!data.length) {
      const message = await ctx.replyWithHTML(
        ctx.i18n.t('NEXT_MONTH_MATCH.notie'),
      );
      this.storeService.setMessageIds(message.message_id);
    } else {
      this.storeNextMonthMatch.setData(data);
      const totalPage = Math.ceil(data.length / PAGE_SIZE);
      this.storeNextMonthMatch.setTotalPage(totalPage);
      const currentPage = 1;
      this.storeNextMonthMatch.setCurrentPage(currentPage);
      const message = await inlineKeyboard_NextMonth(
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
  @Action('top_NEXT_MONTH_MATCH')
  async onTopWeekMatch(@Ctx() ctx: any) {
    const totalPage = this.storeNextMonthMatch.getTotalPage();
    const data = this.storeNextMonthMatch.getData();
    const pageNumber = this.storeNextMonthMatch.getCurrentPage();
    if (pageNumber === 1) {
      await ctx.answerCbQuery(`${ctx.i18n.t('text.firstPage')}`, true);
      return;
    } else {
      const pageNumber = 1;
      const currentPage = 1;
      const dataCurrent = paginate(data, pageNumber);
      this.storeNextMonthMatch.setCurrentPage(currentPage);
      await inlineKeyboard_NextMonth(
        ctx,
        dataCurrent,
        true,
        totalPage,
        currentPage,
      );
    }
  }
  @Action('end_NEXT_MONTH_MATCH')
  async onEndWeekMatch(@Ctx() ctx: any) {
    const totalPage = this.storeNextMonthMatch.getTotalPage();
    const data = this.storeNextMonthMatch.getData();
    const pageNumber = this.storeNextMonthMatch.getCurrentPage();

    if (pageNumber >= totalPage) {
      await ctx.answerCbQuery(`${ctx.i18n.t('text.endPage')}`, true);
      return;
    } else {
      const pageNumber = totalPage;
      const currentPage = totalPage;
      const dataCurrent = paginate(data, pageNumber);
      this.storeNextMonthMatch.setCurrentPage(currentPage);
      await inlineKeyboard_NextMonth(
        ctx,
        dataCurrent,
        true,
        totalPage,
        currentPage,
      );
    }
  }
  @Action('previous_NEXT_MONTH_MATCH')
  async onPreviousPageWeekMatch(@Ctx() ctx: any) {
    const totalPage = this.storeNextMonthMatch.getTotalPage();
    const data = this.storeNextMonthMatch.getData();
    const pageNumber = this.storeNextMonthMatch.getCurrentPage();

    const dataCurrent = paginate(data, pageNumber - 1);
    const currentPage = pageNumber - 1;
    if (currentPage < 1) {
      await ctx.answerCbQuery(`${ctx.i18n.t('text.firstPage')}`, true);
      return;
    } else {
      this.storeNextMonthMatch.setCurrentPage(currentPage);
      await inlineKeyboard_NextMonth(
        ctx,
        dataCurrent,
        true,
        totalPage,
        currentPage,
      );
    }
  }
  @Action('next_NEXT_MONTH_MATCH')
  async onNextPageWeekMatch(@Ctx() ctx: any) {
    const totalPage = this.storeNextMonthMatch.getTotalPage();
    const data = this.storeNextMonthMatch.getData();
    const pageNumber = this.storeNextMonthMatch.getCurrentPage();

    const dataCurrent = paginate(data, pageNumber + 1);
    const currentPage = pageNumber + 1;
    if (currentPage > totalPage) {
      await ctx.answerCbQuery(`${ctx.i18n.t('text.endPage')}`, true);
      return;
    } else {
      this.storeNextMonthMatch.setCurrentPage(currentPage);
      await inlineKeyboard_NextMonth(
        ctx,
        dataCurrent,
        true,
        totalPage,
        currentPage,
      );
    }
  }
}
