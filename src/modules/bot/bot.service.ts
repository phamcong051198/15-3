import { Inject, Injectable } from '@nestjs/common';
import { AxiosInstance } from 'axios';
import { StraightBet } from 'src/models';
export enum BetList {
  ALL = 'ALL',
  RUNNING = 'RUNNING',
  SETTLED = 'SETTLED',
}

@Injectable()
export class BotService {
  constructor(
    @Inject('P88_INSTANCE')
    private readonly apiP88: AxiosInstance,
  ) {}

  async getBetHistory(betList: BetList, fromDate: string, toDate: string) {
    const queryParams = {
      betlist: betList,
      fromDate: fromDate,
      toDate: toDate,
    };

    const queryString = new URLSearchParams(queryParams).toString();
    const validBetTypes = ['SPREAD', 'TOTAL_POINTS'];
    try {
      const response = await this.apiP88.get(`/v3/bets?${queryString}`);
      const result: StraightBet[] = response.data?.straightBets
        ?.map((x) => {
          const item: StraightBet = {
            betId: x.betId,
            uniqueRequestId: x.uniqueRequestId,
            wagerNumber: x.wagerNumber,
            placedAt: x.placedAt,
            settledAt: x.settledAt,
            betStatus: x.betStatus,
            betStatus2: x.betStatus2,
            betType: x.betType,
            win: x.win,
            risk: x.risk,
            winLoss: x.winLoss,
            oddsFormat: x.oddsFormat,
            customerCommission: x.customerCommission,
            updateSequence: x.updateSequence,
            sportId: x.sportId,
            sportName: x.sportName,
            leagueId: x.leagueId,
            leagueName: x.leagueName,
            eventId: x.eventId,
            handicap: x.handicap,
            price: x.price,
            teamName: x.teamName,
            team1: x.team1,
            team2: x.team2,
            periodNumber: x.periodNumber,
            team1Score: x.team1Score,
            team2Score: x.team2Score,
            ftTeam1Score: x.ftTeam1Score,
            ftTeam2Score: x.ftTeam2Score,
            isLive: x.isLive,
            eventStartTime: x.eventStartTime,
            resultingUnit: x.resultingUnit,
          };
          return item;
        })
        .filter((x) => x.sportId == '29' && validBetTypes.includes(x.betType));

      return result;
    } catch (error) {
      return;
    }
  }
}
