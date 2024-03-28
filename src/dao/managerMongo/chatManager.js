/* import { chatsModel } from "../models/chatsModel.js";

export class chatManager{

async saveMessage(datos){
    try {   
        let userInCollection = await chatsModel.findOne({user: datos.user})
        if(userInCollection){
            userInCollection.message.push(datos.message)
            await chatsModel.updateOne({user: datos.user}, {message: userInCollection.message})
            return datos
        }
        
        await chatsModel.create({ user: datos.user, message: [datos.message] });
        console.log(`se creo un nuevo usuario en BD: ${datos.user}`)
        return datos
    } catch (error) {
    console.log(error.message)
    return null    
    }
    }
} */