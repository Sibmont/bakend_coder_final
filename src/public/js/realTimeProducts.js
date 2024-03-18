const socket = io();

const container = document.getElementById("container");

socket.on("showProducts", (data) => {
  container.innerHTML = "";
  data.forEach((product) => {
    container.innerHTML += `
      <div>
        <p>title: ${product.title}</p>
        <p>description: ${product.description}</p>
        <p>price: ${product.price}</p>
        <p>code: ${product.code}</p>
        <p>stock: ${product.stock}</p>
        <p>category: ${product.category}</p>
        <p>status: ${product.status}</p>
        <p>id: ${product.id}</p>
      <div/>
    `;
  });
});
