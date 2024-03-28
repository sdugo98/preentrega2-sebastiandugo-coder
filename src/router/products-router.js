import {
  Router
} from "express";
import {
  ManagerProducts
} from "../dao/managerMongo/managerProductsMongo.js";
import {
  productsModel
} from "../dao/models/productsModel.js";
import multer from "multer";
import mongoose from "mongoose";
import {
  io
} from "../app.js";
import { auth } from "./viewsRouter.js";
import { passportCall } from "../utils.js";
import { ProductsController } from "../controller/productsController.js";
export const router = Router();
export const managerProducts = new ManagerProducts();

/* MANEJO FORM DATA */
const upload = multer();

/* castear id 
function idValid(id, res) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    let error= 'Ingrese un Id Valido'
    return res.redirect(`/errorHandlebars/?error=${error}`)
  }
}
 */
router.get("/", passportCall('jwt'),ProductsController.render);

router.get("/:id", passportCall('jwt'),ProductsController.getProductById);

router.post("/", passportCall('jwt'),upload.none(), ProductsController.createProduct);

router.put("/:id", passportCall('jwt') , ProductsController.updateProduct);

router.delete("/:id", passportCall('jwt'),ProductsController.deleteProduct);

