import {fileURLToPath} from 'url'
import { dirname } from 'path'
import passport from 'passport'
import jwt from 'jsonwebtoken'
const __filename = fileURLToPath(import.meta.url)
export const __dirname = dirname(__filename)

import bcrypt from 'bcrypt'

export const hashearPass = (password)=>bcrypt.hashSync(password,bcrypt.genSaltSync(10))
export const validPassword=(user, password)=>bcrypt.compareSync(password, user.password)

export const passportCall=(estrategy)=>{
    return function(req, res, next) {
        passport.authenticate(estrategy, function(err, user, info, status) {
          if (err) { return next(err) }
          if (!user) {
            /* como api/products NO entra en el ruteo padre, debido a problemas de tiempo, no puedo aplicarle una de mis respuestas- Asi que opto, por devolver un error normal*/
                 /* return res.status(200).json(info.message?info.message:info.toString()) */
                let error = info.message ? info.message : info.toString();
                return res.redirect(`/errorHandlebars/?error=${error}`)
          }
          req.user=user
          return next()
        })(req, res, next);
      }
}

export const TOKENKEY = 'keyColo2'
export const genToken = (user) =>jwt.sign({...user}, TOKENKEY,{expiresIn: '1h'})
