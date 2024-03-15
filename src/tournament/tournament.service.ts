import { Inject, Injectable } from '@nestjs/common';
import { AxiosInstance } from 'axios';
import { I18nService } from 'nestjs-i18n';
import { StoreService } from 'src/store/store.service';
import { convertToUTC } from 'src/utils/convertToUTC';
import { fetchDataMatch } from 'src/utils/fetchDataMatch';
import { fetchDataTournament } from 'src/utils/fetchDataTournament';

@Injectable()
export class TournamentService {
  constructor(
    private readonly i18n: I18nService,
    private storeService: StoreService,
    @Inject('P88_INSTANCE')
    private readonly apiP88: AxiosInstance,
  ) {}
  async getListTournament() {
    const locale = this.storeService.getLocale();
    const dataTournament = await fetchDataTournament(this.apiP88);

    return {
      text: {
        header: this.i18n.t('tournament.header', {
          lang: locale,
        }),
        placeholder: this.i18n.t('tournament.placeholder', {
          lang: locale,
        }),
        search: this.i18n.t('tournament.search', {
          lang: locale,
        }),
        tournamentName: this.i18n.t('tournament.tournamentName', {
          lang: locale,
        }),
      },
      dataTable: dataTournament,
    };
  }

  async getListMatch(idTournament: string) {
    const locale = this.storeService.getLocale();
    const timeDate = '+07:00';

    const { nameLeague, dataAPi } = await fetchDataMatch(
      this.apiP88,
      idTournament,
    );
    const dataMatch = dataAPi.map((item) => {
      return {
        ...item,
        starts: convertToUTC(item.starts, timeDate),
      };
    });

    return {
      text: {
        header: this.i18n.t('match.header', {
          lang: locale,
        }),
        placeholder: this.i18n.t('match.placeholder', {
          lang: locale,
        }),
        search: this.i18n.t('match.search', {
          lang: locale,
        }),
        tournamentName: this.i18n.t('match.tournamentName', {
          lang: locale,
        }),
      },
      nameLeague,
      dataTable: dataMatch,
    };
  }
}
