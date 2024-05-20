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
  
  import { passportCall, securityAcces } from "../utils.js";
  import { UserController } from "../controller/userController.js";
  export const router = Router();
  const upload = multer();



router.post("/", passportCall('jwt'),upload.none(), securityAcces(["admin", "premiun", "user"]),UserController.changeRol);