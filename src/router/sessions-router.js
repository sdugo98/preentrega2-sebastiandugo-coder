import { Router } from 'express';
import {userModel} from '../dao/models/usersModel.js'
import crypto from 'crypto'
export const router=Router()

router.post('/register',async(req,res)=>{
    let {nombre, email, password} = req.body

    if(!nombre || !email || !password){
        return res.redirect('/register?error=Complete los datos')
    }

    let existUserInBD = await userModel.findOne({email})
    if(existUserInBD){
        return res.redirect('/register?error=Existen usuarios con el email ' + email)
    }
    try {
        let user
        if (email === 'adminCoder@coder.com' && password==='adminCod3r123') {
            /*ENCRIPTAR CONTRASEÑA*/
                password=crypto.createHmac("sha256", 'udmv222').update(password).digest('hex')
                user = await userModel.create({nombre,email,password, rol:'Admin'})
                return res.redirect(`/login?message=usuario ${email} registrado como ADMIN`)
        }
            password=crypto.createHmac("sha256", 'udmv222').update(password).digest('hex')
                user = await userModel.create({nombre,email,password})
                return res.redirect(`/login?message=usuario ${email} registrado`)
    } catch (error) {
        return res.redirect('/register?error=Error internal.')
    }
})

router.post('/login',async(req,res)=>{

    let {email, password} = req.body

    if(!email || !password){
        return res.redirect('/login?error=Complete los datos')
    }
    /*ENCRIPTAR CONTRASEÑA*/
    password=crypto.createHmac("sha256", 'udmv222').update(password).digest('hex')
    try {

        let user = await userModel.findOne({email, password})
        if(!user){
            return res.redirect('/login?error=Datos invalidos')
        }
        console.log(user)
        req.session.user={
            nombre: user.nombre, email:user.email, rol: user.rol
        }

        res.redirect('/api/products')
    } catch (error) {
        return res.status(500).json({error: error.message})
    }
    })


    router.get('/logout',async(req,res)=>{
        req.session.destroy(error=>{
            if(error){
                res.redirect('/login?error=fallo en el logout')
            }
        })

        res.redirect('/login')
    });