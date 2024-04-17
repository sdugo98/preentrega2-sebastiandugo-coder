import {fileURLToPath} from 'url'
import { dirname } from 'path'
import passport from 'passport'
import jwt from 'jsonwebtoken'
const __filename = fileURLToPath(import.meta.url)
export const __dirname = dirname(__filename)

import bcrypt from 'bcrypt'
import { ERRORES_INTERNOS, STATUS_CODES } from './utils/tiposError.js'
import { CustomError } from './utils/customError.js'

export const hashearPass = (password)=>bcrypt.hashSync(password,bcrypt.genSaltSync(10))
export const validPassword=(user, password)=>bcrypt.compareSync(password, user.password)

export const passportCall=(estrategy)=>{
    return function(req, res, next) {
        passport.authenticate(estrategy, function(err, user, info, status) {
          if (err) { return next(err) }
          if (!user) {
                
               let error = info.message ? info.message : info.toString()
                return res.redirect(`/errorHandlebars/?error=${error}`)
          }
          req.user=user
          return next()
        })(req, res, next);
      }
}

export const TOKENKEY = 'keydugo98'
export const genToken = (user) =>jwt.sign({...user}, TOKENKEY,{expiresIn: '1h'})


export const securityAcces= (permissions = [])=>{
  return (req,res,next)=>{
    permissions=permissions.map(p=>p.toUpperCase())
    if(permissions.includes("PUBLIC")){
      return next()
    }


    if(!permissions.includes(req.user.rol.toUpperCase())){
      let error  =  CustomError.CustomError('NO AUTORIZADO', 'NO TIENES ACCESO A ESTE RECURSO', STATUS_CODES.ERROR_AUTENTICACION, ERRORES_INTERNOS.PERMISOS)
      return res.render('errorHandlebars', {error})
    }
    return next()
  }
}