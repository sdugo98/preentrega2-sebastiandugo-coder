import {fileURLToPath} from 'url'
import { dirname } from 'path'
import jwt from "jsonwebtoken"

const __filename = fileURLToPath(import.meta.url)
export const __dirname = dirname(__filename)

import bcrypt from 'bcrypt'

export const hashearPass = (password)=>bcrypt.hashSync(password,bcrypt.genSaltSync(10))

export const validPass = (user,password)=>bcrypt.compareSync(password,user.password)

export const TOKENKEY= 'keydugo98'
export const generateToken=(user)=>jwt.sign({...user}, TOKENKEY, {expiresIn: '24h'})

/* export const auth=(req,res,next)=>{
     if(!req.headers.authorization){
      return res.status(401).json({error: 'error middle'})
    }
  
    let token = req.headers.authorization.split(" ")[1]
    try {
      let user= jwt.verify(token, TOKENKEY)
      req.user=user
      next()
    } catch (error) {
        return res.status(404).json({error:"error verify"})
    } 
    if(!req.cookie.cookieColo){
      return res.status(404).json({error: 'usuario no identificado'})
    }

    let token= req.cookie.cookieColo
    next()
  } */