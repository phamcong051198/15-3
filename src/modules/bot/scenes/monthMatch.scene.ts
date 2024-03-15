import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { MONTH_MATCH_SCENE, PAGE_SIZE } from 'src/app.constants';
import { inlineKeyboard_Month } from 'src/keyBoardBot/inlineKeyboard';
import { P88IntegrationService } from 'src/modules/p88_integration/p88_integration.service';
import { StoreService } from 'src/store/store.service';
import { Store_MonthMatch } from 'src/store/storeMonthMatch';

import { paginate } from 'src/utils/paginate';

@Scene(MONTH_MATCH_SCENE)
export class MonthMatchScene {
  constructor(
    private p88IntegrationService: P88IntegrationService,
    private storeService: StoreService,
    private storeMonthMatch: Store_MonthMatch,
  ) {}

  @SceneEnter()
  async onSceneEnter(ctx) {
    const data = await this.p88IntegrationService.getMonthMatch();
    if (!data.length) {
      const message = await ctx.replyWithHTML(ctx.i18n.t('MONTH_MATCH.notie'));
      this.storeService.setMessageIds(message.message_id);
    } else {
      this.storeMonthMatch.setData(data);
      const totalPage = Math.ceil(data.length / PAGE_SIZE);
      this.storeMonthMatch.setTotalPage(totalPage);
      const currentPage = 1;
      this.storeMonthMatch.setCurrentPage(currentPage);
      const message = await inlineKeyboard_Month(
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
  @Action('top_MONTH_MATCH')
  async onTopWeekMatch(@Ctx() ctx: any) {
    const totalPage = this.storeMonthMatch.getTotalPage();
    const data = this.storeMonthMatch.getData();
    const pageNumber = this.storeMonthMatch.getCurrentPage();
    if (pageNumber === 1) {
      await ctx.answerCbQuery(`${ctx.i18n.t('text.firstPage')}`, true);
      return;
    } else {
      const pageNumber = 1;
      const currentPage = 1;
      const dataCurrent = paginate(data, pageNumber);
      this.storeMonthMatch.setCurrentPage(currentPage);
      await inlineKeyboard_Month(
        ctx,
        dataCurrent,
        true,
        totalPage,
        currentPage,
      );
    }
  }
  @Action('end_MONTH_MATCH')
  async onEndWeekMatch(@Ctx() ctx: any) {
    const totalPage = this.storeMonthMatch.getTotalPage();
    const data = this.storeMonthMatch.getData();
    const pageNumber = this.storeMonthMatch.getCurrentPage();

    if (pageNumber >= totalPage) {
      await ctx.answerCbQuery(`${ctx.i18n.t('text.endPage')}`, true);
      return;
    } else {
      const pageNumber = totalPage;
      const currentPage = totalPage;
      const dataCurrent = paginate(data, pageNumber);
      this.storeMonthMatch.setCurrentPage(currentPage);
      await inlineKeyboard_Month(
        ctx,
        dataCurrent,
        true,
        totalPage,
        currentPage,
      );
    }
  }
  @Action('previous_MONTH_MATCH')
  async onPreviousPageWeekMatch(@Ctx() ctx: any) {
    const totalPage = this.storeMonthMatch.getTotalPage();
    const data = this.storeMonthMatch.getData();
    const pageNumber = this.storeMonthMatch.getCurrentPage();

    const dataCurrent = paginate(data, pageNumber - 1);
    const currentPage = pageNumber - 1;
    if (currentPage < 1) {
      await ctx.answerCbQuery(`${ctx.i18n.t('text.firstPage')}`, true);
      return;
    } else {
      this.storeMonthMatch.setCurrentPage(currentPage);
      await inlineKeyboard_Month(
        ctx,
        dataCurrent,
        true,
        totalPage,
        currentPage,
      );
    }
  }
  @Action('next_MONTH_MATCH')
  async onNextPageWeekMatch(@Ctx() ctx: any) {
    const totalPage = this.storeMonthMatch.getTotalPage();
    const data = this.storeMonthMatch.getData();
    const pageNumber = this.storeMonthMatch.getCurrentPage();

    const dataCurrent = paginate(data, pageNumber + 1);
    const currentPage = pageNumber + 1;
    if (currentPage > totalPage) {
      await ctx.answerCbQuery(`${ctx.i18n.t('text.endPage')}`, true);
      return;
    } else {
      this.storeMonthMatch.setCurrentPage(currentPage);
      await inlineKeyboard_Month(
        ctx,
        dataCurrent,
        true,
        totalPage,
        currentPage,
      );
    }
  }
}
