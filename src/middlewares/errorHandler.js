export const errorHandler = (error, req, res,next)=>{
    if(error){
        if(error.code){
            return res.status(error.code).json({error:`${error.name}: ${error.message}`})
        }else{
            return res.status(500).json({error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`})
        }
    }
    next()
}