import { Router } from "express";
import { productsModel } from "../dao/models/productsModel.js";
export const router = Router();

router.get("/", async (req, res) => {
  try {
    res.status(200).render("index");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
