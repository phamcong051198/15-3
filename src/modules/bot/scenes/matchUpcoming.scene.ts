import { Scene, SceneEnter } from 'nestjs-telegraf';
import { MATCH_UPCOMING_SCENE } from 'src/app.constants';
import keyboard_matchUpcoming from 'src/keyBoardBot/keyboard/matchUpcoming';
import { StoreService } from 'src/store/store.service';

@Scene(MATCH_UPCOMING_SCENE)
export class MatchUpcomingScene {
  constructor(private storeService: StoreService) {}
  @SceneEnter()
  async onSceneEnter(ctx) {
    const message = await keyboard_matchUpcoming(ctx);
    this.storeService.setMessageIds(ctx.message.message_id);
    this.storeService.setMessageIds(message.message_id);
  }
}
