/* import { Router } from 'express'
import { passportCall } from '../utils.js'

export class MyRouter{
    constructor(){
        this.router=Router()
        this.init()
    }

    init(){}

    getRouter(){
        return this.router
    }

    get(ruta, permissions,...functions){ 
        this.router.get(ruta, this.myAnswers,(ruta !=='/login' && ruta !=='/registro' && ruta !=='/github'&& !ruta.includes('/callbackGithub'))?passportCall('jwt'):(req,res,next)=>{next()},this.access(permissions),this.agregaTryCatch(functions))
    }

    post(ruta, permissions,...functions){ 
        this.router.post(ruta, this.myAnswers,(ruta !=='/login' && ruta !=='/registro' && ruta !=='/github'&& !ruta.includes('/callbackGithub'))?passportCall('jwt'):(req,res,next)=>{next()}, this.access(permissions),this.agregaTryCatch(functions))
    }

    put(ruta, permissions,...functions){ 
        this.router.post(ruta, this.myAnswers,(ruta !=='/login' && ruta !=='/registro' && ruta !=='/github'&& !ruta.includes('/callbackGithub'))?passportCall('jwt'):(req,res,next)=>{next()}, this.access(permissions),this.agregaTryCatch(functions))
    }

    delete(ruta, permissions,...functions){ 
        this.router.post(ruta, this.myAnswers,(ruta !=='/login' && ruta !=='/registro' && ruta !=='/github'&& !ruta.includes('/callbackGithub'))?passportCall('jwt'):(req,res,next)=>{next()}, this.access(permissions),this.agregaTryCatch(functions))
    }

    myAnswers=(req, res, next)=>{
        res.success=(response)=>res.status(200).json({status:"OK", response})
        res.successNewUser=(response, user)=>res.status(201).json({status:"OK", response, user})
        res.errorClient=(error)=>res.status(400).json({status:"Bad Request", error})
        res.errorServer=(error)=>res.status(500).json({status:"Server Error", error})
        res.errorAuth=(error)=>res.status(401).json({status:"Auth Error", error})
        res.errorPermissions=(error)=>res.status(403).json({status:"Permissions Error", error})
        next()
    }

    agregaTryCatch(functions){
        return functions.map(funcion=>{
            return async(...params)=>{
                try {
                    await funcion.apply(this, params)
                } catch (error) {
                    params[1].errorServer("Error inesperado. Contacte al administrador. Detalle: "+ error.message)
                }
            }
        })
    }


    access(permissions=[]){
        return(req,res,next)=>{
            permissions=permissions.map(p=>p.toLowerCase())

            if(permissions.includes('public')){
                return next()
            }

            if(!req.user || !req.user.rol){
                return res.errorAuth('Debes loguearte')
            }

            if(!permissions.includes(req.user.rol.toLowerCase())){
                return res.errorPermissions('No contas con privilegios para ingresar a esta pagina')
            }
        
            return next()
        }
    }

} */