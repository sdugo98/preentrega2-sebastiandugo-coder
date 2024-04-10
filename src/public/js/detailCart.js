
/*  const prodQuantity = prodQuantityElement.getAttribute('quantity') 
 const containerCart = document.getElementById('containerCart')
/* const socket = io()
const cartContainer = document.getElementById('containerCart')

socket.on('cart', (cart)=>{
    cartContainer.innerHTML = `
    <table>
        <tr id="tr">
            <td>CANTIDAD</td>
            <td>NOMBRE</td>
            <td class="tdPrecios"><span>PRECIO</span><span>SUBTOTAL</span></td>
        </tr>
        <table id="table"></table>
    </table>
`;

let total = 0
cart.products.forEach((product) => {
    const { price, quantity, title } = product;
  
    let articuloUnitarioCarrito = document.createElement("tr");
    articuloUnitarioCarrito.classList.add("articuloUnitarioCarrito");
  
    let tdNombre = document.createElement("td");
    tdNombre.textContent = title;
    articuloUnitarioCarrito.appendChild(tdNombre);
  
    let tdPrecioySubtotal = document.createElement("td");
    tdPrecioySubtotal.innerHTML = `<span>$-${price}</span> <span>$-${price * quantity}</span>`;
    tdPrecioySubtotal.classList.add("precioySubtot");
    articuloUnitarioCarrito.appendChild(tdPrecioySubtotal);
  
    cartContainer.appendChild(articuloUnitarioCarrito);
  
    let subtotal = price * quantity;
    total += subtotal;
  });
  

// Mostrar el total de la compra en el carrito
let totalCompra = document.createElement("tr")
totalCompra.innerHTML = `
  <td id="cajaTotal" colspan="2">Total:</td>
  <td class="precioySubtot"><span></span><span>$-${total}</span></td>
`
cartContainer.appendChild(totalCompra) 
})



 */