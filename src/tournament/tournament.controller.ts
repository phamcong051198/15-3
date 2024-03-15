import { Controller, Get, Param, Post, Render } from '@nestjs/common';
import { TournamentService } from './tournament.service';

@Controller('tournament')
export class TournamentController {
  constructor(private readonly tournamentService: TournamentService) {}

  @Get()
  @Render('tournament')
  async getListTournament() {
    return await this.tournamentService.getListTournament();
  }

  @Get(':id')
  @Render('match')
  async getListMatch(@Param('id') idTournament) {
    return await this.tournamentService.getListMatch(idTournament);
  }
}
