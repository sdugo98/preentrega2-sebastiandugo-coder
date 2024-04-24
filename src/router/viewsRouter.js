import { Router } from "express";
import { productsModel } from "../dao/models/productsModel.js";
import { passportCall, securityAcces } from "../utils.js";
import { currentDTO } from "../DTO/currentDTO.js";
import { ProductsController } from "../controller/productsController.js";
import { CartsController } from "../controller/cartsController.js";
import { ticketService } from "../services/ticket.Service.js";
import {Mocking} from '../controller/mockingController.js'
import { ERRORES_INTERNOS, STATUS_CODES } from "../utils/tiposError.js";
import { CustomError } from "../utils/customError.js";

export const router = Router();

/* export const auth =(req,res,next)=>{
  if(!req.session.user){
    res.redirect('/login?error=Debes iniciar sesion para acceder a la web')
  }
  next()
}
 */
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

router.get('/current',passportCall('jwt'),securityAcces(["public"]),async(req,res)=>{
  let user = req.user
  user = await currentDTO(user)
  res.status(200).render('perfil', {user});

});


router.get('/products', passportCall('jwt'), securityAcces(["public"]), async (req, res) => {
  try {
    const renderData = await ProductsController.renderData(req);
    req.logger.info('RENDER')
    if(!renderData){
        let error  =  CustomError.CustomError('ERROR AL RENDERIZAR PRODUCTOS', 'ERROR INTERNO', STATUS_CODES.ERROR_SERVER, ERRORES_INTERNOS.DATABASE)
         return res.render('errorHandlebars', {error})
    }

    res.render('viewProducts', renderData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get('/products/:id', passportCall('jwt'), securityAcces(["public"]),async (req,res)=>{
  try {
    const renderProductById = await ProductsController.getProductById(req)
    if(!renderProductById){
      req.logger.error('NO SE ENCONTRO PRODUCTO POR ID')
      let error  =  CustomError.CustomError('ERROR EN DATOS', 'NO SE ENCONTRO PRODUCTO', STATUS_CODES.ERROR_ARGUMENTOS, ERRORES_INTERNOS.ARGUMENTOS)
      return res.render('errorHandlebars', {error})
    } 
    res.status(200).render("viewDetailProduct", renderProductById);
  } catch (error) {
    return res.status(500).json({error: error.message})
  }
})

router.get('/carts', passportCall('jwt'), securityAcces(["public"]),async (req,res)=>{
  try {
    const renderCart = await CartsController.render(req)
    if(!renderCart){
      req.logger.fatal('ERROR AL RENDERIZAR CARRITOS')
      let error  =  CustomError.CustomError('ERROR AL RENDERIZAR CARRITOS', 'ERROR INTERNO', STATUS_CODES.ERROR_SERVER, ERRORES_INTERNOS.DATABASE)
       return res.render('errorHandlebars', {error})
  }
    res.render('viewCarts', renderCart)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})
router.get('/carts/:id', passportCall('jwt'), securityAcces(["public"]), async (req, res) => {
  try {
    const cart = await CartsController.getCartById(req);
    if(!cart){
      req.logger.error('NO SE ENCONTRO CARRITO POR ID')
    let error  =  CustomError.CustomError('ERROR EN DATOS', 'NO SE ENCONTRO CARRITO', STATUS_CODES.ERROR_ARGUMENTOS, ERRORES_INTERNOS.ARGUMENTOS)
     return res.render('errorHandlebars', {error})
    } 
    cart.products.forEach(prod => {
      prod.subtotal = (prod.product.price * prod.quantity).toFixed(2)
    });
/* parseFloatse utiliza para convertir el prod.subtot al reverso en un número de punto flotante antes de agregarlo al acumulador en la reducefunción. Además, el final totalse redondea a dos decimales utilizando .toFixed(2) */
    const total = cart.products.reduce((acc, prod) => acc + parseFloat(prod.subtotal), 0).toFixed(2);

    return res.render('viewDetailCarts', { cart, total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/purchase/:tid',passportCall('jwt'), securityAcces(["public"]), async (req, res) =>{
  let {tid} = req.params
  console.log(tid)
  if(!tid){
    let error  =  CustomError.CustomError('ERROR INTERNO', 'ERROR AL RECUPERAR LA ORDEN, CONTACTE CON EL ADMIN', STATUS_CODES.ERROR_SERVER, ERRORES_INTERNOS.INTERNAL)
     return res.render('errorHandlebars', {error})
    } 
  

  let ticket = await ticketService.getTicketByID(tid)
  console.log(ticket)
  res.render('ticket', {ticket})
})


/* ENDPOINT PARA PROBAR SEGURIDAD */
router.get('/support', passportCall('jwt'),securityAcces(["admin"]),(req,res)=>{
  res.render('support')
})

/* ERROR HANDLEBAR GENERAL */
router.get('/errorHandlebars', securityAcces(["public"]),(req,res)=>{
 let {error} = req.query
  res.render('errorHandlebars', {error})
})
router.get('/mockingproducts', passportCall('jwt'),securityAcces(["admin"]), async(req,res)=>{
  let fakeProducts = await Mocking.genProd()
  let error /* = req.error */

  res.render('mockingProducts', {error, fakeProducts})
})

/* ERROR SERVIDOR */
router.get('/errorServer', securityAcces(["public"]),(req,res)=>{
  res.render('errorServer')
})

router.get('/loggerTest', securityAcces(["public"]), (req, res) => {
  req.logger.debug('Debug message');
  req.logger.http('HTTP message');
  req.logger.info('Info message');
  req.logger.warning('Warning message');
  req.logger.error('Error message');
  req.logger.fatal('Fatal message');
  return res.status(200).json({ message: 'TESTEANDO LOGS EN CONSOLA' });
});

/* TOMA ENDPOINT ENPOINT ERRONEO */
router.get('*', securityAcces(["public"]),(req,res)=>{
  res.render('404')
})