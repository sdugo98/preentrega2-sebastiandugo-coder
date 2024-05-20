import { Router } from "express";
import { userModel } from "../dao/models/usersModel.js";
import passport from "passport";
import { genToken, hashearPass, passportCall, validPassword } from "../utils.js";
import { UserController } from "../controller/userController.js";
import jwt from 'jsonwebtoken'
import { TOKENKEY } from "../utils.js";
import { sendMail } from "../mails/mails.js";
/* import { MyRouter } from "./router.js"; */
export const router = Router();

router.post('/registro',passportCall('register'),async(req,res)=>{
try {
  if(req.error){
    return res.redirect(`/registro/?error=${req.error}`)
    }
    res.redirect('/login')
} catch (error) {
  return redirect('/errorServer')
}})

router.post('/login', passportCall('login'), (req, res) => {
  if (req.error) {
      return res.redirect(`/login/?error=${req.error}`);
  }

  let token = genToken(req.user);
  res.cookie('CookieUser', token, { httpOnly: true, maxAge: 1000 * 60 * 60 });
  res.redirect('/current');
});




router.get('/github',passportCall('github', {}), (req,res)=>{})
router.get('/callbackGithub',passportCall('github'),
  (req,res)=>{
    let user = req.user
    let token = genToken(user)
    res.cookie('CookieUser', token, {httpOnly:true, maxAge:1000*60*60})
    res.redirect('/current')
  })


  router.get('/logout',async(req,res)=>{
    res.clearCookie('CookieUser')
    res.redirect('/login')
  })

  router.post('/restPass1',async(req,res)=>{
    let {email} = req.body
    if(!email){
      return res.status(404).json({error: 'NO INGRESO UN MAIL'})
    }
    let user = await UserController.getUser(req, res,email)
    if(!user){
      return res.status(404).json({error: 'ERROR AL RECUPERAR USUARIO1'})
    }
    delete user.password
    let token = genToken(user)
    if(!token){
      return res.status(500).json({error: 'Error al generar jwt'})
    }

    let message= `Usted a solicitado reestablecer su contraseña.<br><br><hr>
    -Haga click en el siguiente enlace para continuar: <a href="http://localhost:8080/api/sessions/restPass2?token=${token}">REESTABLECER CONTRASEÑA</a><br><br><hr>
    
    El enlace es valido solo por 1 HORA (60 minutos).
    Si no es utilizado el enlace expirara, y debera generar un enlace nuevo.`

    let rta =await sendMail(email, "REESTABLECER CONTRASEÑA", message)
    
    if(rta.accepted.length > 0){
      res.redirect('http://localhost:8080/restablecerPass?message=Email enviado. Verifique su correo electronico.')
    }else{
      res.redirect('http://localhost:8080/restablecerPass?error=Error interno intente mas tarde')
    }
  })


  router.get('/restPass2',async(req,res)=>{
    let {token} = req.query
    try {
      let contentToken;
      try {
          contentToken = jwt.verify(token, TOKENKEY);
      } catch (error) {
          if (error.name === 'TokenExpiredError') {
              return res.redirect('http://localhost:8080/restablecerPass?error=ENLACE EXPIRADO');
          } else {
              return res.status(500).json({ error });
          }
      }
      res.redirect(`http://localhost:8080/restPass2?token=${token}`)
    } catch (error) {
      return res.status(500).json({error: error})
    } 
  })


  router.post('/restPass3', async (req,res)=>{
    let {pass} = req.body
    let {token} = req.query
let contentToken;

    try {
        contentToken = jwt.verify(token, TOKENKEY);
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.redirect('http://localhost:8080/restablecerPass?error=ENLACE EXPIRADO');
        } else {
            return res.status(500).json({ error });
        }
    }

   console.log(pass)
    let updatePassUser = await UserController.updatePassUser(res, pass, contentToken.email)
if(!updatePassUser){
  return res.status(500).json({error: 'FALLO EN EL PROCESO DE REESTABLECIMIENTO, INTENTE MAS TARDE'})
}

return updatePassUser
  })