import { Controller, Get, Query, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { StoreService } from './store/store.service';
import { BetList, BotService } from './modules/bot/bot.service';
import { formatShortDate } from './constants/constant';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private storeService: StoreService,
    private botService: BotService,
  ) {}

  @Get()
  @Render('index')
  getHello() {
    const username = this.storeService.getUserName();
    return { message: 'Hello world!' + username };
  }

  @Get('betHistory')
  @Render('betHistory')
  async getBetHistory(
    @Query('fromDate') fromDate: string,
    @Query('toDate') toDate: string,
    @Query('betlist') betlist?: string,
    @Query('searchKey') searchKey?: string,
  ) {
    // const username = this.storeService.getUserName();
    // if (true) return;

    const betList =
      betlist === BetList.RUNNING.toString()
        ? BetList.RUNNING
        : BetList.SETTLED;

    const data = (
      await this.botService.getBetHistory(betList, fromDate, toDate)
    )?.filter(
      (x) =>
        x.betId?.toString().includes(searchKey || '') ||
        x.teamName?.includes(searchKey || '') ||
        x.leagueName?.includes(searchKey || ''),
    );
    const startDate = formatShortDate(fromDate);
    const endDate = formatShortDate(toDate);

    return {
      dataTable: JSON.stringify(data || []),
      betlist: betlist === BetList.SETTLED,
      fromDate: startDate,
      toDate: endDate,
    };
  }
  @Get('api/betHistory')
  async get(
    @Query('fromDate') fromDate: string,
    @Query('toDate') toDate: string,
    @Query('betlist') betlist?: string,
    @Query('searchKey') searchKey?: string,
  ) {
    const betList =
      betlist === BetList.RUNNING.toString()
        ? BetList.RUNNING
        : BetList.SETTLED;

    const data = (
      await this.botService.getBetHistory(betList, fromDate, toDate)
    )?.filter(
      (x) =>
        x.betId?.toString().includes(searchKey || '') ||
        x.teamName?.includes(searchKey || '') ||
        x.leagueName?.includes(searchKey || ''),
    );
    const startDate = formatShortDate(fromDate);
    const endDate = formatShortDate(toDate);

    return {
      statusCode: 200,
      body: JSON.stringify({
        dataTable: data,
        betlist: betlist === BetList.SETTLED,
        fromDate: startDate,
        toDate: endDate,
      }),
    };
  }
}
