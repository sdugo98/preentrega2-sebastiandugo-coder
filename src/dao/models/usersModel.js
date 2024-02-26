import mongoose from "mongoose"

const usersEsquema = new mongoose.Schema(
    {
        nombre: String,
        email:{
            type: String, unique: true
        },
        password: String,
        rol: {type: String, default: 'user'}
    },
    {
        timestamps: {
            updatedAt: 'DateUltimateMod', createdAt: 'DateOn'
        }
    }
)

export const userModel = mongoose.model('users', usersEsquema)