import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { LEAGUE_INFO_SCENE, PAGE_SIZE } from 'src/app.constants';
import { inlineKeyboard_League } from 'src/keyBoardBot/inlineKeyboard';
import { P88IntegrationService } from 'src/modules/p88_integration/p88_integration.service';
import { StoreService } from 'src/store/store.service';
import { Store_League } from 'src/store/storeLeague.service';
import { paginate } from 'src/utils/paginate';

@Scene(LEAGUE_INFO_SCENE)
export class LeagueInfoScene {
  constructor(
    private p88IntegrationService: P88IntegrationService,
    private storeService: StoreService,
    private storeLeague: Store_League,
  ) {}

  @SceneEnter()
  async onSceneEnter(ctx) {
    const data = await this.p88IntegrationService.getDataTournament();
    if (!data.length) {
      const message = await ctx.replyWithHTML(ctx.i18n.t('LEAGUES.notie'));
      this.storeService.setMessageIds(message.message_id);
    } else {
      this.storeLeague.setData(data);
      const totalPage = Math.ceil(data.length / PAGE_SIZE);
      this.storeLeague.setTotalPage(totalPage);
      const currentPage = 1;
      this.storeLeague.setCurrentPage(currentPage);
      const message = await inlineKeyboard_League(
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

  @Action('top_LEAGUES')
  async onTopLEAGUES(@Ctx() ctx: any) {
    const totalPage = this.storeLeague.getTotalPage();
    const data = this.storeLeague.getData();
    const pageNumber = this.storeLeague.getCurrentPage();
    if (pageNumber === 1) {
      await ctx.answerCbQuery(`${ctx.i18n.t('text.firstPage')}`, true);
      return;
    } else {
      const pageNumber = 1;
      const currentPage = 1;
      const dataCurrent = paginate(data, pageNumber);
      this.storeLeague.setCurrentPage(currentPage);
      await inlineKeyboard_League(
        ctx,
        dataCurrent,
        true,
        totalPage,
        currentPage,
      );
    }
  }

  @Action('end_LEAGUES')
  async onEndLEAGUES(@Ctx() ctx: any) {
    const totalPage = this.storeLeague.getTotalPage();
    const data = this.storeLeague.getData();
    const pageNumber = this.storeLeague.getCurrentPage();

    if (pageNumber >= totalPage) {
      await ctx.answerCbQuery(`${ctx.i18n.t('text.endPage')}`, true);
      return;
    } else {
      const pageNumber = totalPage;
      const currentPage = totalPage;
      const dataCurrent = paginate(data, pageNumber);
      this.storeLeague.setCurrentPage(currentPage);
      await inlineKeyboard_League(
        ctx,
        dataCurrent,
        true,
        totalPage,
        currentPage,
      );
    }
  }
  @Action('previous_LEAGUES')
  async onPrevious_LEAGUES(@Ctx() ctx: any) {
    const totalPage = this.storeLeague.getTotalPage();
    const data = this.storeLeague.getData();
    const pageNumber = this.storeLeague.getCurrentPage();

    const dataCurrent = paginate(data, pageNumber - 1);
    const currentPage = pageNumber - 1;
    if (currentPage < 1) {
      await ctx.answerCbQuery(`${ctx.i18n.t('text.firstPage')}`, true);
      return;
    } else {
      this.storeLeague.setCurrentPage(currentPage);
      await inlineKeyboard_League(
        ctx,
        dataCurrent,
        true,
        totalPage,
        currentPage,
      );
    }
  }
  @Action('next_LEAGUES')
  async onNext_LEAGUES(@Ctx() ctx: any) {
    const totalPage = this.storeLeague.getTotalPage();
    const data = this.storeLeague.getData();
    const pageNumber = this.storeLeague.getCurrentPage();

    const dataCurrent = paginate(data, pageNumber + 1);
    const currentPage = pageNumber + 1;
    if (currentPage > totalPage) {
      await ctx.answerCbQuery(`${ctx.i18n.t('text.endPage')}`, true);
      return;
    } else {
      this.storeLeague.setCurrentPage(currentPage);
      await inlineKeyboard_League(
        ctx,
        dataCurrent,
        true,
        totalPage,
        currentPage,
      );
    }
  }
}
