import { Router } from "express";
export const router = Router();

router.get("/", (req, res) => {
  try {
    res.status(200).render("chat");
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
