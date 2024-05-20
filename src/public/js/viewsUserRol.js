const changeRolForm = document.getElementById('changeRolForm')
const resFetch = document.getElementById("resFetch");

changeRolForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log('escucho btn 01')
    const dataForm = new FormData(changeRolForm);
  
    try {
      const response = await fetch("http://localhost:8080/api/users/premiun", {
        method: "POST",
        body: dataForm,
      });
      console.log('escucho btn 02')
  
      console.log("fetch enviado");
      const data = await response.json();

  
      resFetch.classList.remove('alert-danger', 'alert-success');
  
      if (data.error) {
        let errorDiv = document.createElement('div');
        errorDiv.classList.add('alert', 'alert-danger');
        errorDiv.innerHTML = `${data.error}`;
  
        resFetch.innerHTML = '';
        resFetch.appendChild(errorDiv);
      } else {
  
        resFetch.classList.add('alert', 'alert-success');
  
        resFetch.innerHTML = `CAMBIO DE ROL EXITOSO`;
        changeRolForm.reset();
        /* PONGO SOLO UN TIMEOUT PARA VER EL CARTEL DE RESPUESTA */
        setTimeout(() => {
          window.location.href = 'http://localhost:8080/api/sessions/logout'
        }, "1000");
      }
    } catch (error) {
      console.error("Error in Fetch:", error);
  
      resFetch.classList.remove('alert-danger', 'alert-success');
  
      let errorDiv = document.createElement('div');
      errorDiv.classList.add('alert', 'alert-danger');
      errorDiv.innerHTML = 'ERROR AL CAMBIAR ROL';
  
      resFetch.innerHTML = '';
      resFetch.appendChild(errorDiv);
    }
  });
  