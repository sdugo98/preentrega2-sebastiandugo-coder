import { Router } from "express";
import { productsModel } from "../dao/models/productsModel.js";
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

router.get('/register',(req,res)=>{
  let {error} = req.query

  res.status(200).render('register', {error});
});

router.get('/login',(req,res)=>{
  let {error, message} = req.query


  res.status(200).render('login', {error, message});
});

router.get('/perfil',auth,(req,res)=>{
  let user = req.session.user
  res.status(200).render('perfil', {user});
});