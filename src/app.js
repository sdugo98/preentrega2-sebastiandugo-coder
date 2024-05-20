import express from "express";
import { engine } from "express-handlebars";
import { router as viewsRouter } from "./router/viewsRouter.js";
import { Server } from "socket.io";
import { router as productManagerRouter } from "./router/products-router.js";
import { router as cartManagerRouter } from "./router/carts-router.js";
import { router as chatManagerRouter } from "./router/chat-router.js";
import { router as sessionsManagerRouter } from "./router/sessions-router.js";
import { router as userManagerRouter } from "./router/user-router.js";
import { __dirname} from "./utils.js";
import mongoose from "mongoose";
import { initPassport } from "./config/config.passport.js";
import passport from "passport";
import cookieParser from 'cookie-parser'
import { config } from "./config/config.js";
import { ChatController } from "./controller/chatController.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { middleLogg } from "./utils/winstonLogger.js";
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUI from 'swagger-ui-express'


const PORT = config.PORT;

const app = express();

/* CONFIGURACION SWAGGER */
const options = {
  definition:{
    openapi: "3.0.0",
    info:{
      title: "Documentacion API (Lovera)",
      version: "1.0.0",
      description: "Documentacion de API utilizada en este eccomerce-. Cuenta con Apartado de productos, carritos, chat en tiempo real, Sistema de registro y jerarquia de usuarios-."
    }
  },
  apis:[`${__dirname}/docs/*.yaml`]
}
/* CONFIGURACION SWAGGER */

const specs = swaggerJsdoc(options)
app.use(`/api-docs`, swaggerUI.serve,swaggerUI.setup(specs))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));
app.use(middleLogg)


/* COOKIE PARSER---------------------------------------------- */
app.use(cookieParser())

/* CONFIGURACIONES PASSPORT */
initPassport()
app.use(passport.initialize())


/* CONFIGURAMOS HANDLEBARS */

/* Trabajar con doc Hidratados */
app.engine(
  "handlebars",
  engine({
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
  })
  );
  
  
  app.set("view engine", "handlebars");
  app.set("views", `${__dirname}/views`);
  
  /* REDIRECCIONES */
  app.use("/api/chat", chatManagerRouter);
app.use("/api/products", productManagerRouter);
app.use("/api/carts", cartManagerRouter);
app.use('/api/sessions', sessionsManagerRouter)
app.use('/api/users/premiun', userManagerRouter)
app.use("/", viewsRouter);

app.use(errorHandler)

const serverHTTP = app.listen(PORT, () => {
  console.log(`Server escuchando en puerto ${PORT}`);
});

const managerChat = new ChatController();

export const io = new Server(serverHTTP);
io.on("connection", (socket) => {
  console.log(`se conecto cliente id ${socket.id}`);

  socket.on("correoDelUsuario", (newUser) => {
    socket.broadcast.emit("conectUser", newUser);
  });

  socket.on("message", async (datos) => {
    let datosSave = await managerChat.saveMessage(datos);
    io.emit("newMessage", datosSave);
  });
});

/*CONEXION CON MONGOOSE */
try {
  await mongoose.connect(
    config.MONGO_URL
  );
  console.log("BD Online");
} catch (error) {
  console.log(error.message);
}