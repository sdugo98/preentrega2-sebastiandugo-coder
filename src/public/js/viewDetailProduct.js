const btnAddToCart = document.getElementById("btnAddToCart");
btnAddToCart.addEventListener("click", (e) => {
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