const socket = io();

const resFetch = document.getElementById("resFetch");
const formAdd = document.getElementById("addProductForm");
formAdd.addEventListener("submit", async (e) => {
  e.preventDefault();

  const dataForm = new FormData(formAdd);

  try {
    fetch("http://localhost:8080/api/products", {
      method: "POST",
      body: dataForm,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("fetch enviado");
        resFetch.innerHTML = `<p>Producto Agregado</p>`;

        formAdd.reset();
      });
  } catch (error) {
    console.error("Error:", error);
  }
});

socket.on("listProduct", (products) => {
  let containerProd = document.getElementById("container-products");
  containerProd.innerHTML = "";
  products.docs.forEach((product) => {
    const listMod = `
    <div class="card">
    <div class="card-body">
      <h4 class="card-title">${product.title}</h4>
      <p class="card-text">code: ${product.code} ID: ${product.id}</p>
      <p class="card-title">Precio: ${product.price} </p>
    </div>
    <a href="/api/products/${product._id}" class="btn btn-detail">Ver detalle</a>
    <button class="btn btn-success mt-2 btnAddToCart" data-product-id="${product._id}">Agregar Al carrito</button>
  </div>
        `;
    containerProd.innerHTML += listMod;
  });
});

const deleteForm = document.getElementById("deleteProductForm");
deleteForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let deleteID = document.getElementById("deleteID").value;

  try {
    fetch(`http://localhost:8080/api/products/${deleteID}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("fetch enviado");
        resFetch.innerHTML = "<p>Producto Eliminado</p>";

        deleteForm.reset();
      });
  } catch (error) {
    console.error("Error:", error);
  }
});

/* Tuvimos que usar clase, por problema con id al seleccionar los botones.
Seleccionamos todas los botones con esa class con el query */
const btnsAddToCart = document.querySelectorAll(".btnAddToCart");
/* prueba con spread operator, para trabajar la coleccfion html y volverlo "array" */
[...btnsAddToCart].forEach((btn) => {
  btn.addEventListener("click", (e) => {
    let productId = e.target.dataset.productId;
    console.log(productId);

    try {
      fetch(
        `http://localhost:8080/api/carts/657652f1fd69e3f5f2d60663/product/${productId}`,
        {
          method: "POST",
        }
      ).then(
        Toastify({
          text: `SE AGREGO UN PRODUCTO AL CARRITO CON ID: 657652f1fd69e3f5f2d60663`,
          duration: 3000,
        }).showToast()
      );
    } catch (error) {
      console.error("error: " + error);
    }
  });
});
