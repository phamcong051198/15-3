import { Module } from '@nestjs/common';
import { Store_TodayMatch } from 'src/store/storeTodayMatch.service';
import { StoreService } from 'src/store/store.service';
import { Store_WeekMatch } from 'src/store/storeWeekMatch.service';
import { Store_League } from 'src/store/storeLeague.service';
import { Store_LiveMatch } from 'src/store/storeLiveMatch.service';
import { Store_MonthMatch } from 'src/store/storeMonthMatch';
import { Store_NextMonthMatch } from 'src/store/storeNextMonthMatch';

@Module({
  providers: [
    StoreService,
    Store_LiveMatch,
    Store_TodayMatch,
    Store_WeekMatch,
    Store_MonthMatch,
    Store_NextMonthMatch,
    Store_League,
  ],
  exports: [
    StoreService,
    Store_LiveMatch,
    Store_TodayMatch,
    Store_WeekMatch,
    Store_MonthMatch,
    Store_NextMonthMatch,
    Store_League,
  ],
})
export class SharedModule {}
