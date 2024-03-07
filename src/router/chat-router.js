import { Router } from "express";
/* import { auth } from "./viewsRouter.js"; */
export const router = Router();

router.get("/",/*  auth, */(req, res) => {
  try {
    res.status(200).render("chat");
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});