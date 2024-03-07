import { Router } from "express";
import { productsModel } from "../dao/models/productsModel.js";
import passport from "passport";

export const router = Router();

/* ---------------------------------------BORRAMOS SESSIONS------------------------------ */
/* 
/* 
export const auth =(req,res,next)=>{
  if(!req.session.user){
    res.redirect('/login?error=Debes iniciar sesion para acceder a la web')
  }
  next()
} */

router.get("/", async (req, res) => {
  try {
    res.status(200).render("index");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/register',(req,res)=>{
  let {error} = req.query

  res.status(200).render('register', {error});
});

router.get('/login',(req,res)=>{

  res.status(200).render('login');
});

router.get('/perfil', passport.authenticate('jwt', {session:false}),(req,res)=>{
  let user = req.user
  res.render('perfil', {user});
});