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
      const resApi = await this.apiP88.get('/v3/fixtures?sportId=29');

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
        this.apiP88.get('/v3/fixtures?sportId=29'),
      ]);
      const leaguesLive = liveApiRes.data.sports[0].leagues;
      const listId_LiveMatch = leaguesLive.flatMap((league) =>
        league.events.map((event) => event.id),
      );

      const allEvents = fixturesRes.data.league.flatMap((item) => item.events);

      const liveEvents = allEvents.filter((item) =>
        listId_LiveMatch.includes(item.id),
      );
      const liveEvents_sortTime = liveEvents.sort((item1, item2) => {
        return (
          new Date(item1.starts).getTime() - new Date(item2.starts).getTime()
        );
      });

      return liveEvents_sortTime;
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

    const todayEvents_sortHome = dataTodayMatch.sort((a, b) =>
      a.home.localeCompare(b.home),
    );
    return todayEvents_sortHome;
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

    const weekEvents_sortHome = dataWeekMatch.sort((a, b) =>
      a.home.localeCompare(b.home),
    );
    return weekEvents_sortHome;
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

    const monthEvents_sortHome = dataMonthMatch.sort((a, b) =>
      a.home.localeCompare(b.home),
    );
    return monthEvents_sortHome;
  }

  async getNextMonthMatch() {
    const dataFixturesMatch = await this.getFixtures();

    const dataNextMonthMatch = dataFixturesMatch.filter(
      (event) =>
        new Date(event.starts).getUTCMonth() === new Date().getUTCMonth() + 1,
    );
    const nextMonthEvents_sortHome = dataNextMonthMatch.sort((a, b) =>
      a.home.localeCompare(b.home),
    );

    return nextMonthEvents_sortHome;
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

  async getDetailEvent(eventId: any) {
    try {
      const resApi = await this.apiP88.get(
        `/v3/fixtures?sportId=29&eventIds=${eventId}`,
      );
      const detailEvent = resApi.data.league[0];
      console.log(detailEvent);
    } catch (error) {}
  }
}
