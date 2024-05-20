export class UserService {
    constructor(dao){
        this.dao = new dao()
    }

    async getUserById(id){
        return await this.dao.getUserById(id)
    }
    async changeRol(user, rol){
        return await this.dao.changeRol(user,rol)        
    }    

    async getUser(email){
        return await this.dao.getUser(email)
    }
    async updatePassUser(pass,email){
        return await this.dao.updatePassUser(pass,email)
    }
}

import { UserDAO } from "../dao/userDAO.js"
export const userService = new UserService(UserDAO)