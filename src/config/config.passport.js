import passport from "passport";
/* importamos estrategia */
import passportJWT from "passport-jwt";
import local from "passport-local";
import { userModel } from "../dao/models/usersModel.js";
import { TOKENKEY, hashearPass, validPass } from "../utils.js";
import jwt from "jsonwebtoken"
import github from "passport-github2";

/* CREAMOS BUSCADOR DE TOKEN */
const searchToken = (req) => {
  let token = null;

  if (req.cookies.cookieColo) {
    token = req.cookies.cookieColo;
  }

  return token;
};

export const initPassport = () => {
  passport.use(
    "register",
    new local.Strategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        try {
          let { nombre, email } = req.body;

          if (!nombre || !email || !password) {
            /* return res.redirect("/register?error=Complete los datos"); */
            return done(null, false);
          }

          let regMail =
            /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;
          console.log(regMail.test(email));
          if (!regMail.test(email)) {
            return done(null, false);
          }

          let existUserInBD = await userModel.findOne({ email });
          if (existUserInBD) {
            /*             return res.redirect(
              "/register?error=Existen usuarios con el email " + email
            ); */
            return done(null, false);
          }
          try {
            let user;
            if (
              email === "adminCoder@coder.com" &&
              password === "adminCod3r123"
            ) {
              password = hashearPass(password);
              user = await userModel.create({
                nombre,
                email,
                password,
                rol: "Admin",
              });
              /*               return res.redirect(
                `/login?message=usuario ${email} registrado como ADMIN`
              ); */
              return done(null, user);
            }

            password = hashearPass(password);
            user = await userModel.create({ nombre, email, password });
            /*             return res.redirect(`/login?message=usuario ${email} registrado`); */
            return done(null, user);
          } catch (error) {
            /* return res.redirect("/register?error=Error internal."); */
            return done(error);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  /* passport.use('login', new local.Strategy(
    {        
        passReqToCallback: true,
        usernameField: "email",
    },
    async(req,username,password,done)=>{
        try {
            
            let {email} = req.body
            
            if(!email || !password){
                /*            return res.redirect('/login?error=Complete los datos') 
            return done(null, false)
        }
        /*ENCRIPTAR CONTRASEÑA*/
  /* password=crypto.createHmac("sha256", 'udmv222').update(password).digest('hex') 
        try {
            let user = await userModel.findOne({email})
            if(!user){
                /*                 return res.redirect('/login?error=Datos invalidos') 
                return done(null, false)
            }
            if(!validPass(user,password)){
                /*                 return res.redirect('/login?error=Datos invalidos') 
                return done(null, false)
                
            }
            console.log(user)           
            /*             res.redirect('/api/products') 
            return done(null, user)
            
        } catch (error) {
            /* return res.status(500).json({error: error.message}) 
            return done(error)
        }
    } catch (error) {
        return done(error)
    }
    }
)
) */

passport.use("jwt",new passportJWT.Strategy(
    {
      secretOrKey: TOKENKEY,
      jwtFromRequest: passportJWT.ExtractJwt.fromExtractors([searchToken]),
    },
    async (contentToken, done) => {
        try {
          return done(null, contentToken);
        } catch (error) {
          return done(error);
        }
    }
  )
);
/*
Owned by: @sdugo98

App ID: 851029

Client ID: Iv1.16047d0725764474
Secret client: 28a8728f57d2a5a36c338236fcc408c50ce1612b*/

  passport.use(
    "github",
    new github.Strategy(
      {
        clientID: "Iv1.16047d0725764474",
        clientSecret: "28a8728f57d2a5a36c338236fcc408c50ce1612b",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
        /*         clientID: '',
        clientSecret:'',
        callbackURL:''  */
      },
      async (accesToken, refreshToken, profile, done) => {
        try {
          let user = await userModel.findOne({ email: profile._json.email });
          if (!user) {
            let newUser = {
              nombre: profile._json.name,
              email: profile._json.email,
              profile,
            };
            user = await userModel.create(newUser);
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  /* serializador y desserializador */
  passport.serializeUser((user, done) => {
    return done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await userModel.findById(id);
    return done(null, user);
  });
};