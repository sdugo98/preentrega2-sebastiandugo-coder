const socket = io();

const cartsForm = document.getElementById("createCartForm");
cartsForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let cartTitle = new FormData(cartsForm);

  try {
    fetch(`http://localhost:8080/api/carts`, {
      method: "POST",
      body: cartTitle,
    })
    .then((response) => response.json())
    .then((data) => {
      console.log("Server Response:", data);

      resFetch.classList.remove('alert-danger', 'alert-success');

      if (data.error) {
        let errorDiv = document.createElement('div');
        errorDiv.classList.add('alert', 'alert-danger');
        errorDiv.innerHTML = `${data.error}`;

        resFetch.innerHTML = ''
        resFetch.appendChild(errorDiv);
        
        }else{ 
          resFetch.classList.add('alert', 'alert-success');
          resFetch.innerHTML = `Producto Agregado`;
      }
    })
      } catch (error) {
    console.error("error: " + error);
  }
})

socket.on("listCarts", (carts) => {
  let containerCarts = document.getElementById("containerCarts");
  containerCarts.innerHTML = "";
  carts.forEach((cart) => {
    const listMod = `
    <div class="card mb-3">
    <div class="card-body">
        <h4 class="card-title">${cart.title}</h4>
        <p class="card-text">ID: ${cart._id}</p>
    </div>
</div> `;
    containerCarts.innerHTML += listMod;
  });
});