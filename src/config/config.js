import dotenv from 'dotenv'
import {__dirname} from '../utils.js'
dotenv.config({
    override:true,
    path: `${__dirname}/.env` 
})

export const config ={
    PORT: process.env.PORT || 7000,
    MONGO_URL: process.env.MONGO_URL,
    TOKENKEY: process.env.TOKENKEY
}