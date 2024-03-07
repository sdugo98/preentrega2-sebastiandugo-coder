let inputEmail=document.getElementById("email")
let inputPassword=document.getElementById("password")
let divMensaje=document.getElementById("mensaje")
divMensaje.innerHTML= ""
let btnSubmit=document.getElementById("btnSubmit")

btnSubmit.addEventListener('click',async (e)=>{
    e.preventDefault()
    if(inputEmail.value.trim().length===0 || inputPassword.value.trim().length===0){
        divMensaje.innerHTML='Complete los datos'
        divMensaje.classList.add('alert')
        divMensaje.classList.add('alert-danger')
        return
    }

    let body={
        email:inputEmail.value.trim(),
        password:inputPassword.value.trim()
    }

    try {
        let respuesta= await fetch('http://localhost:8080/api/sessions/login',{
            method: 'post',headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(body)
    })
    if(respuesta.status===200){
        divMensaje.innerHTML='login correcto'
    }else{
        divMensaje.innerHTML="Credenciales incorrectas"
        divMensaje.classList.add('alert')
        divMensaje.classList.add('alert-danger')

    }
  /*   let data = await respuesta.json();
    let user = data.user;
     */
    } catch (error) {
        return ({error:error.message})    
    }
    })