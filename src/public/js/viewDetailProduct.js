const btnAddToCart = document.getElementById("btnAddToCart");
btnAddToCart.addEventListener("click", (e) => {
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
