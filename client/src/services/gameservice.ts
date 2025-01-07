import { ObjectResult } from '@/src/models/model'
import { Game } from '@/src/models/game'
import BaseService, { MMResult } from './baseservice'

/**
 * 游戏访问服务
 */
export class GameService extends BaseService {

    //#region 游戏

    async getGames(index: number, size: number, content: string = ""): Promise<MMResult<ObjectResult<Game>>> {
        return await this.get('/api/game/getgames', { content: content, index: index, size: size })
    }

    async addGame(game: Game): Promise<MMResult<Boolean>> {
        return await this.post('/api/game/addgame', game)
    }

    async modifyGame(game: Game): Promise<MMResult<Boolean>> {
        return await this.put('/api/game/modifygame', game)
    }

    async removeGames(gameIDs: Array<number>): Promise<MMResult<Boolean>> {
        return await this.delete('/api/game/removegame', { gameid: gameIDs.join(",") })
    }

    //#endreion
}

export default new GameService()
