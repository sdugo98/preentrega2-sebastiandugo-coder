import passport from "passport";
import local from "passport-local";
import { userModel } from "../dao/models/usersModel.js";
import { TOKENKEY, genToken, hashearPass, validPassword } from "../utils.js";
import github from 'passport-github2'
import passportJWT from 'passport-jwt'
import {cartsService } from "../services/carts.Service.js";
import { ERRORES_INTERNOS, STATUS_CODES } from "../utils/tiposError.js";
import { CustomError } from "../utils/customError.js";

const searchToken=(req)=>{
  let token = null
  if(req.cookies.CookieUser){
    token=req.cookies.CookieUser
  }
  return token
}

export const initPassport = () => {
/* CREAMOS ESTRATEGIA NUEVA DE REGISTRO-------------------- */
  passport.use('register', new local.Strategy(
    {
      passReqToCallback:true,
      usernameField:"email"
    },
    async(req,username,password,done)=>{
      try {

        let {first_name, last_name, rol, email, age}=req.body
        if(!first_name ||!last_name|| !email||!age||!password){
          return done(null, false,CustomError.CustomError('COMPLETE TODOS LOS CAMPOS', 'COMPLETE LOS DATOS', STATUS_CODES.ERROR_DATOS_ENVIADOS, ERRORES_INTERNOS.OTROS))
        } 

        let regMail=/^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/
          console.log(regMail.test(email))
          if(!regMail.test(email)){
              return done(null, false, CustomError.CustomError('EMAIL INVALIDO, CONTROLAR', 'EMAIL INVALIDO', STATUS_CODES.ERROR_DATOS_ENVIADOS, ERRORES_INTERNOS.OTROS))
          }

        let existUser = await userModel.findOne({email}).lean()

        if(existUser){
          return done(null, false,CustomError.CustomError('YA EXISTEN USUARIOS EN BD CON ESE EMAIL', 'YA EXISTEN USUARIOS EN BD CON ESE EMAIL', STATUS_CODES.ERROR_DATOS_ENVIADOS, ERRORES_INTERNOS.OTROS))
        }
        let user;
        if (
            email === "adminCoder@coder.com" &&
            password === "adminCod3r123"
          ) {
            user= await userModel.create({
              first_name,last_name,age,
              email,
              password: hashearPass(password),
              cart: [{ cart: "INVALID" }],
              rol: "Admin",
            });
            return done(null, user)
          }

          let cartTitle = `Carro de: ${last_name}`
          let cart = await cartsService.createCart(cartTitle)
          


        user = await userModel.create({
          first_name, last_name, email, rol,age,
          cart: cart,
          password: hashearPass(password)
        })
        return done(null, user)
        
        }catch (error) {
        return done(error)
      }
    }
  ))



  passport.use('login', new local.Strategy(
    {
      usernameField:"email"
    },
    async(username,password,done)=>{
      try {

        if(!username || !password){
          return done (null, false, {message: 'Complete los datos'})
        }
        let regMail=/^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/
          console.log(regMail.test(username))
          if(!regMail.test(username)){
            return done(null, false, CustomError.CustomError('EMAIL INVALIDO', 'EMAIL INVALIDO', STATUS_CODES.ERROR_DATOS_ENVIADOS, ERRORES_INTERNOS.OTROS))
          }

        let user = await userModel.findOne({email:username}).lean()
        if(!user){
          return done(null, false, CustomError.CustomError('DATOS INVALIDOS', 'DATOS INVALIDOS', STATUS_CODES.ERROR_DATOS_ENVIADOS, ERRORES_INTERNOS.OTROS))
        }
        
        if(!validPassword(user, password)){

          return done(null, false, CustomError.CustomError('DATOS INVALIDOS', 'DATOS INVALIDOS', STATUS_CODES.ERROR_DATOS_ENVIADOS, ERRORES_INTERNOS.OTROS))
        }

        delete user.password
        return done(null, user)

      } catch (error) {
        return done(error)
      }
    }
  ))

  passport.use('jwt', new passportJWT.Strategy(
    {
      secretOrKey: TOKENKEY,
      jwtFromRequest: passportJWT.ExtractJwt.fromExtractors([searchToken])
    },
    async(contentToken, done)=>{
      try {
        return done(null, contentToken)
      } catch (error) {
        return done(error)
      }
    }
  ))

passport.use('github', new github.Strategy(
    {         clientID: 'Iv1.16047d0725764474',
        clientSecret:'28a8728f57d2a5a36c338236fcc408c50ce1612b',
        callbackURL:'http://localhost:8080/api/sessions/githubcallback'  
/*         clientID: '',
        clientSecret:'',
        callbackURL:''   */
    },
    async( accesToken,refreshToken,profile,done)=>{
        try {
            let user = await userModel.findOne({email: profile._json.email}).lean()
            if(!user){
                let newUser={
                    first_name: profile._json.name,
                    email: profile._json.email,
                    profile,
                    cart: [{ cart: "657a877e2197c85449ab36b2" }]
                }
                user = await userModel.create(newUser)
            }
            return done(null,user)
        } catch (error) {
            return done(error)
        }
    }
))
};

/* BORRAMOS TODA CONFIGURACION DE SESSIONS-------------------------------- */

/* serializador y desserializador 
passport.serializeUser((user,done)=>{
    return done(null, user._id)
})

passport.deserializeUser(async(id,done)=>{
    let user= await userModel.findById(id)
    return done(null, user)
})
 */