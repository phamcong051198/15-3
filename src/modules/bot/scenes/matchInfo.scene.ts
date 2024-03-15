import { Scene, SceneEnter } from 'nestjs-telegraf';
import { MATCH_INFORMATION_SCENE } from 'src/app.constants';
import keyboard_menuMatchInfo from 'src/keyBoardBot/keyboard/menuMatchInfo';
import { StoreService } from 'src/store/store.service';

@Scene(MATCH_INFORMATION_SCENE)
export class MatchInformationScene {
  constructor(private storeService: StoreService) {}

  @SceneEnter()
  async onSceneEnter(ctx) {
    const message = await keyboard_menuMatchInfo(ctx);
    this.storeService.setMessageIds(ctx.message.message_id);
    this.storeService.setMessageIds(message.message_id);
  }
}
