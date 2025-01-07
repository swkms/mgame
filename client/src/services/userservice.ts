import { ObjectResult } from '@/src/models/model'
import { User } from '@/src/models/user'
import BaseService, { MMResult } from './baseservice'

/**
 * 用户访问服务
 */
export class UserService extends BaseService {

    /**
     * 登录
     * @param user 用户实体
     * @returns 用户实体
     */
    async login(loginName: string, loginPwd: string): Promise<MMResult<User>> {
        return await this.post('/api/user/login', { loginName: loginName, loginPwd: loginPwd })
    }

    //#region 用户

    async getUsers(index: number, size: number, organizationIDs: Array<number>, content: string = ""): Promise<MMResult<ObjectResult<User>>> {
        return await this.get('/api/user/getusers', { content: content, index: index, size: size, organizationIDs: organizationIDs.join(",") })
    }

    async getSelf(): Promise<MMResult<User>> {
        return await this.post('/api/user/GetSelf', null)
    }

    async addUser(user: User): Promise<MMResult<Boolean>> {
        return await this.post('/api/user/adduser', user)
    }

    async modifyUser(user: User): Promise<MMResult<Boolean>> {
        return await this.put('/api/user/modifyuser', user)
    }

    async modifyPwd(pwd: string): Promise<MMResult<Boolean>> {
        return await this.put('/api/user/modifyPwd', pwd)
    }

    async resetPwd(user: User): Promise<MMResult<Boolean>> {
        return await this.put('/api/user/resetPwd', user)
    }

    async removeUsers(userIDs: Array<number>): Promise<MMResult<Boolean>> {
        return await this.delete('/api/user/removeuser', { userid: userIDs.join(",") })
    }

    //#endreion
}

export default new UserService()
