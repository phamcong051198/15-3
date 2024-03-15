import { Inject, Injectable } from '@nestjs/common';
import { AxiosInstance } from 'axios';

@Injectable()
export class P88IntegrationService {
  constructor(
    @Inject('P88_INSTANCE')
    private readonly apiP88: AxiosInstance,
  ) {}

  async getFixtures() {
    try {
      const timeZone7 = false;
      const resApi = await this.apiP88.get(
        'https://api.p88.bet/v3/fixtures?sportId=29',
      );

      const dataFixtures = resApi.data.league;
      const dataFixturesMatch = dataFixtures
        .map((item: any) => item.events)
        .flat();

      const dataFixturesMatch_UTC_0 = dataFixturesMatch.filter(
        (event) => !event.hasOwnProperty('parentId'),
      );
      const dataFixturesMatch_GMT_7 = dataFixturesMatch_UTC_0.map(
        (event: any) => ({
          ...event,
          starts: new Date(
            new Date(event.starts).getTime() + 7 * 60 * 60 * 1000,
          ).toISOString(),
        }),
      );

      return timeZone7 ? dataFixturesMatch_GMT_7 : dataFixturesMatch_UTC_0;
    } catch (error) {
      return [];
    }
  }

  async getLiveMatch() {
    try {
      const [liveApiRes, fixturesRes] = await Promise.all([
        this.apiP88.get('/v2/inrunning'),
        this.apiP88.get('https://api.p88.bet/v3/fixtures?sportId=29'),
      ]);

      const dataLiveSoccer = liveApiRes.data.sports.find(
        (item) => item.id === 29,
      );
      const liveMatch = dataLiveSoccer
        ? dataLiveSoccer.leagues.flatMap((item) =>
            item.events.filter((event) => event.state !== 9),
          )
        : [];

      if (!liveMatch.length) {
        return liveMatch;
      }

      const aIds = liveMatch.map((item) => item.id);
      const dataFixtures = fixturesRes.data.league || [];

      const dataLiveMatch = dataFixtures.flatMap((leagueItem) =>
        leagueItem.events.filter((event) => aIds.includes(event.id)),
      );

      const result = dataLiveMatch.filter(
        (item) =>
          !item.home.includes('(Corners)') && !item.away.includes('(Corners)'),
      );

      result.sort(
        (a, b) => new Date(b.starts).getTime() - new Date(a.starts).getTime(),
      );

      return result;
    } catch (error) {
      return [];
    }
  }

  async getTodayMatch() {
    const dataFixturesMatch = await this.getFixtures();

    const today = new Date().toISOString().split('T')[0];
    const dataTodayMatch = dataFixturesMatch.filter((event: any) =>
      event.starts.startsWith(today),
    );
    return dataTodayMatch;
  }

  async getWeekMatch() {
    const dataFixturesMatch = await this.getFixtures();

    const dataWeekMatch = dataFixturesMatch.filter((event) => {
      const eventDate = new Date(event.starts);
      const today = new Date();
      const endOfWeek = new Date(today);
      endOfWeek.setDate(endOfWeek.getDate() + (8 - today.getDay()));
      return eventDate >= today && eventDate <= endOfWeek;
    });
    return dataWeekMatch;
  }

  async getMonthMatch() {
    const dataFixturesMatch = await this.getFixtures();

    const today = new Date();
    const endOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );
    const dataMonthMatch = dataFixturesMatch.filter(
      (event) =>
        new Date(event.starts) >= today && new Date(event.starts) <= endOfMonth,
    );
    return dataMonthMatch;
  }

  async getNextMonthMatch() {
    const dataFixturesMatch = await this.getFixtures();

    const dataNextMonthMatch = dataFixturesMatch.filter(
      (event) =>
        new Date(event.starts).getMonth() === new Date().getMonth() + 1,
    );
    return dataNextMonthMatch;
  }

  async getDataTournament() {
    try {
      const resApi = await this.apiP88.get('/v3/leagues?sportId=29');
      const dataApi = resApi.data.leagues;
      const dataMatch = dataApi.filter((item: any) => {
        return (
          !item.name.includes('Corners') &&
          item.hasOfferings &&
          (item.leagueSpecialsCount ||
            item.eventSpecialsCount ||
            item.eventCount)
        );
      });
      dataMatch.sort((item1, item2) =>
        item1.name
          .trim()
          .toLowerCase()
          .localeCompare(item2.name.trim().toLowerCase()),
      );
      return dataMatch;
    } catch (error) {
      return [];
    }
  }
}
