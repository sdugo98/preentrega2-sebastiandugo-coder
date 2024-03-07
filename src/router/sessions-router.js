import {
    Router
  } from "express";
  import {
    userModel
  } from "../dao/models/usersModel.js";
  import passport from "passport";
  import {
    generateToken,
    validPass
  } from "../utils.js";
  export const router = Router();
  
  router.post(
    "/register",
    passport.authenticate("register", {
      failureRedirect: "/api/sessions/errorRegister",
    }),
    async (req, res) => {
      let {
        email
      } = req.body;
      return res.redirect(`/login?message=usuario ${email} registrado`);
    }
  );
  
  router.get("/errorRegister", (req, res) => {
    return res.redirect("/register?error=Error en el proceso de registro");
  });
  
  router.post("/login", async (req, res) => {
      let {email, password}=req.body
  
      if(!email || !password) return res.status(400).send('Ingrese email y password')
            let user = await userModel.findOne({ email });
  
            if (!user) {
              return res.status(404).json({ message: "Invalid credentials" });
            }
  
            if (!validPass(user, password)) {
              return res.status(404).json({ message: "Invalid credentials" });
            }
      let token = generateToken(user);
      res.cookie("cookieColo", token, {maxAge: 1000 * 60 * 60,httpOnly: true});
      return res.status(200).json({user:user})
    }
  );
  
  
  
  router.get("/errorLogin", (req, res) => {
    return res.redirect("/login?error=Error en proceso de login");
  });
  
  router.get("/logout", async (req, res) => {
    req.session.destroy((error) => {
      if (error) {
        res.redirect("/login?error=fallo en el logout");
      }
    });
  
    res.redirect("/login");
  });
  
  router.get("/github", passport.authenticate("github", {}), (req, res) => {});
  router.get(
    "/callbackGithub",
    passport.authenticate("github", {
      failureRedirect: "/api/sessions/errorGithub",
    }),
    (req, res) => {
      req.session.user = req.user;
      res.redirect("/api/products");
    }
  );
  
  router.get("/errorGithub", (req, res) => {
    res.status(200).json({
      error: "error en autenticacion con Github",
    });
  });
  