import { BetList } from './modules/bot/bot.service';

export interface StraightBet {
  betId?: string;
  uniqueRequestId?: string;
  wagerNumber?: number;
  placedAt?: string;
  settledAt?: string;
  betStatus?: string;
  betStatus2?: string;
  betType?: string;
  win?: string;
  risk?: string;
  winLoss?: string;
  oddsFormat?: string;
  customerCommission?: string;
  updateSequence?: string;
  sportId?: string;
  sportName?: string;
  leagueId?: string;
  leagueName?: string;
  eventId?: string;
  handicap?: number;
  price?: string;
  teamName?: string;
  team1?: string;
  team2?: string;
  periodNumber?: string;
  team1Score?: string;
  team2Score?: string;
  ftTeam1Score?: string;
  ftTeam2Score?: string;
  isLive?: boolean;
  eventStartTime?: string;
  resultingUnit?: string;
}

export interface GetBetHistoryRequest {
  betlist: BetList;
  fromDate: string;
  toDate: string;
}
