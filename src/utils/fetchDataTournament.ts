import { AxiosInstance } from 'axios';

export async function fetchDataTournament(
  apiP88: AxiosInstance,
): Promise<any[]> {
  const resApi = await apiP88.get('/v3/leagues?sportId=29');
  const dataApi = resApi.data.leagues;
  const dataMatch = dataApi.filter((item: any) => {
    return (
      !item.name.includes('Corners') &&
      item.hasOfferings &&
      (item.leagueSpecialsCount || item.eventSpecialsCount || item.eventCount)
    );
  });
  dataMatch.sort((item1: any, item2: any) =>
    item1.name
      .trim()
      .toLowerCase()
      .localeCompare(item2.name.trim().toLowerCase()),
  );
  return dataMatch;
}
