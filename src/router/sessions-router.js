import { Router } from "express";
import { userModel } from "../dao/models/usersModel.js";
import passport from "passport";
import { genToken, hashearPass, passportCall, validPassword } from "../utils.js";
/* import { MyRouter } from "./router.js"; */
export const router = Router();

router.post('/registro', /* [public] */ passportCall('register'),async(req,res)=>{
try {
  if(req.error){
    return res.redirect(`/registro/?error=${req.error}`)
    }
    res.redirect('/login')
} catch (error) {
  return redirect('/errorServer')
}})

router.post('/login', /* [public] */ passportCall('login'), (req, res) => {
  if (req.error) {
      return res.redirect(`/login/?error=${req.error}`);
  }

  let token = genToken(req.user);
  res.cookie('CookieUser', token, { httpOnly: true, maxAge: 1000 * 60 * 60 });
  res.redirect('/current');
});




router.get('/github', /* public */ passportCall('github', {}), (req,res)=>{})
router.get('/callbackGithub',/* [public] */passportCall('github'),
  (req,res)=>{
    let user = req.user
    let token = genToken(user)
    res.cookie('CookieUser', token, {httpOnly:true, maxAge:1000*60*60})
    res.redirect('/current')
  })


  router.get('/logout', /* [public] */async(req,res)=>{
    res.clearCookie('CookieUser')
    res.redirect('/login')
  })


  
/* 
export class SessionsRouter extends MyRouter{
      init(){
        
        this.post('/registro' , ["public"] , passportCall('register'),(req,res)=>{
            /* res.successNewUser('Registro Exitoso', req.user) 
            res.redirect('/login')
        })
        
    
        this.post('/login', ['public'],passportCall('login'), (req,res)=>{
    
    
    
          let token= genToken(req.user)
          res.cookie('CookieUser', token, {httpOnly:true, maxAge: 1000*60*60})
         /*  res.success(`Login Exitoso, Bienvenido ${req.user.first_name} Su rol: ${req.user.rol}`)
         res.redirect('/current')
        })
    /*      RUTA PRUEBA QUE ANDA BIEN LOS PERMISOS, (HASTA QUE PASE TODOS LOS ROUTER AL CUSTOM ROUTER) 
      this.get('/support', ['admin'],(req,res)=>{
        res.success('Servicio de Soporte de pagina, habilitado solo para Administradores!')
      }) */
      /*   this.get("/github", ['public'],passportCall("github", {}), (req, res) => {});
          this.get(
            "/callbackGithub",["public"],
            passportCall("github"),
            (req, res) => {
              let user = req.user;
              let token= genToken(user)
              res.cookie('CookieUser', token, {httpOnly:true, maxAge: 1000*60*60})
              res.redirect("/current");
            }
          )
          
          this.get("/logout", ['public'],async (req, res) => {
            res.clearCookie('CookieUser');
          
            res.redirect("/login");
          });
          } */