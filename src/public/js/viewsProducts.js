const socket = io();


const resFetch = document.getElementById("resFetch");
const formAdd = document.getElementById("addProductForm");
formAdd.addEventListener("submit", async (e) => {
  e.preventDefault();

  const dataForm = new FormData(formAdd);
  console.log('toco')
  fetch("http://localhost:8080/api/products", {
  method: "POST",
  body: dataForm,
})
  .then((response) => response.json())
  .then((data) => {
    console.log("Server Response:", data);
  
    // Removemos las clases 'alert-danger' y 'alert-success' de resFetch
    resFetch.classList.remove('alert-danger', 'alert-success');
  
    if (data.error) {
      let errorDiv = document.createElement('div');
      errorDiv.classList.add('alert', 'alert-danger');
      errorDiv.innerHTML = `${data.error}`;
      
      // Agregamos el div de error al elemento con id 'resFetch'
      resFetch.innerHTML = '';  // Limpiamos cualquier contenido previo
      resFetch.appendChild(errorDiv);
    } else {
      console.log("fetch enviado");
  
      // Agregamos la clase 'alert-success' al elemento con id 'resFetch'
      resFetch.classList.add('alert', 'alert-success');
  
      resFetch.innerHTML = `<p>Producto Agregado</p>`;
      formAdd.reset();
    }
  })
  .catch((error) => {
    console.error("Error in Fetch:", error);
  
    // Removemos las clases 'alert-danger' y 'alert-success' de resFetch
    resFetch.classList.remove('alert-danger', 'alert-success');
  
    let errorDiv = document.createElement('div');
    errorDiv.classList.add('alert', 'alert-danger');
    errorDiv.innerHTML = `${error}`;
    
    // Agregamos el div de error al elemento con id 'resFetch'
    resFetch.innerHTML = '';  // Limpiamos cualquier contenido previo
    resFetch.appendChild(errorDiv);
  });
  
  

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
        console.log("Server Response:", data);

        // Removemos las clases 'alert-danger' y 'alert-success' de resFetch
        resFetch.classList.remove('alert-danger', 'alert-success');

        if (data.error) {
          let errorDiv = document.createElement('div');
          errorDiv.classList.add('alert', 'alert-danger');
          errorDiv.innerHTML = `${data.error}`;

          // Agregamos el div de error al elemento con id 'resFetch'
          resFetch.innerHTML = '';  // Limpiamos cualquier contenido previo
          resFetch.appendChild(errorDiv);
        } else {
          console.log("fetch enviado");

          // Agregamos la clase 'alert-success' al elemento con id 'resFetch'
          resFetch.classList.add('alert', 'alert-success');

          resFetch.innerHTML = `<p>Producto Eliminado</p>`;
          // Puedes realizar otras acciones después de eliminar el producto
        }
      })
      .catch((error) => {
        console.error("Error in Fetch:", error);

        // Removemos las clases 'alert-danger' y 'alert-success' de resFetch
        resFetch.classList.remove('alert-danger', 'alert-success');

        let errorDiv = document.createElement('div');
        errorDiv.classList.add('alert', 'alert-danger');
        errorDiv.innerHTML = `${error}`;
        
        // Agregamos el div de error al elemento con id 'resFetch'
        resFetch.innerHTML = '';  // Limpiamos cualquier contenido previo
        resFetch.appendChild(errorDiv);
      });
  } catch (error) {
    console.error("Error in Fetch:", error);
      
    // Removemos las clases 'alert-danger' y 'alert-success' de resFetch
    resFetch.classList.remove('alert-danger', 'alert-success');
  
    let errorDiv = document.createElement('div');
    errorDiv.classList.add('alert', 'alert-danger');
    errorDiv.innerHTML = `${error}`;
    
    // Agregamos el div de error al elemento con id 'resFetch'
    resFetch.innerHTML = '';  // Limpiamos cualquier contenido previo
    resFetch.appendChild(errorDiv);
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
        `http://localhost:8080/api/carts/657a877e2197c85449ab36b2/product/${productId}`,
        {
          method: "POST",
        }
      ).then(
        Toastify({
          text: `SE AGREGO UN PRODUCTO AL CARRITO CON ID: 657a877e2197c85449ab36b2`,
          duration: 3000,
        }).showToast()
      );
    } catch (error) {
      console.error("error: " + error);
    }
  });
});
