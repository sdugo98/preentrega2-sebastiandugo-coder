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
        console.log("fetch enviado");
        resFetch.innerHTML = "<p>Carrito Creado</p>";

        cartsForm.reset();
      });
  } catch (error) {
    console.error("Error:", error);
  }
});

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