import { Router } from "express";
import { productsModel } from "../dao/models/productsModel.js";
import { passportCall } from "../utils.js";
export const router = Router();

export const auth =(req,res,next)=>{
  if(!req.session.user){
    res.redirect('/login?error=Debes iniciar sesion para acceder a la web')
  }
  next()
}

router.get("/", async (req, res) => {
  try {
    res.status(200).render("index");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/registro',(req,res)=>{
  let {error} = req.query
  
  res.status(200).render('register', {error});
});

router.get('/login',(req,res)=>{
  let {error, message} = req.query 
  
  res.status(200).render('login', {error, message});
});

router.get('/current',passportCall('jwt'),(req,res)=>{
  let user = req.user
  res.status(200).render('perfil', {user});

});

/* ENDPOINT PARA PROBAR SEGURIDAD */
router.get('/support', passportCall('jwt'), /* securityAccess(req.user), */(req,res)=>{
  res.render('support')
})

/* ERROR HANDLEBAR GENERAL */
router.get('/errorHandlebars', (req,res)=>{
 let {error} = req.query
  res.render('errorHandlebars', {error})
})

/* ERROR SERVIDOR */
router.get('/errorServer', (req,res)=>{
  res.render('errorServer')
})

/* TOMA ENDPOINT ENPOINT ERRONEO */
router.get('*', (req,res)=>{
  res.render('404')
})