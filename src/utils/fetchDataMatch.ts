import { AxiosInstance } from 'axios';

export async function fetchDataMatch(
  apiP88: AxiosInstance,
  idTournament: string,
): Promise<any> {
  const getIdMatch = await apiP88.get(
    `/v3/odds?sportId=29&leagueIds=${idTournament}`,
  );
  const getFixturesLeague = await apiP88.get(
    `/v3/fixtures?sportId=29&leagueIds=${idTournament}`,
  );
  const dataIdMatch = getIdMatch.data.leagues[0].events;
  const dataFixturesLeague = getFixturesLeague.data.league[0].events;
  const nameLeague = getFixturesLeague.data.league[0].name;

  const dataAPi = dataFixturesLeague.filter((bItem: any) =>
    dataIdMatch.some((aItem: any) => aItem.id === bItem.id),
  );

  dataAPi.sort(
    (item1: any, item2: any) =>
      new Date(item1.starts).getTime() - new Date(item2.starts).getTime(),
  );

  return { nameLeague, dataAPi };
}
