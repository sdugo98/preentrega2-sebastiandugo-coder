import { Router } from "express";
import { auth } from "./viewsRouter.js";
import { passportCall, securityAcces } from "../utils.js";
import { ChatController } from "../controller/chatController.js";
export const router = Router();
/* export const chatController = new ChatController() */

/* router.get("/", passportCall('jwt'),(req, res) => {
  try {
    res.status(200).render("chat");
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
 */
router.get("/", passportCall('jwt'),securityAcces(["user"]),ChatController.render);