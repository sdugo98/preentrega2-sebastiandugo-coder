import express from "express";
import { engine } from "express-handlebars";
import { router as viewsRouter } from "./router/viewsRouter.js";
import { Server } from "socket.io";
import { router as productManagerRouter } from "./router/products-router.js";
import { router as cartManagerRouter } from "./router/carts-router.js";
import { router as chatManagerRouter } from "./router/chat-router.js";
import { router as sessionsManagerRouter } from "./router/sessions-router.js";
/* import { SessionsRouter } from "./router/sessions-router.js"; */
import { __dirname} from "./utils.js";
/* import { chatManager } from "./dao/managerMongo/chatManager.js";
import sessions from 'express-session'
import mongoStore from 'connect-mongo' */
import mongoose from "mongoose";
import { initPassport } from "./config/config.passport.js";
import passport from "passport";
import cookieParser from 'cookie-parser'
import { config } from "./config/config.js";
import { ChatController } from "./controller/chatController.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { middleLogg } from "./utils/winstonLogger.js";


const PORT = config.PORT;

const app = express();
/* export const sessionsRouter = new SessionsRouter() */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));
app.use(middleLogg)
/* Configuracion sessions y connect mongo */

/* BORRAMOS TODA CONFIGURACION DE SESSIONS-------------------------------- */
/* app.use(sessions({
  secret: 'udmv',
  resave: true, saveUninitialized: true,
  store: mongoStore.create({
    mongoUrl:'mongodb+srv://sebastiandugo98:sebas1998@cluster0.xbb2pbe.mongodb.net/?retryWrites=true&w=majority',
    mongoOptions:{dbName:'test'},
    ttl:3600
  })
}))  */



/* COOKIE PARSER---------------------------------------------- */
app.use(cookieParser())
/* CONFIGURACIONES PASSPORT */

initPassport()
app.use(passport.initialize())

/* BORRAMOS TODA CONFIGURACION DE SESSIONS-------------------------------- */
/* app.use(passport.session()) */


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
  
  
  /* app.engine("handlebars", engine()); */
  app.set("view engine", "handlebars");
  app.set("views", `${__dirname}/views`);
  
  /* REDIRECCIONES */
  app.use("/api/chat", chatManagerRouter);
app.use("/api/products", productManagerRouter);
app.use("/api/carts", cartManagerRouter);
/* app.use("/api/sessions", sessionsRouter.getRouter()) */
app.use('/api/sessions', sessionsManagerRouter)
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